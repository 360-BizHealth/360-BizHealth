#!/usr/bin/env node
/*
 * Fails if anything secret-looking reaches the browser bundle in dist/:
 * server-only env var names, Postgres URLs, JWTs, Resend keys, private keys,
 * or values of the server-only variables currently set in the environment.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "./load-env.mjs";

loadEnv();
const SERVER_ONLY = ["DATABASE_URL", "MIGRATION_DATABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY", "IP_HASH_SALT", "CRON_SECRET", "TURNSTILE_SECRET_KEY", "DATABASE_CA_CERT"];
const PATTERNS = [
  [/postgres(ql)?:\/\/[^\s"']+/i, "PostgreSQL connection string"],
  [/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, "JWT"],
  [/\bre_[A-Za-z0-9]{16,}/, "Resend API key"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"],
  [/service_role/i, "Supabase service_role reference"],
  [/\bsb_secret_[A-Za-z0-9_-]+/, "Supabase secret key"],
];

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.(js|html|css|json|txt|xml|webmanifest)$/.test(e.name)) files.push(f);
  }
})(path.resolve("dist"));

const problems = [];
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  for (const name of SERVER_ONLY) {
    if (text.includes(name)) problems.push(`${f}: mentions server-only variable ${name}`);
    const v = process.env[name];
    if (v && v.length >= 8 && text.includes(v)) problems.push(`${f}: contains the VALUE of ${name}`);
  }
  for (const [re, label] of PATTERNS) if (re.test(text)) problems.push(`${f}: looks like it contains a ${label}`);
}

if (problems.length) {
  console.error("Bundle secret check FAILED:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`Bundle secret check passed (${files.length} files scanned).`);
