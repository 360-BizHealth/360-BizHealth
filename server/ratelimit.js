import { query } from "./db.js";
import { HttpError } from "./http.js";

/*
 * Database-backed fixed-window rate limit, shared across all serverless
 * instances. Throws 429 with Retry-After once the limit is exceeded.
 */
export async function limit(key, windowSeconds, max, message) {
  const { rows } = await query("select public.rate_limit_hit($1, $2, $3) as ok", [key, windowSeconds, max]);
  if (!rows[0].ok) {
    const now = Math.floor(Date.now() / 1000);
    const retry = windowSeconds - (now % windowSeconds);
    throw new HttpError(429, "rate_limited", message || "Too many requests. Please wait a few minutes and try again.", {
      headers: { "Retry-After": String(retry) },
    });
  }
}
