/*
 * Local stand-in for API middleware. Calls the central router.
 */
import handleRequest from "../router.js";

export function createApiMiddleware() {
  return async function apiMiddleware(req, res, next) {
    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith("/api/") && url.pathname !== "/api") {
      if (next) return next();
      res.statusCode = 404;
      return res.end();
    }
    return handleRequest(req, res);
  };
}
