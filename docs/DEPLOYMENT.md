# Deployment checklist and live verification

Work through the sections in order. Items marked **(you)** need your accounts, credentials or DNS access; they cannot be completed from the code alone.

## A. Accounts and services

- [ ] **(you)** Supabase project created (Mumbai `ap-south-1` recommended). Note the project ref and database password.
- [ ] **(you)** Supabase → Authentication → Sign In / Providers → Email: enabled, **"Allow new users to sign up" turned off**.
- [ ] **(you)** Supabase → Authentication → URL Configuration → Site URL set to `https://www.360bizhealth.com`.
- [ ] **(you)** Resend account; domain `360bizhealth.com` added and **Verified** (SPF + DKIM DNS records created at your DNS provider).
- [ ] **(you)** Resend API key created ("Sending access" only).
- [ ] **(you)** Optional: Cloudflare Turnstile widget created for `360bizhealth.com` (site key + secret key).

## B. Database

- [ ] Apply every file in `supabase/migrations/` in filename order (SQL editor, `npm run db:migrate`, or `supabase db push`; one method only).
- [ ] Check in Supabase → Table Editor that `leads`, `lead_notes`, `audit_log`, `admin_users`, `rate_limits` exist and each shows **RLS enabled**.
- [ ] Supabase → Database → Backups: confirm daily backups are on for your plan (see `docs/OPERATIONS.md`).

## C. First administrator

- [ ] Supabase → Authentication → Users → Add user (email + strong password, Auto Confirm).
- [ ] `npm run admin:add -- you@360bizhealth.com admin` (or the SQL in the README).
- [ ] Optional: add staff accounts with role `staff`.

## D. Vercel project

- [ ] Import the repository in Vercel. Framework preset **Other** (settings come from `vercel.json`).
- [ ] Project → Settings → General → Node.js Version: **22.x**.
- [ ] Project → Settings → Environment Variables: add for **Production** (and Preview if used):

| Name | Value |
|---|---|
| `SITE_URL` | `https://www.360bizhealth.com` |
| `VITE_SITE_URL` | `https://www.360bizhealth.com` |
| `DATABASE_URL` | Supabase → Connect → **Transaction pooler** URI (port 6543), password filled in |
| `DATABASE_SSL` | `require` |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → anon / publishable key |
| `RESEND_API_KEY` | from Resend |
| `EMAIL_FROM` | `360 Biz Health Website <leads@360bizhealth.com>` (verified domain) |
| `LEAD_NOTIFICATION_TO` | inbox(es) that should receive new leads, comma-separated |
| `IP_HASH_SALT` | 64 random hex characters |
| `CRON_SECRET` | 64 random hex characters (different from the salt) |
| `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | optional |

Generate random values with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

Do **not** add `ALLOW_INSECURE_COOKIES` in Vercel, and never add a Supabase service-role key.

- [ ] Deploy (Deployments → Redeploy after changing variables; `VITE_*` values are baked in at build time).
- [ ] Project → Settings → Domains: add `www.360bizhealth.com` and `360bizhealth.com`; set one to redirect to the other (the one in `SITE_URL` is primary).
- [ ] Project → Settings → Cron Jobs: confirm `/api/v1/cron/retry-notifications` is listed (daily 04:00 UTC).

## E. Verify the live site

Run these against the production URL after the domain is live.

1. **Health**: `curl https://www.360bizhealth.com/api/v1/health` → `{"ok":true,"status":"ok","database":"ok",...}`. A `503`/`"unavailable"` means `DATABASE_URL` is wrong or the database is unreachable.
2. **Pages**: open `/`, each of the four service pages, `/blog`, one article, `/contact`, `/about`, `/careers`, `/faq`. Check the logo, fonts (Inter), green/cream palette.
3. **404**: `curl -s -o /dev/null -w "%{http_code}" https://www.360bizhealth.com/blog/does-not-exist` → `404`.
4. **Redirects**: `curl -sI https://www.360bizhealth.com/about/` → `308` to `/about`; `/privacy` → `301` to `/privacy-policy`.
5. **Metadata**: view source of a service page: `<title>`, `<meta name="description">`, `<link rel="canonical" href="https://www.360bizhealth.com/...">` and a JSON-LD block are in the raw HTML. Paste the URL into Google's Rich Results Test and the Schema.org validator.
6. **Enquiry**: submit the contact form with your own details. Expect the Thank-you page with a reference `BH-XXXXXX`, the e-mail alert in `LEAD_NOTIFICATION_TO`, and the lead in `/admin`.
7. **E-mail failure path** (optional): temporarily set a wrong `RESEND_API_KEY`, redeploy and submit; the lead is still saved and shows "failed" in the dashboard; restore the key and use **Retry email alert**.
8. **Admin security**: in a private window, `curl -i https://www.360bizhealth.com/api/v1/admin/leads` → `401`. Sign in at `/admin`, filter, open a lead, change status, add a note, export CSV (admin role), sign out.
9. **Search Console**: add the property, submit `https://www.360bizhealth.com/sitemap.xml`.
10. **Headers**: `curl -sI https://www.360bizhealth.com/` shows `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`.

If you later add Google Tag Manager or other third-party scripts, extend the `Content-Security-Policy` header in `vercel.json` (`script-src`, `connect-src`, `img-src`, `frame-src`) or they will be blocked.

## F. Rollback

Vercel → Deployments → pick the last good deployment → **Promote to Production**. Database migrations are additive; if a future migration must be reverted, write a new migration that undoes it rather than editing history.
