/*
 * Protected lead-management endpoints. Every handler starts with requireAdmin,
 * so the data is protected at the API, not only by the /admin page route.
 */
import { handler, readJson, send, queryOf } from "../http.js";
import { requireAdmin } from "../auth.js";
import {
  parseFilters, listLeads, leadStats, getLead, parsePatch, updateLead, addNote,
  leadForNotification, notifyForLead, exportLeads, audit, EXPORT_LIMIT,
} from "../leads.js";
import { toCsv } from "../csv.js";

const idOf = (req) => {
  const q = queryOf(req);
  return q.id;
};

/* GET /api/v1/admin/leads */
export const list = handler({
  async GET(req, res) {
    await requireAdmin(req, res);
    const data = await listLeads(parseFilters(queryOf(req)));
    return send(res, 200, { ok: true, ...data });
  },
});

/* GET /api/v1/admin/stats */
export const stats = handler({
  async GET(req, res) {
    await requireAdmin(req, res);
    return send(res, 200, { ok: true, stats: await leadStats() });
  },
});

/* GET | PATCH /api/v1/admin/leads/:id */
export const detail = handler({
  async GET(req, res) {
    await requireAdmin(req, res);
    return send(res, 200, { ok: true, lead: await getLead(idOf(req)) });
  },
  async PATCH(req, res) {
    const admin = await requireAdmin(req, res, { write: true });
    const patch = parsePatch(await readJson(req));
    const result = await updateLead(idOf(req), patch, admin);
    return send(res, 200, { ok: true, ...result, lead: await getLead(idOf(req)) });
  },
});

/* POST /api/v1/admin/leads/:id/notes */
export const notes = handler({
  async POST(req, res) {
    const admin = await requireAdmin(req, res, { write: true });
    const body = await readJson(req);
    const note = await addNote(idOf(req), body.body, admin);
    return send(res, 201, { ok: true, note });
  },
});

/* POST /api/v1/admin/leads/:id/notify — retry the business notification (admins only) */
export const notify = handler({
  async POST(req, res) {
    const admin = await requireAdmin(req, res, { write: true, role: "admin" });
    const lead = await leadForNotification(idOf(req));
    const result = await notifyForLead(lead, admin);
    return send(res, result.status === "sent" ? 200 : 502, {
      ok: result.status === "sent",
      notification: result.status,
      ...(result.status !== "sent" ? { error: { code: "notification_" + result.status, message: result.status === "not_configured" ? "Email notifications are not configured on this deployment." : "The email provider did not accept the message. Details are in the activity log." } } : {}),
    });
  },
});

/* GET /api/v1/admin/leads/export — CSV (admins only) */
export const exportCsv = handler({
  async GET(req, res) {
    const admin = await requireAdmin(req, res, { role: "admin" });
    const filters = parseFilters(queryOf(req));
    const rows = await exportLeads(filters);
    await audit(admin, "leads_exported", { count: rows.length, filters: { ...filters, page: undefined, pageSize: undefined } });
    const stamp = new Date().toISOString().slice(0, 10);
    return send(res, 200, toCsv(rows), {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="360bizhealth-leads-${stamp}.csv"`,
      "X-Export-Limit": String(EXPORT_LIMIT),
    });
  },
});
