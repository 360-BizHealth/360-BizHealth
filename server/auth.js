/*
 * Administrator authentication.
 *
 * Identity: Supabase Auth (email + password, managed in the Supabase dashboard).
 * Authorisation: an active row in public.admin_users.
 * Session: the Supabase access and refresh tokens are kept in HttpOnly,
 * SameSite=Strict, Secure cookies scoped to /api/v1/admin, so page scripts can
 * never read them. Every admin request re-validates the access token with
 * Supabase and re-checks admin_users, so revoking a user takes effect at once.
 */
import { config, authConfigured } from "./config.js";
import { HttpError, parseCookies, cookie, assertSameOrigin, assertCsrfHeader } from "./http.js";
import { query } from "./db.js";
import { log } from "./log.js";

export const ACCESS_COOKIE = "bh_admin_at";
export const REFRESH_COOKIE = "bh_admin_rt";
const COOKIE_PATH = "/api/v1/admin";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // a week; Supabase rotates the token on every refresh

function requireAuthConfig() {
  if (!authConfigured()) throw new HttpError(503, "auth_not_configured", "Administrator sign-in is not configured on this deployment.");
}

async function gotrue(path, { method = "GET", body, token } = {}) {
  requireAuthConfig();
  const headers = { apikey: config.supabaseAnonKey, "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${config.supabaseUrl}/auth/v1${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    log.error("auth_provider_unreachable", { err });
    throw new HttpError(503, "auth_unavailable", "Sign-in is temporarily unavailable. Please try again shortly.");
  }
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data };
}

export async function passwordSignIn(email, password) {
  const r = await gotrue("/token?grant_type=password", { method: "POST", body: { email, password } });
  if (r.status === 200 && r.data && r.data.access_token) return r.data;
  if (r.status === 429) throw new HttpError(429, "rate_limited", "Too many sign-in attempts. Please wait and try again.");
  if (r.status >= 500) throw new HttpError(503, "auth_unavailable", "Sign-in is temporarily unavailable. Please try again shortly.");
  throw new HttpError(401, "invalid_credentials", "The email or password is incorrect.");
}

async function refresh(refreshToken) {
  const r = await gotrue("/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: refreshToken } });
  return r.status === 200 && r.data && r.data.access_token ? r.data : null;
}

async function userFor(accessToken) {
  const r = await gotrue("/user", { token: accessToken });
  return r.status === 200 && r.data && r.data.id ? r.data : null;
}

export async function revoke(accessToken) {
  if (!accessToken || !authConfigured()) return;
  try { await gotrue("/logout?scope=local", { method: "POST", token: accessToken }); } catch { /* best effort */ }
}

export function sessionCookies(session) {
  return [
    cookie(ACCESS_COOKIE, session.access_token, { maxAge: Number(session.expires_in || 3600), path: COOKIE_PATH }),
    cookie(REFRESH_COOKIE, session.refresh_token, { maxAge: REFRESH_MAX_AGE, path: COOKIE_PATH }),
  ];
}

export function clearedCookies() {
  return [
    cookie(ACCESS_COOKIE, "", { maxAge: 0, path: COOKIE_PATH }),
    cookie(REFRESH_COOKIE, "", { maxAge: 0, path: COOKIE_PATH }),
  ];
}

export async function adminRecord(userId) {
  const { rows } = await query(
    "select user_id, email, role from public.admin_users where user_id = $1 and active = true",
    [userId]
  );
  return rows[0] || null;
}

/*
 * Resolves the signed-in administrator or throws 401/403.
 * Pass { write: true } for state-changing requests to enforce origin + CSRF checks.
 * May append refreshed session cookies to the response.
 */
export async function requireAdmin(req, res, { write = false, role = null } = {}) {
  if (write) {
    assertSameOrigin(req);
    assertCsrfHeader(req);
  }
  requireAuthConfig();
  const jar = parseCookies(req);
  let access = jar[ACCESS_COOKIE];
  let user = access ? await userFor(access) : null;

  if (!user && jar[REFRESH_COOKIE]) {
    const session = await refresh(jar[REFRESH_COOKIE]);
    if (session) {
      access = session.access_token;
      user = session.user || (await userFor(access));
      appendCookies(res, sessionCookies(session));
    }
  }
  if (!user) {
    appendCookies(res, clearedCookies());
    throw new HttpError(401, "not_authenticated", "Please sign in to continue.");
  }

  const admin = await adminRecord(user.id);
  if (!admin) throw new HttpError(403, "not_authorised", "This account does not have access to the lead dashboard.");
  if (role && admin.role !== role) throw new HttpError(403, "insufficient_role", "Your role does not allow this action.");
  return { id: admin.user_id, email: admin.email, role: admin.role, accessToken: access };
}

export function appendCookies(res, cookies) {
  const prev = res.getHeader("Set-Cookie");
  const list = prev ? (Array.isArray(prev) ? prev : [prev]) : [];
  res.setHeader("Set-Cookie", [...list, ...cookies]);
}
