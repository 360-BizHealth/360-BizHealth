import { SERVICES } from "../data/services.js";
import { SERVICE_DETAILS } from "../data/serviceDetails.js";
import { SERVICE_NAV } from "../data/navigation.js";
import { DEFAULT_SERVICE_FOR_VERTICAL } from "../../shared/enquiry.js";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import Button, { TextLink } from "../components/Button.jsx";
import FaqList from "../components/FaqList.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { TileGrid } from "../components/Tiles.jsx";
import { ListCard, Checklist } from "../components/Lists.jsx";
import { midSentence } from "../lib/text.js";

/*
 * Service pages. Copy comes from data/services.js; layout, imagery and optional
 * sections come from data/serviceDetails.js, so each vertical renders its own
 * sequence of sections instead of one fixed template.
 */

const contactHref = (slug) => `/contact?service=${DEFAULT_SERVICE_FOR_VERTICAL[slug]}&from=${slug}`;
const navFor = (slug) => SERVICE_NAV.find((n) => n.slug === slug);

function Picture({ image, className, eager = false, sizes = "(max-width: 980px) 92vw, 520px" }) {
  return (
    <img
      className={className}
      src={image.lg}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.w}
      height={image.h}
      alt={image.alt}
      loading={eager ? "eager" : "lazy"}
      fetchpriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
}

function Hero({ slug, s, d }) {
  const crumbs = [[navFor(slug).short, "/" + slug]];
  const cta = (
    <div className="hero__cta">
      <Button variant="primary" to={contactHref(slug)} ev="service_hero_cta">Talk to an expert</Button>
      <Button variant="onink" href="#faq">Read the FAQ</Button>
    </div>
  );
  if (d.hero.layout === "photo") {
    return (
      <section className="shero shero--photo">
        <Picture image={d.hero.image} className="shero__bg" eager sizes="100vw" />
        <div className="wrap">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow eyebrow--ondark">{d.eyebrow}</p>
          <h1>{s.h1}</h1>
          <p>{s.kicker}</p>
          {cta}
        </div>
      </section>
    );
  }
  return (
    <section className="shero">
      <div className="wrap shero__in">
        <div>
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow eyebrow--ondark">{d.eyebrow}</p>
          <h1>{s.h1}</h1>
          <p>{s.kicker}</p>
          {cta}
        </div>
        <div className="shero__media"><Picture image={d.hero.image} eager /></div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- sections */

const SECTIONS = {
  intro: ({ s, d }) => (
    <Section tight>
      <Reveal className="wrap split">
        <div>
          <Eyebrow>Overview</Eyebrow>
          <h2>{d.introHeading}</h2>
          {s.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <ListCard title={s.problemTitle} items={s.problems} />
      </Reveal>
    </Section>
  ),

  roles: ({ s, d }) => (
    <Section tight tone="white">
      <Reveal className="wrap">
        <Eyebrow>How delivery works</Eyebrow>
        <h2>{d.roles.title}</h2>
        <p className="lede">{s.clarify}</p>
        <div className="roles" style={{ marginTop: "1.6rem" }}>
          <div className="roles__col roles__col--ours">
            <h3>{d.roles.ours.label}</h3>
            <Checklist items={d.roles.ours.items} cols={2} />
          </div>
          <div className="roles__col roles__col--theirs">
            <h3>{d.roles.theirs.label}</h3>
            <Checklist items={d.roles.theirs.items} />
          </div>
        </div>
      </Reveal>
    </Section>
  ),

  provide: ({ s }) => (
    <Section tight>
      <Reveal className="wrap">
        <Eyebrow>What we provide</Eyebrow>
        <h2>{s.provideTitle}</h2>
        <TileGrid items={s.provide} cols={3} numbered style={{ marginTop: "1.5rem" }} />
      </Reveal>
    </Section>
  ),

  timeline: ({ s }) => (
    <Section tight tone="tint">
      <Reveal className="wrap">
        <Eyebrow>Process</Eyebrow>
        <h2>{s.processTitle}</h2>
        <ol className="timeline">
          {s.flow.map((step, i) => (
            <li key={step}>
              <span className="timeline__n" aria-hidden="true">{i + 1}</span>
              <span className="timeline__t">{step}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  ),

  capabilities: ({ s, d }) => (
    <Section tight>
      <Reveal className="wrap split split--center">
        <div>
          <Eyebrow>Scope</Eyebrow>
          <h2>{s.capsTitle}</h2>
          <ul className="chips" style={{ margin: "1.2rem 0 1.2rem" }}>{s.caps.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className="muted">{s.capsNote}</p>
        </div>
        {d.sectionImage && (
          <figure className="figure" style={{ maxWidth: 380, marginInline: "auto" }}>
            <Picture image={d.sectionImage} sizes="(max-width: 980px) 80vw, 380px" />
          </figure>
        )}
      </Reveal>
    </Section>
  ),

  cycle: ({ s, d }) => {
    const n = s.flow.length;
    return (
      <Section tight tone="tint">
        <Reveal className="wrap split split--center">
          <div>
            <Eyebrow>Process</Eyebrow>
            <h2>{s.processTitle}</h2>
            <p className="muted">The same stages repeat every month, on a fixed calendar.</p>
            <ol className="cycle-list">
              {s.flow.map((step) => <li key={step}><b>{step}</b><span>{d.cycleNotes[step]}</span></li>)}
            </ol>
          </div>
          <div className="cycle" aria-hidden="true">
            <div className="cycle__ring" />
            <div className="cycle__hub"><div><strong>Monthly</strong><span>payroll cycle</span></div></div>
            {s.flow.map((step, i) => {
              const a = (i / n) * 2 * Math.PI - Math.PI / 2;
              return (
                <div key={step} className="cycle__node" style={{ left: `${50 + 36 * Math.cos(a)}%`, top: `${50 + 36 * Math.sin(a)}%` }}>
                  <i>{String(i + 1).padStart(2, "0")}</i><b>{step}</b>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Section>
    );
  },

  statutory: ({ s, d }) => (
    <Section tight>
      <Reveal className="wrap">
        <div className="split split--center">
          <div>
            <Eyebrow>Scope</Eyebrow>
            <h2>{s.capsTitle}</h2>
            <p className="muted">{s.capsNote}</p>
          </div>
          {d.sectionImage && (
            <figure className="figure" style={{ maxWidth: 420, marginInline: "auto" }}>
              <Picture image={d.sectionImage} sizes="(max-width: 980px) 80vw, 420px" />
            </figure>
          )}
        </div>
        <ul className="badges" style={{ marginTop: "1.6rem" }}>{s.caps.map((c) => <li key={c}>{c}</li>)}</ul>
      </Reveal>
    </Section>
  ),

  stages: ({ s, d }) => (
    <Section tight tone="tint">
      <Reveal className="wrap">
        <Eyebrow>{s.processTitle}</Eyebrow>
        <h2>{s.provideTitle}, in the order it should happen</h2>
        <ol className="stages">
          {d.stages.map((st, i) => (
            <li className="stage" key={st.step}>
              <div className="stage__mark" aria-hidden="true"><span className="stage__n">{i + 1}</span><span className="stage__line" /></div>
              <div className="stage__body">
                <h3>{st.step}</h3>
                <div className="stage__items">
                  {st.provide.map((k) => (
                    <div key={k}><h4>{s.provide[k][0]}</h4><p>{s.provide[k][1]}</p></div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  ),

  documents: ({ s, d }) => (
    <Section tight>
      <Reveal className="wrap split split--center">
        <div>
          <Eyebrow>Scope</Eyebrow>
          <h2>{s.capsTitle}</h2>
          <p className="muted">{s.capsNote}</p>
          <Checklist items={s.caps} cols={2} />
        </div>
        {d.sectionImage && (
          <figure className="figure" style={{ maxWidth: 400, marginInline: "auto" }}>
            <Picture image={d.sectionImage} sizes="(max-width: 980px) 80vw, 400px" />
          </figure>
        )}
      </Reveal>
    </Section>
  ),

  formats: ({ s }) => (
    <Section tight>
      <Reveal className="wrap">
        <Eyebrow>Formats</Eyebrow>
        <h2>{s.processTitle}</h2>
        <ul className="formats">
          {s.flow.map((f, i) => <li key={f}><span className="num">{String(i + 1).padStart(2, "0")}</span><b>{f}</b></li>)}
        </ul>
      </Reveal>
    </Section>
  ),

  planning: ({ s }) => (
    <Section tight tone="tint">
      <Reveal className="wrap">
        <Eyebrow>Planning</Eyebrow>
        <h2>{s.capsTitle}</h2>
        <p className="muted" style={{ marginBottom: "1.4rem" }}>{s.capsNote}</p>
        <ul className="plan-grid">{s.caps.map((c) => <li key={c}>{c}</li>)}</ul>
      </Reveal>
    </Section>
  ),

  fit: ({ s }) => (
    <Section tight>
      <Reveal className="wrap">
        <Eyebrow>Who it&rsquo;s for</Eyebrow>
        <h2>{s.forTitle}</h2>
        <TileGrid items={s.forWho} cols={4} style={{ marginTop: "1.4rem" }} />
      </Reveal>
    </Section>
  ),

  included: ({ s }) => (
    <Section tight tone="white">
      <Reveal className="wrap split">
        <div>
          <Eyebrow>Engagement</Eyebrow>
          <h2>{s.includedTitle}</h2>
          <p className="muted">Scope is confirmed in writing before work begins.</p>
        </div>
        <Checklist items={s.included} cols={s.included.length > 7 ? 2 : 1} />
      </Reveal>
    </Section>
  ),

  clarify: ({ s }) => (
    <Section tight>
      <Reveal className="wrap">
        <div className="panel panel--ring">
          <Eyebrow onDark>How delivery works</Eyebrow>
          <h2 style={{ fontSize: "clamp(1.4rem,1.1rem + 1vw,1.9rem)" }}>Who does what</h2>
          <p>{s.clarify}</p>
          <p style={{ marginBottom: 0 }}><TextLink to="/about" style={{ color: "#fff" }}>More about how we work</TextLink></p>
        </div>
      </Reveal>
    </Section>
  ),

  faq: ({ s }) => (
    <Section tight id="faq">
      <Reveal className="wrap wrap--narrow">
        <Eyebrow>FAQ</Eyebrow>
        <h2>Questions about {midSentence(s.nav)}</h2>
        <FaqList items={s.faqs} />
      </Reveal>
    </Section>
  ),

  cta: ({ s, slug }) => (
    <CtaBand title={s.cta[0]} text={s.cta[1]} to={contactHref(slug)} waMsg={`Hi 360 Biz Health, I'd like to discuss ${s.nav}.`} />
  ),

  related: ({ s }) => (
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
  ),
};

export default function ServicePage({ slug }) {
  const s = SERVICES[slug];
  const d = SERVICE_DETAILS[slug];
  return (
    <div className={"svc svc--" + d.theme}>
      <Hero slug={slug} s={s} d={d} />
      {d.sections.map((key) => {
        const Render = SECTIONS[key];
        return <Render key={key} s={s} d={d} slug={slug} />;
      })}
    </div>
  );
}
