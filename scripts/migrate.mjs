#!/usr/bin/env node
/*
 * Applies supabase/migrations/*.sql in filename order and records each one in
 * public.schema_migrations so it is applied only once.
 *   npm run db:migrate            (uses DATABASE_URL from the environment or .env)
 * If you manage the database with the Supabase CLI (`supabase db push`), use that
 * instead of this script — not both.
 */
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { loadEnv } from "./load-env.mjs";

loadEnv();
const url = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL (or MIGRATION_DATABASE_URL) first. Use the Supabase *session* or direct connection string for migrations.");
  process.exit(1);
}
const ssl = process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: false };
const dir = path.resolve("supabase/migrations");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

const client = new pg.Client({ connectionString: url, ssl });
await client.connect();
try {
  await client.query("create table if not exists public.schema_migrations (version text primary key, applied_at timestamptz not null default now())");
  await client.query("alter table public.schema_migrations enable row level security");
  const done = new Set((await client.query("select version from public.schema_migrations")).rows.map((r) => r.version));
  for (const f of files) {
    if (done.has(f)) { console.log(`= ${f} (already applied)`); continue; }
    const sql = fs.readFileSync(path.join(dir, f), "utf8");
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into public.schema_migrations (version) values ($1)", [f]);
      await client.query("commit");
      console.log(`+ ${f}`);
    } catch (err) {
      await client.query("rollback");
      console.error(`! ${f} failed: ${err.message}`);
      process.exitCode = 1;
      break;
    }
  }
} finally {
  await client.end();
}
