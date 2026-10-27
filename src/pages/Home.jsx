import { Link } from "react-router-dom";
import { HOME_FAQS } from "../data/site.js";
import { IMAGES } from "../data/images.js";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import Button, { TextLink } from "../components/Button.jsx";
import HeroRing from "../components/HeroRing.jsx";
import FaqList from "../components/FaqList.jsx";
import CtaBand from "../components/CtaBand.jsx";

/* ---------------------------------------------------------------- content */

const PILLARS = [
  { slug: "hrms-software-solutions", image: IMAGES.hrTech, title: "HRMS software solutions",
    text: "Requirement assessment, partner platform comparison, and implementation through to ongoing support." },
  { slug: "payroll-tds-labour-compliance", image: IMAGES.taxation, title: "Payroll, TDS & labour compliance",
    text: "Managed monthly payroll, with TDS, PF, ESIC, PT, LWF and labour-law compliance on a fixed calendar." },
  { slug: "business-registration-ipr-certifications", image: IMAGES.records, title: "Business registration, IPR & certifications",
    text: "Entity registration, GST, Udyam, trademark filing support and ISO certification, in the right order." },
  { slug: "corporate-retreats-workations", image: IMAGES.retreat, title: "Corporate retreats & workations",
    text: "Retreats, workations, annual meets and seminars, with travel, stay and on-ground coordination." },
];

const STRIP = ["Multi-HRMS partner ecosystem", "SME to enterprise solutions", "Technology and managed services", "Specialised allied partners"];

const WHY = [
  ["Multiple HRMS options", "The shortlist starts from your requirement."],
  ["A requirement-led approach", "Assessment first, with the gaps stated plainly."],
  ["One point of contact", "HR technology, payroll, compliance, setup and travel."],
  ["Implementation and support", "We stay involved after the purchase."],
  ["Technology and managed services", "Software or a managed service, whichever fits."],
  ["Scales with business size", "From a first HR system to multi-state operations."],
];

const HRMS_FLOW = ["Business requirement", "Assessment", "Suitable HRMS options", "HRMS demonstration", "Selection", "Onboarding", "Policy implementation", "Admin & product training", "Support"];

const PAYROLL_FLOW = [
  ["Data", "Attendance, joiners, exits and revisions to a cut-off"],
  ["Payroll", "Processing, register review and payslips"],
  ["TDS", "Computation, challans, Form 24Q and Form 16"],
  ["Statutory compliance", "PF, ESIC, PT, LWF and labour-law documentation"],
  ["Reports", "Registers, MIS and compliance status"],
  ["Support", "Employee queries, audits and continuity"],
];

const SETUP = [
  ["Business registration", "The entity is registered first."],
  ["GST / MSME", "GST and Udyam, where applicable."],
  ["Trademark / IPR", "Brand protection in the right class."],
  ["ISO / certifications", "Whatever a buyer or tender asks for."],
];

const RETREAT_FORMATS = ["Retreats", "Workations", "Annual meets", "Seminars", "Team experiences"];

const SERVE = [
  ["Startups", "A first HR system, clean registrations, diligence-ready payroll."],
  ["SMEs", "Moving off spreadsheets as compliance starts to matter."],
  ["MSMEs", "Udyam, shift-based attendance and buyer certifications."],
  ["Growing and multi-location companies", "Site and state rules in one system and calendar."],
  ["Enterprises", "Deeper configuration, structured rollout, defined support."],
  ["HR, finance and operations leaders", "One point of contact instead of a vendor list."],
];

const HOW = [
  ["Tell us what you need", "A short call or a message."],
  ["We understand the requirement", "Headcount, locations, systems and deadlines."],
  ["We identify the appropriate solution", "Platform, managed service or specialist, with reasons."],
  ["We coordinate implementation or delivery", "Owners and dates, tracked to completion."],
  ["We stay available for ongoing support", "Changes, escalations and what comes next."],
];

const pad = (n) => String(n).padStart(2, "0");

/* ------------------------------------------------------------- components */

/* Service card: image, heading, two-line summary, one link. The heading link
   stretches over the whole card so the card is a single large target. */
function PillarCard({ index, slug, title, text, image }) {
  return (
    <article className="svc">
      <div className="svc__media">
        <img
          src={image.sm}
          srcSet={image.srcSet}
          sizes="(max-width: 700px) 100vw, (max-width: 1240px) 50vw, 600px"
          width={image.w}
          height={image.h}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="svc__body">
        <span className="svc__idx" aria-hidden="true">{pad(index)}</span>
        <h3><Link to={"/" + slug}>{title}</Link></h3>
        <p>{text}</p>
        <TextLink to={"/" + slug} ev="service_card_cta">
          Explore service<span className="sr-only">: {title}</span>
        </TextLink>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------- page */

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" aria-labelledby="home-title">
        <div className="wrap hero__in">
          <div className="hero__copy">
            <Eyebrow>Business solutions. Simplified.</Eyebrow>
            <h1 id="home-title">One partner for your business&rsquo;s essential operations</h1>
            <p className="hero__lede">HR technology, payroll, compliance, business setup and corporate experiences, coordinated through one trusted partner.</p>
            <div className="hero__cta">
              <Button variant="primary" to="/contact" ev="hero_cta">Talk to a 360 Biz Health expert</Button>
              <Button variant="text" href="#services">Explore our services</Button>
            </div>
          </div>
          <div className="hero__visual"><HeroRing /></div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="strip">
        <div className="wrap">
          <ul aria-label="How we work">{STRIP.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>

      {/* Four service verticals */}
      <Section id="services" tone="tint" className="hsec" labelledBy="services-title">
        <div className="wrap">
          <Reveal className="hhead hhead--split">
            <div>
              <Eyebrow>Four service verticals</Eyebrow>
              <h2 id="services-title">Four things most growing businesses need, handled by one team</h2>
            </div>
            <p className="lede">Each works on its own. Together, they take the coordination off your desk.</p>
          </Reveal>
          <Reveal className="svc-grid">
            {PILLARS.map((p, i) => <PillarCard key={p.slug} index={i + 1} {...p} />)}
          </Reveal>
        </div>
      </Section>

      {/* Why: requirement first */}
      <Section className="hsec" labelledBy="why-title">
        <div className="wrap">
          <Reveal className="hhead hhead--split">
            <div>
              <Eyebrow>Why 360 Biz Health</Eyebrow>
              <h2 id="why-title" className="h2-xl">Requirement first, platform second</h2>
            </div>
            <p className="lede">Not tied to one product or service line, we start from what your business actually needs.</p>
          </Reveal>
          <Reveal as="ul" className="why">
            {WHY.map(([t, d], i) => (
              <li key={t}>
                <span className="why__n" aria-hidden="true">{pad(i + 1)}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* HRMS: green band with horizontal process */}
      <section className="hsec band" aria-labelledby="hrms-title">
        <div className="wrap">
          <Reveal className="hhead hhead--split">
            <div>
              <Eyebrow onDark>HRMS software solutions</Eyebrow>
              <h2 id="hrms-title">We don&rsquo;t build an HRMS. We help businesses find and implement the right one.</h2>
            </div>
            <div>
              <p className="lede">As a channel partner to multiple HRMS companies, we compare platforms against your requirement, then coordinate the rollout.</p>
              <p className="band__note">Module coverage varies by platform. We confirm it before you commit.</p>
              <Button variant="primary" to="/hrms-software-solutions" ev="hrms_section_cta">See how HRMS selection works</Button>
            </div>
          </Reveal>
          <Reveal>
            <h3 className="band__sub">From requirement to ongoing support</h3>
            <ol className="track" aria-label="HRMS engagement steps">
              {HRMS_FLOW.map((s, i) => (
                <li key={s}><span className="track__n" aria-hidden="true">{i + 1}</span><span className="track__t">{s}</span></li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Payroll: editorial split with a divided list */}
      <Section tone="white" className="hsec" labelledBy="payroll-title">
        <Reveal className="wrap duo">
          <div className="duo__text">
            <Eyebrow>Payroll, TDS &amp; labour compliance</Eyebrow>
            <h2 id="payroll-title">A payroll month that runs on a calendar, not on memory</h2>
            <p className="lede">Inputs close on a fixed date, the register is reviewed before payment, and returns follow their schedule.</p>
            <p className="muted small">Statutory execution is by 360 Biz Health or allied specialists, confirmed before onboarding.</p>
            <TextLink to="/payroll-tds-labour-compliance" ev="payroll_section_cta">Explore payroll and compliance</TextLink>
          </div>
          <div className="ledger">
            <p className="ledger__cap">The monthly cycle</p>
            <ol aria-label="Monthly payroll cycle">
              {PAYROLL_FLOW.map(([t, d], i) => (
                <li key={t}>
                  <span className="ledger__n" aria-hidden="true">{pad(i + 1)}</span>
                  <span><b>{t}</b><span>{d}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Section>

      {/* Business setup: horizontal sequence */}
      <Section className="hsec" labelledBy="setup-title">
        <div className="wrap">
          <Reveal className="hhead hhead--split">
            <div>
              <Eyebrow>Business registration, IPR &amp; certifications</Eyebrow>
              <h2 id="setup-title">The setup work, done in an order that does not double back</h2>
            </div>
            <div>
              <p className="lede">Work requiring a qualified professional is carried out through allied specialists.</p>
              <TextLink to="/business-registration-ipr-certifications">Explore business setup and IPR</TextLink>
            </div>
          </Reveal>
          <Reveal as="ol" className="seq" aria-label="Business setup sequence">
            {SETUP.map(([t, d], i) => (
              <li key={t}>
                <span className="seq__n" aria-hidden="true">{pad(i + 1)}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </Reveal>
          <p className="seq__scope">Copyright registration, design registration, website and app development, SEO and branding services are outside our scope.</p>
        </div>
      </Section>

      {/* Retreats: image-led feature */}
      <Section tone="tint" className="hsec" labelledBy="retreat-title">
        <Reveal className="wrap feat">
          <div className="feat__media">
            <img
              src={IMAGES.retreat.sm}
              srcSet={IMAGES.retreat.srcSet}
              sizes="(max-width: 980px) 100vw, 560px"
              width={IMAGES.retreat.w}
              height={IMAGES.retreat.h}
              alt={IMAGES.retreat.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="feat__body">
            <Eyebrow>Corporate retreats &amp; workations</Eyebrow>
            <h2 id="retreat-title">Time away that has an agenda and someone holding the plan</h2>
            <p className="lede">Planned around the objective, with travel, stay and on-ground coordination as one plan, delivered with specialist partners.</p>
            <ul className="feat__list" aria-label="Retreat formats">
              {RETREAT_FORMATS.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Button variant="primary" to="/corporate-retreats-workations" ev="retreat_section_cta">Plan a corporate retreat</Button>
          </div>
        </Reveal>
      </Section>

      {/* Who we serve */}
      <Section className="hsec" labelledBy="serve-title">
        <div className="wrap">
          <Reveal className="hhead hhead--center">
            <Eyebrow>Who we serve</Eyebrow>
            <h2 id="serve-title">Built for the stage you are at</h2>
          </Reveal>
          <Reveal as="ul" className="serve">
            {SERVE.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
          </Reveal>
        </div>
      </Section>

      {/* How it works: vertical timeline */}
      <Section tone="white" className="hsec" labelledBy="how-title">
        <Reveal className="wrap duo duo--how">
          <div className="duo__text duo__text--sticky">
            <Eyebrow>How it works</Eyebrow>
            <h2 id="how-title">Five steps, and a person who stays reachable</h2>
            <p className="lede">The same sequence applies to every service we offer.</p>
          </div>
          <ol className="tl">
            {HOW.map(([t, d], i) => (
              <li key={t}>
                <span className="tl__n" aria-hidden="true">{pad(i + 1)}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section className="hsec" labelledBy="faq-title">
        <div className="wrap faq-wrap">
          <Reveal className="hhead hhead--center">
            <Eyebrow>Common questions</Eyebrow>
            <h2 id="faq-title">Questions we are asked before the first call</h2>
          </Reveal>
          <Reveal>
            <FaqList items={HOME_FAQS} />
            <p className="faq-more"><TextLink to="/faq">Read the full FAQ</TextLink></p>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        title="Tell us what your business needs. We'll help you map the right next step."
        text="One message, one call, and a clear recommendation on what to do first."
        waMsg="Hi 360 Biz Health, I'd like to discuss a business requirement."
      />
    </div>
  );
}
