# 360 Biz Health: website, enquiry API and lead dashboard

React 18 + Vite + React Router 7 website for 360 Biz Health, prerendered to static HTML for search engines, with Vercel serverless functions, a Supabase PostgreSQL database, Supabase Auth for staff sign-in, and Resend for new-lead e-mails.

| Part | Technology | Where |
|---|---|---|
| Public website | React 18, Vite 5, React Router 7, prerendered at build time | `src/`, `index.html` |
| Brand system | Inter + Poppins (self-hosted), palette from the brand PDF, vector logo | `src/styles/global.css`, `src/assets/brand/` |
| API | Vercel Node.js functions (`/api/v1/*`) | `api/` (routes) → `server/` (logic) |
| Database | Supabase PostgreSQL with Row Level Security | `supabase/migrations/` |
| Staff sign-in | Supabase Auth (email + password) + `admin_users` allow-list, HttpOnly cookies | `server/auth.js` |
| Lead e-mails | Resend HTTP API, with stored status and retry | `server/email.js`, cron in `vercel.json` |
| Tests | Vitest (unit + API against real PostgreSQL), Playwright (end-to-end, axe accessibility) | `tests/` |

Detailed guides: [`docs/AUDIT.md`](docs/AUDIT.md) (requirement audit and integration status), [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) (step-by-step go-live and verification), [`docs/OPERATIONS.md`](docs/OPERATIONS.md) (security, privacy, retention, backups), [`docs/TEST-REPORT.md`](docs/TEST-REPORT.md), [`docs/CHANGES.md`](docs/CHANGES.md).

---

## 1. Prerequisites

- Node.js 22 (`node -v`) and npm 10+
- For production: a Vercel account, a Supabase project, a Resend account with a verified sending domain
- Optional: Cloudflare Turnstile keys (extra spam protection)

## 2. Install and run locally

```bash
npm ci                     # install exactly what package-lock.json specifies
cp .env.example .env       # then fill in the values you have (see section 4)
npm run dev                # http://localhost:5173 (React app + the real /api handlers)
```

`npm run dev` runs the API functions inside the Vite dev server (see `server/dev/router.js`), so the contact form and `/admin` work locally once `.env` points at a database and Supabase project. Without a database the site still runs; the form will honestly report that enquiries cannot be accepted (HTTP 503) instead of pretending to succeed.

Production-like local run (static prerendered pages, Vercel-style clean URLs, redirects, real 404 status, API):

```bash
npm run build
npm run serve              # http://localhost:4173
```

## 3. Project structure

```
api/v1/                     Vercel function entry points (one file per route, thin)
  enquiries.js              POST   public enquiry submission
  health.js                 GET    health check
  admin/session.js          POST sign in · GET current user · DELETE sign out
  admin/stats.js            GET    dashboard counts
  admin/leads/index.js      GET    paginated, filtered lead list
  admin/leads/export.js     GET    CSV export (admin role)
  admin/leads/[id]/index.js GET details · PATCH status/assignee/follow-up
  admin/leads/[id]/notes.js POST   private note
  admin/leads/[id]/notify.js POST  retry the lead e-mail (admin role)
  admin/overview.js         GET    dashboard figures (KPIs, 30-day trend, status mix, activity, recent posts)
  admin/users.js            GET    dashboard accounts (admin role, read-only)
  admin/posts/index.js      GET list · POST create (publish needs admin role)
  admin/posts/[id]/index.js GET · PUT update (live posts: admin) · DELETE (admin)
  admin/posts/[id]/status.js POST  publish / unpublish (admin role)
  admin/media.js            GET recent uploads · POST upload an image (raw bytes, ≤ 2 MB, JPEG/PNG/WebP)
  posts/index.js            GET    published posts (public)
  posts/[slug].js           GET    one published post + related (public)
  media/[id].js             GET    an uploaded image (public, immutable cache)
  blog-page.js              GET    server-rendered /blog and /blog/:slug (via rewrites)
  sitemap.js                GET    /sitemap.xml: static pages + published posts (via rewrite)
  cron/retry-notifications.js GET  Vercel Cron: retry failed e-mails
server/                     API logic: http helpers, auth, db pool, leads + blog repositories, e-mail, CSV, rate limit
shared/enquiry.js           Enquiry validation + option lists (incl. retreat packages) shared by forms and API
shared/blog.js, markdown.js Blog post validation; Markdown → sanitised HTML (used by the API and the editor preview)
supabase/migrations/        Versioned SQL (tables, constraints, indexes, RLS, rate-limit function)
src/
  data/                     site.js (business details, home FAQs), navigation.js (all menus),
                            services.js (service copy), serviceDetails.js (per-service layout, images, sections),
                            retreats.js (Corporate Retreats page), resources.js, images.js (optimised image registry)
  lib/                      seo.js (head tags + JSON-LD), blog.js (article metadata, SSR data hand-off), api.js,
                            attribution.js, analytics.js, contact.js, text.js
  components/               Layout, Header, MobileNav, Footer, MobileBar, PageHead, Breadcrumbs, Section, Reveal,
                            Button, Tiles, Lists, FaqList, CtaBand, HeroRing, ContactForm, Turnstile, BrandLogo
  pages/                    Home, ServicePage, About, Contact, BlogIndex, BlogArticle, Careers, Resources, Faq,
                            CorporateRetreats, ThankYou, Privacy, Terms, Disclaimer, NotFound,
                            admin/ (AdminApp shell + sidebar, Overview, Leads, LeadDetail, BlogList, BlogEditor,
                            BlogPreview, RetreatsAdmin, Users, Login)
  routes.jsx                Every route with its title, description, breadcrumbs and structured data
  entry-server.jsx          Renderer used at build time (prerender.mjs) and at request time (blog pages)
scripts/                    prerender.mjs, serve.mjs, migrate.mjs, add-admin.mjs, check-bundle.mjs, brand/make_logo.py
tests/                      unit/, api/, e2e/, helpers/
assets-source/              Original, unoptimised images (not bundled; kept for future edits)
```

### Editing content

- **Service pages**: copy in `src/data/services.js`; layout, hero image and section order in `src/data/serviceDetails.js`. Each page lists its own `sections` (for example HRMS uses a horizontal timeline and a who-does-what comparison, Payroll a monthly cycle diagram, Business setup a staged sequence, Retreats a photo hero and format cards).
- **Blog**: managed in the dashboard at `/admin/blog` (no code or redeploy needed). Posts are stored in the database (`blog_posts`); the public `/blog` and `/blog/:slug` pages, the sitemap and BlogPosting/FAQ structured data are generated from it on each request. Staff write drafts; administrators publish, unpublish, edit live posts and delete. The three original articles were migrated with their URLs and anchors unchanged.
- **Corporate retreat packages**: `src/data/retreats.js` (names, descriptions, highlights, FAQ). Enquiry counts per package are in the dashboard under Retreat Packages.
- **Navigation**: `src/data/navigation.js` drives the header, mobile menu, footer and 404 page.
- **Business details**: `src/data/site.js` (`BIZ`). Phone and WhatsApp buttons stay hidden until you replace the placeholder number and set `phonePublished: true`.
- **Images**: put the original in `assets-source/`, export WebP variants into `src/assets/images/` (`name-lg.webp` ~1200px, `name-sm.webp` 640px) and register them in `src/data/images.js` with meaningful alt text.

## 4. Environment variables

All variables are listed with placeholders in [`.env.example`](.env.example). Only `VITE_*` values reach the browser; everything else is server-only.

| Variable | Required | Purpose |
|---|---|---|
| `SITE_URL` | yes | Public URL, e.g. `https://www.360bizhealth.com`. Used for origin checks and links in e-mails |
| `VITE_SITE_URL` | yes | Same URL, used at build time for canonical tags, sitemap and Open Graph |
| `DATABASE_URL` | yes | Supabase **transaction pooler** connection string (port 6543) |
| `DATABASE_SSL` | no | `require` (default), `verify` (+ `DATABASE_CA_CERT`), or `disable` for local databases |
| `MIGRATION_DATABASE_URL` | no | Session/direct connection string for `npm run db:migrate` and `npm run admin:add` |
| `SUPABASE_URL` | yes | `https://<project-ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | yes | Supabase anon (publishable) key, used server-side to call Supabase Auth |
| `RESEND_API_KEY` | for e-mail | Resend API key |
| `EMAIL_FROM` | for e-mail | Sender on a domain verified in Resend |
| `LEAD_NOTIFICATION_TO` | for e-mail | Comma-separated recipients of new-lead alerts |
| `IP_HASH_SALT` | yes | Random secret for hashing IP addresses (rate limiting) |
| `CRON_SECRET` | yes | Random secret; Vercel Cron sends it to the retry job |
| `ALLOWED_ORIGINS` | no | Extra origins allowed to POST (e.g. a staging domain) |
| `VITE_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | no | Enable Cloudflare Turnstile on the form |
| `ALLOW_INSECURE_COOKIES` | local only | `true` lets admin cookies work on `http://localhost`; ignored in production |

The Supabase **service-role key is not used anywhere** and must never be added to this project.

## 5. Database setup

1. Create a Supabase project (region close to your users, e.g. Mumbai `ap-south-1`).
2. Apply the migration, choosing **one** method:
   - **SQL editor**: run each file in `supabase/migrations/` in filename order (`20261015000100_initial_schema.sql`, then `20261015000200_lead_subject.sql`) in Supabase → SQL Editor.
   - **Script**: set `MIGRATION_DATABASE_URL` (Session pooler, port 5432) in `.env`, then `npm run db:migrate`. It records applied files in `public.schema_migrations`.
   - **Supabase CLI**: `supabase link` then `supabase db push`.
3. The migrations create `leads`, `lead_notes`, `audit_log`, `admin_users`, `rate_limits` and the `rate_limit_hit()` function, add structured retreat fields to `leads` (`retreat_package`, `details`), create `blog_posts` and `blog_media`, seed the three original articles, enable Row Level Security on every table, and revoke all access from the `anon` and `authenticated` roles. The website never queries the database from the browser; only the API functions do.

   Current files, in order: `20261015000100_initial_schema.sql`, `20261015000200_lead_subject.sql`, `20261027000100_crm_blog.sql`, `20261027000200_seed_blog_posts.sql`. The last two are additive: existing leads, notes, audit history and accounts are untouched, and re-running the seed never overwrites a post edited in the dashboard.

Future schema changes: add a new file `supabase/migrations/<timestamp>_<name>.sql` and apply it the same way. Never edit a migration that has already been applied.

## 6. Administrator accounts

There is deliberately **no public sign-up**. To create the first administrator:

1. Supabase → Authentication → Sign In / Providers → Email: keep Email enabled and **turn off "Allow new users to sign up"**.
2. Supabase → Authentication → Users → **Add user** → enter the person's email and a strong password, tick **Auto Confirm User**.
3. Grant dashboard access: `npm run admin:add -- person@company.com admin` (role `admin` = full access including CSV export, e-mail retry, publishing/unpublishing/deleting blog posts and the Users & Access page; `staff` = view and update leads, add notes, write blog drafts and upload images). Or in the SQL editor:
   ```sql
   insert into public.admin_users (user_id, email, role)
   select id, email, 'admin' from auth.users where email = 'person@company.com';
   ```
4. Sign in at `/admin`. Remove access with `npm run admin:add -- person@company.com --revoke` (takes effect on the next request).

## 7. E-mail notifications (Resend)

1. Resend → Domains → add `360bizhealth.com` and create the DNS records it shows (SPF/DKIM) at your DNS provider; wait for "Verified".
2. Resend → API Keys → create a key with "Sending access". Set `RESEND_API_KEY`, `EMAIL_FROM` (e.g. `360 Biz Health Website <leads@360bizhealth.com>`) and `LEAD_NOTIFICATION_TO`.
3. Each enquiry is **saved first**, then e-mailed. The outcome is stored per lead (`sent`, `failed`, `not_configured`). Failed e-mails are retried daily by the Vercel Cron job and can be retried from the lead page by an admin. The dashboard shows a red counter when alerts have failed.

## 8. Testing

```bash
npm test                   # unit + API integration tests (starts a throwaway PostgreSQL 17 automatically)
npm run build && npm run test:e2e   # Playwright end-to-end + axe accessibility against the production build
npm run check:bundle       # fails if secrets or server-only variable names reach dist/
npm run test:all           # everything above in order
```

The API and end-to-end tests start an embedded PostgreSQL, apply the real migration, and replace Supabase Auth and Resend with local HTTP stubs, so they need no accounts or network access. Playwright needs a Chromium browser (`npx playwright install chromium` on a new machine). Results of the last run are in [`docs/TEST-REPORT.md`](docs/TEST-REPORT.md).

## 9. Deploying to Vercel

Short version (full checklist in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)):

1. Push the project to GitHub/GitLab and import it in Vercel. `vercel.json` already sets the install/build commands, output directory, clean URLs, redirects, security headers, function limits and the cron job. Framework preset: **Other**.
2. Add every variable from section 4 under Project → Settings → Environment Variables (Production, and Preview if you use preview deployments with a separate database).
3. Deploy. Then add your domain under Project → Settings → Domains and redirect the apex domain to `www` (or the reverse; keep `SITE_URL`/`VITE_SITE_URL` identical to the primary domain).
4. Verify with the checks in `docs/DEPLOYMENT.md` (health endpoint, a real test enquiry, e-mail arrival, admin sign-in, 404 status).

### How routing works on Vercel

- Every static public page is prerendered to `dist/<path>.html`; `cleanUrls` serves `/about` from `about.html`, and `trailingSlash: false` redirects `/about/` → `/about` (matching the canonical URLs).
- `/blog`, `/blog/:slug` and `/sitemap.xml` are rewritten to functions (`api/v1/blog-page.js`, `api/v1/sitemap.js`) that read the database on each request and render with the same React components (bundle in `dist-ssr/`, included in the functions via `includeFiles` in `vercel.json`). Responses are cached at the edge for 30 seconds (`s-maxage=30, stale-while-revalidate=60`), so a publish, edit or unpublish is visible within about a minute. Unknown or unpublished slugs return a real 404.
- Unknown URLs get `dist/404.html` with a real **404 status**.
- Uploaded blog images are stored in PostgreSQL (`blog_media`, max 2 MB each, type checked from the file bytes) and served from `/api/v1/media/:id` with year-long immutable caching, so they persist on serverless hosting and stay within the site's `img-src 'self'` Content-Security-Policy.
- `/admin/*` is rewritten to the admin shell; `/api/*` is handled only by functions and is never rewritten to the frontend.
- Old URLs (`/resources/blogs-news/:slug`, `/privacy`, `/terms`, `#/...` hash links) redirect to their canonical pages.

## 10. Dashboard (CRM) at a glance

- **Dashboard**: total, new, last-7-days, follow-ups-due and converted leads, published posts; a 30-day enquiry chart; lead status mix; recent leads; recent activity (from the audit log); recently edited posts; quick actions. Every figure is a live database query and every card links to the matching filtered view.
- **Leads / Enquiries**: search (name, company, email, phone, subject, reference), filters (status, service, retreat package, dates, e-mail alert, follow-up due), sorting, page size and pagination, all kept in the URL. "Enquiries" is the same data filtered to new, uncontacted leads, with a count badge in the sidebar. Lists refresh when the tab regains focus and on demand.
- **Lead detail**: contact details, retreat package and details (for retreat enquiries), message, status / assignee / next follow-up, private notes, source and consent, e-mail alert status, full activity history.
- **Blog Management**: table with thumbnail, title, category, author, status, created / published / updated dates; search, status tabs, category filter, sort, pagination; edit, preview, publish/unpublish and delete (with confirmation). The editor has Markdown with a formatting toolbar and live preview, featured-image upload, alt text, category, author, publication date, key points, FAQs, SEO title and description with a search-result preview, unsaved-changes warning and protection against overwriting someone else's newer edit.
- **Retreat Packages**: live enquiry counts per package with links to the filtered leads. Package text itself is edited in `src/data/retreats.js`.
- **Users & Access** (administrators): who can sign in, their role and last sign-in. Accounts are managed with `npm run admin:add` (section 6).

## 11. Brand

Palette (from the brand PDF): forest `#1E5A3C`, deep green `#0C4727`, sage `#719078`, sand `#E8DDC9`, cream `#F9F4EA`, orange `#F26423`. The exact orange is used for decorative accents; filled buttons and orange text use `#B9440F` so white text meets WCAG AA contrast (5.4:1). Inter is the primary typeface; Poppins is used for numbers and short labels. The logo SVGs in `src/assets/brand/` were generated from Inter glyph outlines to match the PDF geometry (`scripts/brand/make_logo.py`); if you receive the original vector logo from the designer, replace those two files.

## 12. Before launch: owner actions

- Replace the placeholder phone/WhatsApp in `src/data/site.js` and set `phonePublished: true` (until then Call/WhatsApp buttons are hidden, not broken).
- Have the Privacy Policy, Terms and Disclaimer reviewed against your registered entity details; add the verified address (`addressPublished: true`) and a last-updated date.
- Confirm the careers listings are current.
- Complete the external configuration in sections 4 to 7 and the verification checklist in `docs/DEPLOYMENT.md`.
