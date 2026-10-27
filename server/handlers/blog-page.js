/*
 * Server-rendered public blog pages:
 *   /blog          → GET /api/v1/blog-page
 *   /blog/:slug    → GET /api/v1/blog-page?slug=:slug
 * (rewrites in vercel.json; scripts/serve.mjs does the same locally).
 *
 * Posts come from the database on each request, so publishing, editing,
 * unpublishing or deleting in the admin panel takes effect without a redeploy.
 * The page is rendered with the same React components and <head> builder as
 * every other page, and the data is embedded for hydration as a JSON data
 * block (not executable, so the site's script CSP is unaffected).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { queryOf } from "../http.js";
import { listPublished, getPublished, relatedTo } from "../blog.js";
import { log } from "../log.js";
import { PUBLIC_CACHE } from "./public-blog.js";

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);
let ssrPromise = null;
let template = null;

function root() {
  return process.env.BH_SSR_ROOT || process.cwd();
}

async function ssr() {
  if (!ssrPromise) ssrPromise = import(pathToFileURL(path.join(root(), "dist-ssr", "entry-server.js")).href);
  if (!template) template = fs.readFileSync(path.join(root(), "dist-ssr", "template.html"), "utf8");
  return ssrPromise;
}

function page(mod, meta, appHtml, data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c").split(LS).join("\\u2028").split(PS).join("\\u2029");
  return template
    .replace("<!--bh-head-->", mod.headFor(meta))
    .replace('<div id="root"><!--bh-app--></div>',
      `<div id="root" data-prerendered="true">${appHtml}</div><script type="application/json" id="bh-data">${json}</script>`);
}

function sendHtml(res, status, html, cache) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(html);
}

export default async function blogPage(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end();
  }
  let mod;
  try {
    mod = await ssr();
  } catch (err) {
    log.error("blog_ssr_bundle_missing", { err });
    return sendHtml(res, 500, "<!doctype html><title>Blog unavailable</title><p>The blog could not be loaded. Please try again shortly.</p>", "no-store");
  }
  const slug = queryOf(req).slug;
  try {
    if (!slug) {
      const posts = await listPublished();
      const data = { path: "/blog", posts };
      return sendHtml(res, 200, page(mod, mod.blogIndexMeta(posts), mod.render("/blog", data), data), PUBLIC_CACHE);
    }
    const post = await getPublished(slug);
    if (!post) {
      const data = { path: "/blog/" + slug, notFound: true };
      return sendHtml(res, 404, page(mod, mod.NOT_FOUND_META, mod.render("/blog/" + slug, data), data), PUBLIC_CACHE);
    }
    const related = await relatedTo(post);
    const data = { path: "/blog/" + post.slug, post, related };
    return sendHtml(res, 200, page(mod, mod.articleMeta(post), mod.render("/blog/" + post.slug, data), data), PUBLIC_CACHE);
  } catch (err) {
    log.error("blog_page_failed", { err, slug: slug || null });
    const data = { path: slug ? "/blog/" + slug : "/blog", unavailable: true };
    const meta = { ...mod.BLOG_INDEX_META, noindex: true };
    return sendHtml(res, 503, page(mod, meta, mod.render(data.path, data), data), "no-store");
  }
}
