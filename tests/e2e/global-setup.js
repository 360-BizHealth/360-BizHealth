import fs from "node:fs";
import { spawn } from "node:child_process";
import { startDatabase } from "../helpers/db.js";
import { startAuthStub, startResendStub } from "../helpers/stubs.js";

export const ADMIN = { email: "owner@example.com", password: "e2e-admin-password" };
export const STAFF = { email: "staff@example.com", password: "e2e-staff-password" };

export default async function globalSetup() {
  if (!fs.existsSync("dist/index.html")) throw new Error("Run `npm run build` before the end-to-end tests.");
  const db = await startDatabase();
  const auth = await startAuthStub();
  const resend = await startResendStub();
  const admin = auth.addUser(ADMIN.email, ADMIN.password);
  const staff = auth.addUser(STAFF.email, STAFF.password);
  for (const u of [admin, staff]) await db.query("insert into auth.users (id, email) values ($1,$2)", [u.id, u.email]);
  await db.query("insert into admin_users (user_id, email, role) values ($1,$2,'admin'), ($3,$4,'staff')", [admin.id, admin.email, staff.id, staff.email]);

  const env = {
    ...process.env,
    PORT: "4317",
    DATABASE_URL: db.url,
    DATABASE_SSL: "disable",
    SITE_URL: "http://127.0.0.1:4317",
    SUPABASE_URL: auth.url,
    SUPABASE_ANON_KEY: "test-anon-key",
    RESEND_API_KEY: "re_test_key",
    RESEND_API_BASE: resend.url,
    EMAIL_FROM: "Leads <leads@example.com>",
    LEAD_NOTIFICATION_TO: "sales@example.com",
    IP_HASH_SALT: "e2e",
    ALLOW_INSECURE_COOKIES: "true",
    BH_SILENT_LOGS: "true",
  };
  const server = spawn(process.execPath, ["scripts/serve.mjs"], { env, stdio: ["ignore", "pipe", "inherit"] });
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("serve.mjs did not start")), 15000);
    server.stdout.on("data", (d) => { if (String(d).includes("http://localhost")) { clearTimeout(t); resolve(); } });
  });
  process.env.E2E_DATABASE_URL = db.url;
  process.env.E2E_RESEND_URL = resend.url;

  return async () => {
    server.kill();
    await auth.close();
    await resend.close();
    await db.stop();
  };
}
