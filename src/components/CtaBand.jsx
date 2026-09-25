import Reveal from "./Reveal.jsx";
import Button from "./Button.jsx";

export default function CtaBand({ title, text, waMsg }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal className="panel panel--edge">
          <h2>{title}</h2>
          <p className="lede" style={{ color: "rgba(255,255,255,.82)" }}>{text}</p>
          <div className="hero__cta">
            <Button variant="primary" to="/contact">Talk to an expert</Button>
            <Button variant="onink" whatsapp msg={waMsg}>WhatsApp us</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
