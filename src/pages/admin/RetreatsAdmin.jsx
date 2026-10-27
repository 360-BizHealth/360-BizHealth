import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { PACKAGES } from "../../data/retreats.js";
import { useAdmin, useCrumbs } from "./AdminApp.jsx";
import Icon from "./Icon.jsx";
import { Loading, ErrorCard } from "./ui.jsx";

/*
 * Corporate retreat packages: enquiry counts per package (live) and the package
 * content shown on the public page. Package content is maintained in code
 * (src/data/retreats.js); this screen does not edit it.
 */
export default function RetreatsAdmin() {
  const { onAuthError } = useAdmin();
  useCrumbs([["Dashboard", "/admin"], ["Retreat Packages"]]);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    api("/api/v1/admin/overview")
      .then((r) => setData({ packages: r.packages, total: r.stats.byService.find((s) => s.service === "corporate-retreat")?.count || 0 }))
      .catch((err) => { onAuthError(err); setError(err.message); });
  }, [onAuthError]);
  useEffect(() => { load(); }, [load]);

  const rows = [...PACKAGES.map((p) => ({ id: p.id, name: p.name, image: p.image, text: p.text, highlights: p.highlights })), { id: "custom", name: "Custom Package", text: "Visitors who want something other than the three packages." }];

  return (
    <>
      <div className="pagehead">
        <div>
          <h1 className="adm__h1">Retreat Packages</h1>
          <p className="muted">Enquiries received for each package on the Corporate Retreats page.</p>
        </div>
        <div className="pagehead__actions">
          <a className="btn btn--ghost btn--sm" href="/corporate-retreats-workations#packages" target="_blank" rel="noopener noreferrer"><Icon name="external" size={16} /> View public page<span className="sr-only"> (opens in a new tab)</span></a>
          <Link className="btn btn--green btn--sm" to="/admin/leads?service=corporate-retreat">All retreat enquiries</Link>
        </div>
      </div>
      {error && <ErrorCard title="Package figures could not be loaded" error={error} onRetry={load} />}
      {!data && !error && <Loading label="Loading packages…" />}
      {data && (
        <>
          <p className="muted small">{data.total} corporate retreat {data.total === 1 ? "enquiry" : "enquiries"} in total. Enquiries without a package preference are counted only in the total.</p>
          <div className="pkgs">
            {rows.map((p) => {
              const n = data.packages[p.id] || 0;
              return (
                <article key={p.id} className="panel-card pkgcard">
                  {p.image ? <img src={p.image.sm} alt="" width="320" height="180" loading="lazy" /> : <div className="pkgcard__ph" aria-hidden="true"><Icon name="retreat" size={28} /></div>}
                  <div className="pkgcard__body">
                    <h2 className="adm__h2">{p.name}</h2>
                    <p className="muted small">{p.text}</p>
                    {p.highlights && <ul className="pkgcard__list">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
                    <div className="pkgcard__foot">
                      <span><strong className="num">{n}</strong> {n === 1 ? "enquiry" : "enquiries"}</span>
                      <Link to={`/admin/leads?package=${p.id}`} className="small">View leads <Icon name="arrow" size={14} /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="muted small" style={{ marginTop: "1rem" }}>Package names, descriptions and highlights are part of the website code (<code>src/data/retreats.js</code>). Ask your developer to change them; pricing is always shown as “Request a Quote”.</p>
        </>
      )}
    </>
  );
}
