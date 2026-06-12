/* eslint-env worker */

/**
 * p.foundation backend worker.
 *
 * A single Cloudflare Worker that exists only for the backend services the
 * static site on GitHub Pages cannot do itself:
 *   - POST /api/donate/checkout      creates Stripe donation Checkout sessions
 *   - POST /api/newsletter/subscribe subscribes emails to the Mailgun list
 *   - POST /api/apply                emails application and contact forms via Mailgun
 * Plus GET /health for monitoring. It must not serve pages or static assets.
 */

const MAX_BODY_LENGTH = 10 * 1024;
const MIN_AMOUNT_CENTS = 100;
const MAX_AMOUNT_CENTS = 1000000;
const MAX_EMAIL_LENGTH = 254;
const MAX_REFERRAL_LENGTH = 500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Application form limits. A maximal in-contract application (20 fields of
// 2000 characters) exceeds the default 10 KiB body cap once JSON escaping is
// counted, so /api/apply reads its body with this higher limit instead.
const MAX_APPLY_BODY_LENGTH = 64 * 1024;
const MAX_FIELD_COUNT = 20;
const MAX_FIELD_LABEL_LENGTH = 80;
const MAX_FIELD_VALUE_LENGTH = 2000;

/**
 * Allowed application form identifiers mapped to the human readable labels
 * used in the notification email subject and body.
 */
const APPLICATION_FORM_LABELS = {
  mediaguard: 'MediaGuard program',
  citizenmesh: 'CitizenMesh program',
  resilientnet: 'ResilientNet program',
  'opencache-isp': 'OpenCache (ISP)',
  'opencache-provider': 'OpenCache (content provider)',
  contact: 'Contact',
};

/**
 * Build the CORS headers for a request. The Origin header must exactly match
 * one of the comma separated entries in ALLOWED_ORIGINS; if it does the
 * origin is reflected with Vary: Origin, otherwise no CORS headers are
 * emitted and the browser blocks the cross origin response.
 *
 * @param {Request} request Incoming request.
 * @param {Record<string, string>} env Worker environment bindings.
 * @returns {Record<string, string>} CORS headers, possibly empty.
 */
function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) {
    return {};
  }
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((entry) => entry.trim());
  if (!allowed.includes(origin)) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
  };
}

/**
 * Build a JSON response with CORS headers applied.
 *
 * @param {unknown} body Serializable response body.
 * @param {number} status HTTP status code.
 * @param {Record<string, string>} cors CORS headers from corsHeaders().
 * @returns {Response} JSON response.
 */
function jsonResponse(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...cors,
    },
  });
}

/**
 * Read and parse a JSON request body with basic hygiene checks: the request
 * must declare Content-Type application/json, the body must not exceed
 * maxLength (MAX_BODY_LENGTH by default), and it must parse as JSON.
 *
 * @param {Request} request Incoming request.
 * @param {number} maxLength Maximum accepted body length in bytes.
 * @returns {Promise<{ data?: unknown, error?: string, status?: number }>}
 *   Parsed data on success, or an error message with an HTTP status.
 */
async function readJsonBody(request, maxLength = MAX_BODY_LENGTH) {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return { error: 'Content-Type must be application/json.', status: 415 };
  }
  // Reject oversized (or chunked, length-less) bodies before buffering them
  // into memory. Browsers and curl always send Content-Length for
  // non-streaming POST bodies, so requiring it costs legitimate clients
  // nothing.
  const rawLength = request.headers.get('Content-Length');
  const contentLength = rawLength === null ? NaN : Number(rawLength);
  if (!Number.isFinite(contentLength) || contentLength > maxLength) {
    return { error: 'Request body is too large.', status: 413 };
  }
  const text = await request.text();
  // Compare bytes, not UTF-16 code units, so multi-byte payloads cannot
  // exceed the cap.
  if (new TextEncoder().encode(text).length > maxLength) {
    return { error: 'Request body is too large.', status: 413 };
  }
  try {
    return { data: JSON.parse(text) };
  } catch {
    return { error: 'Request body is not valid JSON.', status: 400 };
  }
}

/**
 * Check the optional per IP rate limiter. The RATE_LIMITER binding is
 * configured in wrangler.toml; when it is absent (for example if the binding
 * is removed because a plan does not support it) requests pass through.
 *
 * @param {Request} request Incoming request.
 * @param {Record<string, unknown>} env Worker environment bindings.
 * @param {string} scope Endpoint label so limits are tracked per endpoint.
 * @returns {Promise<boolean>} True when the caller is over the limit.
 */
async function rateLimited(request, env, scope) {
  const limiter = env.RATE_LIMITER;
  if (!limiter || typeof limiter.limit !== 'function') {
    return false;
  }
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await limiter.limit({ key: `${scope}:${ip}` });
    return !success;
  } catch (err) {
    // Never block traffic because the limiter itself failed.
    console.error('Rate limiter error:', err);
    return false;
  }
}

/**
 * Handle POST /api/donate/checkout: validate the donation request and create
 * a Stripe Checkout session, returning its hosted payment page URL.
 *
 * @param {Request} request Incoming request.
 * @param {Record<string, string>} env Worker environment bindings.
 * @param {Record<string, string>} cors CORS headers for the response.
 * @returns {Promise<Response>} JSON response per the API contract.
 */
async function handleDonateCheckout(request, env, cors) {
  if (await rateLimited(request, env, 'donate')) {
    return jsonResponse(
      { error: 'Too many requests. Please try again in a minute.' },
      429,
      cors
    );
  }
  const body = await readJsonBody(request);
  if (body.error) {
    return jsonResponse({ error: body.error }, body.status, cors);
  }
  const { amount, interval } = body.data ?? {};

  if (
    !Number.isInteger(amount) ||
    amount < MIN_AMOUNT_CENTS ||
    amount > MAX_AMOUNT_CENTS
  ) {
    return jsonResponse(
      {
        error:
          'Donation amount must be a whole number of cents between 100 and 1000000.',
      },
      400,
      cors
    );
  }
  if (interval !== 'one_time' && interval !== 'monthly') {
    return jsonResponse(
      { error: "Donation interval must be 'one_time' or 'monthly'." },
      400,
      cors
    );
  }

  // URLSearchParams handles all value encoding; never concatenate strings
  // into a form body.
  const params = new URLSearchParams();
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', 'usd');
  params.set('line_items[0][price_data][unit_amount]', String(amount));
  if (interval === 'one_time') {
    params.set('mode', 'payment');
    params.set('submit_type', 'donate');
    params.set(
      'line_items[0][price_data][product_data][name]',
      'One-time donation to P Foundation'
    );
    // Session metadata is not copied to the PaymentIntent automatically, so
    // set it there too to keep charges attributable in reporting.
    params.set('payment_intent_data[metadata][source]', 'p.foundation/donate');
  } else {
    params.set('mode', 'subscription');
    params.set(
      'line_items[0][price_data][product_data][name]',
      'Monthly donation to P Foundation'
    );
    params.set('line_items[0][price_data][recurring][interval]', 'month');
    // Session metadata is not copied to the Subscription automatically, so
    // set it there too or monthly renewals lose their attribution.
    params.set('subscription_data[metadata][source]', 'p.foundation/donate');
  }
  params.set(
    'success_url',
    `${env.SITE_URL}/donate/thanks?session_id={CHECKOUT_SESSION_ID}`
  );
  params.set('cancel_url', `${env.SITE_URL}/donate`);
  params.set('metadata[source]', 'p.foundation/donate');

  const stripeResponse = await fetch(
    'https://api.stripe.com/v1/checkout/sessions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    }
  );

  if (!stripeResponse.ok) {
    // Log upstream details for operators; never leak them to the client.
    console.error(
      'Stripe checkout session creation failed:',
      stripeResponse.status,
      await stripeResponse.text()
    );
    return jsonResponse(
      { error: 'Payment service error. Please try again.' },
      502,
      cors
    );
  }

  const session = await stripeResponse.json();
  return jsonResponse({ url: session.url }, 200, cors);
}

/**
 * Handle POST /api/newsletter/subscribe: validate the email and upsert it as
 * a member of the Mailgun mailing list. The subscription date is set server
 * side on purpose so clients cannot forge it.
 *
 * @param {Request} request Incoming request.
 * @param {Record<string, string>} env Worker environment bindings.
 * @param {Record<string, string>} cors CORS headers for the response.
 * @returns {Promise<Response>} JSON response per the API contract.
 */
async function handleNewsletterSubscribe(request, env, cors) {
  if (await rateLimited(request, env, 'subscribe')) {
    return jsonResponse(
      { error: 'Too many requests. Please try again in a minute.' },
      429,
      cors
    );
  }
  const body = await readJsonBody(request);
  if (body.error) {
    return jsonResponse({ error: body.error }, body.status, cors);
  }
  const data = body.data ?? {};

  const email =
    typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
    return jsonResponse(
      { error: 'Please provide a valid email address.' },
      400,
      cors
    );
  }

  let referralPage =
    typeof data.referralPage === 'string' ? data.referralPage : '';
  referralPage = referralPage
    .slice(0, MAX_REFERRAL_LENGTH)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, '');

  const params = new URLSearchParams();
  params.set('address', email);
  params.set('upsert', 'yes');
  params.set('subscribed', 'yes');
  params.set(
    'vars',
    JSON.stringify({
      referral_page: referralPage,
      subscribed_at: new Date().toISOString(),
    })
  );

  const mailgunResponse = await fetch(
    `${env.MAILGUN_API_BASE}/v3/lists/${encodeURIComponent(
      env.MAILGUN_LIST_ADDRESS
    )}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    }
  );

  if (!mailgunResponse.ok) {
    // Log upstream details for operators; never leak them to the client.
    console.error(
      'Mailgun member upsert failed:',
      mailgunResponse.status,
      await mailgunResponse.text()
    );
    return jsonResponse(
      { error: 'Subscription service error. Please try again.' },
      502,
      cors
    );
  }

  return jsonResponse({ ok: true }, 200, cors);
}

/**
 * Strip every ASCII control character (including newlines) plus DEL from a
 * single line string such as a field label.
 *
 * @param {string} value Raw string.
 * @returns {string} Sanitized string.
 */
function stripControlChars(value) {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]/g, '');
}

/**
 * Strip ASCII control characters and DEL from a multi line string, keeping
 * newlines so textarea answers survive.
 *
 * @param {string} value Raw string.
 * @returns {string} Sanitized string.
 */
function stripControlCharsKeepNewlines(value) {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '');
}

/**
 * Handle POST /api/apply: validate a program or product application (or a
 * contact form message) and email it to contact@p.foundation via Mailgun,
 * with Reply-To set to the sender email so a plain reply from the inbox
 * reaches them.
 *
 * @param {Request} request Incoming request.
 * @param {Record<string, string>} env Worker environment bindings.
 * @param {Record<string, string>} cors CORS headers for the response.
 * @returns {Promise<Response>} JSON response per the API contract.
 */
async function handleApply(request, env, cors) {
  if (await rateLimited(request, env, 'apply')) {
    return jsonResponse(
      { error: 'Too many requests. Please try again in a minute.' },
      429,
      cors
    );
  }
  const body = await readJsonBody(request, MAX_APPLY_BODY_LENGTH);
  if (body.error) {
    return jsonResponse({ error: body.error }, body.status, cors);
  }
  const data = body.data ?? {};

  // hasOwnProperty guards against prototype keys like 'constructor'.
  const form =
    typeof data.form === 'string' &&
    Object.prototype.hasOwnProperty.call(APPLICATION_FORM_LABELS, data.form)
      ? data.form
      : '';
  if (!form) {
    return jsonResponse(
      {
        error:
          "Form must be one of 'mediaguard', 'citizenmesh', 'resilientnet', 'opencache-isp', 'opencache-provider', 'contact'.",
      },
      400,
      cors
    );
  }
  const formLabel = APPLICATION_FORM_LABELS[form];

  const email =
    typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
    return jsonResponse(
      { error: 'Please provide a valid email address.' },
      400,
      cors
    );
  }

  const fields = data.fields;
  if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
    return jsonResponse(
      { error: 'Fields must be an object of question and answer strings.' },
      400,
      cors
    );
  }
  const entries = Object.entries(fields);
  if (entries.length < 1 || entries.length > MAX_FIELD_COUNT) {
    return jsonResponse(
      {
        error: `Fields must contain between 1 and ${MAX_FIELD_COUNT} entries.`,
      },
      400,
      cors
    );
  }

  const lines = [`Form: ${formLabel}`, `Sender email: ${email}`, ''];
  for (const [rawLabel, rawValue] of entries) {
    if (typeof rawValue !== 'string') {
      return jsonResponse(
        { error: 'Every field value must be a string.' },
        400,
        cors
      );
    }
    const label = stripControlChars(rawLabel);
    const value = stripControlCharsKeepNewlines(rawValue);
    if (!label || label.length > MAX_FIELD_LABEL_LENGTH) {
      return jsonResponse(
        {
          error: `Every field label must be a non-empty string of at most ${MAX_FIELD_LABEL_LENGTH} characters.`,
        },
        400,
        cors
      );
    }
    if (value.length > MAX_FIELD_VALUE_LENGTH) {
      return jsonResponse(
        {
          error: `Every field value must be a string of at most ${MAX_FIELD_VALUE_LENGTH} characters.`,
        },
        400,
        cors
      );
    }
    // Indent continuation lines of multi line answers under their label.
    const [firstLine, ...restLines] = value.split('\n');
    lines.push(`${label}: ${firstLine}`);
    for (const extraLine of restLines) {
      lines.push(`  ${extraLine}`);
    }
  }

  // URLSearchParams handles all value encoding; never concatenate strings
  // into a form body.
  const params = new URLSearchParams();
  params.set('from', `P Foundation Website <forms@${env.MAILGUN_DOMAIN}>`);
  params.set('to', 'contact@p.foundation');
  // "Website form:" reads naturally for both applications ("Website form:
  // MediaGuard program") and contact messages ("Website form: Contact").
  params.set('subject', `Website form: ${formLabel} (${email})`);
  params.set('text', lines.join('\n'));
  params.set('h:Reply-To', email);

  const mailgunResponse = await fetch(
    `${env.MAILGUN_API_BASE}/v3/${encodeURIComponent(
      env.MAILGUN_DOMAIN
    )}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    }
  );

  if (!mailgunResponse.ok) {
    // Log upstream details for operators; never leak them to the client.
    console.error(
      'Mailgun application send failed:',
      mailgunResponse.status,
      await mailgunResponse.text()
    );
    return jsonResponse(
      { error: 'Email service error. Please try again.' },
      502,
      cors
    );
  }

  return jsonResponse({ ok: true }, 200, cors);
}

export default {
  /**
   * Route incoming requests to the three API handlers, the health check, and
   * the CORS preflight responder.
   *
   * @param {Request} request Incoming request.
   * @param {Record<string, string>} env Worker environment bindings.
   * @returns {Promise<Response>} Response for the request.
   */
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    try {
      const url = new URL(request.url);

      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            ...cors,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      if (request.method === 'GET' && url.pathname === '/health') {
        return new Response('ok', {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
            ...cors,
          },
        });
      }

      if (
        request.method === 'POST' &&
        url.pathname === '/api/donate/checkout'
      ) {
        return await handleDonateCheckout(request, env, cors);
      }

      if (
        request.method === 'POST' &&
        url.pathname === '/api/newsletter/subscribe'
      ) {
        return await handleNewsletterSubscribe(request, env, cors);
      }

      if (request.method === 'POST' && url.pathname === '/api/apply') {
        return await handleApply(request, env, cors);
      }

      return jsonResponse({ error: 'Not found.' }, 404, cors);
    } catch (err) {
      console.error('Unhandled worker error:', err);
      return jsonResponse(
        { error: 'Internal server error. Please try again.' },
        500,
        cors
      );
    }
  },
};
