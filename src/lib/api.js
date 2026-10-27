/*
 * Small fetch wrapper for the site's own API. Always same-origin; admin calls rely
 * on HttpOnly cookies set by the server, and send a custom header that cross-site
 * forms cannot forge (the API rejects state-changing requests without it).
 */
export class ApiError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields || null;
  }
}

const NETWORK_MESSAGE = "We could not reach the server. Check your connection and try again.";

export async function api(path, { method = "GET", body, signal } = {}) {
  const headers = { Accept: "application/json", "X-BH-CSRF": "1" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  let res;
  try {
    res = await fetch(path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, credentials: "same-origin", signal });
  } catch (err) {
    if (err && err.name === "AbortError") throw err;
    throw new ApiError(0, "network_error", NETWORK_MESSAGE);
  }
  let data = null;
  const type = res.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    try { data = await res.json(); } catch { data = null; }
  }
  if (!res.ok || !data || data.ok === false) {
    const e = (data && data.error) || {};
    const fallback = res.status === 404 ? "The service is not available at this address." : res.status >= 500 ? "Something went wrong on our side. Please try again." : "The request could not be completed.";
    throw new ApiError(res.status, e.code || "http_" + res.status, e.message || fallback, e.fields);
  }
  return data;
}

export function newSubmissionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // RFC 4122 v4 fallback for older browsers
  const b = new Uint8Array(16);
  (typeof crypto !== "undefined" ? crypto : { getRandomValues: (a) => a.map(() => Math.floor(Math.random() * 256)) }).getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
