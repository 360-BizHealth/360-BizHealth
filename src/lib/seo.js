import { BIZ, HOME_FAQS } from "../data/site.js";
import { SERVICES, SERVICE_SLUGS } from "../data/services.js";

const canonicalUrl = (path) => BIZ.origin + (path === "/" ? "/" : path + "/");

function setMeta(name, val, attr = "name") {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", val);
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = data ? JSON.stringify(data) : "{}";
}

export function applyMeta(route, path) {
  const url = canonicalUrl(path);
  document.title = route.title;
  setMeta("description", route.desc);
  setMeta("robots", route.noindex ? "noindex, nofollow" : "index, follow");
  setMeta("og:title", route.title, "property");
  setMeta("og:description", route.desc, "property");
  setMeta("og:url", url, "property");
  setMeta("twitter:title", route.title);
  setMeta("twitter:description", route.desc);
  const link = document.head.querySelector('link[rel="canonical"]');
  if (link) link.setAttribute("href", url);
}

export function applyStaticSchema() {
  const org = {
    "@type": "Organization", "@id": BIZ.origin + "/#organization", name: BIZ.name, url: BIZ.origin + "/",
    description: "A multi-service business solutions company providing HRMS advisory and implementation, payroll and TDS services, labour compliance support, business registration and IPR support, and corporate retreat planning.",
    email: BIZ.email, telephone: BIZ.phoneHref,
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: BIZ.email, telephone: BIZ.phoneHref, areaServed: "IN", availableLanguage: ["en", "hi"] }],
  };
  if (BIZ.addressPublished) {
    org.address = {
      "@type": "PostalAddress", streetAddress: BIZ.address.street, addressLocality: BIZ.address.locality,
      addressRegion: BIZ.address.region, postalCode: BIZ.address.postal, addressCountry: BIZ.address.country,
    };
  }
  setJsonLd("ld-static", {
    "@context": "https://schema.org",
    "@graph": [org, { "@type": "WebSite", "@id": BIZ.origin + "/#website", url: BIZ.origin + "/", name: BIZ.name, publisher: { "@id": BIZ.origin + "/#organization" }, inLanguage: "en-IN" }],
  });
}

export function applyPageSchema(route, path) {
  const url = canonicalUrl(path);
  const graph = [];
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: BIZ.origin + "/" }];
  (route.crumbs || []).forEach((c, i) => {
    const it = { "@type": "ListItem", position: i + 2, name: c[0] };
    if (c[1]) it.item = BIZ.origin + c[1];
    items.push(it);
  });
  if (items.length > 1) graph.push({ "@type": "BreadcrumbList", itemListElement: items });

  if (path === "/about") graph.push({ "@type": "AboutPage", url, name: route.title, isPartOf: { "@id": BIZ.origin + "/#website" } });
  if (path === "/contact") graph.push({ "@type": "ContactPage", url, name: route.title, isPartOf: { "@id": BIZ.origin + "/#website" } });

  if (route.service) {
    const s = SERVICES[route.service];
    graph.push({
      "@type": "Service", name: s.h1, description: s.desc, serviceType: s.nav, url,
      provider: { "@id": BIZ.origin + "/#organization" }, areaServed: { "@type": "Country", name: "India" },
      hasOfferCatalog: {
        "@type": "OfferCatalog", name: s.provideTitle,
        itemListElement: s.provide.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: p[0], description: p[1] } })),
      },
    });
  }

  /* FAQPage only where the same answers are visible on the page */
  let faqs = null;
  if (path === "/") faqs = HOME_FAQS;
  else if (route.service) faqs = SERVICES[route.service].faqs;
  else if (path === "/faq") faqs = HOME_FAQS.concat(...SERVICE_SLUGS.map((k) => SERVICES[k].faqs));
  if (faqs) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f[0], acceptedAnswer: { "@type": "Answer", text: f[1] } })),
    });
  }

  setJsonLd("ld-page", graph.length ? { "@context": "https://schema.org", "@graph": graph } : null);
}
