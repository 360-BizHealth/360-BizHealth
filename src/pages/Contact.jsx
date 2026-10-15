import { useSearchParams } from "react-router-dom";
import { BIZ } from "../data/site.js";
import { SERVICE_LABELS, DEFAULT_SERVICE_FOR_VERTICAL } from "../../shared/enquiry.js";
import { HAS_PHONE } from "../lib/contact.js";
import { SERVICES, SERVICE_SLUGS } from "../data/services.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import ContactForm from "../components/ContactForm.jsx";
import { EmailLink, PhoneLink, WhatsAppLink } from "../components/ContactLinks.jsx";
import { TileGrid } from "../components/Tiles.jsx";

function RailItem({ title, note }) {
  return (
    <>
      <span className="dot" aria-hidden="true"></span>
      <span>{title}<small>{note}</small></span>
    </>
  );
}

export default function Contact() {
  const [params] = useSearchParams();
  const from = params.get("from") || "";
  const vertical = DEFAULT_SERVICE_FOR_VERTICAL[from] ? from : "";
  const requested = params.get("service");
  const defaultService = SERVICE_LABELS[requested] ? requested : vertical ? DEFAULT_SERVICE_FOR_VERTICAL[vertical] : "";
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
              <EmailLink><RailItem title={BIZ.email} note="For detailed requirements and documents" /></EmailLink>
              {HAS_PHONE && <PhoneLink><RailItem title={BIZ.phoneDisplay} note="Call during business hours" /></PhoneLink>}
              {HAS_PHONE && <WhatsAppLink><RailItem title="WhatsApp" note="Message us with a short description" /></WhatsAppLink>}
            </div>
            <p className="muted" style={{ marginTop: "1.2rem", fontSize: ".94rem" }}>Based in {BIZ.area}. We work with businesses across India, and payroll and compliance scope is confirmed state by state.</p>
            <p className="muted" style={{ fontSize: ".94rem" }}>Useful to include: headcount, states of operation, what you use today and your timeline.</p>
          </div>

          <div className="card">
            <h2 style={{ fontSize: "1.4rem" }}>Send an enquiry</h2>
            <ContactForm defaultService={defaultService} vertical={vertical} />
          </div>
        </div>
      </Section>

      <Section tight tone="tint">
        <Reveal className="wrap">
          <h2 style={{ fontSize: "1.5rem" }}>Not sure which service you need?</h2>
          <p className="lede">Pick the closest starting point and we will route it correctly.</p>
          <TileGrid items={SERVICE_SLUGS.map((k) => ({ title: SERVICES[k].nav, text: SERVICES[k].kicker, to: "/" + k }))} cols={4} style={{ marginTop: "1.2rem" }} />
        </Reveal>
      </Section>
    </>
  );
}
