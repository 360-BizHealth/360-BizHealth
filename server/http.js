import crypto from "node:crypto";
import { config } from "./config.js";
import { log } from "./log.js";

/* An error that maps directly to an HTTP response. */
export class HttpError extends Error {
  constructor(status, code, message, extra) {
    super(message);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "same-origin",
  "X-Frame-Options": "DENY",
};

export function send(res, status, body, headers = {}) {
  res.statusCode = status;
  for (const [k, v] of Object.entries({ ...SECURITY_HEADERS, ...headers })) res.setHeader(k, v);
  if (body === undefined || body === null) return res.end();
  if (typeof body === "string" || Buffer.isBuffer(body)) return res.end(body);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify(body));
}

export function sendError(res, err) {
  if (err instanceof HttpError) {
    const headers = err.extra && err.extra.headers ? err.extra.headers : {};
    const body = { ok: false, error: { code: err.code, message: err.message } };
    if (err.extra && err.extra.fields) body.error.fields = err.extra.fields;
    return send(res, err.status, body, headers);
  }
  const id = crypto.randomUUID();
  log.error("unhandled_error", { errorId: id, err });
  return send(res, 500, { ok: false, error: { code: "internal_error", message: "Something went wrong on our side. Please try again.", id } });
}

/* Wraps a handler so every thrown error becomes a structured JSON response. */
export function handler(methods) {
  return async function vercelHandler(req, res) {
    try {
      if (!methods[req.method]) {
        throw new HttpError(405, "method_not_allowed", "Method not allowed.", { headers: { Allow: Object.keys(methods).join(", ") } });
      }
      await methods[req.method](req, res);
    } catch (err) {
      sendError(res, err);
    }
  };
}

const MAX_BODY = 32 * 1024;

export async function readJson(req) {
  const type = String(req.headers["content-type"] || "");
  if (!type.toLowerCase().startsWith("application/json")) {
    throw new HttpError(415, "unsupported_media_type", "Send the request as JSON.");
  }
  const len = Number(req.headers["content-length"] || 0);
  if (len > MAX_BODY) throw new HttpError(413, "payload_too_large", "The request is too large.");

  // Vercel's Node runtime may have parsed the body already.
  let pre;
  try { pre = req.body; } catch { throw new HttpError(400, "invalid_json", "The request body is not valid JSON."); }
  if (pre !== undefined && pre !== null && typeof pre === "object" && !Buffer.isBuffer(pre)) return pre;
  if (typeof pre === "string" || Buffer.isBuffer(pre)) return parse(String(pre));

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new HttpError(413, "payload_too_large", "The request is too large.");
    chunks.push(chunk);
  }
  return parse(Buffer.concat(chunks).toString("utf8"));
}

function parse(text) {
  if (!text) return {};
  try {
    const v = JSON.parse(text);
    if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("not an object");
    return v;
  } catch {
    throw new HttpError(400, "invalid_json", "The request body is not valid JSON.");
  }
}

export function clientIp(req) {
  const h = req.headers;
  const first = (v) => String(v || "").split(",")[0].trim();
  return first(h["x-vercel-forwarded-for"]) || first(h["x-real-ip"]) || first(h["x-forwarded-for"]) || (req.socket && req.socket.remoteAddress) || "unknown";
}

export function hashIp(ip) {
  const salt = config.ipHashSalt || "bh-default-salt-set-IP_HASH_SALT";
  return crypto.createHash("sha256").update(salt + "|" + ip).digest("hex").slice(0, 32);
}

export function queryOf(req) {
  if (req.query && typeof req.query === "object") return req.query;
  const u = new URL(req.url, "http://local");
  return Object.fromEntries(u.searchParams.entries());
}

/* ------------------------------------------------------------------ cookies */

export function parseCookies(req) {
  const out = {};
  const raw = String(req.headers.cookie || "");
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    if (!k) continue;
    try { out[k] = decodeURIComponent(part.slice(i + 1).trim()); } catch { /* ignore malformed */ }
  }
  return out;
}

export function cookie(name, value, { maxAge, path = "/" } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, "HttpOnly", "SameSite=Strict"];
  if (!config.insecureCookies) parts.push("Secure");
  if (maxAge !== undefined) parts.push(`Max-Age=${Math.max(0, Math.floor(maxAge))}`);
  return parts.join("; ");
}

/* --------------------------------------------------------------- origin/CSRF */

function allowedOrigins(req) {
  const list = [config.siteUrl, ...config.extraOrigins];
  // apex and www variants of the configured site
  try {
    const u = new URL(config.siteUrl);
    const alt = u.hostname.startsWith("www.") ? u.hostname.slice(4) : "www." + u.hostname;
    list.push(`${u.protocol}//${alt}`);
  } catch { /* SITE_URL validated in docs */ }
  // Same host the request was made to (covers Vercel preview deployments and local dev)
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (host) {
    const proto = String(req.headers["x-forwarded-proto"] || "").split(",")[0] || (config.insecureCookies ? "http" : "https");
    list.push(`${proto}://${host}`);
  }
  return list;
}

/*
 * Rejects cross-site state-changing requests. Browsers always send Origin on
 * cross-origin POST/PATCH/DELETE, so a mismatching Origin is a forged request.
 */
export function assertSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) {
    // Non-browser clients (curl, tests, server-to-server). Admin routes additionally
    // require the custom CSRF header, which a cross-site form cannot set.
    return;
  }
  if (!allowedOrigins(req).includes(origin.replace(/\/+$/, ""))) {
    throw new HttpError(403, "forbidden_origin", "This request was not made from the 360 Biz Health website.");
  }
}

export function assertCsrfHeader(req) {
  if (req.headers["x-bh-csrf"] !== "1") {
    throw new HttpError(403, "csrf_check_failed", "Missing request verification header.");
  }
}
