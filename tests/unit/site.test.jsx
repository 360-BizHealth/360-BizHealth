import { describe, it, expect } from "vitest";
import { ROUTES, LEGACY_REDIRECTS } from "../../src/routes.jsx";
import { buildHead, canonicalUrl, renderHeadHtml } from "../../src/lib/seo.js";
import { articleMeta } from "../../src/lib/blog.js";
import { renderMarkdown, readMinutes } from "../../shared/markdown.js";
import { validatePost } from "../../shared/blog.js";
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

  it("prerenders /blog statically and no article routes are static", () => {
    expect(ROUTES.find((r) => r.path === "/blog").meta.dynamic).toBe(false);
    expect(ROUTES.filter((r) => r.path.startsWith("/blog/"))).toEqual([]);
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
    const meta = articleMeta({ slug: "x-post", title: "A title", excerpt: "An excerpt long enough", category: "Payroll", author: "Team",
      publishedAt: "2026-01-06T03:30:00.000Z", updatedAt: "2026-02-01T10:00:00.000Z", faqs: [["Q?", "A."]], imageUrl: "/blog-images/a.webp" });
    const graph = buildHead(meta).jsonLd["@graph"];
    const post = graph.find((g) => g["@type"] === "BlogPosting");
    expect(post.datePublished).toBe("2026-01-06");
    expect(post.dateModified).toBe("2026-02-01");
    expect(post.headline).toBe("A title");
    expect(post.image[0]).toMatch(/^https:\/\/.+\/blog-images\/a\.webp$/);
    expect(graph.some((g) => g["@type"] === "FAQPage")).toBe(true);
    expect(meta.path).toBe("/blog/x-post");
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

  it("the seed migration preserves all three original articles", () => {
    const sql = fs.readFileSync("supabase/migrations/20261027000200_seed_blog_posts.sql", "utf8");
    for (const slug of ["posh-act-2013-employer-guide", "modern-leave-policy-india-2026", "full-final-settlement-india-2026"]) expect(sql).toContain(`'${slug}'`);
    expect(sql).toContain("on conflict (slug) do nothing");
  });

  it("midSentence keeps acronyms", () => {
    expect(midSentence("HRMS solutions")).toBe("HRMS solutions");
    expect(midSentence("Payroll, TDS & labour compliance")).toBe("payroll, TDS & labour compliance");
  });
});

describe("blog content safety (shared/markdown.js)", () => {
  it("escapes raw HTML and drops unsafe links and off-site images", () => {
    const { html } = renderMarkdown('<script>alert(1)</script>\n\nHi <img src=x onerror=alert(1)>\n\n[x](javascript:alert(1)) [ok](/contact)\n\n![a](https://evil.example/x.png) ![b"onerror=1](/blog-images/ok.webp)');
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<img src=x/i);
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("evil.example");
    expect(html).toContain('<a href="/contact">ok</a>');
    expect(html).toContain('src="/blog-images/ok.webp" alt="b&quot;onerror=1"');
  });

  it("gives headings stable, unique ids and lists H2s for the contents", () => {
    const { html, headings } = renderMarkdown("# Top\n\n## What & why\n\n### Detail\n\n## What & why");
    expect(html).toContain('<h2 id="top">');
    expect(headings.map((h) => h.id)).toEqual(["top", "what-and-why", "what-and-why-2"]);
    expect(readMinutes("word ".repeat(1000))).toBe(5);
  });
});

describe("blog post validation (shared/blog.js)", () => {
  const ok = { title: "Payroll checklist for 2026", excerpt: "A practical month-end payroll checklist for HR teams.", content: "## Start\n\n" + "Text ".repeat(20), category: "Payroll" };
  it("accepts a valid post and derives a slug", () => {
    const r = validatePost(ok);
    expect(r.ok).toBe(true);
    expect(r.data.slug).toBe("payroll-checklist-for-2026");
  });
  it("rejects bad slugs, external images, missing alt text and incomplete FAQs", () => {
    const r = validatePost({ ...ok, slug: "Bad Slug!", imageUrl: "https://example.com/a.jpg", faqs: [["Question only", ""]] });
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors).sort()).toEqual(["faqs", "imageAlt", "imageUrl", "slug"]);
    expect(validatePost({ ...ok, slug: "admin" }).errors.slug).toBeTruthy();
  });
  it("normalises object formatted FAQs {question, answer} and {q, a}", () => {
    const r = validatePost({
      ...ok,
      faqs: [
        { question: "Is this supported?", answer: "Yes." },
        { q: "What about q and a?", a: "Also supported." },
      ],
    });
    expect(r.ok).toBe(true);
    expect(r.data.faqs).toEqual([
      ["Is this supported?", "Yes."],
      ["What about q and a?", "Also supported."],
    ]);
  });
});

