# Test report

Last full run: 27 October 2026, on the production build (`npm run build`), Node 22, PostgreSQL 17 (embedded, all migrations applied), Supabase Auth and Resend replaced by local HTTP stubs.

| Suite | Command | Result |
|---|---|---|
| Unit | `npx vitest run tests/unit` | 61 / 61 passed |
| API integration (real handlers + real PostgreSQL) | `npx vitest run tests/api` | 50 / 50 passed |
| End-to-end (Playwright, Chromium) | `npm run test:e2e` | 66 / 68 passed, 2 failed (see below) |
| Bundle secret check | `npm run check:bundle` | passed (22 files) |

## What the new tests cover

- **Lead capture** (`tests/api/crm.test.js`, `tests/e2e/crm.spec.js`, `tests/e2e/retreats.spec.js`): the contact form and the Corporate Retreats form both create a database record that appears in Admin → Leads (dashboard recent leads, search by reference, Enquiries view) and opens in the lead view; the selected retreat package and retreat details are stored as structured fields, shown in the lead view, filterable by package and included in the CSV export; unknown packages are rejected; failed submissions never show success; nothing private is returned by the public endpoint.
- **Blog CMS**: drafts are invisible to the public (`/blog/:slug` 404, not listed, not in the sitemap); publishing makes the post appear on `/blog`, at its URL (server-rendered HTML with canonical, BlogPosting JSON-LD and heading anchors) and in `/sitemap.xml`; editing a live post updates the public page; unpublishing returns 404; deleting removes the row and is logged; slug uniqueness; validation; stale-edit protection; staff can draft but not publish, edit live posts or delete; raw HTML / `javascript:` links / off-site images in content are neutralised; image uploads accept only real JPEG/PNG/WebP up to 2 MB (type checked from bytes) and are served same-origin.
- **Existing articles**: the three original articles are migrated with their URLs, 12/10/9 sections, FAQs and section anchors (`#complaint-procedure-and-timelines` still works).
- **Access control**: every CMS and dashboard endpoint returns 401 without a session; writes need the CSRF header and same-site origin; Users & Access is admin-only; the new tables deny the Supabase `anon` and `authenticated` roles and have RLS enabled.
- **Dashboard**: overview figures equal live database counts; 30-day trend sums to the lead total; package counts.
- **Admin accessibility**: axe (WCAG 2.1 AA) on Dashboard, Leads, Blog list, Blog editor, Retreat Packages and Users: **0 violations**.
- **Corporate Retreats page**: form ≈ 42% / FAQ ≈ 58% on desktop, stacked on phones with no horizontal scroll; Explore Package dialog (keyboard, Escape, focus return); Enquire Now preselects the package from the card and from the dialog.

## Known failures (not introduced by this change)

`tests/e2e/a11y.spec.js` at 1366 px and 375 px: axe `color-contrast` on the **orange primary buttons** across the public site (white text on `#F26423` = 3.17:1; WCAG AA needs 4.5:1 for this text size), plus two older items on service pages (hero paragraph and an eyebrow on a dark panel). The brand orange was kept on the public site as requested. Switching filled buttons to the darker `#B9440F` (already used inside the dashboard) would clear these.
