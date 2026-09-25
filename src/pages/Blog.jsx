import { useState } from "react";
import { Link } from "react-router-dom";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import CtaBand from "../components/CtaBand.jsx";

const ARTICLES = [
  {
    id: "hrms-checklist",
    category: "HR Technology",
    title: "12 Things to Write Down Before Shortlisting an HRMS",
    date: "September 2026",
    readTime: "5 min read",
    summary: "Almost every difficult HRMS implementation traces back to a requirement that was never written down. Take this exact framework into vendor demos.",
    points: [
      "Headcount forecast and multi-location attendance requirements",
      "Shift patterns, leave accruals, and statutory compliance needs",
      "Salary structures, reimbursement workflows, and admin ownership"
    ],
    serviceLink: "/hrms-software-solutions",
    serviceName: "Explore HRMS Solutions"
  },
  {
    id: "payroll-cut-off",
    category: "Payroll & Compliance",
    title: "The Payroll Cut-Off Calendar That Prevents Month-End Chaos",
    date: "August 2026",
    readTime: "4 min read",
    summary: "Payroll bottlenecks are almost always calendar problems. Fixing four key cutoff dates stops errors before the salary register is generated.",
    points: [
      "Attendance & input freeze timelines for joiners and exits",
      "Salary register verification and sign-off milestones",
      "Statutory PF, ESIC, and PT deposit schedule alignment"
    ],
    serviceLink: "/payroll-tds-labour-compliance",
    serviceName: "Explore Payroll Services"
  },
  {
    id: "multi-state-operations",
    category: "Compliance",
    title: "Operating Across Multiple States: What Actually Changes for Payroll?",
    date: "July 2026",
    readTime: "6 min read",
    summary: "A second office location isn't just a new pin code. How Professional Tax, Labour Welfare Fund, and local Shops & Establishments rules vary.",
    points: [
      "State-specific PT slabs and deduction frequencies",
      "Labour Welfare Fund compliance across different state jurisdictions",
      "Establishment-level registers and minimum wage adherence"
    ],
    serviceLink: "/payroll-tds-labour-compliance",
    serviceName: "Explore Labour Compliance"
  },
  {
    id: "trademark-first-steps",
    category: "Business Setup & IPR",
    title: "Trademark Protection: Search First, Class Second, Filing Third",
    date: "June 2026",
    readTime: "4 min read",
    summary: "The most expensive branding mistake is falling in love with a name no one checked. How to properly protect your brand mark in the correct classes.",
    points: [
      "Comprehensive clearance search before brand launch",
      "Selecting the right Nice classes for current and future operations",
      "Word mark vs device/logo protection strategies"
    ],
    serviceLink: "/business-registration-ipr-certifications",
    serviceName: "Explore IPR & Registration"
  },
  {
    id: "workation-planning",
    category: "Corporate Retreats",
    title: "Planning a Productive Team Workation: Connectivity Over Scenery",
    date: "May 2026",
    readTime: "5 min read",
    summary: "The failure mode of a corporate retreat is picking a place for photos while everyone struggles with WiFi on critical client calls.",
    points: [
      "Bandwidth redundancy and quiet workspace requirements",
      "Balancing strategy sessions with downtime and team bonding",
      "End-to-end logistics coordination and seasonal windows"
    ],
    serviceLink: "/corporate-retreats-workations",
    serviceName: "Explore Corporate Retreats"
  }
];

const CATEGORIES = ["All", "HR Technology", "Payroll & Compliance", "Compliance", "Business Setup & IPR", "Corporate Retreats"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <>
      <PageHead
        crumbs={[["Blog"]]}
        title="Insights & Practical Guides"
        lede="Practical notes, frameworks, and actionable guides on HR tech, payroll operations, statutory compliance, and corporate offsites."
      />

      <Section tight>
        <div className="wrap">
          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: ".45rem .95rem",
                  borderRadius: "999px",
                  fontSize: ".88rem",
                  fontWeight: 600,
                  border: "1px solid",
                  borderColor: activeCategory === cat ? "var(--gold)" : "var(--line)",
                  background: activeCategory === cat ? "var(--gold)" : "#fff",
                  color: activeCategory === cat ? "var(--ink)" : "var(--ink-2)",
                  cursor: "pointer",
                  transition: "all .18s ease"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="tile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filtered.map((item) => (
              <Reveal key={item.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
                    <Eyebrow style={{ margin: 0 }}>{item.category}</Eyebrow>
                    <span className="muted" style={{ fontSize: ".82rem" }}>{item.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", lineHeight: 1.35, marginBottom: ".8rem" }}>{item.title}</h3>
                  <p className="muted" style={{ fontSize: ".94rem", lineHeight: 1.5, marginBottom: "1.2rem" }}>{item.summary}</p>
                  
                  <ul style={{ paddingLeft: "1.1rem", fontSize: ".9rem", color: "var(--ink-2)", marginBottom: "1.2rem" }}>
                    {item.points.map((pt, i) => (
                      <li key={i} style={{ marginBottom: ".35rem" }}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: ".9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="muted" style={{ fontSize: ".82rem" }}>{item.date}</span>
                  <Link to={item.serviceLink} style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--gold)", textDecoration: "none" }}>
                    {item.serviceName} &rarr;
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand
        title="Need advice tailored to your company's setup?"
        text="Speak with a 360 Biz Health consultant to evaluate your HR technology, payroll workflows, or compliance structure."
      />
    </>
  );
}
