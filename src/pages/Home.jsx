import { HOME_FAQS } from "../data/site.js";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import Button, { TextLink } from "../components/Button.jsx";
import HeroRing from "../components/HeroRing.jsx";
import PillarCard from "../components/PillarCard.jsx";
import FaqList from "../components/FaqList.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { TileGrid } from "../components/Tiles.jsx";
import { Flow, Steps } from "../components/Lists.jsx";

const PILLARS = [
  { slug: "hrms-software-solutions", title: "HRMS software solutions",
    problem: "Shortlisting a platform from demos, then owning an implementation nobody has time for.",
    answer: "We assess the requirement, compare suitable partner platforms and run selection, configuration, migration, training and support.",
    points: ["Requirement assessment and platform comparison", "Purchase and implementation coordination", "Data migration, training and onboarding"] },
  { slug: "payroll-tds-labour-compliance", title: "Payroll, TDS & labour compliance",
    problem: "Payroll held together by one spreadsheet and one person, with statutory deadlines arriving regardless.",
    answer: "Monthly payroll as a managed service, with TDS, PF, ESIC, PT, LWF and labour-law documentation on a fixed calendar.",
    points: ["Payroll processing and payslips", "TDS, Form 24Q and Form 16 support", "PF, ESIC, PT, LWF and compliance audits"] },
  { slug: "business-registration-ipr-certifications", title: "Business registration, IPR & certifications",
    problem: "Registrations done out of order, and a brand name used for years before anyone checks it.",
    answer: "Entity registration, GST and Udyam, trademark search and filing support, and ISO certification support in one sequence.",
    points: ["Company registration, GST and MSME/Udyam", "Trademark search, filing and registration support", "ISO and other business certifications"] },
  { slug: "corporate-retreats-workations", title: "Corporate retreats & workations",
    problem: "A budget spent on time away that had no agenda and no one coordinating it.",
    answer: "Retreats, workations, annual meets and seminars planned around the objective, with travel, stay and on-ground coordination.",
    points: ["Destination, travel and stay planning", "Annual meets, strategy meets and seminars", "On-ground coordination through the trip"] },
];

const STRIP = ["Multi-HRMS partner ecosystem", "SME to enterprise solutions", "Technology and managed services", "Specialised allied partners"];

const WHY = [
  ["Multiple HRMS options", "We work with several HRMS providers, so the shortlist starts from your requirement."],
  ["A requirement-led approach", "Assessment before recommendation, with the gaps in each option stated plainly."],
  ["One point of contact", "Across HR technology, payroll, compliance, setup and corporate travel."],
  ["Implementation and support", "We stay involved after the purchase, which is where most projects fail."],
  ["Technology and managed services", "Software where it helps, a managed service where running it in-house does not."],
  ["Scales with business size", "From a first formal HR system to multi-location, multi-state operations."],
];

const HRMS_FLOW = ["Business requirement", "Assessment", "Suitable HRMS options", "Selection", "Implementation", "Onboarding", "Support"];

const PAYROLL_FLOW = [
  ["Data", "Attendance, joiners, exits, revisions and reimbursements collected to a cut-off"],
  ["Payroll", "Processing, salary register review and payslips"],
  ["TDS", "Monthly computation, challans, Form 24Q and Form 16 support"],
  ["Statutory compliance", "PF, ESIC, Professional Tax, LWF and labour-law documentation"],
  ["Reports", "Registers, MIS and a compliance status summary"],
  ["Support", "Employee queries, audits and month-on-month continuity"],
];

const SERVE = [
  ["Startups", "A first formal HR system, clean registrations and payroll that survives diligence."],
  ["SMEs", "Moving off spreadsheets, with compliance exposure that is starting to matter."],
  ["MSMEs", "Udyam classification, shift-based attendance and certification requirements from buyers."],
  ["Growing and multi-location companies", "Rules that differ by site and state, held in one system and one calendar."],
  ["Enterprises", "Deeper configuration, structured rollout and defined support routes."],
  ["HR, finance and operations leaders", "One point of contact instead of a vendor list."],
];

const HOW = [
  ["Tell us what you need", "A short call or a message describing the requirement."],
  ["We understand the requirement", "Headcount, locations, current systems, deadlines and constraints."],
  ["We identify the appropriate solution", "Partner platform, managed service or specialist, with reasons."],
  ["We coordinate implementation or delivery", "A plan with owners and dates, tracked to completion."],
  ["We stay available for ongoing support", "Changes, escalations and the next requirement when it comes."],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero__in">
          <div>
            <p className="eyebrow">Business solutions. Simplified.</p>
            <h1>One partner for your business&rsquo;s essential operations</h1>
            <p>HR technology, payroll, compliance, business setup and corporate experiences &mdash; coordinated through one trusted business solutions partner.</p>
            <div className="hero__cta">
              <Button variant="primary" to="/contact" ev="hero_cta">Talk to a 360 Biz Health expert</Button>
              <Button variant="onink" href="#services">Explore our services</Button>
            </div>
            <p className="hero__note">We work with a network of HRMS technology partners and specialist service partners, and stay accountable for coordination across all of them.</p>
          </div>
          <div><HeroRing /></div>
        </div>
      </section>

      <div className="strip">
        <div className="wrap">
          <ul>{STRIP.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>

      <Section id="services">
        <div className="wrap">
          <Reveal style={{ maxWidth: "62ch" }}>
            <Eyebrow>Four service verticals</Eyebrow>
            <h2>Four things most growing businesses need, handled by one team</h2>
            <p className="lede">Each vertical stands on its own. Together they remove the coordination work that usually lands on a founder or an HR head.</p>
          </Reveal>
          <Reveal className="grid g2" style={{ marginTop: "2rem" }}>
            {PILLARS.map((p, i) => <PillarCard key={p.slug} index={i + 1} {...p} />)}
          </Reveal>
        </div>
      </Section>

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>Why 360 Biz Health</Eyebrow>
            <h2>Requirement first, platform second</h2>
            <p>We are not tied to a single product or a single service line. That lets us start with what your business actually needs this quarter, and bring in the right technology or specialist for it.</p>
          </div>
          <TileGrid items={WHY} cols={2} />
        </Reveal>
      </Section>

      <Section>
        <div className="wrap">
          <Reveal className="panel">
            <div className="split split--wide">
              <div>
                <Eyebrow onDark>HRMS software solutions</Eyebrow>
                <h2>We don&rsquo;t build an HRMS. We help businesses find and implement the right one.</h2>
                <p>360 Biz Health works with multiple HRMS software companies as a channel partner. We assess your requirement, compare suitable partner platforms and then coordinate the part that decides whether the investment works &mdash; configuration, migration, training and rollout.</p>
                <p style={{ color: "rgba(255,255,255,.66)", fontSize: ".95rem" }}>Modules such as core HR, attendance, leave, payroll, self-service, recruitment, expenses and performance are available across the ecosystem, but not every partner platform provides every module. We confirm what is included before you commit.</p>
                <Button variant="primary" to="/hrms-software-solutions" ev="hrms_section_cta">See how HRMS selection works</Button>
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontFamily: "var(--sans)", fontWeight: 700 }}>From requirement to ongoing support</h3>
                <Flow items={HRMS_FLOW} tone="gold" vertical />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>Payroll, TDS &amp; labour compliance</Eyebrow>
            <h2>A payroll month that runs on a calendar, not on memory</h2>
            <p>Inputs close on a fixed date, the register is reviewed before payment, TDS is computed on verified declarations, and statutory returns follow their own schedule. Exits are settled within the statutory window.</p>
            <p>Direct statutory execution is carried out by 360 Biz Health or through allied specialists depending on the requirement, and we confirm who does what before onboarding.</p>
            <TextLink to="/payroll-tds-labour-compliance" ev="payroll_section_cta">Explore payroll and compliance</TextLink>
          </div>
          <div><Flow items={PAYROLL_FLOW} vertical /></div>
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>Business registration, IPR &amp; certifications</Eyebrow>
            <h2>The setup work, done in an order that does not double back</h2>
            <p>Entity registration, then GST and Udyam where applicable, then brand protection in the right class, then any certification a buyer or tender asks for. Work requiring a qualified professional is carried out through allied specialists.</p>
            <TextLink to="/business-registration-ipr-certifications">Explore business setup and IPR</TextLink>
          </div>
          <div>
            <Flow items={["Business registration", "GST / MSME", "Trademark / IPR", "ISO / certifications"]} tone="red" />
            <p className="muted" style={{ fontSize: ".92rem", marginTop: "1rem" }}>Copyright registration, design registration, website and app development, SEO and branding services are outside our scope.</p>
          </div>
        </Reveal>
      </Section>

      <Section>
        <div className="wrap">
          <Reveal className="panel panel--edge">
            <div className="split">
              <div>
                <Eyebrow onDark>Corporate retreats &amp; workations</Eyebrow>
                <h2>Time away that has an agenda and someone holding the plan</h2>
                <p>Retreats, workations, annual meets, strategy meets, seminars and team experiences &mdash; planned around the objective, with destination, travel, stay and on-ground coordination handled as one plan. Delivered with specialist travel and hospitality partners.</p>
                <Button variant="primary" to="/corporate-retreats-workations" ev="retreat_section_cta">Plan a corporate retreat</Button>
              </div>
              <div>
                <Flow items={["Retreats", "Workations", "Annual meets", "Seminars", "Team experiences"]} tone="gold" />
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: ".92rem", marginTop: "1rem" }}>Destinations are shortlisted against objective, season, group size and budget. Leh-Ladakh is one example, not a fixed option.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Who we serve</Eyebrow>
          <h2>Built for the stage you are at</h2>
          <TileGrid items={SERVE} cols={3} style={{ marginTop: "1.4rem" }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2>Five steps, and a person who stays reachable</h2>
            <p className="muted">The same sequence applies whether you are choosing an HRMS, moving payroll out, registering a business or planning a retreat.</p>
          </div>
          <Steps items={HOW} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap" style={{ maxWidth: 820 }}>
          <Eyebrow>Common questions</Eyebrow>
          <h2>Questions we are asked before the first call</h2>
          <FaqList items={HOME_FAQS} />
          <p style={{ marginTop: "1.2rem" }}><TextLink to="/faq">Read the full FAQ</TextLink></p>
        </Reveal>
      </Section>

      <CtaBand
        title="Tell us what your business needs. We'll help you map the right next step."
        text="One message, one call, and a clear recommendation on what to do first — whether that is an HRMS shortlist, a payroll handover, a registration sequence or a retreat plan."
        waMsg="Hi 360 Biz Health, I'd like to discuss a business requirement."
      />
    </>
  );
}
