# Security, privacy and operations

## Access model

- Browsers never connect to the database. All reads and writes go through `/api/v1/*` functions using the server-only `DATABASE_URL`.
- Row Level Security is enabled on every table with **no policies for `anon` or `authenticated`**, and all privileges are revoked from those roles. Even with the public Supabase key or a signed-in user's token, the Supabase Data API cannot read leads. (Tested in `tests/api/api.test.js` → "database security".)
- Staff sign in with Supabase Auth. The API then requires an **active row in `admin_users`**; a valid Supabase account alone grants nothing. Access is re-checked on every request, so deactivating a user is immediate.
- Roles: `admin` (everything, including CSV export and e-mail retry) and `staff` (view, update status/assignee/follow-up, add notes).
- Optional least-privilege database user: create a login role, `grant bh_api to <role>`, and use it in `DATABASE_URL` instead of `postgres`. The migration already defines the `bh_api` policies and grants.

## Session and request security

- Supabase access/refresh tokens are stored only in `HttpOnly; Secure; SameSite=Strict` cookies scoped to `/api/v1/admin`. Page scripts cannot read them, and they are never returned in response bodies.
- State-changing admin requests require the custom `X-BH-CSRF: 1` header and a same-site `Origin`; cross-site forms cannot send either.
- The public enquiry endpoint rejects foreign `Origin`s, non-JSON bodies, bodies over 32 KB, honeypot submissions and submissions faster than 2 seconds, and applies database-backed rate limits (5 per IP per 10 minutes, 4 per email per hour). Sign-in is limited to 10 attempts per IP and 6 per email per 15 minutes, on top of Supabase's own limits.
- All SQL is parameterised; list filters are whitelisted; search text is escaped for `LIKE`.
- CSV exports neutralise spreadsheet formulas (cells starting with `= + - @`).
- Logs contain identifiers and error codes only, never request bodies, e-mail addresses, phone numbers, passwords or tokens (`server/log.js` redacts these keys).
- Security headers (CSP, HSTS, frame denial, nosniff, referrer and permissions policies) are set in `vercel.json`.

## Personal data collected

Per enquiry: name, company, work email, phone, service, optional company size / city / current HRMS, message, consent flag + timestamp + consent wording version, source page, landing page, referrer, UTM parameters, browser user-agent, and a **salted SHA-256 hash of the IP address** (the IP itself is not stored). Staff notes and an audit log of changes are stored with the lead.

The Privacy Policy page describes this. Have it reviewed against your registered entity details and applicable law (including India's Digital Personal Data Protection Act, 2023) before launch; this project does not claim any compliance certification.

## Retention (recommended policy: decide and document)

The application does not delete data automatically. A suggested policy:

- Leads with status `lost` or `on_hold` and no activity for 24 months: delete.
- Rate-limit rows: cleaned automatically after 1 day.
- Audit log: keep while the lead exists (deleted with it via `on delete cascade`).

Run in the Supabase SQL editor when you adopt it:

```sql
delete from public.leads
where status in ('lost', 'on_hold') and updated_at < now() - interval '24 months';
```

To honour a deletion request for one person: `delete from public.leads where lower(email) = lower('person@example.com');` (notes and audit entries are removed with the lead).

## Backups and recovery

- Supabase takes daily backups on paid plans (check Database → Backups for your plan's retention). Point-in-time recovery is an add-on.
- For an independent copy, schedule a periodic export: `pg_dump "$MIGRATION_DATABASE_URL" --schema=public --no-owner > backup.sql` and store it encrypted.
- Recovery: restore from the Supabase dashboard (or `psql` the dump into a new project), update `DATABASE_URL` in Vercel, redeploy.
- The website itself is stateless; any previous Vercel deployment can be promoted instantly.

## E-mail delivery

- Leads are committed before any e-mail is attempted, so an e-mail outage never loses an enquiry.
- Outcome per lead: `sent`, `failed` (with the provider's error), or `not_configured`.
- Retries: the daily Vercel Cron job (`/api/v1/cron/retry-notifications`, authenticated with `CRON_SECRET`) retries `failed`/`pending` leads from the last 7 days up to 5 attempts; admins can retry any lead from its page.
- If alerts fail repeatedly, check the Resend dashboard (domain still verified, key not revoked) and Vercel → Logs filtered by `lead_notification_failed`.

## Monitoring

- `GET /api/v1/health` returns 200 when the database answers, 503 otherwise, suitable for an uptime monitor (UptimeRobot, Better Stack, etc.).
- Vercel → Logs: search for `"level":"error"`; every unexpected server error has an `errorId` that is also shown to the visitor.

## Dependency notes

`npm audit --omit=dev` reports no known vulnerabilities in production dependencies at the time of delivery. The development toolchain (Vite 5 / Vitest 2 / esbuild) has advisories that affect only the local dev server; upgrade to Vite 6+ / Vitest 3+ when convenient.
