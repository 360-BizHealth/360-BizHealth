/*
 * Lead repository. Every statement is parameterised; user input never becomes SQL.
 */
import crypto from "node:crypto";
import { query, tx } from "./db.js";
import { HttpError } from "./http.js";
import { CONSENT_VERSION, LEAD_STATUS_VALUES, SERVICE_LABELS } from "../shared/enquiry.js";
import { sendLeadNotification } from "./email.js";
import { log } from "./log.js";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export function newReference() {
  const bytes = crypto.randomBytes(6);
  let s = "";
  for (const b of bytes) s += REF_ALPHABET[b % REF_ALPHABET.length];
  return "BH-" + s;
}

export function contentHash(d) {
  return crypto
    .createHash("sha256")
    .update([d.email.toLowerCase(), d.service, d.message.toLowerCase().replace(/\s+/g, " ")].join("|"))
    .digest("hex");
}

const PUBLIC_COLUMNS = "id, reference, created_at";

/**
 * Stores a validated enquiry. Returns { lead, created } where created=false means
 * the same submission (same idempotency key, or identical content within 24 hours)
 * was already stored, so no duplicate row is written.
 */
export async function createLead(data, meta) {
  const hash = contentHash(data);
  return tx(async (c) => {
    if (meta.idempotencyKey) {
      const prior = await c.query(`select ${PUBLIC_COLUMNS} from public.leads where idempotency_key = $1`, [meta.idempotencyKey]);
      if (prior.rows[0]) return { lead: prior.rows[0], created: false };
    }
    const dup = await c.query(
      `select ${PUBLIC_COLUMNS} from public.leads where content_hash = $1 and created_at > now() - interval '24 hours' order by created_at desc limit 1`,
      [hash]
    );
    if (dup.rows[0]) return { lead: dup.rows[0], created: false };

    let row = null;
    for (let attempt = 0; attempt < 4 && !row; attempt++) {
      const r = await c.query(
        `insert into public.leads
          (reference, name, email, phone, company, service, company_size, city, current_hrms, subject, message,
           consent, consent_version, source_page, source_vertical, referrer, landing_page, utm,
           ip_hash, user_agent, idempotency_key, content_hash)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, true,$12,$13,$14,$15,$16,$17::jsonb, $18,$19,$20,$21)
         on conflict do nothing
         returning *`,
        [
          newReference(), data.name, data.email, data.phone, data.company, data.service,
          data.companySize || null, data.city || null, data.currentHrms || null, data.subject || null, data.message,
          CONSENT_VERSION, meta.source.page || null, meta.source.vertical || null,
          meta.source.referrer || null, meta.source.landing || null, JSON.stringify(meta.source.utm || {}),
          meta.ipHash || null, meta.userAgent || null, meta.idempotencyKey || null, hash,
        ]
      );
      row = r.rows[0] || null;
      if (!row && meta.idempotencyKey) {
        // A concurrent request with the same key won the race.
        const prior = await c.query(`select ${PUBLIC_COLUMNS} from public.leads where idempotency_key = $1`, [meta.idempotencyKey]);
        if (prior.rows[0]) return { lead: prior.rows[0], created: false };
      }
    }
    if (!row) throw new Error("could not allocate a unique lead reference");
    await c.query(
      "insert into public.audit_log (lead_id, action, details) values ($1, 'lead_created', $2::jsonb)",
      [row.id, JSON.stringify({ service: row.service, source_page: row.source_page })]
    );
    return { lead: row, created: true };
  });
}

/* Sends (or re-sends) the business notification and records the outcome. Never throws. */
export async function notifyForLead(lead, actor = null) {
  let result;
  try {
    result = await sendLeadNotification(lead);
  } catch (err) {
    result = { status: "failed", error: String(err && err.message).slice(0, 300) };
  }
  try {
    await query(
      `update public.leads set
         notification_status = $2,
         notification_attempts = notification_attempts + case when $2 = 'not_configured' then 0 else 1 end,
         notification_error = $3,
         notified_at = case when $2 = 'sent' then now() else notified_at end
       where id = $1`,
      [lead.id, result.status, result.error || null]
    );
    await query(
      "insert into public.audit_log (lead_id, actor_id, actor_email, action, details) values ($1,$2,$3,$4,$5::jsonb)",
      [lead.id, actor ? actor.id : null, actor ? actor.email : null, "notification_" + result.status, JSON.stringify(result.error ? { error: result.error } : {})]
    );
  } catch (err) {
    log.error("notification_status_write_failed", { leadId: lead.id, err });
  }
  if (result.status === "failed") log.warn("lead_notification_failed", { leadId: lead.id, error: result.error });
  return result;
}

/* ----------------------------------------------------------------- admin reads */

function escapeLike(s) {
  return s.replace(/[\\%_]/g, (c) => "\\" + c);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function assertUuid(id) {
  if (!UUID_RE.test(String(id || ""))) throw new HttpError(404, "not_found", "Lead not found.");
}

export function parseFilters(q) {
  const f = {};
  const s = (v, n) => String(v || "").trim().slice(0, n);
  f.q = s(q.q, 100);
  f.status = LEAD_STATUS_VALUES.includes(q.status) ? q.status : "";
  f.service = SERVICE_LABELS[q.service] ? q.service : "";
  f.from = DATE_RE.test(q.from || "") ? q.from : "";
  f.to = DATE_RE.test(q.to || "") ? q.to : "";
  f.notification = ["failed", "pending", "sent", "not_configured"].includes(q.notification) ? q.notification : "";
  f.sort = ["newest", "oldest", "updated", "follow_up"].includes(q.sort) ? q.sort : "newest";
  f.page = Math.max(1, Math.min(10_000, parseInt(q.page, 10) || 1));
  f.pageSize = Math.max(5, Math.min(100, parseInt(q.pageSize, 10) || 25));
  return f;
}

function where(f) {
  const clauses = [];
  const params = [];
  const p = (v) => { params.push(v); return "$" + params.length; };
  if (f.q) {
    const like = p("%" + escapeLike(f.q) + "%");
    clauses.push(`(name ilike ${like} or email ilike ${like} or company ilike ${like} or phone ilike ${like} or reference ilike ${like} or city ilike ${like} or subject ilike ${like})`);
  }
  if (f.status) clauses.push(`status = ${p(f.status)}`);
  if (f.service) clauses.push(`service = ${p(f.service)}`);
  // Dates are interpreted in India Standard Time, which is how the team reads them.
  if (f.from) clauses.push(`created_at >= (${p(f.from)}::date)::timestamp at time zone 'Asia/Kolkata'`);
  if (f.to) clauses.push(`created_at < ((${p(f.to)}::date + 1))::timestamp at time zone 'Asia/Kolkata'`);
  if (f.notification) clauses.push(`notification_status = ${p(f.notification)}`);
  return { sql: clauses.length ? "where " + clauses.join(" and ") : "", params };
}

const ORDER = {
  newest: "created_at desc",
  oldest: "created_at asc",
  updated: "updated_at desc",
  follow_up: "next_follow_up asc nulls last, created_at desc",
};

const LIST_COLUMNS = `id, reference, created_at, updated_at, name, email, phone, company, service, company_size, city,
  status, assigned_to, next_follow_up, notification_status, subject, left(message, 160) as message_preview`;

export async function listLeads(f) {
  const w = where(f);
  const offset = (f.page - 1) * f.pageSize;
  const [items, total] = await Promise.all([
    query(`select ${LIST_COLUMNS} from public.leads ${w.sql} order by ${ORDER[f.sort]} limit ${f.pageSize} offset ${offset}`, w.params),
    query(`select count(*)::int as n from public.leads ${w.sql}`, w.params),
  ]);
  return { items: items.rows, total: total.rows[0].n, page: f.page, pageSize: f.pageSize };
}

export async function leadStats() {
  const { rows } = await query(`
    select
      count(*)::int as total,
      count(*) filter (where created_at > now() - interval '7 days')::int as last7,
      count(*) filter (where created_at > now() - interval '30 days')::int as last30,
      count(*) filter (where notification_status = 'failed')::int as notification_failed,
      count(*) filter (where next_follow_up is not null and next_follow_up <= (now() at time zone 'Asia/Kolkata')::date and status not in ('converted','lost'))::int as follow_up_due
    from public.leads`);
  const byStatus = await query("select status, count(*)::int as n from public.leads group by status");
  const byService = await query("select service, count(*)::int as n from public.leads group by service order by n desc");
  return {
    ...rows[0],
    byStatus: Object.fromEntries(byStatus.rows.map((r) => [r.status, r.n])),
    byService: byService.rows.map((r) => ({ service: r.service, count: r.n })),
  };
}

export async function getLead(id) {
  assertUuid(id);
  const { rows } = await query(
    `select id, reference, created_at, updated_at, name, email, phone, company, service, company_size, city, current_hrms,
            subject, message, consent, consent_version, consent_at, source_page, source_vertical, referrer, landing_page, utm,
            status, assigned_to, next_follow_up, last_contacted_at,
            notification_status, notification_attempts, notification_error, notified_at
       from public.leads where id = $1`,
    [id]
  );
  if (!rows[0]) throw new HttpError(404, "not_found", "Lead not found.");
  const [notes, activity] = await Promise.all([
    query("select id, author_email, body, created_at from public.lead_notes where lead_id = $1 order by created_at desc", [id]),
    query("select id, actor_email, action, details, created_at from public.audit_log where lead_id = $1 order by created_at desc limit 100", [id]),
  ]);
  return { ...rows[0], notes: notes.rows, activity: activity.rows };
}

/* ---------------------------------------------------------------- admin writes */

export function parsePatch(body) {
  const patch = {};
  const errors = {};
  if ("status" in body) {
    if (LEAD_STATUS_VALUES.includes(body.status)) patch.status = body.status;
    else errors.status = "Choose a valid status.";
  }
  if ("assignedTo" in body) {
    const v = String(body.assignedTo ?? "").replace(/\s+/g, " ").trim();
    if (v.length > 120) errors.assignedTo = "Keep this under 120 characters.";
    else patch.assigned_to = v || null;
  }
  if ("nextFollowUp" in body) {
    const v = body.nextFollowUp;
    if (v === null || v === "") patch.next_follow_up = null;
    else if (DATE_RE.test(String(v)) && !Number.isNaN(Date.parse(v))) patch.next_follow_up = v;
    else errors.nextFollowUp = "Use a valid date.";
  }
  if (Object.keys(errors).length) throw new HttpError(422, "validation_failed", "Some fields need attention.", { fields: errors });
  if (!Object.keys(patch).length) throw new HttpError(400, "nothing_to_update", "No changes were sent.");
  return patch;
}

export async function updateLead(id, patch, actor) {
  assertUuid(id);
  return tx(async (c) => {
    const cur = await c.query("select status, assigned_to, next_follow_up::text as next_follow_up from public.leads where id = $1 for update", [id]);
    if (!cur.rows[0]) throw new HttpError(404, "not_found", "Lead not found.");
    const before = cur.rows[0];
    const sets = [];
    const params = [id];
    const changes = {};
    for (const [col, val] of Object.entries(patch)) {
      if ((before[col] ?? null) === (val ?? null)) continue;
      params.push(val);
      sets.push(`${col} = $${params.length}`); // column names come from the fixed whitelist in parsePatch
      changes[col] = { from: before[col] ?? null, to: val ?? null };
    }
    if (patch.status === "contacted" && before.status !== "contacted") sets.push("last_contacted_at = now()");
    if (sets.length) {
      await c.query(`update public.leads set ${sets.join(", ")} where id = $1`, params);
      await c.query(
        "insert into public.audit_log (lead_id, actor_id, actor_email, action, details) values ($1,$2,$3,'lead_updated',$4::jsonb)",
        [id, actor.id, actor.email, JSON.stringify(changes)]
      );
    }
    return { changed: Object.keys(changes) };
  });
}

export async function addNote(id, text, actor) {
  assertUuid(id);
  const body = String(text ?? "").replace(/\r\n?/g, "\n").trim();
  if (!body) throw new HttpError(422, "validation_failed", "Write a note first.", { fields: { body: "Write a note first." } });
  if (body.length > 4000) throw new HttpError(422, "validation_failed", "Keep notes under 4,000 characters.", { fields: { body: "Keep notes under 4,000 characters." } });
  return tx(async (c) => {
    const exists = await c.query("select 1 from public.leads where id = $1", [id]);
    if (!exists.rows[0]) throw new HttpError(404, "not_found", "Lead not found.");
    const { rows } = await c.query(
      "insert into public.lead_notes (lead_id, author_id, author_email, body) values ($1,$2,$3,$4) returning id, author_email, body, created_at",
      [id, actor.id, actor.email, body]
    );
    await c.query("update public.leads set updated_at = now() where id = $1", [id]);
    await c.query(
      "insert into public.audit_log (lead_id, actor_id, actor_email, action, details) values ($1,$2,$3,'note_added',$4::jsonb)",
      [id, actor.id, actor.email, JSON.stringify({ note_id: rows[0].id })]
    );
    return rows[0];
  });
}

export async function leadForNotification(id) {
  assertUuid(id);
  const { rows } = await query("select * from public.leads where id = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "not_found", "Lead not found.");
  return rows[0];
}

export async function leadsAwaitingNotification(limit = 20) {
  const { rows } = await query(
    `select * from public.leads
      where notification_status in ('pending','failed') and notification_attempts < 5
        and created_at > now() - interval '7 days' and created_at < now() - interval '1 minute'
      order by created_at asc limit $1`,
    [limit]
  );
  return rows;
}

export const EXPORT_LIMIT = 10_000;

export async function exportLeads(f) {
  const w = where(f);
  const { rows } = await query(
    `select reference, created_at, status, name, company, email, phone, service, company_size, city, current_hrms,
            subject, message, assigned_to, next_follow_up, last_contacted_at, source_page, utm->>'utm_source' as utm_source,
            utm->>'utm_campaign' as utm_campaign, notification_status
       from public.leads ${w.sql} order by ${ORDER[f.sort]} limit ${EXPORT_LIMIT}`,
    w.params
  );
  return rows;
}

export async function audit(actor, action, details, leadId = null) {
  await query(
    "insert into public.audit_log (lead_id, actor_id, actor_email, action, details) values ($1,$2,$3,$4,$5::jsonb)",
    [leadId, actor ? actor.id : null, actor ? actor.email : null, action, JSON.stringify(details || {})]
  );
}
