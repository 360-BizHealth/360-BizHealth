/*
 * /api/v1/admin/users
 *   GET    list dashboard accounts
 *   POST   create new admin / staff user with email & password
 *   PATCH  update user (suspend / reactivate, change role, reset password)
 *   DELETE delete user
 */
import { handler, readJson, send, queryOf, HttpError } from "../http.js";
import { requireAdmin, listAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from "../auth.js";

function getTargetId(req, body) {
  const q = queryOf(req);
  return q.id || (body && (body.id || body.user_id));
}

export default handler({
  async GET(req, res) {
    await requireAdmin(req, res, { role: "admin" });
    return send(res, 200, { ok: true, users: await listAdminUsers() });
  },

  async POST(req, res) {
    const admin = await requireAdmin(req, res, { write: true, role: "admin" });
    const body = await readJson(req);
    const user = await createAdminUser(body, admin);
    return send(res, 201, { ok: true, user });
  },

  async PATCH(req, res) {
    const admin = await requireAdmin(req, res, { write: true, role: "admin" });
    const body = await readJson(req);
    const id = getTargetId(req, body);
    if (!id) throw new HttpError(400, "missing_user_id", "User ID is required.");
    const user = await updateAdminUser(id, body, admin);
    return send(res, 200, { ok: true, user });
  },

  async DELETE(req, res) {
    const admin = await requireAdmin(req, res, { write: true, role: "admin" });
    let body = null;
    try { body = await readJson(req); } catch { body = null; }
    const id = getTargetId(req, body);
    if (!id) throw new HttpError(400, "missing_user_id", "User ID is required.");
    const result = await deleteAdminUser(id, admin);
    return send(res, 200, { ok: true, ...result });
  },
});
