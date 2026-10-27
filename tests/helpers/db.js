/*
 * Starts a throwaway PostgreSQL 17 server (embedded-postgres), adds the small part
 * of Supabase the migration relies on (auth.users, anon/authenticated roles), and
 * applies supabase/migrations/*.sql exactly as production would.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import EmbeddedPostgres from "embedded-postgres";
import pg from "pg";

async function freePort() {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.listen(0, () => { const p = s.address().port; s.close(() => resolve(p)); });
  });
}

export const SUPABASE_SHIM = `
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key, email text unique);
grant usage on schema public to anon, authenticated;
-- Supabase grants broad default privileges to the API roles; emulate that so the
-- migration's REVOKE statements are actually exercised.
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;
`;

export async function startDatabase() {
  const port = await freePort();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bh-pg-"));
  fs.chmodSync(dir, 0o777);
  const dataDir = path.join(dir, "data");
  const server = new EmbeddedPostgres({ databaseDir: dataDir, user: "postgres", password: "postgres", port, persistent: false, onLog: () => {}, onError: () => {} });
  await server.initialise();
  await server.start();
  await server.createDatabase("bh_test");
  const url = `postgres://postgres:postgres@127.0.0.1:${port}/bh_test`;
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  await client.query(SUPABASE_SHIM);
  const migDir = path.resolve("supabase/migrations");
  for (const f of fs.readdirSync(migDir).filter((x) => x.endsWith(".sql")).sort()) {
    await client.query(fs.readFileSync(path.join(migDir, f), "utf8"));
  }
  await client.end();
  return {
    url,
    async query(text, params) {
      const c = new pg.Client({ connectionString: url });
      await c.connect();
      try { return await c.query(text, params); } finally { await c.end(); }
    },
    async stop() {
      await server.stop();
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}
