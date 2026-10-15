import { useLocation } from "react-router-dom";
import { SERVICES, SERVICE_SLUGS } from "../data/services.js";
import { HAS_PHONE } from "../lib/contact.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import Button from "../components/Button.jsx";
import { TileGrid } from "../components/Tiles.jsx";
import { Steps } from "../components/Lists.jsx";

const NEXT = [
  ["We read the requirement", "Someone from the relevant vertical picks it up, not a general inbox."],
  ["We call or write back", "A short conversation to confirm scope, constraints and timelines."],
  ["You get a clear next step", "A recommendation with reasons, and what it would involve."],
];

export default function ThankYou() {
  const { state } = useLocation();
  const reference = state && typeof state.reference === "string" && /^BH-[A-Z0-9]{6}$/.test(state.reference) ? state.reference : null;
  const links = [...SERVICE_SLUGS.map((k) => ({ title: SERVICES[k].nav, to: "/" + k })), { title: "Practical guides", to: "/blog" }];
  return (
    <>
      <PageHead title="Thank you. Your enquiry has been received."
        lede={reference
          ? `Your reference is ${reference}. Someone from the team will respond within one working day, usually sooner.`
          : "Someone from the team will respond within one working day, usually sooner."}>
        {HAS_PHONE && <Button variant="primary" whatsapp msg={`Hi 360 Biz Health, I just submitted an enquiry on your website${reference ? " (" + reference + ")" : ""}.`}>Continue on WhatsApp</Button>}
        <Button variant="onink" to="/">Back to home</Button>
      </PageHead>
      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>What happens next</Eyebrow>
            <Steps items={NEXT} />
          </div>
          <div>
            <Eyebrow>While you wait</Eyebrow>
            <TileGrid items={links} cols={2} />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
