#!/usr/bin/env node
/*
 * Static prerendering. Runs after `vite build` and `vite build --ssr`:
 *  - renders every static public route to dist/<path>.html with its own <head>
 *    (title, description, canonical, Open Graph, JSON-LD) so crawlers and social
 *    previews see real content without running JavaScript;
 *  - skips database-backed routes (meta.dynamic: /blog and /blog/:slug), which
 *    are server-rendered per request by api/v1/blog-page.js;
 *  - writes dist/404.html (served by Vercel with a real 404 status) and
 *    dist/admin.html (no content, noindex);
 *  - keeps dist-ssr/ (entry-server.js + template.html) for the blog page
 *    function, and writes dist-ssr/static-urls.json for the dynamic sitemap
 *    (api/v1/sitemap.js, served at /sitemap.xml);
 *  - writes robots.txt.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssrDir = path.resolve("dist-ssr");
const ssr = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--bh-head-->") || !template.includes("<!--bh-app-->")) {
  throw new Error("dist/index.html is missing the <!--bh-head--> / <!--bh-app--> placeholders");
}
// the untouched template, for server-rendered pages
fs.writeFileSync(path.join(ssrDir, "template.html"), template);

function page(meta, appHtml) {
  return template
    .replace("<!--bh-head-->", ssr.headFor(meta))
    .replace('<div id="root"><!--bh-app--></div>', appHtml === null
      ? '<div id="root"></div>'
      : `<div id="root" data-prerendered="true">${appHtml}</div>`);
}

function write(urlPath, html) {
  const file = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "") + ".html";
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return file;
}

let count = 0;
for (const r of ssr.ROUTES) {
  if (r.meta.dynamic) continue;
  write(r.path, page(r.meta, ssr.render(r.path)));
  count++;
}
write("/404", page(ssr.NOT_FOUND_META, ssr.render("/__not_found__")));
write("/admin", page(ssr.ADMIN_META, null));

/* static part of the sitemap: indexable routes only; lastmod only where a real date is known */
const origin = ssr.BIZ.origin;
const urls = ssr.ROUTES.filter((r) => !r.meta.noindex).map((r) => ({ path: r.path === "/" ? "/" : r.path, lastmod: r.meta.modified || null }));
fs.writeFileSync(path.join(ssrDir, "static-urls.json"), JSON.stringify({ origin, urls }, null, 2));

fs.writeFileSync(path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /thank-you\n\nSitemap: ${origin}/sitemap.xml\n`);

console.log(`prerendered ${count} routes + 404.html + admin.html; robots.txt; ${urls.length} static sitemap URLs (blog pages and sitemap.xml are served dynamically)`);
