import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAdmin } from "./AdminApp.jsx";
import { SERVICE_OPTIONS, SERVICE_LABELS, LEAD_STATUSES, LEAD_STATUS_LABELS } from "../../../shared/enquiry.js";

const FILTER_KEYS = ["q", "status", "service", "from", "to", "notification", "sort", "page"];
const fmt = (d) => new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function StatusPill({ status }) {
  return <span className={"pill pill--" + status}>{LEAD_STATUS_LABELS[status] || status}</span>;
}

function Stats({ stats }) {
  const items = [
    ["Total leads", stats.total],
    ["Last 7 days", stats.last7],
    ["New, not yet contacted", stats.byStatus.new || 0],
    ["Follow-ups due", stats.follow_up_due],
    ["Converted", stats.byStatus.converted || 0],
    ["Email alerts failed", stats.notification_failed],
  ];
  return (
    <section aria-label="Overview" className="adm__stats">
      {items.map(([label, n]) => (
        <div key={label} className={"stat" + (label.startsWith("Email") && n > 0 ? " stat--warn" : "")}>
          <span className="stat__n num">{n}</span>
          <span className="stat__l">{label}</span>
        </div>
      ))}
    </section>
  );
}

export default function Dashboard() {
  const { user, onAuthError } = useAdmin();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || ""])), [params]);
  const [draft, setDraft] = useState(filters);
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
    Promise.all([api("/api/v1/admin/leads?" + qs, { signal: ctl.signal }), api("/api/v1/admin/stats", { signal: ctl.signal })])
      .then(([list, s]) => { setData(list); setStats(s.stats); })
      .catch((err) => { if (err.name === "AbortError") return; onAuthError(err); setError(err.message); })
      .finally(() => { if (!ctl.signal.aborted) setLoading(false); });
    return () => ctl.abort();
  }, [qs, onAuthError]);

  const apply = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    Object.entries(draft).forEach(([k, v]) => v && k !== "page" && p.set(k, v));
    setParams(p);
  };
  const reset = () => setParams(new URLSearchParams());
  const goPage = (n) => { const p = new URLSearchParams(params); p.set("page", String(n)); setParams(p); };
  const d = (k) => ({ value: draft[k], onChange: (e) => setDraft((x) => ({ ...x, [k]: e.target.value })) });

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const exportHref = "/api/v1/admin/leads/export" + (qs ? "?" + qs : "");

  return (
    <>
      <div className="adm__head">
        <h1 className="adm__h1">Leads</h1>
        {user.role === "admin" && <a className="btn btn--ghost btn--sm" href={exportHref} download>Export CSV</a>}
      </div>
      {stats && <Stats stats={stats} />}

      <form className="card adm__filters" onSubmit={apply} role="search" aria-label="Filter leads">
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
          <label htmlFor="f-sort">Sort</label>
          <select id="f-sort" {...d("sort")}><option value="">Newest first</option><option value="oldest">Oldest first</option><option value="updated">Recently updated</option><option value="follow_up">Next follow-up</option></select>
        </div>
        <div className="adm__filter-actions">
          <button className="btn btn--green btn--sm" type="submit">Apply filters</button>
          <button className="btn btn--ghost btn--sm" type="button" onClick={reset}>Reset</button>
        </div>
      </form>

      <p className="sr-only" role="status" aria-live="polite">{loading ? "Loading leads" : data ? `${data.total} leads found` : ""}</p>
      {error && <div className="alert alert--error" role="alert">{error}</div>}

      {data && (
        <>
          <p className="muted small" style={{ margin: "1rem 0 .6rem" }}>
            {data.total === 0 ? "No leads match." : `Showing ${(data.page - 1) * data.pageSize + 1}–${Math.min(data.page * data.pageSize, data.total)} of ${data.total}`}
            {loading && " · updating…"}
          </p>
          {data.total === 0 ? (
            <div className="card">
              <h2 className="adm__h2">{qs ? "No leads match these filters" : "No leads yet"}</h2>
              <p className="muted">{qs ? "Try widening the date range or clearing the search." : "Enquiries submitted through the website contact form will appear here."}</p>
              {qs && <button className="btn btn--ghost btn--sm" type="button" onClick={reset}>Clear filters</button>}
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
                      <td data-label="Received"><div><span className="nowrap">{fmt(l.created_at)}</span><br /><span className="muted small">{l.reference}</span></div></td>
                      <td data-label="Lead">
                        <div>
                          <Link to={`/admin/leads/${l.id}`} className="ltable__name">{l.name}</Link>
                          <span className="muted small"> · {l.company}</span>
                          <div className="muted small ltable__preview">{l.subject ? <strong>{l.subject}: </strong> : null}{l.message_preview}</div>
                        </div>
                      </td>
                      <td data-label="Service">{SERVICE_LABELS[l.service] || l.service}</td>
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
