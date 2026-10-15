/*
 * Page metadata → <head> tags. Pure functions, used both at build time
 * (prerendered HTML) and in the browser on client-side navigation.
 * Canonical URLs never end in a slash (except the home page "/"), matching
 * `trailingSlash: false` in vercel.json.
 */
import { BIZ, HOME_FAQS } from "../data/site.js";

export const SITE_NAME = "360 Biz Health";
export const DEFAULT_IMAGE = "/og-image.png";

export function canonicalUrl(path) {
  const clean = !path || path === "/" ? "/" : "/" + path.replace(/^\/+|\/+$/g, "");
  return BIZ.origin + clean;
}

export function absoluteUrl(src) {
  if (!src) return BIZ.origin + DEFAULT_IMAGE;
  return /^https?:\/\//.test(src) ? src : BIZ.origin + (src.startsWith("/") ? src : "/" + src);
}

export const ORG_ID = () => BIZ.origin + "/#organization";
export const SITE_ID = () => BIZ.origin + "/#website";

export function organizationSchema() {
  const org = {
    "@type": "Organization",
    "@id": ORG_ID(),
    name: BIZ.name,
    url: BIZ.origin + "/",
    logo: { "@type": "ImageObject", url: BIZ.origin + "/icon-512.png", width: 512, height: 512 },
    description:
      "An independent business advisory and channel-partner company coordinating HRMS selection and implementation, payroll and TDS services, labour compliance support, business registration and IPR support, and corporate retreat planning in India.",
    email: BIZ.email,
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: BIZ.email, areaServed: "IN", availableLanguage: ["en", "hi"] }],
  };
  if (BIZ.phonePublished) {
    org.telephone = BIZ.phoneHref;
    org.contactPoint[0].telephone = BIZ.phoneHref;
  }
  if (BIZ.addressPublished) {
    org.address = {
      "@type": "PostalAddress", streetAddress: BIZ.address.street, addressLocality: BIZ.address.locality,
      addressRegion: BIZ.address.region, postalCode: BIZ.address.postal, addressCountry: BIZ.address.country,
    };
  }
  return org;
}

export function websiteSchema() {
  return { "@type": "WebSite", "@id": SITE_ID(), url: BIZ.origin + "/", name: SITE_NAME, publisher: { "@id": ORG_ID() }, inLanguage: "en-IN" };
}

export function breadcrumbSchema(crumbs) {
  if (!crumbs || !crumbs.length) return null;
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: BIZ.origin + "/" }];
  crumbs.forEach(([name, path], i) => {
    const it = { "@type": "ListItem", position: i + 2, name };
    if (path) it.item = canonicalUrl(path);
    items.push(it);
  });
  return { "@type": "BreadcrumbList", itemListElement: items };
}

export function faqSchema(faqs) {
  if (!faqs || !faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => {
      const q = Array.isArray(f) ? f[0] : f.question;
      const a = Array.isArray(f) ? f[1] : f.answer;
      return { "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } };
    }),
  };
}

export const homeFaqSchema = () => faqSchema(HOME_FAQS);

/**
 * meta: { path, title, desc, noindex?, crumbs?, ogType?, image?, imageAlt?, schema?: object[], published?, modified? }
 * @returns {{ title: string, tags: Array<{tag:string, attrs:object}>, jsonLd: object }}
 */
export function buildHead(meta) {
  const url = canonicalUrl(meta.path);
  const image = absoluteUrl(meta.image);
  const robots = meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large";
  const tags = [
    { tag: "meta", attrs: { name: "description", content: meta.desc } },
    { tag: "meta", attrs: { name: "robots", content: robots } },
    { tag: "link", attrs: { rel: "canonical", href: url } },
    { tag: "meta", attrs: { property: "og:type", content: meta.ogType || "website" } },
    { tag: "meta", attrs: { property: "og:site_name", content: SITE_NAME } },
    { tag: "meta", attrs: { property: "og:locale", content: "en_IN" } },
    { tag: "meta", attrs: { property: "og:title", content: meta.title } },
    { tag: "meta", attrs: { property: "og:description", content: meta.desc } },
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:image:alt", content: meta.imageAlt || SITE_NAME } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: meta.title } },
    { tag: "meta", attrs: { name: "twitter:description", content: meta.desc } },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
  ];
  if (meta.ogType === "article") {
    if (meta.published) tags.push({ tag: "meta", attrs: { property: "article:published_time", content: meta.published } });
    if (meta.modified) tags.push({ tag: "meta", attrs: { property: "article:modified_time", content: meta.modified } });
  }

  const graph = [organizationSchema(), websiteSchema()];
  if (!meta.noindex) {
    const bc = breadcrumbSchema(meta.crumbs);
    if (bc) graph.push(bc);
    (meta.schema || []).filter(Boolean).forEach((s) => graph.push(s));
  }
  return { title: meta.title, tags, jsonLd: { "@context": "https://schema.org", "@graph": graph } };
}

const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* JSON inside <script>: escape "<" so "</script>" in content cannot break out */
const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
export const safeJson = (o) => JSON.stringify(o).replace(/</g, "\\u003c").split(LS).join("\\u2028").split(PS).join("\\u2029");

export function renderHeadHtml(head) {
  const lines = [`<title>${escText(head.title)}</title>`];
  for (const t of head.tags) {
    const attrs = Object.entries(t.attrs).map(([k, v]) => `${k}="${escAttr(v)}"`).join(" ");
    lines.push(`<${t.tag} data-bh-head ${attrs}>`);
  }
  lines.push(`<script type="application/ld+json" data-bh-head>${safeJson(head.jsonLd)}</script>`);
  return lines.join("\n");
}

/* Browser: replace the managed head tags with those for the current page. */
export function applyHead(head) {
  if (typeof document === "undefined") return;
  document.title = head.title;
  document.head.querySelectorAll("[data-bh-head]").forEach((el) => el.remove());
  const frag = document.createDocumentFragment();
  for (const t of head.tags) {
    const el = document.createElement(t.tag);
    el.setAttribute("data-bh-head", "");
    for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    frag.appendChild(el);
  }
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.setAttribute("data-bh-head", "");
  ld.textContent = JSON.stringify(head.jsonLd);
  frag.appendChild(ld);
  document.head.appendChild(frag);
}
