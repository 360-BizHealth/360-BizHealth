import { useMemo, useState } from "react";
import { LEAD_STATUSES } from "../data/site.js";
import { readLeads, writeLeads, leadsToCsv } from "../lib/leads.js";
import PageHead from "../components/PageHead.jsx";
import Section from "../components/Section.jsx";
import Button, { TextLink } from "../components/Button.jsx";

/* Lead dashboard preview. Reads the leads saved by the contact form in this browser.
   In production this route must sit behind authentication and read from the database. */

function LeadCard({ lead, onChange }) {
  const l = lead;
  const src = (l.source && (l.source.utm_source || l.source.referrer)) || "direct";
  const bind = (f) => ({ value: l[f] || "", onChange: (e) => onChange(l.id, f, e.target.value) });
  return (
    <div className="card" style={{ padding: "18px 20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h3 style={{ fontFamily: "var(--sans)", fontSize: "1.05rem", marginBottom: ".1rem" }}>{l.company || "—"}</h3>
          <p className="muted" style={{ fontSize: ".9rem", margin: 0 }}>{l.name} &middot; {l.email} &middot; {l.phone}</p>
        </div>
        <span className="muted" style={{ fontSize: ".82rem" }}>{l.id} &middot; {new Date(l.createdAt).toLocaleString()}</span>
      </div>
      <p style={{ fontSize: ".94rem", margin: ".7rem 0 .4rem" }}>
        <strong>{l.service}</strong>
        {l.size && <> &middot; {l.size} employees</>}
        {l.city && <> &middot; {l.city}</>}
        {l.currentHrms && <> &middot; currently: {l.currentHrms}</>}
      </p>
      <p style={{ fontSize: ".94rem", color: "var(--ink-2)" }}>{l.message}</p>
      <p className="muted" style={{ fontSize: ".84rem" }}>Source: {src}{l.source && l.source.utm_campaign ? " / " + l.source.utm_campaign : ""}</p>
      <div className="grid g3" style={{ gap: ".6rem", marginTop: ".6rem" }}>
        <div className="field"><label>Status<select {...bind("status")}>{LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label></div>
        <div className="field"><label>Assigned to<input {...bind("owner")} /></label></div>
        <div className="field"><label>Next follow-up<input type="date" {...bind("nextFollowUp")} /></label></div>
      </div>
      <div className="field" style={{ marginTop: ".6rem" }}><label>Notes<textarea style={{ minHeight: 70 }} {...bind("notes")} /></label></div>
    </div>
  );
}

export default function Admin() {
  const [leads, setLeads] = useState(readLeads);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("new");

  const visible = useMemo(() => {
    const needle = q.toLowerCase();
    let list = leads.filter((l) => {
      const hay = [l.name, l.company, l.email, l.phone, l.service].join(" ").toLowerCase();
      return (!needle || hay.includes(needle)) && (!status || l.status === status);
    });
    if (sort === "old") list = [...list].reverse();
    if (sort === "company") list = [...list].sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    return list;
  }, [leads, q, status, sort]);

  const updateLead = (id, field, value) => {
    setLeads((all) => {
      const next = all.map((x) => (x.id === id ? { ...x, [field]: value, lastFollowUp: new Date().toISOString() } : x));
      writeLeads(next);
      return next;
    });
  };

  const clear = () => { writeLeads([]); setLeads([]); };

  const exportCsv = () => {
    const blob = new Blob([leadsToCsv(readLeads())], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "360bizhealth-leads.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <>
      <PageHead title="Lead dashboard"
        lede="A working preview of the lead management screen. In the deployed application this screen sits behind authentication with role-based access, and reads from the database rather than from this browser." />
      <Section tight>
        <div className="wrap">
          <div className="card" style={{ marginBottom: "1.2rem" }}>
            <div className="grid g3" style={{ alignItems: "end" }}>
              <div className="field"><label htmlFor="a-q">Search</label><input id="a-q" placeholder="Name, company, email or phone" value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <div className="field"><label htmlFor="a-status">Status</label>
                <select id="a-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">All statuses</option>
                  {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field"><label htmlFor="a-sort">Sort</label>
                <select id="a-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="new">Newest first</option>
                  <option value="old">Oldest first</option>
                  <option value="company">Company A–Z</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <Button variant="ink" size="sm" onClick={exportCsv}>Export CSV</Button>
              <Button variant="ghost" size="sm" onClick={clear}>Clear local leads</Button>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="card">
              <h3 style={{ fontFamily: "var(--sans)", fontSize: "1.05rem" }}>No leads here yet</h3>
              <p className="muted">Submit the enquiry form on the contact page and it will appear in this list. This preview stores leads in your own browser only.</p>
              <p><TextLink to="/contact">Open the enquiry form</TextLink></p>
            </div>
          ) : (
            <div className="grid" style={{ gap: ".8rem" }}>
              {visible.map((l) => <LeadCard key={l.id} lead={l} onChange={updateLead} />)}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
