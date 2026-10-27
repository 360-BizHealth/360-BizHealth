/*
 * POST /api/v1/enquiries  — public enquiry submission.
 *
 * Order of checks: origin → JSON → honeypot/timing → CAPTCHA (if configured)
 * → rate limits → validation → idempotent insert → notification e-mail.
 * The lead is committed before any e-mail is attempted, so a mail outage never
 * loses an enquiry; failed notifications are retried by the admin or the cron.
 */
import { handler, readJson, send, HttpError, assertSameOrigin, clientIp, hashIp } from "../http.js";
import { validateEnquiry, cleanSource, MIN_FILL_MS } from "../../shared/enquiry.js";
import { limit } from "../ratelimit.js";
import { createLead, notifyForLead } from "../leads.js";
import { verifyTurnstile } from "../turnstile.js";
import { log } from "../log.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function post(req, res) {
  assertSameOrigin(req);
  const body = await readJson(req);

  // Bots fill every field; people never see this one.
  if (typeof body.bh_hp_field === "string" && body.bh_hp_field.trim() !== "") {
    log.warn("enquiry_rejected_honeypot", {});
    throw new HttpError(400, "rejected", "Your enquiry could not be accepted. Please email us instead.");
  }
  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    throw new HttpError(400, "too_fast", "That was quicker than we expected. Please check your details and send again.");
  }

  const ip = clientIp(req);
  const ipHash = hashIp(ip);
  await verifyTurnstile(body.turnstileToken, ip);

  await limit(`enquiry:ip:${ipHash}`, 600, 5, "You have sent several enquiries in a short time. Please wait about 10 minutes, or email us directly.");

  const { ok, data, errors } = validateEnquiry(body);
  if (!ok) throw new HttpError(422, "validation_failed", "Please correct the highlighted fields.", { fields: errors });

  await limit(`enquiry:email:${data.email.toLowerCase()}`, 3600, 4, "We have already received several enquiries from this email address in the last hour. We will be in touch.");

  const idempotencyKey = UUID_RE.test(String(body.submissionId || "")) ? body.submissionId : null;
  const { lead, created } = await createLead(data, {
    source: cleanSource(body.source),
    ipHash,
    userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    idempotencyKey,
  });

  if (created) {
    // Awaited so the function is not frozen before the request completes on serverless.
    await notifyForLead(lead);
    log.info("enquiry_created", { leadId: lead.id, reference: lead.reference });
  }

  return send(res, created ? 201 : 200, { ok: true, reference: lead.reference, duplicate: !created });
}

export default handler({ POST: post });
