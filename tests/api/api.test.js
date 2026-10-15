/*
 * API integration tests: real handlers, real PostgreSQL (with the production
 * migration), stubbed Supabase Auth and Resend over HTTP.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { startDatabase } from "../helpers/db.js";
import { startAuthStub, startResendStub } from "../helpers/stubs.js";
import { startApi, client } from "../helpers/app.js";
import { closePool } from "../../server/db.js";

let db, auth, resend, api;
let adminUser, staffUser;
const ORIGIN = "http://127.0.0.1"; // set as SITE_URL below

const valid = (over = {}) => ({
  name: "Asha Verma",
  company: "Verma Textiles",
  email: "Asha@Example.COM",
  phone: "098765 43210",
  service: "payroll",
  companySize: "51-200",
  city: "Gurugram",
  subject: "Payroll outsourcing for two states",
  message: "We run payroll for 120 people across Delhi and Haryana and want to outsource it.",
  consent: true,
  elapsedMs: 9000,
  source: { page: "/payroll-tds-labour-compliance", vertical: "payroll-tds-labour-compliance", referrer: "https://google.com", landing: "/?utm_source=google", utm: { utm_source: "google", utm_campaign: "payroll", evil: "x" } },
  ...over,
});

beforeAll(async () => {
  process.env.BH_SILENT_LOGS = process.env.BH_SHOW_LOGS ? "false" : "true";
  db = await startDatabase();
  auth = await startAuthStub();
  resend = await startResendStub();
  Object.assign(process.env, {
    DATABASE_URL: db.url,
    DATABASE_SSL: "disable",
    SITE_URL: ORIGIN,
    SUPABASE_URL: auth.url,
    SUPABASE_ANON_KEY: "test-anon-key",
    RESEND_API_KEY: "re_test_key",
    RESEND_API_BASE: resend.url,
    EMAIL_FROM: "360 Biz Health <leads@example.com>",
    LEAD_NOTIFICATION_TO: "sales@example.com",
    IP_HASH_SALT: "test-salt",
    CRON_SECRET: "cron-secret-value",
    ALLOW_INSECURE_COOKIES: "false",
  });
  api = await startApi();

  adminUser = auth.addUser("owner@example.com", "correct horse battery");
  staffUser = auth.addUser("staff@example.com", "staff password 123");
  auth.addUser("outsider@example.com", "outsider password");
  for (const u of [adminUser, staffUser]) await db.query("insert into auth.users (id, email) values ($1, $2)", [u.id, u.email]);
  await db.query("insert into admin_users (user_id, email, role) values ($1,$2,'admin'), ($3,$4,'staff')", [adminUser.id, adminUser.email, staffUser.id, staffUser.email]);
}, 180_000);

afterAll(async () => {
  await closePool();
  await api?.close();
  await auth?.close();
  await resend?.close();
  await db?.stop();
});

beforeEach(() => resend.setMode("ok"));

async function signIn(email, password, origin = ORIGIN) {
  const c = client(api.base, { origin });
  c.setIp(200 + Math.floor(Math.random() * 50));
  const r = await c.request("/api/v1/admin/session", { method: "POST", body: { email, password }, headers: { "X-BH-CSRF": "1" } });
  return { c, r };
}

describe("health", () => {
  it("reports ok with a working database and discloses nothing else", async () => {
    const r = await client(api.base).request("/api/v1/health");
    expect(r.status).toBe(200);
    expect(Object.keys(r.data).sort()).toEqual(["database", "ok", "status", "time"]);
    expect(r.data.database).toBe("ok");
  });
  it("unknown API routes return a JSON 404, not the SPA", async () => {
    const r = await client(api.base).request("/api/v1/nope");
    expect(r.status).toBe(404);
    expect(r.data.error.code).toBe("not_found");
  });
});

describe("POST /api/v1/enquiries", () => {
  it("stores a valid enquiry, normalises it and e-mails the business", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(1);
    const before = resend.sent.length;
    const r = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ submissionId: "11111111-1111-4111-8111-111111111111" }) });
    expect(r.status).toBe(201);
    expect(r.data).toEqual({ ok: true, reference: expect.stringMatching(/^BH-[A-Z2-9]{6}$/), duplicate: false });

    const { rows } = await db.query("select * from leads where reference = $1", [r.data.reference]);
    const lead = rows[0];
    expect(lead.email).toBe("Asha@example.com");
    expect(lead.phone).toBe("+919876543210");
    expect(lead.status).toBe("new");
    expect(lead.subject).toBe("Payroll outsourcing for two states");
    expect(resend.sent.at(-1).subject).toContain("Payroll outsourcing for two states");
    expect(lead.consent).toBe(true);
    expect(lead.utm).toEqual({ utm_source: "google", utm_campaign: "payroll" });
    expect(lead.ip_hash).toMatch(/^[0-9a-f]{32}$/);
    expect(lead.notification_status).toBe("sent");
    expect(resend.sent.length).toBe(before + 1);
    expect(resend.sent.at(-1).to).toEqual(["sales@example.com"]);
    expect(resend.sent.at(-1).reply_to).toBe("Asha@example.com");

    const audit = await db.query("select action from audit_log where lead_id = $1 order by id", [lead.id]);
    expect(audit.rows.map((a) => a.action)).toEqual(["lead_created", "notification_sent"]);
  });

  it("escapes HTML in the notification e-mail", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(2);
    await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "x1@example.com", company: "<script>alert(1)</script> Ltd", message: "Please call <b>me</b> about payroll for our team of 40." }) });
    const html = resend.sent.at(-1).html;
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("is idempotent for a repeated submissionId", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(3);
    const body = valid({ email: "repeat@example.com", submissionId: "22222222-2222-4222-8222-222222222222" });
    const a = await c.request("/api/v1/enquiries", { method: "POST", body });
    const b = await c.request("/api/v1/enquiries", { method: "POST", body });
    expect(a.status).toBe(201);
    expect(b.status).toBe(200);
    expect(b.data.duplicate).toBe(true);
    expect(b.data.reference).toBe(a.data.reference);
    const n = await db.query("select count(*)::int n from leads where lower(email) = 'repeat@example.com'");
    expect(n.rows[0].n).toBe(1);
  });

  it("does not store the same enquiry twice within 24 hours", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(4);
    const a = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "dupe@example.com" }) });
    const b = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "DUPE@example.com", submissionId: "33333333-3333-4333-8333-333333333333" }) });
    expect(a.status).toBe(201);
    expect(b.data.duplicate).toBe(true);
  });

  it("returns field errors and stores nothing for invalid input", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(5);
    const r = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "not-an-email", phone: "12", service: "website-development", message: "short", consent: false, name: "http://spam.example" }) });
    expect(r.status).toBe(422);
    expect(Object.keys(r.data.error.fields).sort()).toEqual(["consent", "email", "message", "name", "phone", "service"]);
    const n = await db.query("select count(*)::int n from leads where email = 'not-an-email'");
    expect(n.rows[0].n).toBe(0);
  });

  it("rejects bots: honeypot and implausibly fast submissions", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(6);
    const hp = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "bot1@example.com", bh_hp_field: "http://x" }) });
    expect(hp.status).toBe(400);
    const fast = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "bot2@example.com", elapsedMs: 300 }) });
    expect(fast.status).toBe(400);
    expect(fast.data.error.code).toBe("too_fast");
  });

  it("rejects malformed requests", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(7);
    expect((await c.request("/api/v1/enquiries", { method: "POST", raw: "name=x", headers: { "Content-Type": "application/x-www-form-urlencoded" } })).status).toBe(415);
    expect((await c.request("/api/v1/enquiries", { method: "POST", raw: "{bad json", headers: { "Content-Type": "application/json" } })).status).toBe(400);
    expect((await c.request("/api/v1/enquiries", { method: "POST", raw: JSON.stringify({ message: "x".repeat(40_000) }), headers: { "Content-Type": "application/json" } })).status).toBe(413);
    expect((await c.request("/api/v1/enquiries", { method: "GET" })).status).toBe(405);
  });

  it("rejects cross-site submissions", async () => {
    const c = client(api.base, { origin: "https://evil.example" });
    c.setIp(8);
    const r = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "x@evil.example" }) });
    expect(r.status).toBe(403);
    expect(r.data.error.code).toBe("forbidden_origin");
  });

  it("rate-limits repeated submissions from one address", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(9);
    const statuses = [];
    for (let i = 0; i < 7; i++) {
      const r = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: `rl${i}@example.com`, message: `Payroll outsourcing enquiry number ${i} for our company.` }) });
      statuses.push(r.status);
      if (r.status === 429) expect(Number(r.headers.get("retry-after"))).toBeGreaterThan(0);
    }
    expect(statuses.slice(0, 5).every((s) => s === 201)).toBe(true);
    expect(statuses.slice(5)).toEqual([429, 429]);
  });

  it("keeps the lead when the e-mail provider fails, and the cron retries it", async () => {
    resend.setMode("fail");
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(10);
    const r = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "mailfail@example.com" }) });
    expect(r.status).toBe(201);
    const row = (await db.query("select id, notification_status, notification_attempts, notification_error from leads where reference = $1", [r.data.reference])).rows[0];
    expect(row.notification_status).toBe("failed");
    expect(row.notification_attempts).toBe(1);
    expect(row.notification_error).toContain("500");

    // the cron only picks up leads older than a minute
    await db.query("update leads set created_at = now() - interval '5 minutes' where id = $1", [row.id]);
    resend.setMode("ok");
    const noAuth = await client(api.base).request("/api/v1/cron/retry-notifications");
    expect(noAuth.status).toBe(401);
    const cron = await client(api.base).request("/api/v1/cron/retry-notifications", { headers: { Authorization: "Bearer cron-secret-value" } });
    expect(cron.status).toBe(200);
    expect(cron.data.sent).toBeGreaterThanOrEqual(1);
    const after = (await db.query("select notification_status from leads where id = $1", [row.id])).rows[0];
    expect(after.notification_status).toBe("sent");
  });

  it("records not_configured when e-mail is not set up", async () => {
    const saved = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = "";
    try {
      const c = client(api.base, { origin: ORIGIN });
      c.setIp(11);
      const r = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "nomail@example.com" }) });
      expect(r.status).toBe(201);
      const row = (await db.query("select notification_status from leads where reference = $1", [r.data.reference])).rows[0];
      expect(row.notification_status).toBe("not_configured");
    } finally {
      process.env.RESEND_API_KEY = saved;
    }
  });

  it("fails honestly (503) when the database is not configured", async () => {
    const saved = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "";
    try {
      const c = client(api.base, { origin: ORIGIN });
      c.setIp(12);
      const r = await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "nodb@example.com" }) });
      expect(r.status).toBe(503);
      expect(r.data.ok).toBe(false);
    } finally {
      process.env.DATABASE_URL = saved;
    }
  });
});

describe("admin authentication", () => {
  it("blocks every protected endpoint without a session", async () => {
    const c = client(api.base, { origin: ORIGIN });
    const lead = (await db.query("select id from leads limit 1")).rows[0];
    for (const [m, p] of [["GET", "/api/v1/admin/session"], ["GET", "/api/v1/admin/leads"], ["GET", "/api/v1/admin/stats"], ["GET", `/api/v1/admin/leads/${lead.id}`], ["GET", "/api/v1/admin/leads/export"]]) {
      const r = await c.request(p, { method: m });
      expect(r.status, p).toBe(401);
      expect(JSON.stringify(r.data)).not.toContain("@example.com");
    }
    const patch = await c.request(`/api/v1/admin/leads/${lead.id}`, { method: "PATCH", body: { status: "lost" }, headers: { "X-BH-CSRF": "1" } });
    expect(patch.status).toBe(401);
  });

  it("rejects a wrong password and a non-admin account", async () => {
    const bad = await signIn("owner@example.com", "wrong password");
    expect(bad.r.status).toBe(401);
    const outsider = await signIn("outsider@example.com", "outsider password");
    expect(outsider.r.status).toBe(403);
    expect(outsider.c.jar.size).toBe(0);
  });

  it("requires the CSRF header and a same-site origin to sign in", async () => {
    const c = client(api.base, { origin: ORIGIN });
    const noHeader = await c.request("/api/v1/admin/session", { method: "POST", body: { email: "owner@example.com", password: "correct horse battery" } });
    expect(noHeader.status).toBe(403);
    const evil = await signIn("owner@example.com", "correct horse battery", "https://evil.example");
    expect(evil.r.status).toBe(403);
  });

  it("issues HttpOnly, Secure, SameSite=Strict cookies scoped to the admin API", async () => {
    const { r } = await signIn("owner@example.com", "correct horse battery");
    expect(r.status).toBe(200);
    expect(r.data.user).toEqual({ email: "owner@example.com", role: "admin" });
    expect(r.setCookies.length).toBe(2);
    for (const c of r.setCookies) {
      expect(c).toMatch(/HttpOnly/);
      expect(c).toMatch(/Secure/);
      expect(c).toMatch(/SameSite=Strict/);
      expect(c).toMatch(/Path=\/api\/v1\/admin/);
    }
    expect(JSON.stringify(r.data)).not.toMatch(/at_|rt_/); // tokens never in the body
  });

  it("refreshes an expired access token using the refresh cookie", async () => {
    const { c } = await signIn("owner@example.com", "correct horse battery");
    auth.expireAll();
    const r = await c.request("/api/v1/admin/session");
    expect(r.status).toBe(200);
    expect(r.setCookies.some((x) => x.startsWith("bh_admin_at="))).toBe(true);
  });

  it("signs out and clears cookies", async () => {
    const { c } = await signIn("owner@example.com", "correct horse battery");
    const out = await c.request("/api/v1/admin/session", { method: "DELETE", headers: { "X-BH-CSRF": "1" } });
    expect(out.status).toBe(200);
    expect(c.jar.size).toBe(0);
    expect((await c.request("/api/v1/admin/session")).status).toBe(401);
  });

  it("revoking admin_users access takes effect immediately", async () => {
    const tmp = auth.addUser("temp@example.com", "temp password 1");
    await db.query("insert into auth.users (id, email) values ($1,$2)", [tmp.id, tmp.email]);
    await db.query("insert into admin_users (user_id, email, role) values ($1,$2,'staff')", [tmp.id, tmp.email]);
    const { c, r } = await signIn("temp@example.com", "temp password 1");
    expect(r.status).toBe(200);
    await db.query("update admin_users set active = false where user_id = $1", [tmp.id]);
    expect((await c.request("/api/v1/admin/leads")).status).toBe(403);
  });
});

describe("admin lead management", () => {
  let admin, staff;
  beforeAll(async () => {
    admin = (await signIn("owner@example.com", "correct horse battery")).c;
    staff = (await signIn("staff@example.com", "staff password 123")).c;
  });

  it("lists leads with pagination, filters and stats", async () => {
    const all = await admin.request("/api/v1/admin/leads?pageSize=5");
    expect(all.status).toBe(200);
    expect(all.data.items.length).toBe(5);
    expect(all.data.total).toBeGreaterThan(5);
    expect(all.data.items[0]).not.toHaveProperty("ip_hash");
    expect(all.data.items[0]).not.toHaveProperty("notes");

    const page2 = await admin.request("/api/v1/admin/leads?pageSize=5&page=2");
    expect(page2.data.items[0].id).not.toBe(all.data.items[0].id);

    const svc = await admin.request("/api/v1/admin/leads?service=payroll&status=new");
    expect(svc.data.items.every((l) => l.service === "payroll" && l.status === "new")).toBe(true);

    const search = await admin.request("/api/v1/admin/leads?q=repeat%40example");
    expect(search.data.total).toBe(1);

    const today = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
    const dated = await admin.request(`/api/v1/admin/leads?from=${today}&to=${today}`);
    expect(dated.data.total).toBeGreaterThan(0);
    const future = await admin.request("/api/v1/admin/leads?from=2099-01-01");
    expect(future.data.total).toBe(0);

    const stats = await admin.request("/api/v1/admin/stats");
    expect(stats.data.stats.total).toBe(all.data.total);
    expect(stats.data.stats.byStatus.new).toBeGreaterThan(0);
  });

  it("treats search text literally (no SQL injection, wildcards escaped)", async () => {
    for (const q of ["' or 1=1 --", "%", "_", "\\", "'); drop table leads; --"]) {
      const r = await admin.request("/api/v1/admin/leads?q=" + encodeURIComponent(q));
      expect(r.status).toBe(200);
      expect(r.data.total).toBe(0);
    }
    const still = await db.query("select count(*)::int n from leads");
    expect(still.rows[0].n).toBeGreaterThan(0);
  });

  it("shows lead details, updates status and records an audit trail", async () => {
    const id = (await db.query("select id from leads where lower(email) = 'repeat@example.com'")).rows[0].id;
    const d = await admin.request(`/api/v1/admin/leads/${id}`);
    expect(d.status).toBe(200);
    expect(d.data.lead.notes).toEqual([]);

    const noCsrf = await admin.request(`/api/v1/admin/leads/${id}`, { method: "PATCH", body: { status: "contacted" } });
    expect(noCsrf.status).toBe(403);

    const bad = await admin.request(`/api/v1/admin/leads/${id}`, { method: "PATCH", body: { status: "deleted", nextFollowUp: "tomorrow" }, headers: { "X-BH-CSRF": "1" } });
    expect(bad.status).toBe(422);
    expect(Object.keys(bad.data.error.fields).sort()).toEqual(["nextFollowUp", "status"]);

    const ok = await staff.request(`/api/v1/admin/leads/${id}`, { method: "PATCH", body: { status: "contacted", assignedTo: "Priya", nextFollowUp: "2026-11-02" }, headers: { "X-BH-CSRF": "1" } });
    expect(ok.status).toBe(200);
    expect(ok.data.changed.sort()).toEqual(["assigned_to", "next_follow_up", "status"]);
    expect(ok.data.lead.status).toBe("contacted");
    expect(ok.data.lead.next_follow_up).toBe("2026-11-02");
    expect(ok.data.lead.last_contacted_at).toBeTruthy();
    const act = ok.data.lead.activity.find((a) => a.action === "lead_updated");
    expect(act.actor_email).toBe("staff@example.com");
    expect(act.details.status).toEqual({ from: "new", to: "contacted" });
  });

  it("adds private notes", async () => {
    const id = (await db.query("select id from leads where lower(email) = 'repeat@example.com'")).rows[0].id;
    const empty = await admin.request(`/api/v1/admin/leads/${id}/notes`, { method: "POST", body: { body: "   " }, headers: { "X-BH-CSRF": "1" } });
    expect(empty.status).toBe(422);
    const r = await admin.request(`/api/v1/admin/leads/${id}/notes`, { method: "POST", body: { body: "Called, sending proposal Friday." }, headers: { "X-BH-CSRF": "1" } });
    expect(r.status).toBe(201);
    const d = await admin.request(`/api/v1/admin/leads/${id}`);
    expect(d.data.lead.notes[0].body).toBe("Called, sending proposal Friday.");
    expect(d.data.lead.notes[0].author_email).toBe("owner@example.com");
  });

  it("returns 404 for unknown or malformed lead ids", async () => {
    expect((await admin.request("/api/v1/admin/leads/00000000-0000-4000-8000-000000000000")).status).toBe(404);
    expect((await admin.request("/api/v1/admin/leads/not-a-uuid")).status).toBe(404);
  });

  it("restricts CSV export and notification retry to the admin role", async () => {
    const id = (await db.query("select id from leads limit 1")).rows[0].id;
    expect((await staff.request("/api/v1/admin/leads/export")).status).toBe(403);
    expect((await staff.request(`/api/v1/admin/leads/${id}/notify`, { method: "POST", headers: { "X-BH-CSRF": "1" } })).status).toBe(403);
    const retry = await admin.request(`/api/v1/admin/leads/${id}/notify`, { method: "POST", headers: { "X-BH-CSRF": "1" } });
    expect(retry.status).toBe(200);
  });

  it("exports CSV safely (formula injection neutralised) and logs the export", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(40);
    await c.request("/api/v1/enquiries", { method: "POST", body: valid({ email: "formula@example.com", company: "=HYPERLINK(\"http://evil\")", message: "+cmd|' /C calc'!A0 please help with payroll compliance" }) });
    const r = await admin.request("/api/v1/admin/leads/export?q=formula%40example.com");
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toContain("text/csv");
    expect(r.headers.get("content-disposition")).toMatch(/attachment; filename="360bizhealth-leads-\d{4}-\d{2}-\d{2}\.csv"/);
    const lines = r.data.replace(/^﻿/, "").trim().split("\r\n");
    expect(lines.length).toBe(2);
    expect(lines[1]).toContain(`"'=HYPERLINK(""http://evil"")"`);
    expect(lines[1]).toContain(`"'+cmd|`);
    const logged = await db.query("select count(*)::int n from audit_log where action = 'leads_exported'");
    expect(logged.rows[0].n).toBeGreaterThan(0);
  });
});

describe("database security (Row Level Security)", () => {
  it("denies the Supabase anon and authenticated roles any access", async () => {
    for (const role of ["anon", "authenticated"]) {
      for (const sql of ["select * from public.leads", "select * from public.lead_notes", "select * from public.admin_users", "insert into public.leads (reference) values ('x')", "select public.rate_limit_hit('k', 60, 1)"]) {
        await expect(db.query(`set role ${role}; ${sql}`), `${role}: ${sql}`).rejects.toThrow(/permission denied/);
      }
    }
  });

  it("has RLS enabled on every table", async () => {
    const { rows } = await db.query("select relname, relrowsecurity from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r' and relname <> 'schema_migrations'");
    expect(rows.length).toBe(5);
    expect(rows.every((r) => r.relrowsecurity)).toBe(true);
  });

  it("enforces data constraints at the database level", async () => {
    await expect(db.query("update leads set status = 'deleted'")).rejects.toThrow(/check constraint/);
    await expect(db.query("update leads set consent = false")).rejects.toThrow(/check constraint/);
  });
});
