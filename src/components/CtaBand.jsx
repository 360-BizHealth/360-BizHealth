import Reveal from "./Reveal.jsx";
import Button from "./Button.jsx";
import { HAS_PHONE } from "../lib/contact.js";
import { EmailLink } from "./ContactLinks.jsx";

export default function CtaBand({ title, text, waMsg, to = "/contact", eyebrow }) {
  return (
    <section className="sec--tight">
      <div className="wrap">
        <Reveal className="panel panel--ring">
          {eyebrow && <p className="eyebrow eyebrow--ondark">{eyebrow}</p>}
          <h2 style={{ maxWidth: "24ch" }}>{title}</h2>
          <p className="lede" style={{ color: "rgba(249,244,234,.88)" }}>{text}</p>
          <div className="hero__cta">
            <Button variant="primary" to={to}>Talk to an expert</Button>
            {HAS_PHONE
              ? <Button variant="onink" whatsapp msg={waMsg}>WhatsApp us</Button>
              : <EmailLink className="btn btn--onink">Email us</EmailLink>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
