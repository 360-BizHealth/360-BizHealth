import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { LEAD_STATUSES } from "../../../shared/enquiry.js";
import { useAdmin, useCrumbs } from "./AdminApp.jsx";
import Icon from "./Icon.jsx";
import { StatusPill, fmtDateTime, fmtDate, serviceLabel, packageLabel, istDaysAgo, Loading, ErrorCard } from "./ui.jsx";

const ACTIONS = {
  lead_created: "New enquiry",
  lead_updated: "Lead updated",
  note_added: "Note added",
  blog_post_created: "Draft created",
  blog_post_updated: "Post edited",
  blog_post_published: "Post published",
  blog_post_unpublished: "Post unpublished",
  blog_post_deleted: "Post deleted",
};

function Kpi({ label, value, to, hint }) {
  return (
    <Link to={to} className="kpi">
      <span className="kpi__label">{label}</span>
      <span className="kpi__value num">{value}</span>
      {hint && <span className="kpi__hint">{hint}</span>}
      <span className="kpi__go" aria-hidden="true"><Icon name="arrow" size={16} /></span>
    </Link>
  );
}

/* 30-day enquiry trend: one series, one hue, bars anchored to the baseline. */
function TrendChart({ days }) {
  const [hover, setHover] = useState(null);
  const total = days.reduce((a, d) => a + d.n, 0);
  if (!total) return <p className="muted small">No enquiries in the last 30 days yet. The chart appears once leads arrive.</p>;
  const max = Math.max(...days.map((d) => d.n));
  const top = Math.max(2, Math.ceil(max / 2) * 2);
  const W = 600, H = 160, padL = 26, padB = 22, bw = (W - padL) / days.length;
  const y = (v) => (H - padB) - (v / top) * (H - padB - 8);
  const label = (iso) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-IN", { day: "2-digit", month: "short", timeZone: "UTC" });
  return (
    <div className="trend">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="trend-t" className="trend__svg" onMouseLeave={() => setHover(null)}>
        <title id="trend-t">{`Enquiries per day, last 30 days: ${total} in total, highest ${max} in a day.`}</title>
        {[0, top / 2, top].map((v) => (
          <g key={v}>
            <line x1={padL} x2={W} y1={y(v)} y2={y(v)} className={v === 0 ? "trend__base" : "trend__grid"} />
            <text x={padL - 6} y={y(v) + 4} textAnchor="end" className="trend__tick">{v}</text>
          </g>
        ))}
        {days.map((d, i) => {
          const h = Math.max(4, (H - padB) - y(d.n));
          const x = padL + i * bw + 1;
          return (
            <g key={d.day} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={-1}>
              <rect x={padL + i * bw} y={0} width={bw} height={H - padB} fill="transparent" />
              {d.n > 0 && <path className={"trend__bar" + (hover === i ? " is-hover" : "")} d={`M${x},${H - padB} v${-(h - 3)} q0,-3 3,-3 h${bw - 8} q3,0 3,3 v${h - 3} z`} />}
            </g>
          );
        })}
        <text x={padL} y={H - 5} className="trend__tick">{label(days[0].day)}</text>
        <text x={W} y={H - 5} textAnchor="end" className="trend__tick">{label(days[days.length - 1].day)}</text>
      </svg>
      {hover !== null && (
        <div className="trend__tip" style={{ left: `${((padL + (hover + 0.5) * bw) / W) * 100}%` }} role="status">
          <strong>{days[hover].n}</strong> {days[hover].n === 1 ? "enquiry" : "enquiries"}<span>{label(days[hover].day)}</span>
        </div>
      )}
      <table className="sr-only">
        <caption>Enquiries per day</caption>
        <thead><tr><th scope="col">Date</th><th scope="col">Enquiries</th></tr></thead>
        <tbody>{days.map((d) => <tr key={d.day}><td>{d.day}</td><td>{d.n}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function StatusBars({ byStatus, total }) {
  if (!total) return <p className="muted small">No leads yet.</p>;
  return (
    <ul className="sbars">
      {LEAD_STATUSES.map((s) => {
        const n = byStatus[s.value] || 0;
        return (
          <li key={s.value}>
            <Link to={`/admin/leads?status=${s.value}`} className="sbars__row">
              <span className="sbars__label">{s.label}</span>
              <span className="sbars__track" aria-hidden="true"><span className="sbars__fill" style={{ width: `${(n / total) * 100}%` }} /></span>
              <span className="sbars__n num">{n}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Overview() {
  const { user, onAuthError } = useAdmin();
  useCrumbs([["Dashboard"]]);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api("/api/v1/admin/overview")
      .then(setData)
      .catch((err) => { onAuthError(err); setError(err.message); })
      .finally(() => setLoading(false));
  }, [onAuthError]);
  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="pagehead">
        <div>
          <h1 className="adm__h1">Dashboard</h1>
          <p className="muted">Live figures from the lead and blog database.</p>
        </div>
        <div className="pagehead__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={load} disabled={loading}><Icon name="refresh" size={16} /> Refresh</button>
          <Link className="btn btn--ghost btn--sm" to="/admin/leads">View leads</Link>
          <Link className="btn btn--primary btn--sm" to="/admin/blog/new"><Icon name="plus" size={16} /> Add blog post</Link>
        </div>
      </div>

      {error && <ErrorCard title="The dashboard could not be loaded" error={error} onRetry={load} />}
      {!data && loading && <Loading label="Loading dashboard…" />}

      {data && (
        <>
          <section className="kpis" aria-label="Key figures">
            <Kpi label="Total leads" value={data.stats.total} to="/admin/leads" />
            <Kpi label="New leads" value={data.stats.byStatus.new || 0} to="/admin/leads?status=new" hint="Not yet contacted" />
            <Kpi label="Last 7 days" value={data.stats.last7} to={`/admin/leads?from=${istDaysAgo(6)}`} hint="Enquiries received" />
            <Kpi label="Follow-ups due" value={data.stats.follow_up_due} to="/admin/leads?due=1&sort=follow_up" hint="Today or overdue" />
            <Kpi label="Converted" value={data.stats.byStatus.converted || 0} to="/admin/leads?status=converted" />
            <Kpi label="Published posts" value={data.stats.published_posts} to="/admin/blog?status=published" hint={`${data.stats.draft_posts} draft${data.stats.draft_posts === 1 ? "" : "s"}`} />
          </section>

          {data.stats.notification_failed > 0 && (
            <div className="alert alert--error" role="alert" style={{ marginBottom: "1.2rem" }}>
              {data.stats.notification_failed} lead email {data.stats.notification_failed === 1 ? "alert has" : "alerts have"} failed. <Link to="/admin/leads?notification=failed">Review them</Link>.
            </div>
          )}

          <div className="dgrid">
            <section className="panel-card dgrid__wide" aria-labelledby="trend-h">
              <div className="panel-card__head"><h2 className="adm__h2" id="trend-h">Enquiries, last 30 days</h2><span className="muted small">{data.stats.last30} in total</span></div>
              <TrendChart days={data.trend} />
            </section>

            <section className="panel-card" aria-labelledby="status-h">
              <div className="panel-card__head"><h2 className="adm__h2" id="status-h">Lead status</h2><Link to="/admin/leads" className="small">All leads</Link></div>
              <StatusBars byStatus={data.stats.byStatus} total={data.stats.total} />
            </section>

            <section className="panel-card dgrid__wide" aria-labelledby="recent-h">
              <div className="panel-card__head"><h2 className="adm__h2" id="recent-h">Recent leads</h2><Link to="/admin/leads" className="small">View all</Link></div>
              {data.recentLeads.length === 0 ? (
                <p className="muted small">No enquiries yet. Submissions from the website forms appear here as soon as they are saved.</p>
              ) : (
                <div className="ltable-wrap ltable-wrap--flush">
                  <table className="ltable">
                    <caption className="sr-only">Six most recent leads</caption>
                    <thead><tr><th scope="col">Lead</th><th scope="col">Service</th><th scope="col">Received</th><th scope="col">Status</th></tr></thead>
                    <tbody>
                      {data.recentLeads.map((l) => (
                        <tr key={l.id}>
                          <td data-label="Lead"><div><Link to={`/admin/leads/${l.id}`} className="ltable__name">{l.name}</Link><div className="muted small">{l.company} · {l.reference}</div></div></td>
                          <td data-label="Service">{serviceLabel(l.service)}{l.retreat_package && <div className="muted small">{packageLabel(l.retreat_package)}</div>}</td>
                          <td data-label="Received" className="nowrap">{fmtDateTime(l.created_at)}</td>
                          <td data-label="Status"><StatusPill status={l.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="panel-card" aria-labelledby="act-h">
              <div className="panel-card__head"><h2 className="adm__h2" id="act-h">Recent activity</h2></div>
              {data.activity.length === 0 ? <p className="muted small">Nothing yet.</p> : (
                <ol className="feed">
                  {data.activity.map((a) => {
                    const d = a.details || {};
                    const target = a.lead_id
                      ? <Link to={`/admin/leads/${a.lead_id}`}>{a.lead_name || a.lead_reference}</Link>
                      : d.post_id && a.action !== "blog_post_deleted" ? <Link to={`/admin/blog/${d.post_id}`}>{d.slug}</Link> : d.title || d.slug || "";
                    return (
                      <li key={a.id}>
                        <span className={"feed__dot feed__dot--" + (a.action.startsWith("blog") ? "blog" : "lead")} aria-hidden="true" />
                        <div><strong>{ACTIONS[a.action] || a.action}</strong> {target}<span className="muted small d-block">{a.actor_email || "Website form"} · {fmtDateTime(a.created_at)}</span></div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            <section className="panel-card dgrid__wide" aria-labelledby="posts-h">
              <div className="panel-card__head"><h2 className="adm__h2" id="posts-h">Recently edited posts</h2><Link to="/admin/blog" className="small">Blog management</Link></div>
              {data.recentPosts.length === 0 ? <p className="muted small">No posts yet. <Link to="/admin/blog/new">Write the first one</Link>.</p> : (
                <ul className="plist">
                  {data.recentPosts.map((p) => (
                    <li key={p.id}>
                      <Link to={`/admin/blog/${p.id}`} className="plist__title">{p.title}</Link>
                      <span className="muted small">{p.category} · edited {fmtDate(p.updated_at)}</span>
                      <span className={"pill pill--" + p.status}>{p.status === "published" ? "Published" : "Draft"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel-card" aria-labelledby="qa-h">
              <div className="panel-card__head"><h2 className="adm__h2" id="qa-h">Quick actions</h2></div>
              <ul className="qa">
                <li><Link to="/admin/blog/new"><Icon name="plus" /> Write a new blog post</Link></li>
                <li><Link to="/admin/leads?status=new"><Icon name="inbox" /> Review new enquiries</Link></li>
                <li><Link to="/admin/leads?service=corporate-retreat"><Icon name="retreat" /> Corporate retreat enquiries</Link></li>
                {user.role === "admin" && <li><a href="/api/v1/admin/leads/export" download><Icon name="download" /> Export all leads (CSV)</a></li>}
              </ul>
            </section>
          </div>
        </>
      )}
    </>
  );
}
