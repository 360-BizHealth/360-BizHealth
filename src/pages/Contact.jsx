import { BIZ } from "../data/site.js";
import { SERVICES, SERVICE_SLUGS } from "../data/services.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import ContactForm from "../components/ContactForm.jsx";
import { WhatsAppLink, EmailLink, PhoneLink } from "../components/ContactLinks.jsx";
import { TileGrid } from "../components/Tiles.jsx";

function RailItem({ color, title, note }) {
  return (
    <>
      <span className="dot" style={{ background: color }}></span>
      <span style={{ fontWeight: 700, color: "var(--ink)" }}>
        {title}<span style={{ fontWeight: 500 }}>{note}</span>
      </span>
    </>
  );
}

export default function Contact() {
  return (
    <>
      <PageHead crumbs={[["Contact"]]} title="Talk to a 360 Biz Health expert"
        lede="Tell us the requirement and we will come back with a clear next step. Most enquiries are answered within one working day." />

      <Section tight>
        <div className="wrap split split--wide">
          <div>
            <Eyebrow>Direct</Eyebrow>
            <h2 style={{ fontSize: "1.5rem" }}>Reach us your way</h2>
            <div className="rail" style={{ marginTop: "1rem" }}>
              <WhatsAppLink><RailItem color="var(--teal)" title="WhatsApp" note="Fastest for a quick question" /></WhatsAppLink>
              <EmailLink><RailItem color="var(--gold)" title={BIZ.email} note="For detailed requirements and documents" /></EmailLink>
              <PhoneLink><RailItem color="var(--red)" title={BIZ.phoneDisplay} note="Monday to Saturday, business hours IST" /></PhoneLink>
            </div>
            <p className="muted" style={{ marginTop: "1.2rem", fontSize: ".94rem" }}>Based in {BIZ.area}. We work with businesses across India, and payroll and compliance scope is confirmed state by state.</p>
            <p className="muted" style={{ fontSize: ".94rem" }}>Useful to include: headcount, states of operation, what you use today and your timeline.</p>
          </div>

          <div className="card">
            <h2 style={{ fontSize: "1.4rem" }}>Send an enquiry</h2>
            <p className="muted" style={{ fontSize: ".94rem" }}>Fields marked <span className="req">*</span> are required.</p>
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <h2 style={{ fontSize: "1.5rem" }}>Not sure which service you need?</h2>
          <p className="lede">Pick the closest starting point and we will route it correctly.</p>
          <TileGrid items={SERVICE_SLUGS.map((k) => ({ title: SERVICES[k].nav, to: "/" + k }))} cols={4} style={{ marginTop: "1.2rem" }} />
        </Reveal>
      </Section>
    </>
  );
}
