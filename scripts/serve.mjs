#!/usr/bin/env node
/*
 * Production-like local server for the built site. It mimics the parts of Vercel
 * this project relies on, reading vercel.json: cleanUrls, trailingSlash:false,
 * redirects, rewrites, headers, a real 404 page, and /api functions.
 *   npm run serve            (after npm run build)   → http://localhost:4173
 * Not used in production; Vercel serves the site there.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "./load-env.mjs";
import { createApiMiddleware } from "../server/dev/router.js";

loadEnv();
if (process.env.ALLOW_INSECURE_COOKIES === undefined) process.env.ALLOW_INSECURE_COOKIES = "true";

const root = path.resolve("dist");
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
const port = Number(process.env.PORT || 4173);
const api = createApiMiddleware(path.resolve("api"));

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml",
  ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json",
};

/* path-to-regexp subset: :name, :name*, and raw (...) groups */
function compile(source) {
  let re = "";
  for (let i = 0; i < source.length; ) {
    const m = source.slice(i).match(/^:(\w+)(\*)?/);
    if (m) { re += m[2] ? `(?<${m[1]}>.*)` : `(?<${m[1]}>[^/]+)`; i += m[0].length; continue; }
    const ch = source[i];
    if (ch === "(") { const j = source.indexOf(")", i); re += source.slice(i, j + 1); i = j + 1; continue; }
    re += /[.+?^${}|[\]\\]/.test(ch) ? "\\" + ch : ch;
    i++;
  }
  return new RegExp("^" + re + "$");
}
const fill = (dest, groups) => dest.replace(/:(\w+)\*?/g, (_, k) => (groups && groups[k]) || "");

const redirects = (vercel.redirects || []).map((r) => ({ ...r, re: compile(r.source) }));
const rewrites = (vercel.rewrites || []).map((r) => ({ ...r, re: compile(r.source) }));
const headerRules = (vercel.headers || []).map((r) => ({ ...r, re: compile(r.source) }));

function fileFor(p) {
  const clean = decodeURIComponent(p).replace(/\/+$/, "") || "/";
  const candidates = clean === "/" ? ["index.html"] : [clean.slice(1), clean.slice(1) + ".html"];
  for (const c of candidates) {
    const full = path.join(root, c);
    if (!full.startsWith(root)) return null;
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  return null;
}

function sendFile(res, file, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  let p = url.pathname;
  for (const h of headerRules) if (h.re.test(p)) for (const { key, value } of h.headers) res.setHeader(key, value);

  if (p.startsWith("/api/")) return api(req, res, () => { res.statusCode = 404; res.end(); });

  if (vercel.trailingSlash === false && p.length > 1 && p.endsWith("/")) {
    res.statusCode = 308; res.setHeader("Location", p.replace(/\/+$/, "") + url.search); return res.end();
  }
  if (vercel.cleanUrls && p.endsWith(".html")) {
    res.statusCode = 308; res.setHeader("Location", (p.replace(/(index)?\.html$/, "") || "/") + url.search); return res.end();
  }
  for (const r of redirects) {
    const m = p.match(r.re);
    if (m) { res.statusCode = r.statusCode || (r.permanent ? 308 : 307); res.setHeader("Location", fill(r.destination, m.groups)); return res.end(); }
  }
  let file = fileFor(p);
  if (!file) {
    for (const r of rewrites) {
      const m = p.match(r.re);
      if (!m) continue;
      const dest = fill(r.destination, m.groups);
      if (dest.startsWith("/api/")) {
        // rewrite to a function (server-rendered blog pages, sitemap), as on Vercel
        const target = new URL(dest, "http://localhost");
        for (const [k, v] of url.searchParams) if (!target.searchParams.has(k)) target.searchParams.set(k, v);
        req.url = target.pathname + target.search;
        return api(req, res, () => { res.statusCode = 404; res.end(); });
      }
      p = dest; file = fileFor(p); break;
    }
  }
  if (file) return sendFile(res, file);
  return sendFile(res, path.join(root, "404.html"), 404);
});

server.listen(port, () => console.log(`360 Biz Health (production build) on http://localhost:${port}`));
