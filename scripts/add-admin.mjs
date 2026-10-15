#!/usr/bin/env node
/*
 * Grants dashboard access to an existing Supabase Auth user.
 *   npm run admin:add -- person@company.com admin     (role: admin | staff)
 *   npm run admin:add -- person@company.com --revoke
 * Create the user first in Supabase → Authentication → Users → "Add user"
 * (with a strong password, "Auto confirm user" ticked). There is deliberately no
 * public sign-up route in the application.
 */
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

loadEnv();
const [email, roleArg] = process.argv.slice(2);
if (!email) {
  console.error("Usage: npm run admin:add -- <email> [admin|staff|--revoke]");
  process.exit(1);
}
const url = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
if (!url) { console.error("Set DATABASE_URL first."); process.exit(1); }
const ssl = process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: url, ssl });
await client.connect();
try {
  const u = await client.query("select id, email from auth.users where lower(email) = lower($1)", [email]);
  if (!u.rows[0]) {
    console.error(`No Supabase Auth user with email ${email}. Create the user in Supabase → Authentication → Users first.`);
    process.exitCode = 1;
  } else if (roleArg === "--revoke") {
    await client.query("update public.admin_users set active = false where user_id = $1", [u.rows[0].id]);
    console.log(`Access revoked for ${u.rows[0].email}.`);
  } else {
    const role = roleArg === "staff" ? "staff" : "admin";
    await client.query(
      `insert into public.admin_users (user_id, email, role, active) values ($1, $2, $3, true)
       on conflict (user_id) do update set email = excluded.email, role = excluded.role, active = true`,
      [u.rows[0].id, u.rows[0].email, role]
    );
    console.log(`${u.rows[0].email} can now sign in to /admin as ${role}.`);
  }
} finally {
  await client.end();
}
