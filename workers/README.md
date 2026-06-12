# p.foundation backend worker

A single Cloudflare Worker (`pf-backend`) that backs the static site at
https://p.foundation.

## Scope

This worker exists ONLY for backend services that a static site cannot do
itself:

1. Creating Stripe donation Checkout sessions.
2. Subscribing emails to the Mailgun mailing list.
3. Emailing application and contact forms to contact@p.foundation via
   Mailgun.

The site itself deploys to GitHub Pages (see `.github/workflows/deploy.yml`).
Do not add page serving, redirects, or other duties here.

## Endpoints

All request and response bodies are JSON. Error responses use the shape
`{ "error": "<human readable message>" }` for any 4xx or 5xx status.

CORS: the worker allows the origins `https://p.foundation` and
`http://localhost:3000`, the methods POST, OPTIONS, and GET, and the
`Content-Type` header. The frontend sends `Content-Type: application/json`,
which triggers a preflight; the worker answers the OPTIONS request.

### POST /api/donate/checkout

Creates a Stripe Checkout session and returns its hosted payment page URL.
The browser is then redirected there.

Request body:

| Field      | Type    | Constraints                               |
| ---------- | ------- | ----------------------------------------- |
| `amount`   | integer | USD cents, 100 to 1000000 ($1 to $10,000) |
| `interval` | string  | exactly `"one_time"` or `"monthly"`       |

```sh
curl -X POST https://webapi.p.foundation/api/donate/checkout \
  -H 'Content-Type: application/json' \
  -d '{"amount": 2500, "interval": "one_time"}'
```

Success (200):

```json
{ "url": "https://checkout.stripe.com/c/pay/cs_live_..." }
```

Error (4xx/5xx):

```json
{ "error": "Donation interval must be 'one_time' or 'monthly'." }
```

### POST /api/newsletter/subscribe

Upserts the email into the Mailgun mailing list.

Request body:

| Field          | Type   | Constraints                                       |
| -------------- | ------ | ------------------------------------------------- |
| `email`        | string | required, valid email address, max 254 characters |
| `referralPage` | string | optional, page path that hosted the form          |

```sh
curl -X POST https://webapi.p.foundation/api/newsletter/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email": "donor@example.com", "referralPage": "/donate"}'
```

Success (200):

```json
{ "ok": true }
```

Error (4xx/5xx):

```json
{ "error": "Please provide a valid email address." }
```

### POST /api/apply

Emails a program or product application, or a contact form message, to
contact@p.foundation via Mailgun. The email's Reply-To header is set to the
sender address, so replying from the inbox reaches them directly. The subject
line is `Website form: <form label> (<sender email>)`, for example
`Website form: Contact (noc@example.net)`.

Request body:

| Field    | Type   | Constraints                                                                                                                  |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `form`   | string | exactly one of `mediaguard`, `citizenmesh`, `resilientnet`, `opencache-isp`, `opencache-provider`, `contact`                 |
| `email`  | string | required, valid email address, max 254 characters                                                                            |
| `fields` | object | 1 to 20 entries; each key is a question label (non-empty string, max 80 chars), each value an answer string (max 2000 chars) |

```sh
curl -X POST https://webapi.p.foundation/api/apply \
  -H 'Content-Type: application/json' \
  -d '{"form": "opencache-isp", "email": "noc@example.net", "fields": {"Organization": "Example ISP", "Why do you want to participate?": "We serve rural communities."}}'
```

Success (200):

```json
{ "ok": true }
```

Error (4xx/5xx):

```json
{ "error": "Fields must contain between 1 and 20 entries." }
```

The message is sent from `forms@bounce.p.foundation` (see `MAILGUN_DOMAIN`
below). The sending domain must be an active domain in the Mailgun account;
`bounce.p.foundation` already is, since the mailing list uses it.

### GET /health

Returns `200` with the plain text body `ok`. Useful for uptime monitoring.

```sh
curl https://webapi.p.foundation/health
```

## Environment variables and secrets

### GitHub Actions secrets

Set these in the repository: Settings, then Secrets and variables, then
Actions, then the Secrets tab. The Deploy Worker workflow needs all four.

| Secret                  | What it is and where to get it                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token created from the "Edit Cloudflare Workers" template. Needs Workers Scripts Edit on the account.                             |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard, Workers and Pages overview, right sidebar.                                                                                 |
| `STRIPE_SECRET_KEY`     | Stripe live secret key, or better a restricted key allowed to write Checkout Sessions. Pushed to the worker as a runtime secret on every deploy. |
| `MAILGUN_API_KEY`       | Mailgun private API key. Pushed to the worker as a runtime secret on every deploy.                                                               |

### GitHub Actions variables

Set these in the same place, on the Variables tab.

| Variable          | What it is                                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PF_API_BASE_URL` | The deployed worker URL, normally `https://webapi.p.foundation` (no trailing slash). Consumed by the GitHub Pages build in `deploy.yml` so the site knows where the API lives; the site falls back to the same URL when unset. |

### Worker runtime config (wrangler.toml [vars])

These are plain, non secret values committed in `wrangler.toml`.

| Var                    | Value and purpose                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ALLOWED_ORIGINS`      | `https://p.foundation,http://localhost:3000`. Comma separated exact origins allowed by CORS.                                                                              |
| `MAILGUN_LIST_ADDRESS` | `updates@bounce.p.foundation`. The mailing list members are added to.                                                                                                     |
| `MAILGUN_DOMAIN`       | `bounce.p.foundation`. Sending domain for application emails (`forms@bounce.p.foundation`). Must be an active Mailgun domain; it already is, as the mailing list uses it. |
| `MAILGUN_API_BASE`     | `https://api.mailgun.net`. Use `https://api.eu.mailgun.net` for EU domains.                                                                                               |
| `SITE_URL`             | `https://p.foundation`. Used to build the Stripe success and cancel URLs.                                                                                                 |

## First deploy checklist

1. Set the four GitHub secrets listed above.
2. Push to `master` (any change under `workers/`), or run the "Deploy Worker"
   workflow manually from the Actions tab.
3. The worker deploys to the custom domain `https://webapi.p.foundation`
   (see the Custom domain section) plus its workers.dev URL as a fallback.
4. Set the `PF_API_BASE_URL` repository variable to
   `https://webapi.p.foundation` (no trailing slash). The site build also
   defaults to this URL when the variable is unset.
5. Re-run the GitHub Pages deploy so the site picks it up.

## Abuse protection

All three POST endpoints are rate limited to 10 requests per minute per IP
and per endpoint, via the Workers rate limiting binding configured in
`wrangler.toml` (`RATE_LIMITER`). The binding uses Cloudflare's beta
"unsafe" bindings namespace; the worker treats it as optional, so if a
deploy ever rejects the block you can remove it from `wrangler.toml` and
all three endpoints keep working without rate limiting.

The subscribe endpoint adds members directly (single opt-in) because that is
the intended signup flow. If list bombing ever becomes a problem, the next
hardening step is double opt-in: upsert with `subscribed=no`, email the
address a signed confirmation link, and flip `subscribed` to `yes` in a
confirm endpoint.

## Mailing list behavior

Members are upserted into `updates@bounce.p.foundation`: subscribing twice
updates the existing member instead of failing. Each member carries two vars:

- `referral_page`: the page where the visitor subscribed, sent by the
  frontend as `referralPage`.
- `subscribed_at`: ISO 8601 timestamp, set server side on purpose so clients
  cannot forge it.

## Local development

```sh
cd workers
npm install                      # installs the pinned wrangler version
cp .dev.vars.example .dev.vars   # then fill in real test keys
npx wrangler dev
```

`workers/package.json` pins the wrangler version for both local development
and the Deploy Worker action, which installs from it.

`npx wrangler dev` serves the worker on http://localhost:8787 and loads
secrets from `.dev.vars` (gitignored). The worker allows the origin
`http://localhost:3000`, so `npm start` on the site works against it: build
or start the site with `PF_API_BASE_URL=http://localhost:8787`.

## Custom domain

The worker is served at `https://webapi.p.foundation`, configured as a
`custom_domain` route in `wrangler.toml`. The hostname reaches Cloudflare
through a partial (CNAME) setup, so the rest of the p.foundation zone stays
on its existing nameservers. The workers.dev URL remains enabled as a
fallback. If the custom domain is ever removed, update
`customFields.apiBaseUrl` in `docusaurus.config.js` and the
`PF_API_BASE_URL` repository variable to match.
