# Change log: files added, changed and removed

Baseline: `360-BizHealth-main.zip` as supplied (React 18 + Vite SPA; leads stored in the visitor's browser; `/admin` an unprotected local preview). The baseline built without errors. No transcript of the earlier implementation conversation was included with the files, so every change below was decided by inspecting the actual code rather than assumed from a transcript.

## Issues found in the baseline and fixed

| Issue | Fix |
|---|---|
| Contact form saved leads to `localStorage` and showed the thank-you page regardless; nothing reached the business | Real `POST /api/v1/enquiries` with server validation, database storage, e-mail alert; success shown only after the server confirms |
| `/admin` was public and read the visitor's own browser storage | Supabase Auth sign-in, `admin_users` allow-list, every API endpoint protected server-side |
| `/blog/<unknown>` silently showed the first article | Each article has its own route; unknown slugs return a real 404 |
| `/resources/blogs-news/:slug` duplicated blog content | 301 redirect to `/blog/:slug` |
| Canonical URLs ended in `/` while routes did not | One canonical form (no trailing slash), enforced by `trailingSlash: false` |
| `vercel.json` rewrote every path (including `/api`) to `index.html`; every URL returned 200 | Prerendered pages + `cleanUrls`; real 404 status; `/api` untouched |
| Titles/meta set only in the browser | Build-time prerendering of every page with its own head tags and JSON-LD |
| Navigation defined three times (header, mobile, footer) with different labels and colours | `src/data/navigation.js` drives all menus |
| Breadcrumb structured data had an unlinked middle item ("Services") | Breadcrumbs are Home → page; every item has a URL |
| Placeholder phone `+91 00000 00000` used in Call and WhatsApp buttons (dead links) | Hidden until a real number is configured (`phonePublished`) |
| Careers "What we offer" tiles never showed their descriptions (`desc` vs `text`) | Fixed |
| Undefined CSS variable `--paper-2`, off-brand navy/gold/red/purple theme, Newsreader/Manrope fonts, many inline styles in Blog | Brand tokens, Inter/Poppins, reusable classes |
| Blog used external Pexels images and a separate visual style | Local optimised images, shared components and tokens |
| ~12 MB of unoptimised PNG/JPG in `src/assets` | WebP variants (≈0.9 MB total, two sizes each) with `srcset`, dimensions and lazy loading |
| Unused dependencies (`tailwindcss`, `@tailwindcss/vite`, `lucide-react`) | Removed |
| React Router 6 had published advisories | Upgraded to React Router 7 (library mode; API unchanged for this app) |

## Added

```
.env.example                         placeholder configuration
api/v1/**                            10 Vercel function routes (see README §3)
server/config.js, http.js, db.js, auth.js, email.js, leads.js, csv.js, ratelimit.js, turnstile.js, log.js
server/handlers/enquiries.js, health.js, admin-session.js, admin-leads.js, cron-notifications.js
server/dev/router.js                 local /api router for dev, serve and tests
shared/enquiry.js                    validation and option lists shared by browser and API
supabase/migrations/20261015000100_initial_schema.sql
supabase/migrations/20261015000200_lead_subject.sql   optional enquiry subject (second pass)
docs/AUDIT.md                        requirement-by-requirement audit (second pass)
scripts/prerender.mjs, serve.mjs, migrate.mjs, add-admin.mjs, check-bundle.mjs, load-env.mjs, brand/make_logo.py
src/entry-server.jsx                 build-time renderer
src/data/navigation.js, serviceDetails.js, blog.js, images.js
src/lib/api.js, attribution.js, text.js
src/components/BrandLogo.jsx, Turnstile.jsx
src/pages/BlogIndex.jsx, BlogArticle.jsx
src/pages/admin/AdminApp.jsx, Login.jsx, Dashboard.jsx, LeadDetail.jsx
src/styles/admin.css
src/assets/brand/logo.svg, logo-reverse.svg
src/assets/images/*.webp             24 optimised images (12 × lg/sm)
public/favicon.svg, apple-touch-icon.png, icon-192.png, icon-512.png, og-image.png, site.webmanifest
tests/unit/*, tests/api/*, tests/e2e/*, tests/helpers/*
playwright.config.js
docs/DEPLOYMENT.md, OPERATIONS.md, TEST-REPORT.md, CHANGES.md
assets-source/                       original images moved here from src/assets (not bundled)
```

## Changed

```
README.md, package.json, package-lock.json, vercel.json, vite.config.js, index.html, .gitignore
public/favicon.ico                   new brand mark
src/main.jsx                         fonts, hydration of prerendered HTML, legacy #/ URLs
src/App.jsx                          route table, head management, lazy-loaded admin, legacy redirects
src/routes.jsx                       per-route metadata and structured data, article routes
src/lib/seo.js                       pure head builder used at build time and in the browser
src/lib/analytics.js, contact.js
src/data/site.js                     configurable origin, phonePublished flag (content unchanged)
src/styles/global.css                full rebrand, responsive rules
src/components/                      Breadcrumbs, Button, ContactForm, ContactLinks, CtaBand, FaqList, Footer,
                                     Header, HeroRing, Layout, Lists, MobileBar, MobileNav, PageHead, Reveal,
                                     Section, Tiles
src/pages/                           Home, ServicePage, About, Contact, Careers, Faq, Resources, ThankYou,
                                     NotFound, Privacy (accurate list of data collected)
```

Unchanged: `src/data/services.js`, `src/data/resources.js`, `src/pages/Terms.jsx`, `Disclaimer.jsx`, `LegalPage.jsx`. All service, FAQ, resource and legal copy, and all three blog articles in full, are preserved.

## Removed

```
src/pages/Blog.jsx                   replaced by BlogIndex.jsx + BlogArticle.jsx + data/blog.js (content moved intact)
src/pages/Admin.jsx                  replaced by pages/admin/*
src/lib/leads.js                     localStorage lead store (replaced by the API)
src/components/BrandMark.jsx         old navy/gold mark (replaced by BrandLogo)
src/components/PillarCard.jsx        folded into Home.jsx
src/components/RouteMeta.jsx         replaced by the Page wrapper in App.jsx
public/_redirects                    Netlify catch-all; hosting is Vercel
src/assets/*.png|*.jpg               moved to assets-source/ (originals kept)
dist/                                build output is generated on deploy, not committed
```

Original images not used on the site (`envelope`, `gauge`, `group-insurance`, `insurance-advisory`, `integrate`, `realtime-claims`, `unified`, `hero-dashboard`, `hero-illustration`, `herophoto`, `web-seo`, the old logo files) are in `assets-source/`. Several relate to services outside the current scope (insurance, SEO) or show invented dashboard figures, so they were not used.
