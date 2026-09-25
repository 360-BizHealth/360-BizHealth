import { SERVICES } from "../data/services.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import Button, { TextLink } from "../components/Button.jsx";
import FaqList from "../components/FaqList.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { TileGrid } from "../components/Tiles.jsx";
import { Flow, ListCard } from "../components/Lists.jsx";

/* One template for all four service verticals; content lives in data/services.js */
export default function ServicePage({ slug }) {
  const s = SERVICES[slug];
  return (
    <>
      <PageHead crumbs={[["Services"], [s.nav]]} title={s.h1} lede={s.kicker}>
        <Button variant="primary" to="/contact" ev="service_page_cta">Talk to an expert</Button>
      </PageHead>

      <Section tight>
        <Reveal className="wrap split">
          <div>{s.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
          <ListCard title={s.problemTitle} items={s.problems} listStyle={{ fontSize: ".96rem", color: "var(--ink-2)" }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>What we provide</Eyebrow>
          <h2>{s.provideTitle}</h2>
          <TileGrid items={s.provide} cols={3} style={{ marginTop: "1.5rem" }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Process</Eyebrow>
          <h2>{s.processTitle}</h2>
          <Flow items={s.flow} style={{ marginTop: "1.2rem" }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>Scope</Eyebrow>
            <h2>{s.capsTitle}</h2>
            <p className="muted">{s.capsNote}</p>
          </div>
          <TileGrid items={s.caps.map((c) => ({ title: c }))} cols={2} tileProps={{ titleStyle: { margin: 0 } }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Who it&rsquo;s for</Eyebrow>
          <h2>{s.forTitle}</h2>
          <TileGrid items={s.forWho} cols={4} style={{ marginTop: "1.4rem" }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap split">
          <ListCard title={s.includedTitle} items={s.included} />
          <div>
            <Eyebrow>How delivery works</Eyebrow>
            <h2 style={{ fontSize: "1.5rem" }}>Who does what</h2>
            <p>{s.clarify}</p>
            <p><TextLink to="/about">More about how we work</TextLink></p>
          </div>
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap" style={{ maxWidth: 820 }}>
          <Eyebrow>FAQ</Eyebrow>
          <h2>Questions about {s.nav.toLowerCase()}</h2>
          <FaqList items={s.faqs} />
        </Reveal>
      </Section>

      <CtaBand title={s.cta[0]} text={s.cta[1]} waMsg={`Hi 360 Biz Health, I'd like to discuss ${s.nav}.`} />

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Related services</Eyebrow>
          <h2 style={{ fontSize: "1.5rem" }}>Other things we handle</h2>
          <TileGrid
            items={s.related.map(([rs, label]) => ({ title: label, text: SERVICES[rs].kicker, to: "/" + rs }))}
            cols={3}
            style={{ marginTop: "1.2rem" }}
          />
        </Reveal>
      </Section>
    </>
  );
}
