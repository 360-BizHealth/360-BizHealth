/*
 * /api/v1/admin/session
 *   POST   sign in   { email, password }
 *   GET    current administrator
 *   DELETE sign out
 */
import { handler, readJson, send, HttpError, assertSameOrigin, assertCsrfHeader, clientIp, hashIp, parseCookies } from "../http.js";
import { passwordSignIn, adminRecord, sessionCookies, clearedCookies, requireAdmin, revoke, appendCookies, ACCESS_COOKIE } from "../auth.js";
import { limit } from "../ratelimit.js";
import { audit } from "../leads.js";
import { normalizeEmail, isValidEmail } from "../../shared/enquiry.js";
import { log } from "../log.js";

async function post(req, res) {
  assertSameOrigin(req);
  assertCsrfHeader(req);
  const body = await readJson(req);
  const email = normalizeEmail(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  if (!isValidEmail(email) || !password || password.length > 200) {
    throw new HttpError(422, "validation_failed", "Enter your email address and password.");
  }

  const ipHash = hashIp(clientIp(req));
  await limit(`login:ip:${ipHash}`, 900, 10, "Too many sign-in attempts. Please wait 15 minutes and try again.");
  await limit(`login:email:${email}`, 900, 6, "Too many sign-in attempts for this account. Please wait 15 minutes and try again.");

  const session = await passwordSignIn(email, password);
  const admin = await adminRecord(session.user && session.user.id);
  if (!admin) {
    await revoke(session.access_token);
    log.warn("admin_login_not_authorised", { userId: session.user && session.user.id });
    throw new HttpError(403, "not_authorised", "This account does not have access to the lead dashboard.");
  }

  appendCookies(res, sessionCookies(session));
  await audit({ id: admin.user_id, email: admin.email }, "admin_signed_in", {});
  return send(res, 200, { ok: true, user: { email: admin.email, role: admin.role } });
}

async function get(req, res) {
  const admin = await requireAdmin(req, res);
  return send(res, 200, { ok: true, user: { email: admin.email, role: admin.role } });
}

async function del(req, res) {
  assertSameOrigin(req);
  assertCsrfHeader(req);
  const token = parseCookies(req)[ACCESS_COOKIE];
  await revoke(token);
  appendCookies(res, clearedCookies());
  return send(res, 200, { ok: true });
}

export default handler({ POST: post, GET: get, DELETE: del });
