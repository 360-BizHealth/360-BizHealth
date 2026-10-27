/*
 * GET /api/v1/cron/retry-notifications
 * Called by Vercel Cron (see vercel.json). Vercel sends
 * "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set.
 */
import crypto from "node:crypto";
import { handler, send, HttpError } from "../http.js";
import { config } from "../config.js";
import { leadsAwaitingNotification, notifyForLead } from "../leads.js";

function authorised(req) {
  const secret = config.cronSecret;
  if (!secret) return false;
  const given = Buffer.from(String(req.headers.authorization || ""));
  const want = Buffer.from(`Bearer ${secret}`);
  return given.length === want.length && crypto.timingSafeEqual(given, want);
}

async function get(req, res) {
  if (!authorised(req)) throw new HttpError(401, "not_authenticated", "Not authorised.");
  const leads = await leadsAwaitingNotification(20);
  const results = { sent: 0, failed: 0, not_configured: 0 };
  for (const lead of leads) {
    const r = await notifyForLead(lead);
    results[r.status] = (results[r.status] || 0) + 1;
  }
  return send(res, 200, { ok: true, checked: leads.length, ...results });
}

export default handler({ GET: get });
