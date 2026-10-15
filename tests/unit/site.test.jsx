import { describe, it, expect } from "vitest";
import { ROUTES, LEGACY_REDIRECTS } from "../../src/routes.jsx";
import { buildHead, canonicalUrl, renderHeadHtml } from "../../src/lib/seo.js";
import { ARTICLES, findArticle, relatedArticles } from "../../src/data/blog.js";
import { SERVICES, SERVICE_SLUGS } from "../../src/data/services.js";
import { SERVICE_DETAILS } from "../../src/data/serviceDetails.js";
import { SERVICE_NAV, PRIMARY_NAV, MOBILE_NAV, FOOTER_COMPANY, FOOTER_LEGAL } from "../../src/data/navigation.js";
import { midSentence } from "../../src/lib/text.js";
import fs from "node:fs";

describe("routes", () => {
  it("has unique paths and unique titles/descriptions for indexable pages", () => {
    const paths = ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    const indexable = ROUTES.filter((r) => !r.meta.noindex);
    expect(new Set(indexable.map((r) => r.meta.title)).size).toBe(indexable.length);
    expect(new Set(indexable.map((r) => r.meta.desc)).size).toBe(indexable.length);
    for (const r of indexable) {
      expect(r.meta.title.length, r.path).toBeLessThanOrEqual(110);
      expect(r.meta.desc.length, r.path).toBeGreaterThan(50);
    }
  });

  it("covers every required page", () => {
    const paths = ROUTES.map((r) => r.path);
    for (const p of ["/", "/about", "/contact", "/blog", "/careers", "/resources", "/faq", "/thank-you", "/privacy-policy", "/terms-and-conditions", "/disclaimer", ...SERVICE_SLUGS.map((s) => "/" + s)]) {
      expect(paths).toContain(p);
    }
  });

  it("gives every blog article its own route and nothing else under /blog/", () => {
    const blog = ROUTES.filter((r) => r.path.startsWith("/blog/")).map((r) => r.path.slice(6)).sort();
    expect(blog).toEqual(ARTICLES.map((a) => a.slug).sort());
    expect(findArticle("does-not-exist")).toBeNull();
  });

  it("every internal navigation link points at a real route", () => {
    const paths = new Set(ROUTES.map((r) => r.path));
    for (const l of [...SERVICE_NAV, ...PRIMARY_NAV, ...MOBILE_NAV, ...FOOTER_COMPANY, ...FOOTER_LEGAL]) expect(paths.has(l.to), l.to).toBe(true);
    for (const slug of SERVICE_SLUGS) for (const [rel] of SERVICES[slug].related) expect(paths.has("/" + rel)).toBe(true);
  });

  it("legacy redirects land on real routes", () => {
    const paths = new Set(ROUTES.map((r) => r.path));
    for (const r of LEGACY_REDIRECTS) if (!r.to.includes(":")) expect(paths.has(r.to)).toBe(true);
  });

  it("vercel.json mirrors the legacy redirects and keeps /api out of rewrites", () => {
    const v = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
    for (const r of LEGACY_REDIRECTS) expect(v.redirects.some((x) => x.source === r.from && x.destination === r.to)).toBe(true);
    expect(v.rewrites.some((r) => /\(\.\*\)|:path\*/.test(r.source) && r.source.startsWith("/("))).toBe(false);
    expect(v.trailingSlash).toBe(false);
    expect(v.cleanUrls).toBe(true);
  });
});

describe("SEO head", () => {
  it("canonical URLs have no trailing slash except the home page", () => {
    expect(canonicalUrl("/")).toMatch(/\/$/);
    expect(canonicalUrl("/about/")).toBe(canonicalUrl("/about"));
    expect(canonicalUrl("/about")).not.toMatch(/\/$/);
  });

  it("builds valid JSON-LD with breadcrumbs, FAQ and service data", () => {
    const r = ROUTES.find((x) => x.path === "/hrms-software-solutions");
    const head = buildHead(r.meta);
    const types = head.jsonLd["@graph"].map((g) => g["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite", "BreadcrumbList", "Service", "FAQPage"]));
    const faq = head.jsonLd["@graph"].find((g) => g["@type"] === "FAQPage");
    expect(faq.mainEntity.length).toBe(SERVICES["hrms-software-solutions"].faqs.length);
    const bc = head.jsonLd["@graph"].find((g) => g["@type"] === "BreadcrumbList");
    expect(bc.itemListElement.every((i) => i.item)).toBe(true);
  });

  it("marks articles as BlogPosting with dates", () => {
    const r = ROUTES.find((x) => x.path === "/blog/" + ARTICLES[0].slug);
    const post = buildHead(r.meta).jsonLd["@graph"].find((g) => g["@type"] === "BlogPosting");
    expect(post.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(post.headline).toBe(ARTICLES[0].title);
  });

  it("noindex pages carry robots noindex and no page-level schema", () => {
    const r = ROUTES.find((x) => x.path === "/thank-you");
    const head = buildHead(r.meta);
    expect(head.tags.find((t) => t.attrs.name === "robots").attrs.content).toMatch(/noindex/);
    expect(head.jsonLd["@graph"].map((g) => g["@type"])).toEqual(["Organization", "WebSite"]);
  });

  it("escapes content so it cannot break out of tags", () => {
    const html = renderHeadHtml(buildHead({ path: "/x", title: "</title><script>x</script>", desc: '"><script>', schema: [{ "@type": "Thing", name: "</script><script>alert(1)</script>" }] }));
    expect(html).not.toContain("<script>x</script>");
    expect(html).not.toContain('"><script>');
    expect(html).not.toContain("</script><script>alert(1)");
  });

  it("does not invent a phone number in Organization data while the placeholder is in use", () => {
    const org = buildHead(ROUTES[0].meta).jsonLd["@graph"][0];
    expect(org.telephone).toBeUndefined();
  });
});

describe("content", () => {
  it("every service has distinct layout config, image and section order", () => {
    const orders = SERVICE_SLUGS.map((s) => SERVICE_DETAILS[s].sections.join(","));
    expect(new Set(orders).size).toBe(4);
    const heroes = SERVICE_SLUGS.map((s) => SERVICE_DETAILS[s].hero.image.lg);
    expect(new Set(heroes).size).toBe(4);
    for (const s of SERVICE_SLUGS) expect(SERVICE_DETAILS[s].hero.image.alt.length).toBeGreaterThan(20);
  });

  it("does not reintroduce excluded services", () => {
    // explicit "... are outside our scope." sentences are allowed and removed first
    const text = JSON.stringify({ SERVICES, SERVICE_NAV }).replace(/[^."]*outside our scope\./g, "");
    for (const bad of ["website development", "app development", "SEO services", "copyright registration", "design registration"]) {
      const re = new RegExp(bad, "i");
      expect(re.test(text), bad).toBe(false);
    }
  });

  it("preserves all three blog articles with full content", () => {
    expect(ARTICLES.length).toBe(3);
    const sections = ARTICLES.map((a) => a.sections.length);
    expect(sections).toEqual([12, 10, 9]);
    for (const a of ARTICLES) expect(a.faqs.length).toBeGreaterThanOrEqual(3);
  });

  it("related articles never include the article itself", () => {
    for (const a of ARTICLES) expect(relatedArticles(a).some((r) => r.slug === a.slug)).toBe(false);
  });

  it("midSentence keeps acronyms", () => {
    expect(midSentence("HRMS solutions")).toBe("HRMS solutions");
    expect(midSentence("Payroll, TDS & labour compliance")).toBe("payroll, TDS & labour compliance");
  });
});
