#!/usr/bin/env node
/*
 * Static prerendering. Runs after `vite build` and `vite build --ssr`:
 *  - renders every public route to dist/<path>.html with its own <head>
 *    (title, description, canonical, Open Graph, JSON-LD) so crawlers and social
 *    previews see real content without running JavaScript;
 *  - writes dist/404.html (served by Vercel with a real 404 status) and
 *    dist/admin.html (no content, noindex);
 *  - writes sitemap.xml and robots.txt.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssr = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes("<!--bh-head-->") || !template.includes("<!--bh-app-->")) {
  throw new Error("dist/index.html is missing the <!--bh-head--> / <!--bh-app--> placeholders");
}

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
  write(r.path, page(r.meta, ssr.render(r.path)));
  count++;
}
write("/404", page(ssr.NOT_FOUND_META, ssr.render("/__not_found__")));
write("/admin", page(ssr.ADMIN_META, null));

/* sitemap: indexable routes only; lastmod only where a real date is known */
const origin = ssr.BIZ.origin;
const urls = ssr.ROUTES.filter((r) => !r.meta.noindex).map((r) => {
  const loc = origin + (r.path === "/" ? "/" : r.path);
  const lastmod = r.meta.modified ? `<lastmod>${r.meta.modified}</lastmod>` : "";
  return `  <url><loc>${loc}</loc>${lastmod}</url>`;
});
fs.writeFileSync(path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);

fs.writeFileSync(path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /thank-you\n\nSitemap: ${origin}/sitemap.xml\n`);

fs.rmSync(path.resolve("dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${count} routes + 404.html + admin.html, sitemap.xml (${urls.length} URLs), robots.txt`);
