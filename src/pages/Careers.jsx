import { BIZ } from "../data/site.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { TileGrid } from "../components/Tiles.jsx";

const OPEN_ROLES = [
  {
    title: "HRMS Implementation Consultant",
    location: "New Delhi / Hybrid",
    type: "Full-time",
    dept: "HR Technology",
    desc: "Work with client HR and leadership teams to analyze requirements, coordinate partner HRMS configuration, manage master data migrations, and lead user adoption.",
    requirements: [
      "2+ years experience in HR software implementation or HR operations",
      "Hands-on understanding of attendance, leave rules, and payroll structures",
      "Clear communication and stakeholder coordination skills"
    ]
  },
  {
    title: "Payroll & Statutory Compliance Specialist",
    location: "New Delhi / Remote",
    type: "Full-time",
    dept: "Payroll & Statutory",
    desc: "Deliver accurate, on-time payroll processing for client portfolios across multiple Indian states, managing TDS, PF, ESIC, PT, and periodic compliance filings.",
    requirements: [
      "3+ years experience in multi-state payroll outsourcing or processing",
      "Strong command of PF, ESIC, PT slabs, and TDS calculations",
      "Proficiency with Excel and leading payroll tools"
    ]
  },
  {
    title: "Client Solutions & Growth Manager",
    location: "New Delhi / Hybrid",
    type: "Full-time",
    dept: "Business Development",
    desc: "Understand prospective client needs across our 4 core verticals (HRMS, Payroll, Setup/IPR, Retreats) and guide them through tailored service proposals.",
    requirements: [
      "Strong consultative approach with B2B clients and founders",
      "Understanding of SME & startup operational challenges",
      "Ability to coordinate with technology and service partners"
    ]
  },
  {
    title: "Corporate Retreats & Operations Coordinator",
    location: "New Delhi / Travel",
    type: "Full-time",
    dept: "Corporate Experiences",
    desc: "Plan and execute end-to-end offsites, team retreats, and workations for fast-growing companies, managing venue partnerships, logistics, and on-ground experience.",
    requirements: [
      "Experience in event planning, hospitality, or corporate travel logistics",
      "Meticulous attention to detail and vendor management",
      "Resourceful problem solver with a customer-first mindset"
    ]
  }
];

const PERKS = [
  { title: "Cross-Domain Learning", desc: "Gain hands-on exposure across HR tech, taxation, corporate law, statutory compliance, and experiential travel." },
  { title: "Merit-Driven Growth", desc: "Small, agile teams where ownership is recognized immediately with real responsibility and career progression." },
  { title: "Team Retreats & Workations", desc: "We practice what we offer — periodic offsites, collaborative workations, and flexible work culture." },
  { title: "Healthy Work Environment", desc: "Clear ownership, transparent communication, and respect for personal time without unnecessary bureaucracy." },
];

export default function Careers() {
  return (
    <>
      <PageHead
        crumbs={[["Careers"]]}
        title="Build your career at 360 Biz Health"
        lede="Join a team solving critical operational challenges for fast-growing businesses across India. We value clear thinking, reliability, and real ownership."
      />

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>Why join us</Eyebrow>
            <h2>Work at the intersection of HR technology, operations, and business growth</h2>
            <p>At 360 Biz Health, we bridge the gap between complex business requirements and proven solutions. Every day, we help founders, HR leaders, and finance heads streamline their operations.</p>
            <p>If you enjoy working on varied challenges with a supportive, high-accountability team, we would love to have you with us.</p>
          </div>
          <div className="card">
            <h3>How we work</h3>
            <ul className="dotlist" style={{ fontSize: ".96rem", color: "var(--ink-2)" }}>
              <li><strong>Direct ownership:</strong> You lead outcomes, not just task checklists.</li>
              <li><strong>Plain talk:</strong> Honest communication with clients and teammates alike.</li>
              <li><strong>Continuous improvement:</strong> We constantly refine our playbooks and tooling.</li>
            </ul>
          </div>
        </Reveal>
      </Section>

      <Section tight tone="tint">
        <Reveal className="wrap">
          <Eyebrow>Life &amp; perks</Eyebrow>
          <h2>What we offer</h2>
          <TileGrid items={PERKS.map((p) => ({ title: p.title, text: p.desc }))} cols={2} style={{ marginTop: "1.2rem" }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Openings</Eyebrow>
          <h2>Current open positions</h2>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>Apply by email with your CV and a short note, or write to us directly if your profile is different.</p>

          <div style={{ display: "grid", gap: "1.2rem" }}>
            {OPEN_ROLES.map((role, idx) => (
              <div key={idx} className="card" style={{ padding: "1.6rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".6rem" }}>
                  <div>
                    <span className="tile__n" style={{ textTransform: "uppercase" }}>
                      {role.dept}
                    </span>
                    <h3 style={{ fontSize: "1.3rem", marginTop: ".2rem" }}>{role.title}</h3>
                  </div>
                  <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                    <span className="tag" style={{ background: "#fff", border: "1px solid var(--line)" }}>
                      {role.location}
                    </span>
                    <span className="tag">
                      {role.type}
                    </span>
                  </div>
                </div>

                <p className="muted" style={{ fontSize: ".94rem", lineHeight: 1.5 }}>{role.desc}</p>

                <div>
                  <h4 style={{ fontSize: ".95rem" }}>Key requirements</h4>
                  <ul className="dotlist" style={{ fontSize: ".93rem", color: "var(--ink-2)" }}>
                    {role.requirements.map((req, rIdx) => (
                      <li key={rIdx} style={{ marginBottom: ".25rem" }}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: ".8rem", display: "flex", justifyContent: "flex-end" }}>
                  <a
                    className="btn btn--primary btn--sm"
                    href={`mailto:${BIZ.email}?subject=${encodeURIComponent("Application: " + role.title)}`}
                  >
                    Apply for this role<span className="sr-only">: {role.title}</span> &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <CtaBand
        to="/contact"
        title="Don't see the exact profile for your background?"
        text={`We are always eager to meet talented professionals. Send your resume and a short intro to ${BIZ.email}.`}
      />
    </>
  );
}
