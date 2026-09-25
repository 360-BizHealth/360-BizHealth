# 360 Biz Health (React)

A React rebuild of the original single-file `360bizhealth.html`. Content, layout, visual hierarchy, styles and behaviour are carried over as they were; only the structure has changed.

## Run it

```
npm install
npm run dev        # local development
npm run build      # production build into /dist
npm run preview    # serve the production build
```

## What changed from the original

The original rendered every page by concatenating HTML strings into `<main>` and used hash URLs (`#/about`). This version uses React components and real URLs (`/about`) through React Router. Everything else is the same: the stylesheet in `src/styles/global.css` is the original CSS copied verbatim, and all page copy is unchanged.

Because the site now uses real URLs, the host must send every path to `index.html`. `public/_redirects` (Netlify) and `vercel.json` (Vercel) already do this. On Apache or Nginx, add an equivalent fallback rule.

## Structure

```
src/
  data/          site.js (business details, nav, form options, home FAQs)
                 services.js (all four service pages), resources.js
  lib/           analytics.js (dataLayer events), contact.js (WhatsApp/tel/mail links),
                 seo.js (title, meta, canonical, JSON-LD), leads.js (lead storage, UTM capture)
  components/    Layout, Header, MobileNav, Footer, MobileBar, PageHead, Breadcrumbs,
                 Section, Reveal, Button, ContactLinks, Tiles, Lists (Flow, Steps, ListCard),
                 FaqList, CtaBand, HeroRing, PillarCard, ContactForm, RouteMeta
  pages/         Home, ServicePage, About, Contact, Resources, Faq, ThankYou,
                 Privacy, Terms, Disclaimer (share LegalPage), Admin, NotFound
  routes.jsx     every route with its title, description and breadcrumb data
```

All four service pages are rendered by one `ServicePage` template from `data/services.js`, so editing a service means editing data, not markup.

## Before launch

1. Replace the placeholder phone and WhatsApp numbers in `src/data/site.js` (`BIZ`). Set `addressPublished: true` once the verified address is filled in.
2. The contact form stores leads in the visitor's browser so the flow can be tested. Replace `saveLead()` in `src/lib/leads.js` with a POST to your backend (server-side validation, rate limiting, CAPTCHA, database).
3. `/admin` is a preview only. Put it behind authentication, or remove its entry from `src/routes.jsx`, before going live.
4. Page titles and meta tags are set in the browser. If search visibility matters, deploy with prerendering or move to a server-rendered React framework such as Next.js; the components port across unchanged.
