import pg from "pg";
export async function dbQuery(text, params) {
  const c = new pg.Client({ connectionString: process.env.E2E_DATABASE_URL });
  await c.connect();
  try { return await c.query(text, params); } finally { await c.end(); }
}
/* Collects console errors/warnings and uncaught exceptions for a page. */
export function watchConsole(page) {
  const problems = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) problems.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push("pageerror: " + e.message));
  return problems;
}
export const ADMIN = { email: "owner@example.com", password: "e2e-admin-password" };
export const STAFF = { email: "staff@example.com", password: "e2e-staff-password" };
