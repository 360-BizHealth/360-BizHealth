/*
 * Public blog helpers shared by server rendering and the browser:
 * page metadata, display formatting and the hydration data hand-off.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { canonicalUrl, absoluteUrl, faqSchema, ORG_ID } from "./seo.js";

export const BLOG_INDEX_META = {
  path: "/blog",
  title: "Blog & Practical Guides on HR, Payroll and Compliance | 360 Biz Health",
  desc: "Practical frameworks, articles and operational guides on HRMS, payroll compliance, business setup and corporate offsites.",
  crumbs: [["Blog", "/blog"]],
};

const istDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata", day: "2-digit", month: "long", year: "numeric" });
export const displayDate = (iso) => (iso ? istDate(iso) : "");
export const isoDay = (iso) => (iso ? new Date(new Date(iso).getTime() + 5.5 * 3600e3).toISOString().slice(0, 10) : "");
export const readTime = (n) => `${n || 1} min read`;

export function blogIndexMeta(posts) {
  return {
    ...BLOG_INDEX_META,
    schema: [{
      "@type": "Blog",
      "@id": canonicalUrl("/blog") + "#blog",
      url: canonicalUrl("/blog"),
      name: "360 Biz Health Blog",
      publisher: { "@id": ORG_ID() },
      blogPost: (posts || []).map((a) => ({ "@id": canonicalUrl("/blog/" + a.slug) + "#article", headline: a.title, url: canonicalUrl("/blog/" + a.slug), datePublished: isoDay(a.publishedAt) })),
    }],
  };
}

export function articleMeta(post) {
  const path = "/blog/" + post.slug;
  return {
    path,
    title: `${post.seoTitle || post.title} | 360 Biz Health`,
    desc: post.seoDescription || post.excerpt,
    crumbs: [["Blog", "/blog"], [post.title, path]],
    ogType: "article",
    image: post.imageUrl || undefined,
    imageAlt: post.imageAlt || undefined,
    published: isoDay(post.publishedAt),
    modified: isoDay(post.updatedAt || post.publishedAt),
    schema: [
      {
        "@type": "BlogPosting",
        "@id": canonicalUrl(path) + "#article",
        mainEntityOfPage: canonicalUrl(path),
        headline: post.title,
        description: post.seoDescription || post.excerpt,
        image: post.imageUrl ? [absoluteUrl(post.imageUrl)] : undefined,
        datePublished: isoDay(post.publishedAt),
        dateModified: isoDay(post.updatedAt || post.publishedAt),
        articleSection: post.category,
        inLanguage: "en-IN",
        author: { "@type": "Organization", name: post.author, url: canonicalUrl("/about") },
        publisher: { "@id": ORG_ID() },
      },
      faqSchema(post.faqs),
    ],
  };
}

/*
 * Data rendered on the server for the first page view (/blog, /blog/:slug).
 * Pages read it once, for the path it was rendered for; later navigations fetch.
 */
export const InitialDataContext = createContext({ current: null });

export function useInitialData(path) {
  const ref = useContext(InitialDataContext);
  const [d] = useState(() => (ref && ref.current && ref.current.path === path ? ref.current : null));
  // used once: a later visit to the same page in this session fetches fresh data
  useEffect(() => { if (d && ref.current === d) ref.current = null; }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return d;
}

export function readInitialData() {
  if (typeof document === "undefined") return null;
  const el = document.getElementById("bh-data");
  if (!el) return null;
  try { return JSON.parse(el.textContent); } catch { return null; }
}
