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
import { normalizeEmail, isValidEmail } from "../shared/enquiry.js";
import { audit } from "./leads.js";

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

export async function gotrueAdmin(path, { method = "GET", body } = {}) {
  const serviceKey = config.supabaseServiceRoleKey;
  if (!serviceKey || !config.supabaseUrl) {
    throw new HttpError(503, "admin_auth_not_configured", "User management requires SUPABASE_SERVICE_ROLE_KEY to be configured in .env");
  }
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
  let res;
  try {
    res = await fetch(`${config.supabaseUrl}/auth/v1/admin${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    log.error("auth_admin_unreachable", { err });
    throw new HttpError(503, "auth_unavailable", "Supabase authentication service is temporarily unavailable.");
  }
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data };
}

export async function listAdminUsers() {
  const { rows } = await query(
    `select u.user_id, u.email, u.role, u.active, u.created_at,
            (select max(a.created_at) from public.audit_log a where a.actor_id = u.user_id and a.action = 'admin_signed_in') as last_sign_in
       from public.admin_users u order by u.active desc, u.role, u.email`
  );
  return rows;
}

export async function createAdminUser({ email, password, role }, actor) {
  const normEmail = normalizeEmail(email).toLowerCase();
  if (!isValidEmail(normEmail)) {
    throw new HttpError(422, "validation_failed", "Please enter a valid email address.", { fields: { email: "Enter a valid email address." } });
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    throw new HttpError(422, "validation_failed", "Password must be at least 8 characters long.", { fields: { password: "Password must be at least 8 characters." } });
  }
  const assignedRole = role === "staff" ? "staff" : "admin";

  const existing = await query("select user_id, active from public.admin_users where lower(email) = lower($1)", [normEmail]);
  if (existing.rows[0]) {
    throw new HttpError(409, "user_exists", "An administrator with this email already exists.");
  }

  let userId;
  const r = await gotrueAdmin("/users", {
    method: "POST",
    body: { email: normEmail, password, email_confirm: true },
  });

  if (r.status === 200 && r.data && r.data.id) {
    userId = r.data.id;
  } else if (r.status === 422 && r.data && r.data.error_code === "email_exists") {
    const u = await query("select id from auth.users where lower(email) = lower($1)", [normEmail]);
    if (!u.rows[0]) {
      throw new HttpError(422, "email_exists", "This email already exists in Supabase Auth.");
    }
    userId = u.rows[0].id;
    await gotrueAdmin(`/users/${userId}`, { method: "PUT", body: { password } });
  } else {
    throw new HttpError(r.status || 500, "auth_error", (r.data && (r.data.msg || r.data.message)) || "Could not create user in authentication provider.");
  }

  await query(
    `insert into public.admin_users (user_id, email, role, active)
     values ($1, $2, $3, true)
     on conflict (user_id) do update set email = excluded.email, role = excluded.role, active = true`,
    [userId, normEmail, assignedRole]
  );

  await audit(actor, "admin_user_created", { created_user_id: userId, email: normEmail, role: assignedRole });
  return { user_id: userId, email: normEmail, role: assignedRole, active: true };
}

export async function updateAdminUser(userId, { active, role, password }, actor) {
  const { rows } = await query("select user_id, email, role, active from public.admin_users where user_id = $1", [userId]);
  if (!rows[0]) throw new HttpError(404, "not_found", "User not found.");

  if (active === false && actor.id === userId) {
    throw new HttpError(400, "cannot_suspend_self", "You cannot suspend your own account.");
  }

  if (role === "staff" && actor.id === userId && rows[0].role === "admin") {
    const activeAdmins = await query("select count(*)::int as count from public.admin_users where role = 'admin' and active = true and user_id <> $1", [userId]);
    if (activeAdmins.rows[0].count === 0) {
      throw new HttpError(400, "cannot_demote_last_admin", "You cannot demote yourself because you are the only active administrator.");
    }
  }

  if (active === false && rows[0].role === "admin") {
    const activeAdmins = await query("select count(*)::int as count from public.admin_users where role = 'admin' and active = true and user_id <> $1", [userId]);
    if (activeAdmins.rows[0].count === 0) {
      throw new HttpError(400, "cannot_suspend_last_admin", "You cannot suspend the only active administrator.");
    }
  }

  if (password) {
    if (typeof password !== "string" || password.length < 8) {
      throw new HttpError(422, "validation_failed", "Password must be at least 8 characters long.");
    }
    const r = await gotrueAdmin(`/users/${userId}`, { method: "PUT", body: { password } });
    if (r.status !== 200) {
      throw new HttpError(r.status, "auth_error", (r.data && (r.data.msg || r.data.message)) || "Could not update password in Supabase Auth.");
    }
  }

  const newActive = active !== undefined ? Boolean(active) : rows[0].active;
  const newRole = role !== undefined ? (role === "staff" ? "staff" : "admin") : rows[0].role;

  await query(
    "update public.admin_users set active = $1, role = $2 where user_id = $3",
    [newActive, newRole, userId]
  );

  if (active !== undefined && active !== rows[0].active) {
    await audit(actor, active ? "admin_user_reactivated" : "admin_user_suspended", { target_user_id: userId, target_email: rows[0].email });
  }
  if (role !== undefined && role !== rows[0].role) {
    await audit(actor, "admin_user_role_changed", { target_user_id: userId, target_email: rows[0].email, newRole });
  }
  if (password) {
    await audit(actor, "admin_user_password_changed", { target_user_id: userId, target_email: rows[0].email });
  }

  return { user_id: userId, email: rows[0].email, role: newRole, active: newActive };
}

export async function deleteAdminUser(userId, actor) {
  if (actor.id === userId) {
    throw new HttpError(400, "cannot_delete_self", "You cannot delete your own account.");
  }
  const { rows } = await query("select user_id, email, role from public.admin_users where user_id = $1", [userId]);
  if (!rows[0]) throw new HttpError(404, "not_found", "User not found.");

  if (rows[0].role === "admin") {
    const activeAdmins = await query("select count(*)::int as count from public.admin_users where role = 'admin' and active = true and user_id <> $1", [userId]);
    if (activeAdmins.rows[0].count === 0) {
      throw new HttpError(400, "cannot_delete_last_admin", "You cannot delete the only active administrator.");
    }
  }

  // 1. Delete from Supabase Auth
  await gotrueAdmin(`/users/${userId}`, { method: "DELETE" });

  // 2. Delete from public.admin_users
  await query("delete from public.admin_users where user_id = $1", [userId]);

  // 3. Audit
  await audit(actor, "admin_user_deleted", { deleted_user_id: userId, deleted_email: rows[0].email });
  return { ok: true, deleted: { user_id: userId, email: rows[0].email } };
}

