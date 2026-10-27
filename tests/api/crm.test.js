/*
 * CRM + blog CMS integration tests: real handlers, real PostgreSQL with every
 * migration (including the blog seed), stubbed Supabase Auth and Resend.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startDatabase } from "../helpers/db.js";
import { startAuthStub, startResendStub } from "../helpers/stubs.js";
import { startApi, client } from "../helpers/app.js";
import { closePool } from "../../server/db.js";

let db, auth, resend, api;
let admin, staff;
const ORIGIN = "http://127.0.0.1";
const W = { "X-BH-CSRF": "1" };
// 1×1 PNG
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");

const enquiry = (over = {}) => ({
  name: "Rohan Kapoor", company: "Kapoor Logistics", email: `rohan.${Math.random().toString(36).slice(2)}@example.com`, phone: "98110 44556",
  service: "corporate-retreat", subject: "Corporate retreat: Corporate offsite, 51-100 participants",
  message: "Corporate retreat enquiry\nParticipants: 51-100\nAnnual planning sessions on two mornings.",
  consent: true, elapsedMs: 9000, source: { page: "/corporate-retreats-workations", vertical: "corporate-retreats-workations" },
  retreat: { package: "corporate-offsite", participants: "51-100", duration: "3-4 days", retreatType: "Corporate offsite", destination: "Hills near Delhi", travelDates: "Mid-February" },
  ...over,
});

const post = (over = {}) => ({
  title: "How to plan a corporate offsite", excerpt: "A practical checklist for HR teams planning an offsite away from the office.",
  content: "## Start with the objective\n\nDecide what the offsite must achieve before choosing a venue. " + "More detail. ".repeat(10),
  category: "Corporate retreats", ...over,
});

async function signIn(email, password) {
  const c = client(api.base, { origin: ORIGIN });
  c.setIp(100 + Math.floor(Math.random() * 100));
  const r = await c.request("/api/v1/admin/session", { method: "POST", body: { email, password }, headers: W });
  expect(r.status).toBe(200);
  return c;
}

beforeAll(async () => {
  process.env.BH_SILENT_LOGS = "true";
  db = await startDatabase();
  auth = await startAuthStub();
  resend = await startResendStub();
  Object.assign(process.env, {
    DATABASE_URL: db.url, DATABASE_SSL: "disable", SITE_URL: ORIGIN, SUPABASE_URL: auth.url, SUPABASE_ANON_KEY: "test-anon-key",
    RESEND_API_KEY: "re_test_key", RESEND_API_BASE: resend.url, EMAIL_FROM: "360 Biz Health <leads@example.com>",
    LEAD_NOTIFICATION_TO: "sales@example.com", IP_HASH_SALT: "test-salt", ALLOW_INSECURE_COOKIES: "false",
  });
  api = await startApi();
  const a = auth.addUser("owner@example.com", "admin password 1");
  const s = auth.addUser("staff@example.com", "staff password 1");
  for (const u of [a, s]) await db.query("insert into auth.users (id, email) values ($1, $2)", [u.id, u.email]);
  await db.query("insert into admin_users (user_id, email, role) values ($1,$2,'admin'), ($3,$4,'staff')", [a.id, a.email, s.id, s.email]);
  admin = await signIn("owner@example.com", "admin password 1");
  staff = await signIn("staff@example.com", "staff password 1");
}, 180_000);

afterAll(async () => {
  await closePool();
  await api?.close();
  await auth?.close();
  await resend?.close();
  await db?.stop();
});

describe("retreat enquiries are stored as structured leads", () => {
  it("stores the selected package and retreat details, and they appear in the admin lead list and detail", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(11);
    const r = await c.request("/api/v1/enquiries", { method: "POST", body: enquiry() });
    expect(r.status).toBe(201);
    expect(Object.keys(r.data).sort()).toEqual(["duplicate", "ok", "reference"]); // nothing private returned

    const row = (await db.query("select * from leads where reference = $1", [r.data.reference])).rows[0];
    expect(row.retreat_package).toBe("corporate-offsite");
    expect(row.details).toEqual({ participants: "51-100", duration: "3-4 days", retreatType: "Corporate offsite", destination: "Hills near Delhi", travelDates: "Mid-February" });

    const list = await admin.request("/api/v1/admin/leads?package=corporate-offsite");
    expect(list.data.items.map((l) => l.reference)).toContain(r.data.reference);
    const detail = await admin.request(`/api/v1/admin/leads/${row.id}`);
    expect(detail.data.lead.retreat_package).toBe("corporate-offsite");
    expect(detail.data.lead.details.participants).toBe("51-100");
    const csv = await admin.request("/api/v1/admin/leads/export?package=corporate-offsite");
    expect(csv.data).toContain('"Retreat package"');
    expect(csv.data).toContain('"corporate-offsite"');
    expect(resend.sent.at(-1).html).toContain("Corporate Offsite");
  });

  it("rejects unknown packages and retreat details sent with another service", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(12);
    const bad = await c.request("/api/v1/enquiries", { method: "POST", body: enquiry({ retreat: { ...enquiry().retreat, package: "platinum" } }) });
    expect(bad.status).toBe(422);
    expect(bad.data.error.fields.package).toBeTruthy();
    const wrong = await c.request("/api/v1/enquiries", { method: "POST", body: enquiry({ service: "payroll" }) });
    expect(wrong.status).toBe(422);
    expect(wrong.data.error.fields.service).toBeTruthy();
  });

  it("still accepts enquiries without retreat data (contact form) and leaves the new columns empty", async () => {
    const c = client(api.base, { origin: ORIGIN });
    c.setIp(13);
    const { retreat, ...plain } = enquiry({ service: "hrms", message: "We need an HRMS for 140 staff across two cities." });
    void retreat;
    const r = await c.request("/api/v1/enquiries", { method: "POST", body: plain });
    expect(r.status).toBe(201);
    const row = (await db.query("select retreat_package, details from leads where reference = $1", [r.data.reference])).rows[0];
    expect(row).toEqual({ retreat_package: null, details: {} });
  });

  it("filters follow-ups that are due", async () => {
    const { rows } = await db.query("select id from leads order by created_at limit 1");
    await db.query("update leads set next_follow_up = current_date - 1, status = 'contacted' where id = $1", [rows[0].id]);
    const due = await admin.request("/api/v1/admin/leads?due=1");
    expect(due.data.items.map((l) => l.id)).toEqual([rows[0].id]);
  });
});

describe("dashboard overview", () => {
  it("requires a session and returns live figures", async () => {
    expect((await client(api.base).request("/api/v1/admin/overview")).status).toBe(401);
    const r = await staff.request("/api/v1/admin/overview");
    expect(r.status).toBe(200);
    const total = (await db.query("select count(*)::int n from leads")).rows[0].n;
    expect(r.data.stats.total).toBe(total);
    expect(r.data.stats.published_posts).toBe(3); // the seeded articles
    expect(r.data.trend).toHaveLength(30);
    expect(r.data.trend.reduce((a, d) => a + d.n, 0)).toBe(total);
    expect(r.data.packages["corporate-offsite"]).toBe(1);
    expect(r.data.recentLeads.length).toBeGreaterThan(0);
  });

  it("lists users for administrators only", async () => {
    expect((await staff.request("/api/v1/admin/users")).status).toBe(403);
    const r = await admin.request("/api/v1/admin/users");
    expect(r.data.users.map((u) => u.email).sort()).toEqual(["owner@example.com", "staff@example.com"]);
    expect(Object.keys(r.data.users[0]).sort()).toEqual(["active", "created_at", "email", "last_sign_in", "role"]);
  });
});

describe("blog CMS", () => {
  let id;

  it("migrates the three original articles as published posts with their URLs", async () => {
    const r = await client(api.base).request("/api/v1/posts");
    expect(r.status).toBe(200);
    expect(r.data.posts.map((p) => p.slug).sort()).toEqual(["full-final-settlement-india-2026", "modern-leave-policy-india-2026", "posh-act-2013-employer-guide"]);
    const one = await client(api.base).request("/api/v1/posts/posh-act-2013-employer-guide");
    expect(one.data.post.headings).toHaveLength(12);
    expect(one.data.post.faqs.length).toBeGreaterThanOrEqual(3);
    expect(one.data.post.html).toContain('<h2 id="what-is-the-posh-act-2013">');
    expect(one.data.related).toHaveLength(2);
  });

  it("blocks every CMS endpoint without a session and requires CSRF for writes", async () => {
    const anon = client(api.base, { origin: ORIGIN });
    for (const [p, m] of [["/api/v1/admin/posts", "GET"], ["/api/v1/admin/posts", "POST"], ["/api/v1/admin/media", "POST"]]) {
      expect((await anon.request(p, { method: m, body: m === "POST" ? {} : undefined, headers: W })).status).toBe(401);
    }
    const noCsrf = await admin.request("/api/v1/admin/posts", { method: "POST", body: { post: post() } });
    expect(noCsrf.status).toBe(403);
    const cross = client(api.base, { origin: "https://evil.example" });
    for (const [k, v] of admin.jar) cross.jar.set(k, v);
    expect((await cross.request("/api/v1/admin/posts", { method: "POST", body: { post: post() }, headers: W })).status).toBe(403);
  });

  it("lets staff create a draft that is not public", async () => {
    const r = await staff.request("/api/v1/admin/posts", { method: "POST", body: { post: post() }, headers: W });
    expect(r.status).toBe(201);
    expect(r.data.post.status).toBe("draft");
    expect(r.data.post.slug).toBe("how-to-plan-a-corporate-offsite");
    id = r.data.post.id;
    expect((await client(api.base).request("/api/v1/posts/how-to-plan-a-corporate-offsite")).status).toBe(404);
    expect((await client(api.base).request("/api/v1/posts")).data.posts.some((p) => p.slug === "how-to-plan-a-corporate-offsite")).toBe(false);
  });

  it("validates input and keeps slugs unique", async () => {
    const bad = await admin.request("/api/v1/admin/posts", { method: "POST", body: { post: post({ title: "", slug: "Not A Slug", imageUrl: "https://evil.example/a.png" }) }, headers: W });
    expect(bad.status).toBe(422);
    expect(Object.keys(bad.data.error.fields)).toEqual(expect.arrayContaining(["title", "slug", "imageUrl"]));
    const dup = await admin.request("/api/v1/admin/posts", { method: "POST", body: { post: post() }, headers: W });
    expect(dup.status).toBe(409);
    expect(dup.data.error.fields.slug).toMatch(/already uses/);
  });

  it("only administrators publish; staff cannot", async () => {
    const s = await staff.request(`/api/v1/admin/posts/${id}/status`, { method: "POST", body: { status: "published" }, headers: W });
    expect(s.status).toBe(403);
    const s2 = await staff.request("/api/v1/admin/posts", { method: "POST", body: { post: post({ slug: "staff-try" }), publish: true }, headers: W });
    expect(s2.status).toBe(403);
    const a = await admin.request(`/api/v1/admin/posts/${id}/status`, { method: "POST", body: { status: "published" }, headers: W });
    expect(a.status).toBe(200);
    expect(a.data.post.status).toBe("published");
    const pub = await client(api.base).request("/api/v1/posts/how-to-plan-a-corporate-offsite");
    expect(pub.status).toBe(200);
    expect(pub.data.post.html).toContain("Start with the objective");
    expect(pub.data.post).not.toHaveProperty("content_md");
    expect(pub.data.post).not.toHaveProperty("updated_by_email");
  });

  it("sanitises content on save and lets admins edit a live post (staff cannot)", async () => {
    const cur = (await admin.request(`/api/v1/admin/posts/${id}`)).data.post;
    const evil = post({ content: "## Safe heading\n\n<script>alert(1)</script> <img src=x onerror=alert(1)> [x](javascript:alert(1)) " + "words ".repeat(20) });
    const staffEdit = await staff.request(`/api/v1/admin/posts/${id}`, { method: "PUT", body: { post: evil, expectedUpdatedAt: cur.updated_at }, headers: W });
    expect(staffEdit.status).toBe(403);
    const r = await admin.request(`/api/v1/admin/posts/${id}`, { method: "PUT", body: { post: evil, expectedUpdatedAt: cur.updated_at }, headers: W });
    expect(r.status).toBe(200);
    // raw HTML is escaped to text and the javascript: link is never turned into an anchor
    expect(r.data.post.content_html).not.toMatch(/<script|<img src=x|href="javascript:/i);
    expect(r.data.post.content_html).toContain("&lt;script&gt;");
    expect(r.data.post.content_html).toContain('<h2 id="safe-heading">');
    const pub = await client(api.base).request("/api/v1/posts/how-to-plan-a-corporate-offsite");
    expect(pub.data.post.headings).toEqual([{ id: "safe-heading", text: "Safe heading" }]);
    // a save based on the old version is refused instead of overwriting
    const stale = await admin.request(`/api/v1/admin/posts/${id}`, { method: "PUT", body: { post: post(), expectedUpdatedAt: cur.updated_at }, headers: W });
    expect(stale.status).toBe(409);
    expect(stale.data.error.code).toBe("edit_conflict");
  });

  it("lists posts with search, status counts and categories", async () => {
    const r = await admin.request("/api/v1/admin/posts?q=offsite");
    expect(r.data.items.map((p) => p.slug)).toEqual(["how-to-plan-a-corporate-offsite"]);
    const all = await admin.request("/api/v1/admin/posts?status=published");
    expect(all.data.total).toBe(4);
    expect(all.data.counts.published).toBe(4);
    expect(all.data.categories).toContain("Corporate retreats");
  });

  it("includes published posts in the sitemap", async () => {
    const r = await client(api.base).request("/api/v1/sitemap");
    expect(r.status).toBe(200);
    expect(r.data).toContain("/blog/how-to-plan-a-corporate-offsite</loc>");
    expect(r.data).toContain("/blog/posh-act-2013-employer-guide</loc>");
  });

  it("unpublishing removes public access; deleting removes the post and logs it", async () => {
    expect((await admin.request(`/api/v1/admin/posts/${id}/status`, { method: "POST", body: { status: "draft" }, headers: W })).status).toBe(200);
    expect((await client(api.base).request("/api/v1/posts/how-to-plan-a-corporate-offsite")).status).toBe(404);
    expect((await client(api.base).request("/api/v1/sitemap")).data).not.toContain("how-to-plan-a-corporate-offsite");
    expect((await staff.request(`/api/v1/admin/posts/${id}`, { method: "DELETE", headers: W })).status).toBe(403);
    expect((await admin.request(`/api/v1/admin/posts/${id}`, { method: "DELETE", headers: W })).status).toBe(200);
    expect((await admin.request(`/api/v1/admin/posts/${id}`)).status).toBe(404);
    const actions = (await db.query("select action from audit_log where details->>'post_id' = $1 order by id", [id])).rows.map((r) => r.action);
    expect(actions).toEqual(["blog_post_created", "blog_post_published", "blog_post_updated", "blog_post_unpublished", "blog_post_deleted"]);
  });
});

describe("image uploads", () => {
  const up = (c, body, type = "image/png", headers = {}) => c.request("/api/v1/admin/media", { method: "POST", raw: body, headers: { ...W, "Content-Type": type, "X-File-Name": "a.png", ...headers } });

  it("stores a real image and serves it same-origin with long caching", async () => {
    const r = await up(staff, PNG);
    expect(r.status).toBe(201);
    expect(r.data.media.url).toMatch(/^\/api\/v1\/media\/[0-9a-f-]{36}$/);
    const again = await up(staff, PNG);
    expect(again.data.media.url).toBe(r.data.media.url); // same bytes are not stored twice
    const res = await fetch(api.base + r.data.media.url);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
    expect(res.headers.get("cache-control")).toContain("immutable");
    expect(Buffer.from(await res.arrayBuffer()).equals(PNG)).toBe(true);
    // the uploaded image can be used as a featured image
    const p = await staff.request("/api/v1/admin/posts", { method: "POST", body: { post: post({ slug: "with-image", imageUrl: r.data.media.url, imageAlt: "A test image" }) }, headers: W });
    expect(p.status).toBe(201);
  });

  it("rejects files that are not images, whatever they claim to be, and oversized files", async () => {
    const fake = await up(staff, Buffer.from("<svg onload=alert(1)>not an image</svg>"), "image/png");
    expect(fake.status).toBe(415);
    const svg = await up(staff, Buffer.from("<svg/>"), "image/svg+xml");
    expect(svg.status).toBe(415);
    const big = Buffer.concat([PNG, Buffer.alloc(2 * 1024 * 1024)]);
    expect((await up(staff, big)).status).toBe(413);
    expect((await up(client(api.base, { origin: ORIGIN }), PNG)).status).toBe(401);
  });

  it("returns 404 for unknown media ids", async () => {
    expect((await fetch(api.base + "/api/v1/media/00000000-0000-4000-8000-000000000000")).status).toBe(404);
    expect((await fetch(api.base + "/api/v1/media/not-a-uuid")).status).toBe(404);
  });
});

describe("database security for the new tables", () => {
  it("denies the Supabase anon and authenticated roles any access to posts and media", async () => {
    for (const role of ["anon", "authenticated"]) {
      for (const t of ["blog_posts", "blog_media"]) {
        const r = await db.query(`select has_table_privilege('${role}', 'public.${t}', 'select') as s, has_table_privilege('${role}', 'public.${t}', 'insert') as i`);
        expect(r.rows[0]).toEqual({ s: false, i: false });
      }
    }
    const rls = await db.query("select relname, relrowsecurity from pg_class where relname in ('blog_posts','blog_media') order by relname");
    expect(rls.rows.every((r) => r.relrowsecurity)).toBe(true);
  });
});
