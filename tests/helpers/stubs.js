/*
 * In-process stand-ins for the two external services, so the real HTTP code paths
 * run in tests: a minimal Supabase Auth (GoTrue) and the Resend e-mail API.
 */
import http from "node:http";
import crypto from "node:crypto";

function listen(handler) {
  return new Promise((resolve) => {
    const s = http.createServer(handler);
    s.listen(0, "127.0.0.1", () => resolve(s));
  });
}
const readBody = (req) => new Promise((r) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => r(d)); });
const json = (res, status, body) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };

export async function startAuthStub() {
  const users = new Map(); // email -> { id, email, password }
  const access = new Map(); // token -> { userId, expired }
  const refresh = new Map(); // token -> userId
  const calls = [];
  const issue = (u) => {
    const at = "at_" + crypto.randomBytes(12).toString("hex");
    const rt = "rt_" + crypto.randomBytes(12).toString("hex");
    access.set(at, { userId: u.id, expired: false });
    refresh.set(rt, u.id);
    return { access_token: at, refresh_token: rt, expires_in: 3600, token_type: "bearer", user: { id: u.id, email: u.email } };
  };
  const server = await listen(async (req, res) => {
    const url = new URL(req.url, "http://x");
    calls.push(url.pathname + url.search);
    if (req.headers.apikey !== "test-anon-key") return json(res, 401, { message: "no apikey" });
    const body = req.method === "POST" ? JSON.parse((await readBody(req)) || "{}") : {};
    if (url.pathname === "/auth/v1/token" && url.searchParams.get("grant_type") === "password") {
      const u = [...users.values()].find((x) => x.email === body.email);
      if (!u || u.password !== body.password) return json(res, 400, { error: "invalid_grant", error_description: "Invalid login credentials" });
      return json(res, 200, issue(u));
    }
    if (url.pathname === "/auth/v1/token" && url.searchParams.get("grant_type") === "refresh_token") {
      const id = refresh.get(body.refresh_token);
      if (!id) return json(res, 400, { error: "invalid_grant" });
      refresh.delete(body.refresh_token); // rotation
      return json(res, 200, issue([...users.values()].find((x) => x.id === id)));
    }
    const token = String(req.headers.authorization || "").replace(/^Bearer /, "");
    if (url.pathname === "/auth/v1/user") {
      const a = access.get(token);
      if (!a || a.expired) return json(res, 401, { message: "invalid JWT" });
      const u = [...users.values()].find((x) => x.id === a.userId);
      return json(res, 200, { id: u.id, email: u.email });
    }
    if (url.pathname === "/auth/v1/logout") { access.delete(token); res.writeHead(204); return res.end(); }
    json(res, 404, {});
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    calls,
    addUser(email, password) { const u = { id: crypto.randomUUID(), email, password }; users.set(email, u); return u; },
    expireAll() { for (const v of access.values()) v.expired = true; },
    close: () => new Promise((r) => server.close(r)),
  };
}

export async function startResendStub() {
  const sent = [];
  let mode = "ok";
  const server = await listen(async (req, res) => {
    const body = JSON.parse((await readBody(req)) || "{}");
    if (req.headers.authorization !== "Bearer re_test_key") return json(res, 401, { name: "invalid_api_key", message: "bad key" });
    if (mode === "fail") return json(res, 500, { name: "application_error", message: "Simulated outage" });
    sent.push(body);
    json(res, 200, { id: crypto.randomUUID() });
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    sent,
    setMode(m) { mode = m; },
    close: () => new Promise((r) => server.close(r)),
  };
}
