import { Fragment, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAdmin } from "./AdminApp.jsx";
import { StatusPill } from "./Dashboard.jsx";
import { SERVICE_LABELS, LEAD_STATUSES } from "../../../shared/enquiry.js";

const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) : "—");

const ACTIONS = {
  lead_created: "Enquiry received",
  lead_updated: "Lead updated",
  note_added: "Note added",
  notification_sent: "Email alert sent",
  notification_failed: "Email alert failed",
  notification_not_configured: "Email alerts not configured",
};

function describe(a) {
  if (a.action === "lead_updated") {
    return Object.entries(a.details || {})
      .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v.from ?? "—"} → ${v.to ?? "—"}`)
      .join("; ");
  }
  if (a.details && a.details.error) return a.details.error;
  return "";
}

export default function LeadDetail() {
  const { id } = useParams();
  const { user, onAuthError } = useAdmin();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ status: "", assignedTo: "", nextFollowUp: "" });
  const [saveMsg, setSaveMsg] = useState({ kind: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [noteMsg, setNoteMsg] = useState({ kind: "", text: "" });
  const [notifyMsg, setNotifyMsg] = useState({ kind: "", text: "" });

  const hydrate = (l) => {
    setLead(l);
    setForm({ status: l.status, assignedTo: l.assigned_to || "", nextFollowUp: l.next_follow_up || "" });
  };

  const load = useCallback(async () => {
    try {
      const r = await api(`/api/v1/admin/leads/${encodeURIComponent(id)}`);
      hydrate(r.lead);
    } catch (err) {
      onAuthError(err);
      setError(err.message);
    }
  }, [id, onAuthError]);

  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg({ kind: "", text: "Saving…" });
    try {
      const r = await api(`/api/v1/admin/leads/${encodeURIComponent(id)}`, { method: "PATCH", body: form });
      hydrate(r.lead);
      setSaveMsg({ kind: "ok", text: r.changed.length ? "Changes saved." : "Nothing changed." });
    } catch (err) {
      onAuthError(err);
      setSaveMsg({ kind: "error", text: err.fields ? Object.values(err.fields).join(" ") : err.message });
    } finally {
      setSaving(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) { setNoteMsg({ kind: "error", text: "Write a note first." }); return; }
    try {
      await api(`/api/v1/admin/leads/${encodeURIComponent(id)}/notes`, { method: "POST", body: { body: note } });
      setNote("");
      setNoteMsg({ kind: "ok", text: "Note added." });
      load();
    } catch (err) {
      onAuthError(err);
      setNoteMsg({ kind: "error", text: err.message });
    }
  };

  const retry = async () => {
    setNotifyMsg({ kind: "", text: "Sending…" });
    try {
      await api(`/api/v1/admin/leads/${encodeURIComponent(id)}/notify`, { method: "POST" });
      setNotifyMsg({ kind: "ok", text: "Email alert sent." });
    } catch (err) {
      onAuthError(err);
      setNotifyMsg({ kind: "error", text: err.message });
    }
    load();
  };

  if (error) {
    return (
      <div className="card" role="alert">
        <h1 className="adm__h1">Lead unavailable</h1>
        <p>{error}</p>
        <Link to="/admin">Back to the lead list</Link>
      </div>
    );
  }
  if (!lead) return <p role="status" className="adm__loading"><span className="spinner" aria-hidden="true" /> Loading lead…</p>;

  const utm = Object.entries(lead.utm || {});
  return (
    <>
      <p style={{ margin: "0 0 1rem" }}><Link to="/admin" className="link link--back">Back to all leads</Link></p>
      <div className="adm__head">
        <div>
          <h1 className="adm__h1" style={{ marginBottom: ".2rem" }}>{lead.name}</h1>
          <p className="muted" style={{ margin: 0 }}>{lead.company} · {lead.reference} · received {fmt(lead.created_at)}</p>
        </div>
        <StatusPill status={lead.status} />
      </div>

      <div className="adm__detail">
        <div className="adm__col">
          <section className="card" aria-labelledby="enq-h">
            <h2 className="adm__h2" id="enq-h">Enquiry</h2>
            <dl className="dl">
              <dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd>
              <dt>Phone</dt><dd><a href={`tel:${lead.phone}`}>{lead.phone}</a></dd>
              <dt>Service</dt><dd>{SERVICE_LABELS[lead.service] || lead.service}</dd>
              {lead.company_size && <><dt>Company size</dt><dd>{lead.company_size} employees</dd></>}
              {lead.city && <><dt>City</dt><dd>{lead.city}</dd></>}
              {lead.current_hrms && <><dt>Current HRMS</dt><dd>{lead.current_hrms}</dd></>}
            </dl>
            {lead.subject && <><h3 className="adm__h3">Subject</h3><p className="adm__msg">{lead.subject}</p></>}
            <h3 className="adm__h3">Message</h3>
            <p className="adm__msg">{lead.message}</p>
          </section>

          <section className="card" aria-labelledby="notes-h">
            <h2 className="adm__h2" id="notes-h">Private notes</h2>
            <form onSubmit={addNote} className="field">
              <label htmlFor="note">Add a follow-up note</label>
              <textarea id="note" value={note} maxLength={4000} onChange={(e) => setNote(e.target.value)} placeholder="Call summary, next steps, quotes sent…" />
              <div className={"alert" + (noteMsg.kind === "error" ? " alert--error" : noteMsg.kind === "ok" ? " alert--ok" : "")} role="status">{noteMsg.text}</div>
              <div><button className="btn btn--green btn--sm" type="submit">Add note</button></div>
            </form>
            {lead.notes.length === 0 ? <p className="muted small">No notes yet.</p> : (
              <ol className="notes">
                {lead.notes.map((n) => (
                  <li key={n.id}><p className="adm__msg">{n.body}</p><span className="muted small">{n.author_email} · {fmt(n.created_at)}</span></li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <div className="adm__col">
          <section className="card" aria-labelledby="fu-h">
            <h2 className="adm__h2" id="fu-h">Follow-up</h2>
            <form onSubmit={save} className="adm__form">
              <div className="field">
                <label htmlFor="d-status">Status</label>
                <select id="d-status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="d-assigned">Assigned to</label>
                <input id="d-assigned" maxLength={120} value={form.assignedTo} onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="d-next">Next follow-up</label>
                <input id="d-next" type="date" value={form.nextFollowUp} onChange={(e) => setForm((f) => ({ ...f, nextFollowUp: e.target.value }))} />
              </div>
              <div className={"alert" + (saveMsg.kind === "error" ? " alert--error" : saveMsg.kind === "ok" ? " alert--ok" : "")} role="status">{saveMsg.text}</div>
              <button className="btn btn--green btn--sm" type="submit" disabled={saving}>Save changes</button>
            </form>
            {lead.last_contacted_at && <p className="muted small" style={{ marginTop: ".8rem" }}>Last marked contacted {fmt(lead.last_contacted_at)}</p>}
          </section>

          <section className="card" aria-labelledby="src-h">
            <h2 className="adm__h2" id="src-h">Source &amp; consent</h2>
            <dl className="dl">
              <dt>Submitted from</dt><dd>{lead.source_page || "—"}</dd>
              <dt>Landing page</dt><dd className="wrap-any">{lead.landing_page || "—"}</dd>
              <dt>Referrer</dt><dd className="wrap-any">{lead.referrer || "—"}</dd>
              {utm.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}
              <dt>Consent</dt><dd>Given {fmt(lead.consent_at)} ({lead.consent_version})</dd>
            </dl>
          </section>

          <section className="card" aria-labelledby="ntf-h">
            <h2 className="adm__h2" id="ntf-h">Email alert</h2>
            <p style={{ margin: 0 }}><span className={"note-status note-status--" + lead.notification_status}>{lead.notification_status.replace("_", " ")}</span>
              {lead.notified_at && <span className="muted small"> · {fmt(lead.notified_at)}</span>}
              {lead.notification_attempts > 0 && <span className="muted small"> · {lead.notification_attempts} attempt(s)</span>}
            </p>
            {lead.notification_error && <p className="small muted" style={{ marginTop: ".5rem" }}>Last error: {lead.notification_error}</p>}
            {user.role === "admin" && lead.notification_status !== "sent" && (
              <button type="button" className="btn btn--ghost btn--sm" style={{ marginTop: ".8rem" }} onClick={retry}>Retry email alert</button>
            )}
            <div className={"alert" + (notifyMsg.kind === "error" ? " alert--error" : notifyMsg.kind === "ok" ? " alert--ok" : "")} role="status" style={{ marginTop: ".6rem" }}>{notifyMsg.text}</div>
          </section>

          <section className="card" aria-labelledby="act-h">
            <h2 className="adm__h2" id="act-h">Activity</h2>
            <ol className="activity">
              {lead.activity.map((a) => (
                <li key={a.id}>
                  <strong>{ACTIONS[a.action] || a.action.replace(/_/g, " ")}</strong>
                  {describe(a) && <span className="small"> — {describe(a)}</span>}
                  <span className="muted small d-block">{a.actor_email || "System"} · {fmt(a.created_at)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
