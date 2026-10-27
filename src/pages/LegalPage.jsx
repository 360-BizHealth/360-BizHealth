import PageHead from "../components/PageHead.jsx";
import Section from "../components/Section.jsx";

/* Shared shell for privacy, terms and disclaimer */
export default function LegalPage({ title, lede, children }) {
  return (
    <>
      <PageHead crumbs={[[title]]} title={title} lede={lede} />
      <Section tight>
        <div className="wrap">
          <div className="prose">
            {children}
            <p className="muted" style={{ fontSize: ".9rem", marginTop: "2rem" }}>This page states our current practice. Before publishing, have it reviewed against your registered entity details and applicable law, and add the verified business address and the last-updated date.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
