/*
 * Central router for all API endpoints, used in both local development and
 * Vercel serverless deployment. Consolidates all endpoints into a single
 * entry point so Vercel creates only 1 Serverless Function (well within the
 * Hobby plan limit of 12).
 */
import healthHandler from "./handlers/health.js";
import enquiriesHandler from "./handlers/enquiries.js";
import sitemapHandler from "./handlers/sitemap.js";
import blogPageHandler from "./handlers/blog-page.js";
import cronNotificationsHandler from "./handlers/cron-notifications.js";
import adminSessionHandler from "./handlers/admin-session.js";
import adminOverviewHandler from "./handlers/admin-overview.js";
import adminUsersHandler from "./handlers/admin-users.js";
import { stats as adminStats, exportCsv as adminExportCsv, list as adminLeadsList, detail as adminLeadDetail, notes as adminLeadNotes, notify as adminLeadNotify } from "./handlers/admin-leads.js";
import { media as adminMedia, collection as adminPostsCollection, item as adminPostItem, status as adminPostStatus } from "./handlers/admin-blog.js";
import { media as publicMedia, list as publicPostsList, one as publicPostOne } from "./handlers/public-blog.js";

const ROUTES = [
  // Static routes (exact match)
  { pattern: /^\/api\/v1\/health\/?$/, params: [], handler: healthHandler },
  { pattern: /^\/api\/v1\/enquiries\/?$/, params: [], handler: enquiriesHandler },
  { pattern: /^\/api\/v1\/sitemap\/?$/, params: [], handler: sitemapHandler },
  { pattern: /^\/api\/v1\/blog-page\/?$/, params: [], handler: blogPageHandler },
  { pattern: /^\/api\/v1\/cron\/retry-notifications\/?$/, params: [], handler: cronNotificationsHandler },
  { pattern: /^\/api\/v1\/admin\/session\/?$/, params: [], handler: adminSessionHandler },
  { pattern: /^\/api\/v1\/admin\/overview\/?$/, params: [], handler: adminOverviewHandler },
  { pattern: /^\/api\/v1\/admin\/media\/?$/, params: [], handler: adminMedia },
  { pattern: /^\/api\/v1\/admin\/stats\/?$/, params: [], handler: adminStats },
  { pattern: /^\/api\/v1\/admin\/leads\/export\/?$/, params: [], handler: adminExportCsv },
  { pattern: /^\/api\/v1\/admin\/leads\/?$/, params: [], handler: adminLeadsList },
  { pattern: /^\/api\/v1\/admin\/posts\/?$/, params: [], handler: adminPostsCollection },
  { pattern: /^\/api\/v1\/admin\/users\/?$/, params: [], handler: adminUsersHandler },
  { pattern: /^\/api\/v1\/posts\/?$/, params: [], handler: publicPostsList },

  // Nested dynamic routes
  { pattern: /^\/api\/v1\/admin\/leads\/([^/]+)\/notes\/?$/, params: ["id"], handler: adminLeadNotes },
  { pattern: /^\/api\/v1\/admin\/leads\/([^/]+)\/notify\/?$/, params: ["id"], handler: adminLeadNotify },
  { pattern: /^\/api\/v1\/admin\/posts\/([^/]+)\/status\/?$/, params: ["id"], handler: adminPostStatus },

  // Dynamic routes
  { pattern: /^\/api\/v1\/admin\/leads\/([^/]+)\/?$/, params: ["id"], handler: adminLeadDetail },
  { pattern: /^\/api\/v1\/admin\/posts\/([^/]+)\/?$/, params: ["id"], handler: adminPostItem },
  { pattern: /^\/api\/v1\/admin\/users\/([^/]+)\/?$/, params: ["id"], handler: adminUsersHandler },
  { pattern: /^\/api\/v1\/media\/([^/]+)\/?$/, params: ["id"], handler: publicMedia },
  { pattern: /^\/api\/v1\/posts\/([^/]+)\/?$/, params: ["slug"], handler: publicPostOne },
];

export async function handleRequest(req, res) {
  const url = new URL(req.url, "http://localhost");
  let pathname = url.pathname;

  // Normalize path if rewritten by Vercel
  if (url.searchParams.has("_vercel_path")) {
    const vp = url.searchParams.get("_vercel_path") || "";
    pathname = vp.startsWith("/api/") ? vp : "/api/" + vp.replace(/^\/+/, "");
    url.searchParams.delete("_vercel_path");
  } else if (pathname === "/api/index.js" || pathname === "/api" || pathname === "/api/") {
    const matched = req.headers["x-matched-path"] || "";
    if (matched && matched.startsWith("/api/")) {
      pathname = matched;
    }
  }

  // Find matching route
  for (const route of ROUTES) {
    const m = pathname.match(route.pattern);
    if (m) {
      const query = { ...Object.fromEntries(url.searchParams.entries()), ...(req.query || {}) };
      route.params.forEach((paramName, idx) => {
        query[paramName] = decodeURIComponent(m[idx + 1]);
      });
      req.query = query;
      return route.handler(req, res);
    }
  }

  // Not found
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify({ ok: false, error: { code: "not_found", message: "No such API endpoint." } }));
}

export default handleRequest;
