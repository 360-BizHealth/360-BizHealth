/*
 * Server-only configuration. Read from process.env at call time so tests and the
 * local dev server can set variables after import. None of these values are ever
 * sent to the browser; nothing here uses the VITE_ prefix.
 */
const env = (k, d = "") => {
  const v = process.env[k];
  return v === undefined || v === "" ? d : v;
};

export const config = {
  get siteUrl() { return env("SITE_URL", "https://www.360bizhealth.com").replace(/\/+$/, ""); },
  /* Extra origins allowed to POST (comma-separated), e.g. a Vercel preview URL. */
  get extraOrigins() { return env("ALLOWED_ORIGINS").split(",").map((s) => s.trim().replace(/\/+$/, "")).filter(Boolean); },
  get isProduction() { return env("VERCEL_ENV") === "production" || env("NODE_ENV") === "production"; },

  get databaseUrl() { return env("DATABASE_URL"); },
  /* require (default): TLS without CA pinning · verify: TLS + CA from DATABASE_CA_CERT · disable: local only */
  get databaseSsl() { return env("DATABASE_SSL", "require"); },
  get databaseCaCert() { return env("DATABASE_CA_CERT").replace(/\\n/g, "\n"); },

  get supabaseUrl() { return env("SUPABASE_URL").replace(/\/+$/, ""); },
  get supabaseAnonKey() { return env("SUPABASE_ANON_KEY"); },
  get supabaseServiceRoleKey() { return env("SUPABASE_SERVICE_ROLE_KEY"); },

  get resendApiKey() { return env("RESEND_API_KEY"); },
  get emailFrom() { return env("EMAIL_FROM"); },
  get notifyTo() { return env("LEAD_NOTIFICATION_TO").split(",").map((s) => s.trim()).filter(Boolean); },
  get resendBaseUrl() { return env("RESEND_API_BASE", "https://api.resend.com").replace(/\/+$/, ""); },

  get ipHashSalt() { return env("IP_HASH_SALT"); },
  get cronSecret() { return env("CRON_SECRET"); },
  get turnstileSecret() { return env("TURNSTILE_SECRET_KEY"); },
  /* Only for plain-http local development. Never set in production. */
  get insecureCookies() { return env("ALLOW_INSECURE_COOKIES") === "true" && !this.isProduction; },
};

export function emailConfigured() {
  return Boolean(config.resendApiKey && config.emailFrom && config.notifyTo.length);
}
export function authConfigured() {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}
