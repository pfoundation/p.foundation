/* eslint-env worker */

/**
 * p.foundation backend worker.
 *
 * A single Cloudflare Worker that exists only for the backend services the
 * static site on GitHub Pages cannot do itself:
 *   - POST /api/donate/checkout      creates Stripe donation Checkout sessions
 *   - POST /api/newsletter/subscribe subscribes emails to the Mailgun list
 *   - POST /api/apply                records application, contact, and support forms
 *                                    in Salesforce (Lead or Case), falling back to a
 *                                    Mailgun email when Salesforce fails
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
  'opencache-isp': 'Embedded OpenCache PoP',
  'opencache-provider': 'OpenCache (content provider)',
  contact: 'Contact',
  support: 'Partner support',
};

/**
 * Salesforce object created for each form. Applications are sales
 * prospects (Leads); contact and support messages need a reply from the
 * team (Cases). Every form key in APPLICATION_FORM_LABELS must appear here.
 */
const SALESFORCE_OBJECT_BY_FORM = {
  mediaguard: 'Lead',
  citizenmesh: 'Lead',
  resilientnet: 'Lead',
  'opencache-isp': 'Lead',
  'opencache-provider': 'Lead',
  contact: 'Case',
  support: 'Case',
};

// Question labels (as sent by the site) that map onto standard Salesforce
// fields. The first label present in a submission wins. Every answer is also
// written in full to Description, so unmapped questions are never lost.
const SF_NAME_LABELS = ['Contact name', 'Your name', 'Name'];
const SF_COMPANY_LABELS = [
  'Organization or institution name',
  'Company',
  'Network name',
  'Organization',
];
const SF_WEBSITE_LABELS = ['Website', 'Company website'];
const SF_PHONE_LABELS = ['Phone', 'Phone number'];

// Support form severities mapped onto the standard Case Priority picklist.
const SF_CASE_PRIORITY = {
  Low: 'Low',
  Normal: 'Medium',
  High: 'High',
  Urgent: 'High',
};

// Salesforce standard Email fields hold at most 80 characters. Longer
// addresses skip Salesforce and go out by email instead of being truncated.
const SF_MAX_EMAIL_LENGTH = 80;
const SF_TIMEOUT_MS = 8000;
// Client credentials responses carry no expiry, so cached tokens are
// refreshed well inside the shortest Salesforce session timeout (15 min is
// the minimum org setting). A 401 also forces a refresh.
const SF_TOKEN_TTL_MS = 10 * 60 * 1000;

/** Module scoped token cache, shared by requests within one isolate. */
let sfTokenCache = null;

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
          "Form must be one of 'mediaguard', 'citizenmesh', 'resilientnet', 'opencache-isp', 'opencache-provider', 'contact', 'support'.",
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

  const answers = [];
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
    answers.push([label, value]);
  }

  const submission = { form, formLabel, email, answers };

  // Salesforce first; any failure falls back to the Mailgun email so a
  // submission is never lost.
  const salesforce = await submitToSalesforce(submission, env);
  if (salesforce.ok) {
    return jsonResponse({ ok: true }, 200, cors);
  }
  if (salesforce.reason !== 'not configured') {
    console.error('Salesforce submission failed:', salesforce.reason);
  }

  const emailSent = await sendApplicationEmail(
    submission,
    env,
    salesforce.reason
  );
  if (!emailSent) {
    return jsonResponse(
      { error: 'Email service error. Please try again.' },
      502,
      cors
    );
  }

  return jsonResponse({ ok: true }, 200, cors);
}

/**
 * Render a submission as plain text lines: a header block, then one
 * "label: answer" line per question, with continuation lines of multi line
 * answers indented under their label.
 *
 * @param {{ formLabel: string, email: string, answers: string[][] }} submission
 * @returns {string} Plain text body.
 */
function formatSubmission({ formLabel, email, answers }) {
  const lines = [`Form: ${formLabel}`, `Sender email: ${email}`, ''];
  for (const [label, value] of answers) {
    const [firstLine, ...restLines] = value.split('\n');
    lines.push(`${label}: ${firstLine}`);
    for (const extraLine of restLines) {
      lines.push(`  ${extraLine}`);
    }
  }
  return lines.join('\n');
}

/**
 * Email a submission to contact@p.foundation via Mailgun, with Reply-To set
 * to the sender. When Salesforce was configured but failed, the body says
 * so, signalling the record must be entered in Salesforce by hand.
 *
 * @param {{ formLabel: string, email: string, answers: string[][] }} submission
 * @param {Record<string, string>} env Worker environment bindings.
 * @param {string} salesforceReason Why Salesforce did not take the record.
 * @returns {Promise<boolean>} True when Mailgun accepted the message.
 */
async function sendApplicationEmail(submission, env, salesforceReason) {
  const { formLabel, email } = submission;
  let text = formatSubmission(submission);
  if (salesforceReason && salesforceReason !== 'not configured') {
    text +=
      '\n\n---\nSalesforce did not accept this submission, ' +
      'so it was not recorded there. Reason: ' +
      salesforceReason;
  }

  // URLSearchParams handles all value encoding; never concatenate strings
  // into a form body.
  const params = new URLSearchParams();
  params.set('from', `P Foundation Website <forms@${env.MAILGUN_DOMAIN}>`);
  params.set('to', 'contact@p.foundation');
  // "Website form:" reads naturally for both applications ("Website form:
  // MediaGuard program") and contact messages ("Website form: Contact").
  params.set('subject', `Website form: ${formLabel} (${email})`);
  params.set('text', text);
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
    return false;
  }
  return true;
}

/**
 * Truncate a string to a Salesforce field length.
 *
 * @param {string} value Raw value.
 * @param {number} max Field length.
 * @returns {string} Value of at most max characters.
 */
function sfClip(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}

/**
 * Return the answer for the first label in labels that the submission
 * contains, or an empty string.
 *
 * @param {string[][]} answers Sanitized [label, value] pairs.
 * @param {string[]} labels Candidate question labels, in priority order.
 * @returns {string} Trimmed answer, possibly empty.
 */
function answerFor(answers, labels) {
  for (const label of labels) {
    const match = answers.find(([key]) => key === label);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
  }
  return '';
}

/**
 * Get a Salesforce access token with the OAuth 2.0 client credentials flow,
 * reusing a cached token unless forceRefresh is set.
 *
 * @param {Record<string, string>} env Worker environment bindings.
 * @param {boolean} forceRefresh Ignore the cache.
 * @returns {Promise<{ accessToken: string, instanceUrl: string }>}
 */
async function getSalesforceToken(env, forceRefresh) {
  if (!forceRefresh && sfTokenCache && sfTokenCache.expiresAt > Date.now()) {
    return sfTokenCache;
  }
  const params = new URLSearchParams();
  params.set('grant_type', 'client_credentials');
  params.set('client_id', env.SF_CLIENT_ID);
  params.set('client_secret', env.SF_CLIENT_SECRET);

  const response = await fetch(
    `${env.SF_INSTANCE_URL.replace(/\/+$/, '')}/services/oauth2/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      signal: AbortSignal.timeout(SF_TIMEOUT_MS),
    }
  );
  if (!response.ok) {
    sfTokenCache = null;
    throw new Error(
      `token request failed with ${response.status}: ${await response.text()}`
    );
  }
  const data = await response.json();
  sfTokenCache = {
    accessToken: data.access_token,
    instanceUrl: data.instance_url || env.SF_INSTANCE_URL,
    expiresAt: Date.now() + SF_TOKEN_TTL_MS,
  };
  return sfTokenCache;
}

/**
 * Split a full name on its last space. A single word becomes the last name.
 *
 * @param {string} name Full name, possibly empty.
 * @returns {{ firstName: string, lastName: string }}
 */
function splitName(name) {
  const split = name.lastIndexOf(' ');
  return {
    firstName: split > 0 ? name.slice(0, split).trim() : '',
    lastName: split > 0 ? name.slice(split + 1) : name,
  };
}

/**
 * Escape a value for use inside a single quoted SOQL string literal.
 *
 * @param {string} value Raw value.
 * @returns {string} Escaped value.
 */
function soqlString(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Send an authenticated request to the Salesforce REST API, refreshing the
 * token and retrying once on 401. Throws on network errors and timeouts.
 *
 * @param {Record<string, string>} env Worker environment bindings.
 * @param {string} path Path below /services/data/{version}, e.g. "/sobjects/Case".
 * @param {{ method?: string, headers?: Record<string, string>, body?: unknown }} [options]
 * @returns {Promise<{ status: number, ok: boolean, text: string }>}
 */
async function sfRequest(env, path, options = {}) {
  const apiVersion = env.SF_API_VERSION || 'v66.0';
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const token = await getSalesforceToken(env, attempt > 0);
    const headers = {
      Authorization: `Bearer ${token.accessToken}`,
      ...options.headers,
    };
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(
      `${token.instanceUrl}/services/data/${apiVersion}${path}`,
      {
        method: options.method || 'GET',
        headers,
        body:
          options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: AbortSignal.timeout(SF_TIMEOUT_MS),
      }
    );
    if (response.status === 401 && attempt === 0) {
      // Expired or revoked session: refresh the token and retry once.
      continue;
    }
    return {
      status: response.status,
      ok: response.ok,
      text: await response.text(),
    };
  }
  return { status: 401, ok: false, text: 'unauthorized after token refresh' };
}

/**
 * Create a Salesforce record and return its Id. Throws with the API error
 * text on failure.
 *
 * @param {Record<string, string>} env Worker environment bindings.
 * @param {string} sobject Object API name.
 * @param {Record<string, string>} record Field values.
 * @param {Record<string, string>} [headers] Extra request headers.
 * @returns {Promise<string>} New record Id.
 */
async function sfCreate(env, sobject, record, headers = {}) {
  const response = await sfRequest(env, `/sobjects/${sobject}`, {
    method: 'POST',
    headers: {
      // A returning submitter must not be rejected by a duplicate rule; the
      // record is saved and flagged as a potential duplicate.
      'Sforce-Duplicate-Rule-Header': 'allowSave=true',
      ...headers,
    },
    body: record,
  });
  if (!response.ok) {
    throw new Error(
      `${sobject} create failed with ${response.status}: ${response.text}`
    );
  }
  const result = JSON.parse(response.text);
  if (!result.success) {
    throw new Error(`${sobject} create failed: ${response.text}`);
  }
  return result.id;
}

/**
 * Find the oldest Contact with the submitter's email, or create one under
 * SF_CONTACT_ACCOUNT_ID. Contacts without an Account are private to their
 * owner, so when SF_CONTACT_ACCOUNT_ID is unset no Contact is created and
 * null is returned when there is no existing match.
 *
 * @param {Record<string, string>} env Worker environment bindings.
 * @param {{ email: string, answers: string[][] }} submission
 * @returns {Promise<string | null>} Contact Id, or null.
 */
async function findOrCreateContact(env, submission) {
  const { email, answers } = submission;
  const soql =
    'SELECT Id FROM Contact ' +
    `WHERE Email = '${soqlString(email)}' ORDER BY CreatedDate LIMIT 1`;
  const query = await sfRequest(env, `/query?q=${encodeURIComponent(soql)}`);
  if (!query.ok) {
    throw new Error(
      `Contact lookup failed with ${query.status}: ${query.text}`
    );
  }
  const existing = JSON.parse(query.text).records?.[0];
  if (existing) {
    return existing.Id;
  }

  if (!env.SF_CONTACT_ACCOUNT_ID) {
    console.error(
      'SF_CONTACT_ACCOUNT_ID is not set; Case created without a Contact.'
    );
    return null;
  }
  const { firstName, lastName } = splitName(answerFor(answers, SF_NAME_LABELS));
  const contact = {
    // LastName is required; fall back to the email's local part.
    LastName: sfClip(lastName || email.slice(0, email.lastIndexOf('@')), 80),
    Email: email,
    AccountId: env.SF_CONTACT_ACCOUNT_ID,
  };
  if (firstName) {
    contact.FirstName = sfClip(firstName, 40);
  }
  const phone = answerFor(answers, SF_PHONE_LABELS);
  if (phone) {
    contact.Phone = sfClip(phone, 40);
  }
  return sfCreate(env, 'Contact', contact);
}

/**
 * Build the Salesforce record body for a submission.
 *
 * @param {'Lead' | 'Case'} sobject Target object.
 * @param {{ form: string, formLabel: string, email: string, answers: string[][] }} submission
 * @returns {Record<string, string>} Field values for the REST API.
 */
function buildSalesforceRecord(sobject, submission) {
  const { form, formLabel, email, answers } = submission;
  const description = sfClip(formatSubmission(submission), 32000);
  const name = answerFor(answers, SF_NAME_LABELS);
  const company = answerFor(answers, SF_COMPANY_LABELS);

  if (sobject === 'Lead') {
    // Lead requires LastName and Company.
    const { firstName, lastName } = splitName(name);
    const record = {
      LastName: sfClip(lastName || email, 80),
      Company: sfClip(company || 'Not provided', 255),
      Email: email,
      LeadSource: 'Web',
      Description: description,
      Website_Form__c: form,
    };
    if (firstName) {
      record.FirstName = sfClip(firstName, 40);
    }
    const website = answerFor(answers, SF_WEBSITE_LABELS);
    if (website) {
      record.Website = sfClip(website, 255);
    }
    return record;
  }

  // Case: the Supplied* fields keep what the submitter typed; ContactId is
  // added by submitToSalesforce so Salesforce can email them on updates.
  const subject =
    answerFor(answers, ['Subject']) ||
    `${formLabel}: ${answerFor(answers, ['Topic']) || 'General'}`;
  const record = {
    Origin: 'Web',
    Subject: sfClip(subject, 255),
    SuppliedEmail: email,
    Description: description,
    Website_Form__c: form,
  };
  if (name) {
    record.SuppliedName = sfClip(name, 80);
  }
  if (company) {
    record.SuppliedCompany = sfClip(company, 80);
  }
  const priority = SF_CASE_PRIORITY[answerFor(answers, ['Severity'])];
  if (priority) {
    record.Priority = priority;
  }
  return record;
}

/**
 * Create a Lead or Case for a submission. Never throws: every failure is
 * returned as a reason, which the caller uses to fall back to email.
 * Salesforce is skipped when SF_INSTANCE_URL, SF_CLIENT_ID, or
 * SF_CLIENT_SECRET is unset.
 *
 * A Case is linked to the submitter's Contact (found or created first). A
 * Contact failure is logged and the Case is still created without it. Case
 * ownership goes to SF_CASE_OWNER_ID (a queue) when set, otherwise to the
 * active Case assignment rule.
 *
 * @param {{ form: string, formLabel: string, email: string, answers: string[][] }} submission
 * @param {Record<string, string>} env Worker environment bindings.
 * @returns {Promise<{ ok: true, id: string } | { ok: false, reason: string }>}
 */
async function submitToSalesforce(submission, env) {
  if (!env.SF_INSTANCE_URL || !env.SF_CLIENT_ID || !env.SF_CLIENT_SECRET) {
    return { ok: false, reason: 'not configured' };
  }
  const sobject = SALESFORCE_OBJECT_BY_FORM[submission.form];
  if (!sobject) {
    return { ok: false, reason: `no Salesforce object for ${submission.form}` };
  }
  if (submission.email.length > SF_MAX_EMAIL_LENGTH) {
    return { ok: false, reason: 'email longer than 80 characters' };
  }
  const record = buildSalesforceRecord(sobject, submission);
  // Run the active Lead or Case assignment rule, unless a Case queue is
  // configured: the rule would override an explicit OwnerId.
  let autoAssign = 'TRUE';

  try {
    if (sobject === 'Case') {
      try {
        const contactId = await findOrCreateContact(env, submission);
        if (contactId) {
          record.ContactId = contactId;
        }
      } catch (err) {
        console.error(
          'Salesforce Contact step failed; creating Case without it:',
          String(err && err.message ? err.message : err)
        );
      }
      if (env.SF_CASE_OWNER_ID) {
        record.OwnerId = env.SF_CASE_OWNER_ID;
        autoAssign = 'FALSE';
      }
    }
    const id = await sfCreate(env, sobject, record, {
      'Sforce-Auto-Assign': autoAssign,
    });
    return { ok: true, id };
  } catch (err) {
    return {
      ok: false,
      reason: String(err && err.message ? err.message : err),
    };
  }
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
