/*
 * Every public route with its page metadata. This table drives the router, the
 * prerendered HTML (scripts/prerender.mjs), sitemap.xml and per-page structured data.
 */
import { SERVICES, SERVICE_SLUGS } from "./data/services.js";
import { SERVICE_NAV } from "./data/navigation.js";
import { HOME_FAQS } from "./data/site.js";
import { ARTICLES } from "./data/blog.js";
import { faqSchema, canonicalUrl, ORG_ID, SITE_ID, absoluteUrl } from "./lib/seo.js";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Resources from "./pages/Resources.jsx";
import BlogIndex from "./pages/BlogIndex.jsx";
import BlogArticle from "./pages/BlogArticle.jsx";
import Careers from "./pages/Careers.jsx";
import Faq from "./pages/Faq.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import NotFound from "./pages/NotFound.jsx";

const page = (path, type, name) => ({ "@type": type, "@id": canonicalUrl(path) + "#webpage", url: canonicalUrl(path), name, isPartOf: { "@id": SITE_ID() } });

const serviceRoutes = SERVICE_SLUGS.map((slug) => {
  const s = SERVICES[slug];
  const nav = SERVICE_NAV.find((n) => n.slug === slug);
  return {
    path: "/" + slug,
    element: <ServicePage slug={slug} />,
    meta: {
      title: s.title,
      desc: s.desc,
      crumbs: [[nav.short, "/" + slug]],
      schema: [
        {
          "@type": "Service",
          name: s.h1,
          description: s.desc,
          serviceType: nav.label,
          url: canonicalUrl("/" + slug),
          provider: { "@id": ORG_ID() },
          areaServed: { "@type": "Country", name: "India" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: s.provideTitle,
            itemListElement: s.provide.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: p[0], description: p[1] } })),
          },
        },
        faqSchema(s.faqs),
      ],
    },
  };
});

const articleRoutes = ARTICLES.map((a) => ({
  path: "/blog/" + a.slug,
  element: <BlogArticle article={a} />,
  meta: {
    title: `${a.title} | 360 Biz Health`,
    desc: a.description,
    crumbs: [["Blog", "/blog"], [a.title, "/blog/" + a.slug]],
    ogType: "article",
    published: a.datePublished,
    modified: a.dateModified || a.datePublished,
    schema: [
      {
        "@type": "BlogPosting",
        "@id": canonicalUrl("/blog/" + a.slug) + "#article",
        mainEntityOfPage: canonicalUrl("/blog/" + a.slug),
        headline: a.title,
        description: a.description,
        image: [absoluteUrl(a.image.lg)],
        datePublished: a.datePublished,
        dateModified: a.dateModified || a.datePublished,
        articleSection: a.category,
        inLanguage: "en-IN",
        author: { "@type": "Organization", name: a.author, url: canonicalUrl("/about") },
        publisher: { "@id": ORG_ID() },
      },
      faqSchema(a.faqs),
    ],
  },
}));

export const ROUTES = [
  {
    path: "/",
    element: <Home />,
    meta: {
      title: "360 Biz Health | HRMS, Payroll, Compliance & Business Solutions",
      desc: "360 Biz Health helps startups, SMEs, MSMEs and enterprises with HRMS software selection and implementation, payroll and TDS, labour compliance, business registration, IPR and corporate retreats.",
      crumbs: [],
      schema: [page("/", "WebPage", "360 Biz Health"), faqSchema(HOME_FAQS)],
    },
  },
  {
    path: "/about",
    element: <About />,
    meta: {
      title: "About 360 Biz Health | Business Solutions Partner",
      desc: "360 Biz Health is an independent business advisory and channel-partner company coordinating HR technology, payroll, compliance, business setup and corporate experiences through one point of contact.",
      crumbs: [["About us", "/about"]],
      schema: [page("/about", "AboutPage", "About 360 Biz Health")],
    },
  },
  ...serviceRoutes,
  {
    path: "/contact",
    element: <Contact />,
    meta: {
      title: "Contact 360 Biz Health | HRMS, Payroll & Business Services",
      desc: "Talk to 360 Biz Health about HRMS selection, payroll outsourcing, statutory compliance, business registration, trademark and ISO support, or a corporate retreat.",
      crumbs: [["Contact", "/contact"]],
      schema: [page("/contact", "ContactPage", "Contact 360 Biz Health")],
    },
  },
  {
    path: "/blog",
    element: <BlogIndex />,
    meta: {
      title: "Blog & Practical Guides on HR, Payroll and Compliance | 360 Biz Health",
      desc: "Practical frameworks, articles and operational guides on HRMS, payroll compliance, business setup and corporate offsites.",
      crumbs: [["Blog", "/blog"]],
      schema: [{
        "@type": "Blog",
        "@id": canonicalUrl("/blog") + "#blog",
        url: canonicalUrl("/blog"),
        name: "360 Biz Health Blog",
        publisher: { "@id": ORG_ID() },
        blogPost: ARTICLES.map((a) => ({ "@id": canonicalUrl("/blog/" + a.slug) + "#article", headline: a.title, url: canonicalUrl("/blog/" + a.slug), datePublished: a.datePublished })),
      }],
    },
  },
  ...articleRoutes,
  {
    path: "/careers",
    element: <Careers />,
    meta: {
      title: "Careers at 360 Biz Health | Join Our Team",
      desc: "Explore job opportunities at 360 Biz Health across HR technology, payroll operations, client advisory and corporate experiences.",
      crumbs: [["Careers", "/careers"]],
      schema: [page("/careers", "WebPage", "Careers at 360 Biz Health")],
    },
  },
  {
    path: "/resources",
    element: <Resources />,
    meta: {
      title: "Resources | Practical Notes on HR, Payroll & Compliance | 360 Biz Health",
      desc: "Short practical notes on choosing an HRMS, running a payroll calendar, operating across states, trademark basics and planning a workation.",
      crumbs: [["Resources", "/resources"]],
      schema: [page("/resources", "CollectionPage", "Resources")],
    },
  },
  {
    path: "/faq",
    element: <Faq />,
    meta: {
      title: "FAQ | HRMS, Payroll, Compliance, Setup & Retreats | 360 Biz Health",
      desc: "Answers on HRMS selection and implementation, payroll outsourcing, PF, ESIC, PT and LWF, labour compliance, business registration, trademark, ISO and corporate retreats.",
      crumbs: [["FAQ", "/faq"]],
      schema: [faqSchema(HOME_FAQS.concat(...SERVICE_SLUGS.map((k) => SERVICES[k].faqs)))],
    },
  },
  {
    path: "/thank-you",
    element: <ThankYou />,
    meta: { title: "Thank you | 360 Biz Health", desc: "Your enquiry has been received by 360 Biz Health.", noindex: true, crumbs: [["Thank you", "/thank-you"]] },
  },
  {
    path: "/privacy-policy",
    element: <Privacy />,
    meta: { title: "Privacy Policy | 360 Biz Health", desc: "How 360 Biz Health collects, uses, shares and protects the information you provide.", crumbs: [["Privacy policy", "/privacy-policy"]] },
  },
  {
    path: "/terms-and-conditions",
    element: <Terms />,
    meta: { title: "Terms & Conditions | 360 Biz Health", desc: "The terms on which the 360 Biz Health website and services are provided.", crumbs: [["Terms & conditions", "/terms-and-conditions"]] },
  },
  {
    path: "/disclaimer",
    element: <Disclaimer />,
    meta: { title: "Disclaimer | 360 Biz Health", desc: "What the 360 Biz Health website is, and what it is not.", crumbs: [["Disclaimer", "/disclaimer"]] },
  },
].map((r) => ({ ...r, meta: { ...r.meta, path: r.path } }));

export const ADMIN_META = { path: "/admin", title: "Lead dashboard | 360 Biz Health", desc: "Internal lead management for authorised 360 Biz Health staff.", noindex: true };

export const NOT_FOUND_META = { path: "/404", title: "Page not found | 360 Biz Health", desc: "The page you are looking for does not exist.", noindex: true };
export const NOT_FOUND_ELEMENT = <NotFound />;

/* Old URLs → canonical destinations. Mirrored as 301s in vercel.json. */
export const LEGACY_REDIRECTS = [
  { from: "/resources/blogs-news/:slug", to: "/blog/:slug" },
  { from: "/resources/blogs-news", to: "/blog" },
  { from: "/privacy", to: "/privacy-policy" },
  { from: "/terms", to: "/terms-and-conditions" },
];
