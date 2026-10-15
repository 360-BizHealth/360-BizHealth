# Requirement audit (second pass)

Audit of the current project against the "Final Implementation Instructions" brief, done by inspecting the code and re-running the tests rather than relying on earlier notes. No transcript of the earlier session was available; the original ZIP, the brand PDF and the current files were used.

Legend: **Done** (implemented and verified locally) · **Fixed now** (gap found in this pass and corrected) · **Needs your setup** (implemented, cannot be verified without your accounts) · **Not applicable**

## 1. Source of truth and external images

| Requirement | Status | Evidence |
|---|---|---|
| Continue from current project, no restart | Done | Only targeted edits in this pass |
| Self-host blog images (Pexels TODO) | Done | Searched `src/`, `server/`, `shared/`, `public/`, `index.html`: no Pexels or other externally hosted images. The three articles use optimised local images from the project's own artwork (`src/data/images.js`). The original Pexels photos were not downloaded; the project's own images were used instead, so there is no third-party image dependency |
| No TODOs, placeholders or mock data in production code | Done | Only remaining placeholder is the business phone number, deliberately hidden until a real one is set (`src/data/site.js`) |

## 2. Brand

| Requirement | Status | Evidence |
|---|---|---|
| Logo matches PDF and is used consistently | Done | Vector logo built from the PDF geometry; header, mobile menu, footer (reversed), admin bar, favicon, app icons, Open Graph image |
| Palette and typography | Done | Tokens in `src/styles/global.css`; Inter primary, Poppins for numbers/labels; accessible orange `#B9440F` for filled buttons |
| Restrained accents, no off-brand colours | Done | Old navy/gold/red/purple removed; axe colour-contrast checks pass on 14 pages |

## 3. Pages and routing

| Requirement | Status | Evidence |
|---|---|---|
| Every route renders unique content; refresh/direct navigation works | Done | All 17 indexable pages prerendered; e2e checks status, H1, canonical, JSON-LD for each |
| Individual resource detail pages | Not applicable | The project has no resource detail pages; Resources is a single page of notes (each note has an anchor) |
| Unknown URLs and blog slugs give a real 404 | Done | `dist/404.html` served with status 404; e2e verified |
| No duplicate breadcrumbs, navigation data or canonicals | Done | One `Breadcrumbs` component, one `navigation.js`, one canonical format (no trailing slash) |
| Vercel routing for client-side routes | Done | `vercel build` run locally; cleanUrls, 404, `/admin/*` rewrite, `/api` untouched |
| Four distinct service pages, accurate positioning, no excluded services | Done | Distinct layouts, images, FAQs and CTAs; unit test guards against excluded services; HRMS page states 360 Biz Health is not an HRMS manufacturer |
| Canonical domain not invented | Done | Uses `https://www.360bizhealth.com`, already set in the original project's `site.js` and `index.html`; configurable via `VITE_SITE_URL` |

## 4. Backend

| Requirement | Status | Evidence |
|---|---|---|
| Single backend (Vercel functions + Supabase Postgres + Supabase Auth + Resend) | Done | `api/`, `server/`, `supabase/migrations/`; no second backend |
| Lead fields: name, email, phone, company, service, size, message, consent, source, timestamp, status, notes | Done | `leads`, `lead_notes`, `audit_log` tables |
| Subject field | **Fixed now** | Was missing. Added optional "Subject" to the form, validation, new migration `20261015000200_lead_subject.sql`, API, e-mail, dashboard, search and CSV; covered by unit, API and e2e tests |
| Server validation, limits, sanitisation, spam protection, rate limiting | Done | `shared/enquiry.js`, honeypot, timing check, optional Turnstile, DB-backed limits |
| Success only after save; e-mail failure keeps the lead | Done | API and e2e tests (simulated DB, network and provider failures) |
| Statuses New, Contacted, Qualified, Converted, Lost | Done | Present. "Proposal sent" and "On hold" from the original project's list are also kept |
| Dashboard: sign-in/out, protected endpoints, overview, pagination, search, filters, details, notes, CSV, states, responsive | Done | Verified by API and e2e tests |
| Server-side authorisation and RLS | Done | `requireAdmin` on every admin endpoint; RLS on all tables; anon/authenticated denied (tested) |
| No public admin registration, documented first-admin process | Done | README section 6, `npm run admin:add` |

## 5. Status of every integration

**1. Implemented and verified locally**
- Website, routing, prerendering, SEO metadata, sitemap, robots, 404 behaviour, redirects
- Enquiry form and API, validation, spam and rate limiting, persistence in PostgreSQL 17 with the real migrations
- Admin authentication flow, authorisation, dashboard features, CSV export, audit log
- RLS and role denial for Supabase's `anon`/`authenticated` roles
- Responsive layouts (320 to 1920 px), keyboard navigation, axe accessibility checks
- Bundle secret scan, local `vercel build`

**2. Implemented but not tested against live services**
- Supabase Auth (tested against a stub with the same endpoints)
- Hosted Supabase database and connection pooler (tested against embedded PostgreSQL)
- Resend e-mail delivery (tested against a stub)
- Vercel production runtime and the daily cron schedule
- Cloudflare Turnstile (optional; code path present, no keys)

**3. Requires your credentials or configuration**
- Supabase project, migrations applied, sign-ups disabled, first admin created
- Resend verified domain and API key
- Vercel project, environment variables, domain
- Real phone/WhatsApp number in `src/data/site.js`
- Legal review of Privacy Policy, Terms and Disclaimer; verified business address

**4. Remaining incomplete features**
- None in the code. Manual checks on real iPhone/Safari and Android devices are still recommended, since automated tests used Chromium only.
