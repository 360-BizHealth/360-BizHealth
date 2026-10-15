/* Runs the real /api handler files behind a local HTTP server, with a cookie-aware client. */
import http from "node:http";
import path from "node:path";
import { createApiMiddleware } from "../../server/dev/router.js";

export async function startApi() {
  const mw = createApiMiddleware(path.resolve("api"));
  const server = http.createServer((req, res) => mw(req, res, () => { res.statusCode = 404; res.end(); }));
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  return { base, close: () => new Promise((r) => server.close(r)) };
}

export function client(base, { origin } = {}) {
  const jar = new Map();
  let counter = 1;
  const ip = () => `198.51.100.${counter}`;
  async function request(p, { method = "GET", body, headers = {}, raw } = {}) {
    const h = { ...headers };
    if (origin !== undefined && origin !== null) h.Origin = origin;
    if (body !== undefined && !raw) h["Content-Type"] = "application/json";
    if (jar.size) h.Cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
    if (!h["X-Forwarded-For"]) h["X-Forwarded-For"] = ip();
    const res = await fetch(base + p, { method, headers: h, body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined), redirect: "manual" });
    const set = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const c of set) {
      const [pair] = c.split(";");
      const i = pair.indexOf("=");
      const k = pair.slice(0, i); const v = pair.slice(i + 1);
      if (/Max-Age=0/.test(c) || v === "") jar.delete(k); else jar.set(k, v);
    }
    const type = res.headers.get("content-type") || "";
    const data = type.includes("json") ? await res.json() : await res.text();
    return { status: res.status, data, headers: res.headers, setCookies: set };
  }
  return { request, jar, setIp: (n) => { counter = n; } };
}
