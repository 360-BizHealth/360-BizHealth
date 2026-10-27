/*
 * Blog post schema shared by the admin editor (instant feedback) and the API
 * (the only authority). Mirrors the checks in the blog_posts table.
 */
import { slugify, isSafeImageUrl } from "./markdown.js";

export const DEFAULT_AUTHOR = "360 Biz Health Editorial Team";
export const SUGGESTED_CATEGORIES = ["HR compliance", "HR policy", "Payroll", "Business setup", "Corporate retreats"];
export const POST_STATUSES = ["draft", "published"];
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const RESERVED_SLUGS = ["new", "admin", "api", "category", "tag", "page", "feed", "rss"];

export const LIMITS = {
  title: [5, 160],
  slug: [3, 120],
  excerpt: [20, 300],
  content: [50, 100000],
  category: [2, 60],
  author: [2, 100],
  imageAlt: [0, 200],
  seoTitle: [0, 70],
  seoDescription: [0, 170],
};

export const slugFromTitle = (t) => slugify(t).slice(0, 80).replace(/-+$/, "");

const line = (v) => String(v ?? "").normalize("NFC").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
const text = (v) => String(v ?? "").normalize("NFC").replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

/**
 * Validates and normalises an editor submission.
 * @returns {{ ok: boolean, data: object, errors: Record<string,string> }}
 */
export function validatePost(input) {
  const src = input && typeof input === "object" ? input : {};
  const errors = {};
  const data = {
    title: line(src.title),
    slug: line(src.slug).toLowerCase(),
    excerpt: line(src.excerpt),
    content: text(src.content),
    category: line(src.category),
    author: line(src.author) || DEFAULT_AUTHOR,
    imageUrl: line(src.imageUrl) || null,
    imageAlt: line(src.imageAlt),
    seoTitle: line(src.seoTitle),
    seoDescription: line(src.seoDescription),
    publishedAt: line(src.publishedAt) || null,
    keyPoints: Array.isArray(src.keyPoints) ? src.keyPoints.map(line).filter(Boolean) : [],
    faqs: Array.isArray(src.faqs)
      ? src.faqs
          .map((f) => {
            if (Array.isArray(f)) return [line(f[0]), text(f[1])];
            const q = f && (f.q !== undefined ? f.q : f.question !== undefined ? f.question : f.title);
            const a = f && (f.a !== undefined ? f.a : f.answer !== undefined ? f.answer : Array.isArray(f.body) ? f.body.join("\n\n") : f.body);
            return [line(q), text(a)];
          })
          .filter(([q, a]) => q || a)
      : [],
  };
  if (!data.slug && data.title) data.slug = slugFromTitle(data.title);

  const len = (k, field, label) => {
    const [min, max] = LIMITS[k];
    const n = data[field].length;
    if (min > 0 && n === 0) errors[field] = `Enter ${label}.`;
    else if (n > 0 && n < min) errors[field] = `Use at least ${min} characters.`;
    else if (n > max) errors[field] = `Keep this under ${max} characters.`;
  };
  len("title", "title", "a title");
  len("slug", "slug", "a URL slug");
  if (!errors.slug && (!SLUG_RE.test(data.slug) || RESERVED_SLUGS.includes(data.slug))) {
    errors.slug = "Use lowercase letters, numbers and single hyphens only (for example payroll-checklist-2026).";
  }
  len("excerpt", "excerpt", "a short excerpt");
  len("content", "content", "the article content");
  len("category", "category", "a category");
  len("author", "author", "an author");
  len("imageAlt", "imageAlt", "alt text");
  len("seoTitle", "seoTitle", "an SEO title");
  len("seoDescription", "seoDescription", "an SEO description");
  if (data.imageUrl && !isSafeImageUrl(data.imageUrl)) errors.imageUrl = "Upload the image here, or use an image already on this site.";
  if (data.imageUrl && !data.imageAlt) errors.imageAlt = "Describe the image for people who cannot see it.";
  if (data.publishedAt && (!/^\d{4}-\d{2}-\d{2}/.test(data.publishedAt) || Number.isNaN(Date.parse(data.publishedAt)))) {
    errors.publishedAt = "Use a valid date.";
  }
  if (data.keyPoints.length > 8) errors.keyPoints = "Keep it to 8 key points or fewer.";
  else if (data.keyPoints.some((k) => k.length > 300)) errors.keyPoints = "Keep each key point under 300 characters.";
  if (data.faqs.length > 15) errors.faqs = "Keep it to 15 questions or fewer.";
  else if (data.faqs.some(([q, a]) => !q || !a)) errors.faqs = "Each question needs an answer, and each answer a question.";
  else if (data.faqs.some(([q, a]) => q.length > 200 || a.length > 2000)) errors.faqs = "Keep questions under 200 and answers under 2,000 characters.";

  return { ok: Object.keys(errors).length === 0, data, errors };
}
