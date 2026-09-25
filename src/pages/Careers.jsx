import { BIZ } from "../data/site.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { TileGrid } from "../components/Tiles.jsx";
import { EmailLink } from "../components/ContactLinks.jsx";

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
        title="Build Your Career at 360 Biz Health"
        lede="Join a team solving critical operational challenges for fast-growing businesses across India. We value clear thinking, reliability, and real ownership."
      />

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>Why Join Us</Eyebrow>
            <h2>Work at the intersection of HR technology, operations, and business growth</h2>
            <p>At 360 Biz Health, we bridge the gap between complex business requirements and proven solutions. Every day, we help founders, HR leaders, and finance heads streamline their operations.</p>
            <p>If you enjoy working on varied challenges with a supportive, high-accountability team, we would love to have you with us.</p>
          </div>
          <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "16px", padding: "1.8rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: ".8rem" }}>How We Work</h3>
            <ul style={{ paddingLeft: "1.1rem", fontSize: ".94rem", color: "var(--ink-2)", lineHeight: 1.7 }}>
              <li><strong>Direct ownership:</strong> You lead outcomes, not just task checklists.</li>
              <li><strong>Plain talk:</strong> Honest communication with clients and teammates alike.</li>
              <li><strong>Continuous improvement:</strong> We constantly refine our playbooks and tooling.</li>
            </ul>
          </div>
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Life & Perks</Eyebrow>
          <h2>What we offer</h2>
          <TileGrid items={PERKS} cols={2} style={{ marginTop: "1.2rem" }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Openings</Eyebrow>
          <h2>Current Open Positions</h2>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>Click on any role to see details or write directly to us.</p>

          <div style={{ display: "grid", gap: "1.2rem" }}>
            {OPEN_ROLES.map((role, idx) => (
              <div key={idx} className="card" style={{ padding: "1.6rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".6rem" }}>
                  <div>
                    <span style={{ fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--gold)" }}>
                      {role.dept}
                    </span>
                    <h3 style={{ fontSize: "1.3rem", marginTop: ".2rem" }}>{role.title}</h3>
                  </div>
                  <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                    <span style={{ padding: ".25rem .6rem", background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "6px", fontSize: ".82rem", fontWeight: 500 }}>
                      {role.location}
                    </span>
                    <span style={{ padding: ".25rem .6rem", background: "rgba(212,175,55,.12)", color: "var(--ink)", borderRadius: "6px", fontSize: ".82rem", fontWeight: 600 }}>
                      {role.type}
                    </span>
                  </div>
                </div>

                <p className="muted" style={{ fontSize: ".94rem", lineHeight: 1.5 }}>{role.desc}</p>

                <div>
                  <h4 style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: ".4rem" }}>Key Requirements:</h4>
                  <ul style={{ paddingLeft: "1.1rem", fontSize: ".9rem", color: "var(--ink-2)", lineHeight: 1.5 }}>
                    {role.requirements.map((req, rIdx) => (
                      <li key={rIdx} style={{ marginBottom: ".25rem" }}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: ".8rem", display: "flex", justifyContent: "flex-end" }}>
                  <EmailLink
                    className="btn btn--primary"
                    style={{ fontSize: ".88rem", padding: ".5rem 1rem" }}
                  >
                    Apply for this role &rarr;
                  </EmailLink>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <CtaBand
        title="Don't see the exact profile for your background?"
        text={`We are always eager to meet talented professionals. Send your resume and a short intro to ${BIZ.email}.`}
      />
    </>
  );
}
