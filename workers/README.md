# p.foundation backend worker

A single Cloudflare Worker (`pf-backend`) that backs the static site at
https://p.foundation.

## Scope

This worker exists ONLY for backend services that a static site cannot do
itself:

1. Creating Stripe donation Checkout sessions.
2. Subscribing emails to the Mailgun mailing list.
3. Recording application, contact, and support forms in Salesforce (as
   Leads or Cases), with a Mailgun email to contact@p.foundation as the
   fallback.

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

Records a program or product application, a contact message, or a support
request in Salesforce, then falls back to email when Salesforce fails.

| Form key                                                                           | Salesforce object |
| ---------------------------------------------------------------------------------- | ----------------- |
| `mediaguard`, `citizenmesh`, `resilientnet`, `opencache-isp`, `opencache-provider` | Lead              |
| `contact`, `support`                                                               | Case              |

The mapping lives in `SALESFORCE_OBJECT_BY_FORM` in `src/index.js`. When
Salesforce is not configured, rejects the record, or does not answer within
8 seconds, the worker emails the submission instead, and the client still
gets `{ "ok": true }`. A fallback email caused by a Salesforce error ends
with the reason, which signals the record must be entered by hand. Only when
both Salesforce and Mailgun fail does the endpoint return 502. See
[Salesforce setup](#salesforce-setup) for the org configuration.

The fallback email goes to contact@p.foundation via Mailgun. Its Reply-To header is set to the
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
Actions, then the Secrets tab. The Deploy Worker workflow needs all six;
a deploy fails while any of them is missing.

| Secret                  | What it is and where to get it                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token created from the "Edit Cloudflare Workers" template. Needs Workers Scripts Edit on the account.                             |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard, Workers and Pages overview, right sidebar.                                                                                 |
| `STRIPE_SECRET_KEY`     | Stripe live secret key, or better a restricted key allowed to write Checkout Sessions. Pushed to the worker as a runtime secret on every deploy. |
| `MAILGUN_API_KEY`       | Mailgun private API key. Pushed to the worker as a runtime secret on every deploy.                                                               |
| `SF_CLIENT_ID`          | Consumer key of the Salesforce External Client App (see Salesforce setup). Pushed as a runtime secret.                                           |
| `SF_CLIENT_SECRET`      | Consumer secret of the same app. Pushed as a runtime secret.                                                                                     |

### GitHub Actions variables

Set these in the same place, on the Variables tab.

| Variable          | What it is                                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PF_API_BASE_URL` | The deployed worker URL, normally `https://webapi.p.foundation` (no trailing slash). Consumed by the GitHub Pages build in `deploy.yml` so the site knows where the API lives; the site falls back to the same URL when unset. |

### Worker runtime config (wrangler.toml [vars])

These are plain, non secret values committed in `wrangler.toml`.

| Var                     | Value and purpose                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ALLOWED_ORIGINS`       | `https://p.foundation,http://localhost:3000`. Comma separated exact origins allowed by CORS.                                                                                                           |
| `MAILGUN_LIST_ADDRESS`  | `updates@bounce.p.foundation`. The mailing list members are added to.                                                                                                                                  |
| `MAILGUN_DOMAIN`        | `bounce.p.foundation`. Sending domain for application emails (`forms@bounce.p.foundation`). Must be an active Mailgun domain; it already is, as the mailing list uses it.                              |
| `MAILGUN_API_BASE`      | `https://api.mailgun.net`. Use `https://api.eu.mailgun.net` for EU domains.                                                                                                                            |
| `SITE_URL`              | `https://p.foundation`. Used to build the Stripe success and cancel URLs.                                                                                                                              |
| `SF_INSTANCE_URL`       | Salesforce My Domain URL, for example `https://pfoundation.my.salesforce.com`. While empty, `/api/apply` skips Salesforce and only emails.                                                             |
| `SF_API_VERSION`        | Salesforce REST API version, `v66.0`.                                                                                                                                                                  |
| `SF_CONTACT_ACCOUNT_ID` | Account Id (for example the "Website Submitters" account) that new Contacts from contact and support forms are created under. While empty, Cases link only to an existing Contact with the same email. |
| `SF_CASE_OWNER_ID`      | Queue (or user) Id that owns new Cases. While empty, the active Case assignment rule picks the owner.                                                                                                  |

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

## Salesforce setup

Salesforce has no plain API keys. The worker authenticates with the OAuth
2.0 client credentials flow: an External Client App issues a consumer key
and secret, and every API call runs as a dedicated integration user.

### 1. Custom field on Lead and Case

Setup, Object Manager, Lead, Fields and Relationships, New. Create a Text
field with label `Website Form`, API name `Website_Form__c`, length 80.
Repeat on Case with the same API name. It stores the form key (for example
`opencache-isp` or `support`), which lets list views, reports, and
assignment rules tell programs apart. Text rather than a picklist keeps a
new form on the site from failing in Salesforce.

The worker also writes these standard fields, which need no setup:

- Lead: FirstName, LastName, Company, Email, Website, LeadSource (`Web`),
  Description (every answer in full).
- Case: SuppliedName, SuppliedEmail, SuppliedCompany, Subject, Priority
  (support Severity mapped Low to Low, Normal to Medium, High and Urgent to
  High), Origin (`Web`), Description, ContactId, and OwnerId when
  `SF_CASE_OWNER_ID` is set.
- Contact (created for a Case when no Contact has the submitter's email):
  FirstName, LastName (the email's local part when the form has no name),
  Email, Phone (when the form has a Phone question), AccountId
  (`SF_CONTACT_ACCOUNT_ID`).

Before each Case the worker runs `SELECT Id FROM Contact WHERE Email = ...
ORDER BY CreatedDate LIMIT 1` and links the oldest match, creating a
Contact only when there is none. With ContactId set, Salesforce can email
the submitter when the team comments on the Case. If the Contact lookup or
create fails, the error is logged and the Case is still created without a
Contact.

Confirm the `Web` value is active in the Lead Source and Case Origin
picklists, and the Low, Medium, and High values in Case Priority. Validation
rules that require other fields on Lead or Case will reject web records;
relax them for the integration user or the forms will fall back to email.

### 2. Integration user and permissions

1. Setup, Users, New User. User License `Salesforce Integration`, Profile
   `Minimum Access - API Only Integrations`. Use a real mailbox you control
   for the email (for example `salesforce-api@p.foundation`).
2. On the user, Permission Set License Assignments, add
   `Salesforce API Integration`.
3. Setup, Permission Sets, New: `PF Website Integration`, license
   `Salesforce API Integration`. Grant:
   - Object Settings, Leads: Read, Create. Field permissions: Edit on
     Website Form, Description, Website, Lead Source, Email, First Name,
     Company.
   - Object Settings, Cases: Read, Create. Field permissions: Edit on
     Website Form, Description, Subject, Priority, Case Origin, Web Email,
     Web Name, Web Company, Contact Name, Case Owner.
   - Object Settings, Contacts: Read, Create. Field permissions: Edit on
     First Name, Email, Phone, Account Name.
   - Object Settings, Accounts: Read.
4. Assign the permission set to the integration user.

If the Lead or Case objects are not offered under that license in your
edition, give the integration user a full Salesforce license and the
`Minimum Access - Salesforce` profile instead, with the same permission set.

### 3. External Client App (the "API key")

1. Setup, External Client App Manager, New External Client App. Name
   `PF Web`, contact email `contact@p.foundation`, distribution state
   Local.
2. Enable OAuth. Callback URL
   `https://login.salesforce.com/services/oauth2/success` (required by the
   form, never used). OAuth scope:
   `Manage user data via APIs (api)`.
3. Under Flow Enablement, check Enable Client Credentials Flow. Leave
   Require PKCE and Require secret for refresh token flows as defaulted.
   Create.
4. Policies tab, Edit. Under OAuth Flows and External Client App
   Enhancements, check Enable Client Credentials Flow and set Run As to the
   integration user. Under OAuth Policies, set Permitted Users to "All
   users may self-authorize" and IP Relaxation to "Relax IP restrictions"
   (Cloudflare egress IPs change). Save.
5. Settings tab, OAuth Settings, Consumer Key and Secret. Salesforce emails
   a verification code; enter it, then copy the Consumer Key and Consumer
   Secret.

New apps can take up to ten minutes before the token endpoint accepts them.

### 4. Wire it into the worker

1. Add the GitHub secrets `SF_CLIENT_ID` (Consumer Key) and
   `SF_CLIENT_SECRET` (Consumer Secret).
2. Set `SF_INSTANCE_URL` in `wrangler.toml` to the My Domain URL (Setup,
   My Domain, Current My Domain URL). The client credentials flow does not
   work against `login.salesforce.com`.
3. Push to `master` to deploy.

Check the credentials before deploying:

```sh
curl -s https://pfoundation.my.salesforce.com/services/oauth2/token \
  -d grant_type=client_credentials \
  -d client_id="$SF_CLIENT_ID" \
  -d client_secret="$SF_CLIENT_SECRET"
```

A JSON body with `access_token` means the setup works. `invalid_grant`
with "no client credentials user enabled" means step 3.4 is missing the
Run As user.

### 5. Optional routing

The worker sends `Sforce-Auto-Assign: TRUE`, so the active Lead and Case
assignment rules run on every record: route by `Website_Form__c` (for
example `opencache-isp` to the peering team, `support` to the NOC queue).
Without an active Case assignment rule whose entries match, a Case stays
owned by the integration user and its notifications go to that user's
email. Either activate a rule with a catch-all last entry, or set
`SF_CASE_OWNER_ID` to a queue Id: the worker then sets OwnerId and sends
`Sforce-Auto-Assign: FALSE` for Cases, since the rule would override it.
It also sends `Sforce-Duplicate-Rule-Header: allowSave=true`, so a
returning applicant is saved and flagged as a possible duplicate instead
of being rejected.

### Rotating the secret

External Client App Manager, PF Web, Settings, OAuth Settings, Consumer
Key and Secret, generate a new secret, update the `SF_CLIENT_SECRET` GitHub
secret, and redeploy. Submissions during the gap fall back to email.

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
