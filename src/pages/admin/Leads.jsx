import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import { SERVICE_OPTIONS, LEAD_STATUSES, RETREAT_PACKAGES } from "../../../shared/enquiry.js";
import { useAdmin, useCrumbs } from "./AdminApp.jsx";
import Icon from "./Icon.jsx";
import { StatusPill, fmtDateTime, serviceLabel, packageLabel } from "./ui.jsx";

const FILTER_KEYS = ["q", "status", "service", "package", "from", "to", "notification", "due", "sort", "page", "pageSize"];

/*
 * Lead workspace. Every view is a fresh query against the database, so a lead
 * submitted through the website appears on the next load, refresh, or when this
 * tab regains focus. Filters live in the URL, so back/forward and links work.
 */
export default function Leads() {
  const { user, onAuthError, refreshCount } = useAdmin();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || ""])), [params]);
  const inbox = filters.status === "new" && !filters.q && !filters.service;
  useCrumbs([["Dashboard", "/admin"], [inbox ? "Enquiries" : "Leads"]]);
  const [draft, setDraft] = useState(filters);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [checkedAt, setCheckedAt] = useState(null);

  useEffect(() => { setDraft(filters); }, [filters]);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && p.set(k, v));
    return p.toString();
  }, [filters]);

  useEffect(() => {
    const ctl = new AbortController();
    setLoading(true);
    setError("");
    api("/api/v1/admin/leads?" + qs, { signal: ctl.signal })
      .then((list) => { setData(list); setCheckedAt(new Date()); })
      .catch((err) => { if (err.name === "AbortError") return; onAuthError(err); setError(err.message); })
      .finally(() => { if (!ctl.signal.aborted) setLoading(false); });
    return () => ctl.abort();
  }, [qs, tick, onAuthError]);

  /* new website enquiries show up when the team comes back to this tab */
  const refresh = useCallback(() => { setTick((t) => t + 1); refreshCount(); }, [refreshCount]);
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const apply = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    Object.entries(draft).forEach(([k, v]) => v && k !== "page" && p.set(k, v));
    setParams(p);
  };
  const reset = () => setParams(new URLSearchParams());
  const goPage = (n) => { const p = new URLSearchParams(params); p.set("page", String(n)); setParams(p); };
  const d = (k) => ({ value: draft[k], onChange: (e) => setDraft((x) => ({ ...x, [k]: e.target.value })) });
  const active = Object.entries(filters).filter(([k, v]) => v && !["page", "pageSize", "sort"].includes(k)).length;

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const exportHref = "/api/v1/admin/leads/export" + (qs ? "?" + qs : "");

  return (
    <>
      <div className="pagehead">
        <div>
          <h1 className="adm__h1">{inbox ? "Enquiries" : "Leads"}</h1>
          <p className="muted">{inbox ? "New website enquiries that nobody has contacted yet." : "Every enquiry submitted through the website, newest first."}</p>
        </div>
        <div className="pagehead__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={refresh} disabled={loading}><Icon name="refresh" size={16} /> Refresh</button>
          {user.role === "admin" && <a className="btn btn--ghost btn--sm" href={exportHref} download><Icon name="download" size={16} /> Export CSV</a>}
        </div>
      </div>

      <form className="panel-card adm__filters" onSubmit={apply} role="search" aria-label="Filter leads">
        <div className="field adm__q">
          <label htmlFor="f-q">Search</label>
          <input id="f-q" type="search" placeholder="Name, company, email, phone, subject or reference" {...d("q")} />
        </div>
        <div className="field">
          <label htmlFor="f-status">Status</label>
          <select id="f-status" {...d("status")}><option value="">All</option>{LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="f-service">Service</label>
          <select id="f-service" {...d("service")}><option value="">All</option>{SERVICE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="f-package">Retreat package</label>
          <select id="f-package" {...d("package")}><option value="">Any</option>{RETREAT_PACKAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
        </div>
        <div className="field">
          <label htmlFor="f-from">From</label>
          <input id="f-from" type="date" {...d("from")} />
        </div>
        <div className="field">
          <label htmlFor="f-to">To</label>
          <input id="f-to" type="date" {...d("to")} />
        </div>
        <div className="field">
          <label htmlFor="f-notif">Email alert</label>
          <select id="f-notif" {...d("notification")}><option value="">Any</option><option value="failed">Failed</option><option value="pending">Pending</option><option value="sent">Sent</option><option value="not_configured">Not configured</option></select>
        </div>
        <div className="field">
          <label htmlFor="f-due">Follow-up</label>
          <select id="f-due" {...d("due")}><option value="">Any</option><option value="1">Due today or overdue</option></select>
        </div>
        <div className="field">
          <label htmlFor="f-sort">Sort</label>
          <select id="f-sort" {...d("sort")}><option value="">Newest first</option><option value="oldest">Oldest first</option><option value="updated">Recently updated</option><option value="follow_up">Next follow-up</option><option value="name">Name A to Z</option></select>
        </div>
        <div className="field">
          <label htmlFor="f-size">Per page</label>
          <select id="f-size" {...d("pageSize")}><option value="">25</option><option value="50">50</option><option value="100">100</option></select>
        </div>
        <div className="adm__filter-actions">
          <button className="btn btn--green btn--sm" type="submit">Apply filters</button>
          <button className="btn btn--ghost btn--sm" type="button" onClick={reset} disabled={!active}>Reset{active ? ` (${active})` : ""}</button>
        </div>
      </form>

      <p className="sr-only" role="status" aria-live="polite">{loading ? "Loading leads" : data ? `${data.total} leads found` : ""}</p>
      {error && <div className="alert alert--error" role="alert" style={{ marginTop: "1rem" }}>{error} <button type="button" className="btn btn--ghost btn--sm" onClick={refresh}>Try again</button></div>}

      {!data && loading && <p className="adm__loading" style={{ marginTop: "1rem" }}><span className="spinner" aria-hidden="true" /> Loading leads…</p>}
      {data && (
        <>
          <p className="muted small listmeta">
            {data.total === 0 ? "No leads match." : `Showing ${(data.page - 1) * data.pageSize + 1}–${Math.min(data.page * data.pageSize, data.total)} of ${data.total}`}
            {loading ? " · updating…" : checkedAt ? ` · checked ${checkedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : ""}
          </p>
          {data.total === 0 ? (
            <div className="panel-card empty">
              <h2 className="adm__h2">{qs && active ? "No leads match these filters" : "No leads yet"}</h2>
              <p className="muted">{qs && active ? "Try widening the date range or clearing the search." : "Enquiries submitted through the website forms appear here as soon as they are saved."}</p>
              {active > 0 && <button className="btn btn--ghost btn--sm" type="button" onClick={reset}>Clear filters</button>}
            </div>
          ) : (
            <div className="ltable-wrap">
              <table className="ltable">
                <caption className="sr-only">Leads, page {data.page} of {pages}</caption>
                <thead>
                  <tr><th scope="col">Received</th><th scope="col">Name &amp; company</th><th scope="col">Service</th><th scope="col">Status</th><th scope="col">Follow-up</th><th scope="col">Alert</th></tr>
                </thead>
                <tbody>
                  {data.items.map((l) => (
                    <tr key={l.id}>
                      <td data-label="Received"><div><span className="nowrap">{fmtDateTime(l.created_at)}</span><br /><span className="muted small">{l.reference}</span></div></td>
                      <td data-label="Lead">
                        <div>
                          <Link to={`/admin/leads/${l.id}`} className="ltable__name">{l.name}</Link>
                          <span className="muted small"> · {l.company}</span>
                          <div className="muted small ltable__preview">{l.subject ? <strong>{l.subject}: </strong> : null}{l.message_preview}</div>
                        </div>
                      </td>
                      <td data-label="Service">{serviceLabel(l.service)}{l.retreat_package && <div className="muted small">{packageLabel(l.retreat_package)}</div>}</td>
                      <td data-label="Status"><StatusPill status={l.status} /></td>
                      <td data-label="Follow-up">{l.next_follow_up || <span className="muted">—</span>}</td>
                      <td data-label="Alert"><span className={"note-status note-status--" + l.notification_status}>{l.notification_status.replace("_", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pages > 1 && (
            <nav className="pager" aria-label="Pagination">
              <button type="button" className="btn btn--ghost btn--sm" disabled={data.page <= 1} onClick={() => goPage(data.page - 1)}>Previous</button>
              <span>Page {data.page} of {pages}</span>
              <button type="button" className="btn btn--ghost btn--sm" disabled={data.page >= pages} onClick={() => goPage(data.page + 1)}>Next</button>
            </nav>
          )}
        </>
      )}
    </>
  );
}
