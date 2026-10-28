# 360 Biz Health: Website, Enquiry API and Lead CRM Dashboard

A modern, high-performance web platform built with **React 18 + Vite 5 + React Router 7**, statically pre-rendered for search engines (SSG), powered by a consolidated **Vercel Serverless API**, a **Supabase PostgreSQL 17** database with Row Level Security (RLS), **Supabase Auth** for staff sign-in, and **Resend** for transactional lead notification emails.

| Component | Technology | Location |
|---|---|---|
| **Public Website** | React 18, Vite 5, React Router 7, Pre-rendered HTML (SSG) | `src/`, `index.html` |
| **Brand Design System** | Self-hosted Inter + Poppins, Tailored Brand Palette, Vector Logos | `src/styles/global.css`, `src/assets/brand/` |
| **Unified Serverless API** | Node.js Serverless Function with Central Router (`/api/*`) | `api/index.js` -> `server/router.js` |
| **Database & Schema** | Supabase PostgreSQL 17 with RLS & Versioned Migrations | `supabase/migrations/` |
| **Staff & Admin Auth** | Supabase Auth (Email + Password) + HttpOnly Cookies + Admin Allow-list | `server/auth.js`, `/admin` |
| **Lead Notifications** | Resend HTTP API + Delivery Status + Automated Vercel Cron Retries | `server/email.js`, `vercel.json` |
| **Testing Suite** | Vitest (Unit & API with Embedded Postgres), Playwright (E2E & Axe A11y) | `tests/` |

---

## 1. Key Features & Capabilities

### 🌐 Public Website & Marketing
- **Services Catalog**: Dedicated pages for HRMS Selection & Implementation, Payroll & TDS Processing, Labour Law & Statutory Compliance, Business Registration & Trademark (IPR).
- **Corporate Retreats & Workations** (`/corporate-retreats-workations`): Dedicated destination retreat planner with curated format tiers (Mountain, Forest, Coastal, Desert, Alpine), interactive itinerary outlines, and specialized enquiry forms.
- **Dynamic SEO & Structured Data**: Build-time static prerendering (`scripts/prerender.mjs`) generates HTML files with custom `<head>` tags, Open Graph, Twitter cards, and Schema.org JSON-LD structured data (`Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Service`).
- **Dynamic Sitemap & Robots**: Automated `robots.txt` and a dynamic `/sitemap.xml` combining static public routes and published blog posts with accurate `lastmod` dates.
- **Spam Protection & Rate Limiting**: Optional Cloudflare Turnstile bot verification combined with database-backed IP and email rate limiting (`public.rate_limit_hit`).

### 📊 Lead Management & CRM Dashboard (`/admin`)
- **Executive Overview**: Real-time KPI tiles (Total Leads, New Enquiries, 7-Day Volume, Follow-ups Due, Converted Leads, Published Posts), 30-day enquiry trend chart, status distribution mix, and live audit activity feed.
- **Advanced Lead Filtering & Search** (`/admin/leads`): Instant multi-field search (Name, Company, Email, Phone, Reference Code, Subject) and multi-dimensional filters (Status, Service vertical, Retreat package, Email delivery status, Follow-up due date).
- **Comprehensive Lead Details**: Detailed contact info, retreat preferences, client message, assignment tracker, internal private notes, source attribution parameters (UTM, referrer, landing page), and full audit history.
- **One-Click CSV Export**: Download filtered or complete lead datasets in CSV format (`/api/v1/admin/leads/export`).
- **Email Delivery & Manual Retry**: Visual status badges (`sent`, `failed`, `not_configured`) for transactional notifications, with an instant one-click retry trigger for administrators.

### ✍️ Database-Backed Blog & Content CMS (`/admin/blog`)
- **Markdown Authoring**: Full Markdown editor with live side-by-side preview, formatting toolbar, and automatic table of contents heading anchors.
- **Direct Image Uploads**: Built-in image upload tool storing images directly in PostgreSQL (`blog_media`) with immutable caching served via `/api/v1/media/:id` within strict Content Security Policy bounds.
- **SEO Optimization**: Custom SEO title, description, slug generator, and live Google Search Snippet preview.
- **Structured Content Blocks**: Dedicated builders for Key Takeaways and FAQ accordions (automatically parsed into JSON-LD `FAQPage` schema on public pages).
- **Publishing Safeguards**: Draft vs. Published status toggles, publication scheduling date, and concurrency protection (`expectedUpdatedAt` prevents race condition overwrites).

### 👥 Team & Access Management (`/admin/users`)
- **Role-Based Access Control**:
  - `admin`: Full administrative control (user management, CSV export, publishing/unpublishing/deleting blog posts, notification retries).
  - `staff`: Lead management, adding notes, drafting blog posts, and image uploads.
- **In-App Management**: Administrators can create new accounts, change user roles, reset passwords, suspend or reactivate accounts, and view last sign-in timestamps directly from the UI.
- **Security Scoping**: Sessions use encrypted, HttpOnly, SameSite=Strict, Secure cookies (`bh_admin_at`, `bh_admin_rt`) scoped exclusively to `/api/v1/admin`.

---

## 2. Architecture & Vercel Hobby Plan Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                 Incoming Request (Vercel Edge)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   Static Assets & SSG HTML              API Route (/api/*)
    (dist/*, cleanUrls)           Rewrite -> /api?_vercel_path=*
                                                  │
                                                  ▼
                                      ┌───────────────────────┐
                                      │     api/index.js      │
                                      │ (Single Serverless Fn)│
                                      └───────────┬───────────┘
                                                  │
                                                  ▼
                                      ┌───────────────────────┐
                                      │   server/router.js    │
                                      │  (Central Fast Router)│
                                      └───────────┬───────────┘
                                                  │
                ┌───────────────────┬─────────────┴─────┬──────────────────┐
                ▼                   ▼                   ▼                  ▼
        handlers/health.js  handlers/enquiries.js  handlers/auth.js  handlers/leads.js...
```

Vercel's **Hobby (Free) Plan** enforces a strict limit of **no more than 12 Serverless Functions** per deployment.
- **The Solution**: All 21 API endpoints, crons, dynamic blog rendering, and media delivery routes are compiled into a **single consolidated Serverless Function** (`api/index.js`) powered by an internal router (`server/router.js`).
- **Result**: Exactly **1 Serverless Function** is registered on Vercel, completely bypassing function-count limits, eliminating cross-function cold starts, and sharing database connection pools efficiently.

---

## 3. Project Structure

```
api/
  index.js                  Single Vercel serverless function entry point
server/
  router.js                 Central request router mapping static and dynamic routes
  config.js                 Server-only environment configuration
  http.js                   HTTP helpers, HttpError, cookie handling, CORS & CSRF checks
  db.js                     pg database client pool (Supabase transaction pooler)
  auth.js                   Supabase Auth, session cookies, and admin_users repository
  leads.js                  Lead repository (queries, updates, status transitions, notes)
  blog.js                   Blog repository (posts, media uploads, related articles)
  email.js                  Resend transactional email client
  csv.js                    Streaming CSV export formatter
  ratelimit.js              Distributed PostgreSQL rate-limiting
  turnstile.js              Cloudflare Turnstile server validation
  log.js                    Structured JSON logger
  dev/
    router.js               Local API middleware for Vite dev server and tests
  handlers/
    health.js               GET /api/v1/health
    enquiries.js            POST /api/v1/enquiries
    sitemap.js              GET /sitemap.xml (dynamic sitemap)
    blog-page.js            GET /blog and /blog/:slug (server-rendered view)
    cron-notifications.js   GET /api/v1/cron/retry-notifications
    admin-session.js        POST /api/v1/admin/session (sign in), GET (me), DELETE (sign out)
    admin-overview.js       GET /api/v1/admin/overview
    admin-leads.js          List, detail, notes, export, and notification retry
    admin-blog.js           Blog post collection, items, status, and media uploads
    admin-users.js          User listing, creation, role change, password reset, delete
    public-blog.js          Public blog list, single post, and media binary streaming
shared/
  enquiry.js                Enquiry schema validation and options shared by client and server
  blog.js                   Blog post validation rules
  markdown.js               Markdown parser and HTML sanitizer
supabase/
  migrations/               Versioned SQL migrations (schema, tables, RLS, functions)
src/
  data/                     site.js, navigation.js, services.js, serviceDetails.js, retreats.js, images.js
  lib/                      api.js (fetch wrapper), seo.js (head tags & JSON-LD), blog.js
  components/               Header, Footer, Navigation, Forms, Cards, Layout, BrandLogo
  pages/                    Public marketing pages (Home, Services, Retreats, About, Contact, Blog)
  pages/admin/              AdminApp shell, Overview, Leads, LeadDetail, BlogList, BlogEditor, Users, Login
scripts/
  prerender.mjs             Build-time SSG pre-renderer
  serve.mjs                 Production-identical preview server
  migrate.mjs               Database migration runner
  add-admin.mjs             CLI tool for bootstrapping initial admin users
  check-bundle.mjs          Build bundle security and leak audit
tests/                      Unit tests, API integration tests, and Playwright E2E suites
```

---

## 4. Getting Started Locally

### Prerequisites
- **Node.js**: `v22.x` or later (`node -v`)
- **Package Manager**: `npm 10+` or `pnpm`

### Installation & Local Run
```bash
# 1. Install dependencies
npm ci

# 2. Setup environment variables
cp .env.example .env
# Fill in your database and Supabase keys in .env

# 3. Start local development server
npm run dev
# Vite runs at http://localhost:5173 with API handlers integrated
```

### Production Build & Preview
```bash
# Compile client bundle, SSR bundle, and run static prerendering:
npm run build

# Start production-identical preview server:
npm run serve
# Server runs at http://localhost:4173 with clean URLs, redirects, and real 404s
```

---

## 5. Environment Variables

All variables are documented in [`.env.example`](.env.example). Variables starting with `VITE_` are bundled into the frontend; all others are strictly server-side secrets.

| Variable | Required | Description |
|---|---|---|
| `SITE_URL` | Yes | Canonical production URL (e.g. `https://www.360bizhealth.com`) |
| `VITE_SITE_URL` | Yes | Same canonical URL for client-side SEO and Open Graph tags |
| `DATABASE_URL` | Yes | Supabase **Transaction Pooler** connection string (Port `6543`) |
| `DATABASE_SSL` | No | SSL mode: `require` (default), `verify`, or `disable` (local) |
| `MIGRATION_DATABASE_URL` | For migrations | Supabase **Session Pooler** connection string (Port `5432`) |
| `SUPABASE_URL` | Yes | Supabase Project API URL (`https://<project-ref>.supabase.co`) |
| `SUPABASE_ANON_KEY` | Yes | Supabase Anonymous (public) key for authentication |
| `RESEND_API_KEY` | For Email | Resend API key for transactional emails |
| `EMAIL_FROM` | For Email | Verified sender address (e.g. `360 Biz Health <leads@360bizhealth.com>`) |
| `LEAD_NOTIFICATION_TO` | For Email | Comma-separated email addresses to receive new lead alerts |
| `IP_HASH_SALT` | Yes | Random salt string for anonymized IP rate-limiting |
| `CRON_SECRET` | Yes | Authorization secret for Vercel Cron retry endpoints |
| `VITE_TURNSTILE_SITE_KEY` | Optional | Cloudflare Turnstile public site key |
| `TURNSTILE_SECRET_KEY` | Optional | Cloudflare Turnstile secret verification key |

> **Security Note**: Never expose the Supabase `service_role` key. It is not used or needed in this codebase.

---

## 6. Database Migrations & Initial Setup

1. Create a project in [Supabase](https://supabase.com).
2. Apply the SQL migrations in `supabase/migrations/` in numerical order:
   - `20261015000100_initial_schema.sql` (Tables, constraints, indexes, RLS, rate limiting)
   - `20261015000200_lead_subject.sql` (Optional subject column support)
   - `20261027000100_crm_blog.sql` (CRM retreat fields, blog posts, media storage)
   - `20261027000200_seed_blog_posts.sql` (Seed migrated articles)
3. To run migrations via script:
   ```bash
   npm run db:migrate
   ```

### Creating the First Administrator
Because there is deliberately **no public registration**:
1. In Supabase Dashboard -> **Authentication** -> **Users**, click **Add user** (enter email & password, check *Auto Confirm*).
2. In Supabase Dashboard -> **Authentication** -> **Providers** -> **Email**, disable **"Allow new users to sign up"**.
3. Grant admin access via CLI:
   ```bash
   npm run admin:add -- your-email@company.com admin
   ```
4. Sign in at `https://www.360bizhealth.com/admin`.

---

## 7. Automated Testing Suite

```bash
# Run unit tests (Vitest)
npm run test:unit

# Run API integration tests (Vitest against embedded PostgreSQL)
npm run test:api

# Run Playwright End-to-End & Axe accessibility audits
npm run build && npm run test:e2e

# Audit client bundle for sensitive secrets or server-only env variables
npm run check:bundle

# Run complete verification pipeline
npm run test:all
```

---

## 8. Deployment to Vercel

1. Push your repository to GitHub / GitLab and import it into **Vercel**.
2. Configure project settings:
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
3. Add all required environment variables in **Project Settings -> Environment Variables**.
4. Configure your primary custom domain (e.g. `www.360bizhealth.com`) and redirect apex `360bizhealth.com` to `www`.
5. Deployments will automatically build static pages, compile the unified serverless API, and enable daily notification retries via Vercel Cron.
