/*
 * GET /sitemap.xml (rewritten to /api/v1/sitemap): the static pages known at
 * build time plus every published blog post, read live from the database.
 * If the database is unreachable the static pages are still listed.
 */
import fs from "node:fs";
import path from "node:path";
import { query } from "../db.js";
import { log } from "../log.js";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

export default async function sitemap(req, res) {
  const rootDir = process.env.BH_SSR_ROOT || process.cwd();
  let pages = { origin: "https://www.360bizhealth.com", urls: [] };
  try { pages = JSON.parse(fs.readFileSync(path.join(rootDir, "dist-ssr", "static-urls.json"), "utf8")); } catch (err) { log.error("sitemap_static_missing", { err }); }
  const lines = pages.urls.map((u) => `  <url><loc>${esc(pages.origin + u.path)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`);
  try {
    const { rows } = await query(
      "select slug, to_char(updated_at at time zone 'Asia/Kolkata', 'YYYY-MM-DD') as lastmod from public.blog_posts where status = 'published' and published_at <= now() order by published_at desc"
    );
    for (const r of rows) lines.push(`  <url><loc>${esc(pages.origin + "/blog/" + r.slug)}</loc><lastmod>${r.lastmod}</lastmod></url>`);
  } catch (err) {
    log.error("sitemap_posts_failed", { err });
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=600");
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>\n`);
}
