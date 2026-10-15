# Test report

Last run on 15 October 2026, after the second-pass changes (Node 22.22, Linux, Chromium via Playwright 1.64) against this exact source tree, after a clean `npm ci`.

| Suite | Command | Result |
|---|---|---|
| Unit tests (validation, CSV, SEO, routes, content) | `npm run test:unit` | **58 passed**, 0 failed |
| API integration (real handlers + PostgreSQL 17 with the production migration) | `npm run test:api` | **31 passed**, 0 failed |
| Production build + prerender | `npm run build` | **Passed**: 18 routes, 404.html, admin.html, sitemap (17 URLs), robots.txt |
| Bundle secret scan | `npm run check:bundle` | **Passed**: 27 files, no secrets or server-only names |
| End-to-end (Playwright, production build) | `npm run test:e2e` | **54 passed**, 0 failed |
| Accessibility (axe-core, WCAG 2.0/2.1/2.2 A+AA rules, 14 pages × 2 widths) | part of e2e | **0 violations** |
| Vercel build (`vercel build` CLI v48, local) | n/a | **Passed**: static output, 10 functions, routes, cron detected |
| `npm audit --omit=dev` | n/a | **0 vulnerabilities** in production dependencies |

## What the tests cover

**Enquiry API**: valid submission stored with normalised email/phone, optional subject and filtered UTM data; audit entry; notification e-mail sent with HTML escaped; idempotent resubmission (same `submissionId`) and 24-hour content de-duplication; field-level 422 errors with nothing stored; honeypot and too-fast rejection; 415/400/413/405 for malformed requests; cross-site `Origin` rejected (403); rate limit (6th request → 429 with `Retry-After`); e-mail provider outage keeps the lead (`failed`) and the authenticated cron retries it to `sent`; cron rejects requests without the secret; `not_configured` recorded when e-mail is not set up; honest 503 when the database is not configured.

**Admin API**: every protected endpoint returns 401 without a session and leaks no data; wrong password 401; valid Supabase user without `admin_users` row 403 (and no cookies set); sign-in requires the CSRF header and same-site origin; cookies are HttpOnly/Secure/SameSite=Strict/path-scoped and tokens never appear in bodies; expired access token is refreshed from the refresh cookie; sign-out clears the session; deactivating `admin_users` blocks the next request; pagination, status/service/date filters, search, stats; SQL-injection and wildcard strings treated literally; status/assignee/follow-up update with audit trail and `last_contacted_at`; CSRF header required for PATCH; invalid patch 422; notes; 404 for unknown/malformed ids; CSV export and e-mail retry limited to the admin role; CSV formula injection neutralised; exports logged.

**Database**: `anon` and `authenticated` roles denied on every table and the rate-limit function; RLS enabled on all tables; check constraints enforced.

**Website (Playwright)**: every sitemap page returns 200 with prerendered HTML, one H1, the correct canonical, `index` robots, a single valid JSON-LD graph, alt attributes on all images and no console errors or hydration warnings; unknown pages and blog slugs return a real 404 with noindex; trailing-slash, `.html`, legacy blog, `/privacy`, `/terms` and old `#/` URLs redirect correctly; `/api` is not swallowed by the frontend; client-side navigation updates title/canonical and moves focus to `<main>`; each service page has a distinct H1 and hero image, breadcrumbs, FAQ and a CTA that pre-selects the service; blog search, category filters, empty state and table of contents; mobile menu (focus on open, focus trap, Escape, navigation, same links as desktop); desktop Services menu by keyboard and mouse; skip link; no placeholder phone/WhatsApp links; every internal link on key pages resolves.

**Forms (Playwright)**: client validation with accessible errors and focus; a real submission from a service page lands in the database with the correct service, size, phone and source, and the Thank-you page shows the stored reference; simulated 500, network failure and server field errors are shown to the visitor and never turned into success.

**Admin dashboard (Playwright)**: no data without sign-in (page and API); wrong password message; sign in, stats, filter by service, search by reference, open lead, update status/assignee/date, add note (verified in the database), reload keeps the session, CSV download contents, sign out invalidates the API; staff role has no export; phone layout has no horizontal scroll and the table becomes labelled cards.

**Responsive**: no horizontal overflow on 16 pages at 320, 375, 414, 768, 1024, 1366, 1440 and 1920 px; side gutters at 320 px; 44 px touch targets in the mobile header/bar; reduced-motion users see all content immediately.

## Not tested here (needs your accounts)

These integrations are fully implemented and exercised against faithful local stubs, but have **not** been run against the real services because no credentials were available:

| Item | How it was tested | What to do |
|---|---|---|
| Supabase Auth (real project) | Local HTTP stub implementing the same `/auth/v1/token`, `/user`, `/logout` endpoints | Step E8 in `docs/DEPLOYMENT.md` |
| Supabase PostgreSQL (hosted) | Embedded PostgreSQL 17 with the real migration and Supabase-style roles | Steps B and E1 |
| Resend e-mail delivery | Local stub of `POST /emails` (success and failure modes) | Steps A, E6, E7 |
| Cloudflare Turnstile | Code path present; disabled in tests (no keys) | Optional; set both keys and submit a test enquiry |
| Vercel production runtime and cron schedule | `vercel build` locally + a Vercel-compatible local server | Deploy and run the checks in section E |
| Real phones/tablets, Safari and Firefox | Chromium only, at phone/tablet/desktop viewport sizes | Quick manual check on an iPhone (Safari) and an Android phone |

## Known limitations

- The current React bundle is about 318 KB (≈102 KB gzip) because all page content ships in one chunk; acceptable for this site size, and pages render instantly from prerendered HTML.
- Service images are the illustrative artwork supplied in the original project (optimised to WebP); replace them in `src/data/images.js` if you commission new photography.
- Development-only tooling (Vite 5, Vitest 2) has advisories affecting the local dev server only.
