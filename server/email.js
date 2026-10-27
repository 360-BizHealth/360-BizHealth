/*
 * Lead notification e-mail through Resend's HTTP API (no SDK needed).
 * The lead is always stored first; this module only reports success or failure
 * so the caller can record it and retry later.
 */
import { config, emailConfigured } from "./config.js";
import { SERVICE_LABELS, RETREAT_PACKAGE_LABELS } from "../shared/enquiry.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function buildLeadEmail(lead) {
  const service = SERVICE_LABELS[lead.service] || lead.service;
  const adminUrl = `${config.siteUrl}/admin/leads/${lead.id}`;
  const rows = [
    ["Reference", lead.reference],
    ["Name", lead.name],
    ["Company", lead.company],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Service", service],
    ["Company size", lead.company_size],
    ["City", lead.city],
    ["Current HRMS", lead.current_hrms],
    ["Subject", lead.subject],
    ["Retreat package", lead.retreat_package ? RETREAT_PACKAGE_LABELS[lead.retreat_package] || lead.retreat_package : null],
    ["Submitted from", lead.source_page],
    ["Received", new Date(lead.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"],
  ].filter(([, v]) => v);

  const subject = `New enquiry ${lead.reference}: ${lead.subject ? lead.subject + " | " : ""}${service} (${lead.company})`.slice(0, 180);
  const text = [
    `New website enquiry ${lead.reference}`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    lead.message,
    "",
    `Open in the lead dashboard: ${adminUrl}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#1C2A22;background:#F9F4EA;padding:24px">
<table role="presentation" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;padding:24px;border:1px solid #E8DDC9">
<tr><td><h1 style="font-size:20px;color:#0C4727;margin:0 0 12px">New website enquiry ${esc(lead.reference)}</h1>
<table role="presentation" style="font-size:14px;border-collapse:collapse;width:100%">
${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#55645A;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${esc(v)}</td></tr>`).join("")}
</table>
<h2 style="font-size:15px;margin:18px 0 6px;color:#0C4727">Message</h2>
<p style="white-space:pre-wrap;font-size:14px;line-height:1.6;margin:0">${esc(lead.message)}</p>
<p style="margin:22px 0 0"><a href="${esc(adminUrl)}" style="background:#1E5A3C;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">Open in the lead dashboard</a></p>
</td></tr></table></body></html>`;

  return { subject, text, html };
}

/** @returns {Promise<{ status: 'sent'|'failed'|'not_configured', error?: string }>} */
export async function sendLeadNotification(lead) {
  if (!emailConfigured()) return { status: "not_configured" };
  const { subject, text, html } = buildLeadEmail(lead);
  try {
    const res = await fetch(`${config.resendBaseUrl}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `lead-${lead.id}-${lead.notification_attempts || 0}`,
      },
      body: JSON.stringify({ from: config.emailFrom, to: config.notifyTo, reply_to: lead.email, subject, text, html }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { status: "sent" };
    let detail = "";
    try { const j = await res.json(); detail = j && (j.name || j.message) ? `${j.name || ""} ${j.message || ""}`.trim() : ""; } catch { /* ignore */ }
    return { status: "failed", error: `HTTP ${res.status}${detail ? ": " + detail : ""}`.slice(0, 300) };
  } catch (err) {
    return { status: "failed", error: (err && err.name === "TimeoutError" ? "Timed out" : String(err && err.message)).slice(0, 300) };
  }
}
