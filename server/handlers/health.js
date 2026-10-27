/* GET /api/v1/health — liveness plus a database round-trip. Discloses no configuration details. */
import { handler, send } from "../http.js";
import { query } from "../db.js";

async function get(req, res) {
  let database = "ok";
  try {
    await query("select 1");
  } catch {
    database = "unavailable";
  }
  const ok = database === "ok";
  return send(res, ok ? 200 : 503, { ok, status: ok ? "ok" : "degraded", database, time: new Date().toISOString() });
}

export default handler({ GET: get });
