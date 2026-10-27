import pg from "pg";
import { config } from "./config.js";
import { HttpError } from "./http.js";

// Return DATE columns as "YYYY-MM-DD" strings instead of local-time Date objects.
pg.types.setTypeParser(1082, (v) => v);

/*
 * One small pool per serverless instance. On Supabase, use the transaction
 * pooler connection string (port 6543) so many short-lived functions share a
 * few real connections. All queries are parameterised ($1, $2 ...).
 */
let pool = null;
let poolUrl = null;

function sslOptions() {
  const mode = config.databaseSsl;
  if (mode === "disable") return false;
  if (mode === "verify") return { rejectUnauthorized: true, ca: config.databaseCaCert || undefined };
  return { rejectUnauthorized: false };
}

export function getPool() {
  const url = config.databaseUrl;
  if (!url) throw new HttpError(503, "database_not_configured", "The enquiry service is not configured yet. Please email us instead.");
  if (pool && poolUrl === url) return pool;
  if (pool) pool.end().catch(() => {});
  pool = new pg.Pool({
    connectionString: url,
    ssl: sslOptions(),
    max: Number(process.env.DATABASE_POOL_MAX || 3),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
    statement_timeout: 10_000,
    application_name: "360bizhealth-api",
  });
  pool.on("error", () => { /* idle client errors are retried on next checkout */ });
  poolUrl = url;
  return pool;
}

export async function query(text, params = []) {
  return getPool().query(text, params);
}

export async function tx(fn) {
  const client = await getPool().connect();
  try {
    await client.query("begin");
    const out = await fn(client);
    await client.query("commit");
    return out;
  } catch (err) {
    await client.query("rollback").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function closePool() {
  if (pool) await pool.end().catch(() => {});
  pool = null;
  poolUrl = null;
}
