/*
 * Local stand-in for Vercel's file-system routing of /api. Used by the Vite dev
 * server, `npm run serve` and the tests, so the same handler files run locally
 * and on Vercel. Not used in production.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else if (entry.name.endsWith(".js") && !entry.name.startsWith("_")) out.push(path.relative(base, full));
  }
  return out;
}

export function buildRoutes(apiDir) {
  const routes = walk(apiDir).map((rel) => {
    const noExt = rel.replace(/\\/g, "/").replace(/\.js$/, "").replace(/\/index$/, "").replace(/^index$/, "");
    const params = [];
    const pattern = noExt
      .split("/")
      .map((seg) => {
        const m = seg.match(/^\[(\w+)\]$/);
        if (m) { params.push(m[1]); return "([^/]+)"; }
        return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("/");
    const dynamic = params.length;
    return { file: path.join(apiDir, rel), regex: new RegExp(`^/api/${pattern}/?$`), params, dynamic };
  });
  // static routes take priority over dynamic ones, as on Vercel
  routes.sort((a, b) => a.dynamic - b.dynamic);
  return routes;
}

export function createApiMiddleware(apiDir) {
  const routes = buildRoutes(apiDir);
  const cache = new Map();
  return async function apiMiddleware(req, res, next) {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith("/api/")) return next();
    const route = routes.find((r) => r.regex.test(url.pathname));
    if (!route) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: false, error: { code: "not_found", message: "No such API endpoint." } }));
    }
    const m = url.pathname.match(route.regex);
    const query = Object.fromEntries(url.searchParams.entries());
    route.params.forEach((p, i) => { query[p] = decodeURIComponent(m[i + 1]); });
    req.query = query;
    try {
      let mod = cache.get(route.file);
      if (!mod || process.env.BH_API_HOT === "true") {
        // Plain absolute paths on POSIX (test runners mishandle %-encoded "[id]" URLs); file URLs on Windows.
        const base = process.platform === "win32" ? pathToFileURL(route.file).href : route.file;
        const href = base + (process.env.BH_API_HOT === "true" ? `?t=${Date.now()}` : "");
        mod = await import(href);
        cache.set(route.file, mod);
      }
      await mod.default(req, res);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: { code: "internal_error", message: "Local API error." } }));
      }
    }
  };
}
