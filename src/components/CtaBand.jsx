import Reveal from "./Reveal.jsx";
import Button from "./Button.jsx";
import { HAS_PHONE } from "../lib/contact.js";
import { EmailLink } from "./ContactLinks.jsx";

/* Closing call to action: one heading, one line, one primary button and a quiet
   secondary contact link (WhatsApp once a real number is configured, else email). */
export default function CtaBand({ title, text, waMsg, to = "/contact", eyebrow }) {
  return (
    <section className="cta-sec">
      <div className="wrap">
        <Reveal className="cta">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
          {text && <p className="lede">{text}</p>}
          <div className="cta__actions">
            <Button variant="primary" to={to}>Talk to an expert</Button>
            {HAS_PHONE
              ? <Button variant="text" whatsapp msg={waMsg}>or message us on WhatsApp</Button>
              : <EmailLink className="btn btn--text">or email us</EmailLink>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
