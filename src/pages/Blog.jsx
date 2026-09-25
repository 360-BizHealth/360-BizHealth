import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const poshArticleImage = "https://images.pexels.com/photos/8853403/pexels-photo-8853403.jpeg?auto=compress&cs=tinysrgb&w=800";
const leaveArticleImage = "https://images.pexels.com/photos/33014979/pexels-photo-33014979.jpeg?auto=compress&cs=tinysrgb&w=800";
const fnfArticleImage = "https://images.pexels.com/photos/38783382/pexels-photo-38783382.jpeg?auto=compress&cs=tinysrgb&w=800";
const teamRetreatsImage = "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800";

const categoryToneStyles = {
  green: { background: "#e6f5ee", color: "#0d8048" },
  pink: { background: "#fff0f5", color: "#bd245a" },
  purple: { background: "#f4eaff", color: "#5d1498" },
  yellow: { background: "#fff7dc", color: "#9a6b00" },
};

const articles = [
  {
    slug: "posh-act-2013-employer-guide",
    category: "HR compliance",
    categoryTone: "green",
    title: "POSH Act 2013: Everything Employers and HR Teams Need to Know",
    description: "A practical guide to workplace safety, Internal Committees, complaint timelines, employer duties and the latest POSH compliance updates for India.",
    date: "06 January 2026",
    readTime: "8 min read",
    image: poshArticleImage,
    author: "360 BizHealth Editorial Team",
    quickAnswer: [
      "The POSH Act protects women from sexual harassment at work and establishes a fair redressal process.",
      "Every organization with 10 or more employees must constitute an Internal Committee.",
      "Complaints are generally filed within three months; the inquiry should finish within 90 days.",
      "Training, confidentiality, visible policies and accurate annual disclosures are core employer responsibilities."
    ],
    sections: [
      {
        heading: "What is the POSH Act, 2013?",
        paragraphs: [
          "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 protects women from sexual harassment at work and creates a structured mechanism for prevention and grievance redressal. It came into effect on 9 December 2013.",
          "The Act applies across private companies, government offices, hospitals, educational institutions, NGOs and other workplaces. Its practical reach also extends to work travel, client locations, virtual meetings and work-related communication channels."
        ]
      },
      {
        heading: "Objectives of the POSH Act",
        bullets: [
          "Prevent sexual harassment in workplaces",
          "Protect women employees and visitors",
          "Establish a structured complaint redressal mechanism",
          "Promote a safe and inclusive work environment",
          "Ensure employer accountability and compliance"
        ]
      },
      {
        heading: "What qualifies as sexual harassment?",
        paragraphs: [
          "Sexual harassment is any unwelcome sexual behaviour. The context and impact on the aggrieved woman matter, and the conduct may happen inside or outside a traditional office when it is connected to work."
        ],
        bullets: [
          "Physical contact or advances",
          "A demand or request for sexual favours",
          "Sexually explicit statements or jokes",
          "Showing pornography or sexually explicit material",
          "Unwelcome verbal or non-verbal conduct of a sexual nature",
          "Conduct that creates a hostile, intimidating or offensive work environment"
        ]
      },
      {
        heading: "Who does the Act apply to?",
        paragraphs: [
          "The framework covers permanent employees, contract workers, interns, trainees, consultants and women visiting the workplace. A workplace can include the office, work events, official travel, client sites, transport arranged by the employer and remote or digital work settings."
        ],
        bullets: [
          "Private companies and corporate organizations",
          "Government departments",
          "Educational institutions and universities",
          "Hospitals and healthcare organizations",
          "NGOs and non-profit organizations",
          "Startups, small businesses and hybrid teams"
        ]
      },
      {
        heading: "Internal Committee: a mandatory requirement",
        paragraphs: [
          "Every organization with 10 or more employees must establish a functioning Internal Committee (often called the ICC or IC) to receive and inquire into complaints."
        ],
        bullets: [
          "Presiding Officer: a senior woman employee",
          "Two internal members who understand women's rights, social work or legal knowledge",
          "One external member from an NGO, association or person familiar with issues relating to sexual harassment",
          "The external member brings independence and neutrality to the process"
        ]
      },
      {
        heading: "When does the Local Committee handle a complaint?",
        paragraphs: [
          "For workplaces with fewer than 10 employees, the Local Committee established by the district administration handles complaints. It also handles a complaint when the allegation is against the employer."
        ]
      },
      {
        heading: "Employer responsibilities under POSH",
        numbered: [
          "Provide a workplace free from discrimination and harassment.",
          "Constitute a functioning Internal Committee for every office or branch with 10 or more employees.",
          "Display the policy, committee details and consequences of sexual harassment prominently.",
          "Conduct regular awareness programs for employees and orientation for committee members.",
          "Support inquiries by making witnesses, records and documents available.",
          "Maintain confidentiality at every stage and prevent retaliation.",
          "Include required compliance information in annual reporting and Board's Report disclosures.",
          "Keep committee details and processes ready for digital reporting and SHe-Box registration where applicable."
        ]
      },
      {
        heading: "Sample policy language",
        paragraphs: [
          "A useful policy should use plain language and cover office locations, remote work, client sites, offsites, travel, emails, chats, calls, video meetings and other work platforms. It should promise a fair, confidential and time-bound process, explain reporting channels and clearly prohibit retaliation."
        ]
      },
      {
        heading: "Complaint procedure and timelines",
        numbered: [
          "Filing a complaint: The aggrieved woman generally submits a written complaint to the Internal Committee within three months of the incident or the last incident in a series. The committee may extend this by up to another three months for recorded reasons.",
          "Conciliation: The complainant may request conciliation before a formal inquiry. A monetary settlement cannot be the basis of conciliation.",
          "Inquiry: The committee should complete the inquiry within 90 days while giving both parties a fair opportunity to be heard.",
          "Employer action: The employer should act on the committee's recommendations within 60 days.",
          "Appeal: Either party may appeal through the applicable legal channels within the prescribed period."
        ]
      },
      {
        heading: "Annual disclosures and recent updates",
        paragraphs: [
          "The 2025–2026 compliance environment places greater emphasis on transparency. Organizations should maintain accurate counts of complaints received, complaints resolved and cases pending beyond 90 days for required annual and Board's Report disclosures. Organizations are also encouraged to keep their Internal Committee details updated on the centralized SHe-Box portal where applicable."
        ]
      },
      {
        heading: "Best practices for a safer workplace",
        bullets: [
          "Run awareness training more than once a year and give committee members role-specific orientation.",
          "Keep the policy short, visible and easy to understand.",
          "Offer reporting channels through the committee, HR, email and a secure online form.",
          "Restrict access to complaint records and remind everyone about confidentiality.",
          "Review committee composition, training completion and response timelines annually.",
          "Track complaints and reporting without revealing the identity of parties or witnesses."
        ]
      },
      {
        heading: "Penalties for non-compliance",
        paragraphs: [
          "Failure to comply can lead to financial penalties, increased consequences for repeat violations, legal action and reputational damage. Repeated or serious violations may also affect business registrations or licences under applicable law. Compliance is therefore both a legal responsibility and a foundation for employee trust."
        ]
      }
    ],
    faqs: [
      { question: "Is POSH compliance mandatory for all companies?", answer: "Every workplace covered by the Act must follow its prevention, committee, complaint-handling and confidentiality requirements. Organizations with 10 or more employees must constitute an Internal Committee." },
      { question: "Who can file a POSH complaint?", answer: "An aggrieved woman can submit a written complaint to the Internal Committee or Local Committee. The law also allows assistance when she cannot make the complaint in writing and recognizes limited situations where another specified person may submit it." },
      { question: "Does POSH apply to remote work?", answer: "Yes. The workplace definition is broad and can cover remote work, client visits, offsites, business travel, employer-arranged transport and work-related digital communication." }
    ]
  },
  {
    slug: "modern-leave-policy-india-2026",
    category: "Workplace culture",
    categoryTone: "yellow",
    title: "Guide to Crafting a Modern Leave Policy: 2026 Best Practices",
    description: "Build an inclusive, flexible and compliant leave framework that supports employee wellbeing without compromising business continuity.",
    date: "29 December 2025",
    readTime: "9 min read",
    image: leaveArticleImage,
    author: "360 BizHealth Editorial Team",
    quickAnswer: [
      "There is no universal leave policy: size, industry, work model, employee mix and state laws all matter.",
      "A balanced framework usually covers sick, casual, earned, parental, bereavement, public, floating and wellness leave.",
      "Define eligibility, accrual, carry-forward, encashment, approvals and documentation in plain language.",
      "Review the policy at least annually and whenever labour laws, business structures or workforce needs change."
    ],
    sections: [
      {
        heading: "Why leave policy is now a strategic tool",
        paragraphs: [
          "An efficient leave policy directly affects retention, productivity and employee satisfaction. Modern organizations are moving beyond rigid absence rules towards policies that support wellbeing, flexibility and work-life balance while protecting business continuity."
        ]
      },
      {
        heading: "How leave policies are evolving",
        bullets: [
          "Fixed leave structures are becoming flexible and customizable",
          "Mental health and wellness leaves are gaining attention",
          "Hybrid teams need work-from-anywhere and handover clarity",
          "Floating holidays support cultural and religious preferences",
          "Parental and adoption leave are becoming more inclusive and gender-aware"
        ]
      },
      {
        heading: "Choosing the right policy",
        bullets: [
          "Organization size and industry",
          "Remote, hybrid or on-site work model",
          "Employee demographics and workforce needs",
          "Operational requirements and peak periods",
          "Geographical presence and state-wise laws",
          "Company values, industry benchmarks, fairness and transparency"
        ]
      },
      {
        heading: "Three practical policy structures",
        numbered: [
          "Standard corporate policy: typically 10–12 casual leave days, 10–12 sick leave days, 15–18 earned or privilege leave days, public holidays, parental leave and 3–5 bereavement days. Earned leave may carry forward within a defined cap.",
          "Flexible hybrid policy: a combined paid-leave pool of around 24–30 days, separate statutory parental benefits, floating holidays and wellness or mental-health leave. Employees still need handover and continuity expectations.",
          "Accrual-based policy: earned leave may be credited at 1.5 days per month, sick leave quarterly or annually, and casual leave at the start of the year. This helps manage payroll and leave liabilities."
        ]
      },
      {
        heading: "Essential leave categories",
        bullets: [
          "Sick leave for health-related absence, with documentation and carry-forward rules",
          "Casual leave for short personal or urgent needs",
          "Earned or privilege leave for planned vacations and extended time off",
          "Parental leave covering maternity, paternity and adoption benefits as applicable",
          "Bereavement leave for the loss of an immediate family member",
          "Public holidays based on regional and national calendars",
          "Optional or floating holidays for cultural, religious or personal preferences",
          "Wellness or mental-health leave to support recovery and wellbeing"
        ]
      },
      {
        heading: "Types of leave policies",
        bullets: [
          "Traditional: separate CL, SL and EL buckets; best for structured or compliance-heavy organizations",
          "Flexible: employees have more control; best for modern and hybrid workplaces",
          "Unlimited: no fixed annual cap, subject to approvals and business needs",
          "Accrual-based: leave is earned monthly or quarterly; best for financial control",
          "Lumpsum: leave is credited at the beginning of the year; simple for employees to understand"
        ]
      },
      {
        heading: "Legal compliance and regional considerations",
        paragraphs: [
          "Leave rules in India can depend on central labour requirements, judicial interpretations, the state Shops and Establishments law, the establishment type and the employee category. The Maternity Benefit Act provides statutory maternity benefits for eligible women, including up to 26 weeks in qualifying cases, protection during pregnancy and nursing breaks. Shops and Establishments laws can change earned-leave, holiday, working-hours and carry-forward rules by state. The Factories Act includes annual leave with wages for eligible workers in manufacturing establishments.",
          "A policy should define which leave can be carried forward or encashed, how encashment is calculated and whether it is available during employment or only on exit. Documentation requirements and state-specific limits should be reviewed regularly."
        ]
      },
      {
        heading: "How to implement a leave system",
        numbered: [
          "Document leave types, entitlements, eligibility, accrual, carry-forward, encashment, approvals and required documents in simple language.",
          "Communicate through email, employee handbooks, HRMS notifications and team briefings. Share a one-page summary with examples, including mid-year joining and proration.",
          "Train managers on fair approvals, peak periods, exceptions, escalations and bias-free decisions.",
          "Use a leave management system for applications, approvals, live balances, history, alerts, reports and payroll integration.",
          "Define workflows such as Employee → Reporting Manager → HR, including notice periods, emergency leave and backup approvers.",
          "Integrate leave with payroll and attendance for accurate deductions, encashment and statutory records.",
          "Monitor trends, absenteeism, balance utilization and last-minute requests.",
          "Create exception handling for medical emergencies, extended leave and critical-role deviations.",
          "Review the policy at least annually and after major legal or organizational changes."
        ]
      },
      {
        heading: "Measure impact and adapt to trends",
        bullets: [
          "Leave utilization and absenteeism trends",
          "Carry-forward balances and employee satisfaction",
          "Impact on productivity and workforce planning",
          "Mental-health support and work-from-anywhere flexibility",
          "Four-day workweek experiments, sabbaticals and inclusive parental leave",
          "AI-driven leave analytics and social-security developments for gig and platform workers"
        ]
      },
      {
        heading: "Key compliance risks",
        bullets: [
          "Denying maternity benefits because of technicalities",
          "Treating maternity leave as a break in service",
          "Failing to update policies after labour-law changes",
          "Ignoring state-specific leave laws",
          "Maintaining poor documentation or no audit trail"
        ]
      }
    ],
    faqs: [
      { question: "How many types of leave should a company offer?", answer: "Many businesses offer five to eight core categories such as public holidays, earned, sick, casual and parental leave. The exact list should reflect legal requirements, work model and employee needs." },
      { question: "Can unused leave be carried forward?", answer: "Often yes, but the limit depends on company policy, employee category, location and applicable law. The policy should state the cap clearly." },
      { question: "Should startups have a formal leave policy?", answer: "Yes. A written policy prevents inconsistent approvals, clarifies expectations and becomes increasingly important as more managers and employees join the team." }
    ]
  },
  {
    slug: "full-final-settlement-india-2026",
    category: "Payroll & exits",
    categoryTone: "pink",
    title: "Full and Final Settlement (FnF) in India: Complete Guide for HR & Payroll Teams",
    description: "Understand salary, leave encashment, gratuity, deductions, clearances, timelines and documentation for a smoother employee exit.",
    date: "22 December 2025",
    readTime: "7 min read",
    image: fnfArticleImage,
    author: "360 BizHealth Editorial Team",
    quickAnswer: [
      "FnF settles all financial obligations when an employee resigns, retires, is terminated or completes a contract.",
      "It can include unpaid salary, allowances, leave encashment, gratuity, bonuses, reimbursements, deductions and asset recovery.",
      "A clear internal target is usually 30–45 days after exit, while statutory payments such as gratuity follow their own requirements.",
      "A detailed statement, approvals and cross-functional clearance help reduce disputes and build trust."
    ],
    sections: [
      {
        heading: "What is Full and Final Settlement?",
        paragraphs: [
          "Full and Final Settlement is the process of calculating and paying all amounts owed to an employee at the time of departure, while recovering valid outstanding dues from the employee. It closes the employment relationship with accurate payment, documentation and compliance."
        ]
      },
      {
        heading: "When does FnF apply?",
        bullets: [
          "Resignation",
          "Termination by the employer",
          "Retirement",
          "End of a fixed-term or other employment contract"
        ]
      },
      {
        heading: "What does FnF include?",
        numbered: [
          "Unpaid salary and allowances: pay for the final days worked, pending revisions, arrears, HRA, special allowances and eligible performance-linked pay.",
          "Leave encashment: payment for unused earned or privilege leave as permitted by policy and applicable law.",
          "Gratuity: statutory benefit for eligible employees based on service and the applicable wage definition.",
          "Bonuses and incentives: earned performance bonuses, commissions, sales incentives and quarterly or annual payouts.",
          "Provident Fund and pension: PF transfer or withdrawal is generally processed through the EPF system, with EPS benefits depending on eligibility.",
          "Reimbursements: approved travel, medical, internet, phone and business-expense claims.",
          "Deductions: TDS, Professional Tax, outstanding loans or advances, notice-period recovery and valid asset-related dues.",
          "Asset recovery: laptops, phones, access cards, equipment, documents and confidential materials must be returned before closure."
        ]
      },
      {
        heading: "Leave encashment formula",
        paragraphs: [
          "A common illustrative formula is: Leave Encashment = (Basic Salary + Dearness Allowance) ÷ 30 × Unused Leave Days. Companies may use basic salary alone or another method under their policy, so the applicable rule should be stated clearly.",
          "Example 1: Basic ₹30,000 + DA ₹5,000 with 10 unused days gives ₹35,000 ÷ 30 = ₹1,166.67 per day and ₹11,666.70 encashment.",
          "Example 2: Basic ₹40,000 + DA ₹10,000 with 15 days gives ₹25,000.05.",
          "Example 3: Basic ₹50,000 + DA ₹10,000 with 20 days gives ₹40,000."
        ]
      },
      {
        heading: "Gratuity calculation",
        paragraphs: [
          "The illustrative formula is: (Last Drawn Salary (Basic + DA) × 15 × Completed Years of Service) ÷ 26. For ₹30,000 and five years, the result is ₹86,538.46. For ₹45,000 and seven years, it is ₹181,730.76. For ₹60,000 and ten years, it is ₹346,153.85. These examples are illustrative; eligibility, wage components and applicable rules must be checked for the employee.",
          "The 2026 guide also flags fixed-term employee eligibility after one year in applicable situations and the impact of the 50% wage definition on statutory calculations. HR should verify the current legal position before processing."
        ]
      },
      {
        heading: "Step-by-step FnF process",
        numbered: [
          "Initiate the exit after resignation, termination, retirement or contract completion.",
          "Complete handover and clearance, including asset return and No Dues approval.",
          "Calculate earnings, leave encashment, gratuity, reimbursements and deductions.",
          "Route the FnF statement through HR, finance and management approvals.",
          "Release the final payment through bank transfer with a detailed breakdown.",
          "Close documentation by sharing the FnF statement, final payslip, relieving letter and experience letter."
        ]
      },
      {
        heading: "Compliance and timelines",
        paragraphs: [
          "Organizations should define a reasonable internal timeline, commonly 30–45 days after the last working day, subject to clearance and approval. Gratuity has its own statutory payment requirement, and tax deductions must follow the Income Tax Act. Delays or unexplained deductions can lead to disputes, escalation, dissatisfaction and reputational harm."
        ]
      },
      {
        heading: "Common challenges and best practices",
        bullets: [
          "Calculation errors: automate payroll and FnF calculations and maintain an audit trail.",
          "Delayed clearances: give HR, finance, IT and managers a shared workflow with owners and due dates.",
          "Policy misinterpretation: document eligibility, encashment, notice recovery and deductions in plain language.",
          "Compliance risk: review wage definitions, tax treatment and statutory rules before approval.",
          "Transparency: share a detailed breakup and a contact point for questions.",
          "Accuracy metrics: track processing time, disputes, calculation corrections and exit satisfaction."
        ]
      },
      {
        heading: "Emerging FnF trends",
        bullets: [
          "Automated HRMS and payroll workflows",
          "Real-time FnF tracking dashboards",
          "Digital document management",
          "AI-based payroll accuracy checks",
          "Employee self-service exit portals"
        ]
      }
    ],
    faqs: [
      { question: "How long does FnF take in India?", answer: "Business timelines vary, but the guide recommends a typical internal target of 30–45 days after the last working day, depending on approvals, clearances and outstanding claims." },
      { question: "Is gratuity part of FnF?", answer: "It can be included when the employee meets eligibility requirements. Some organizations settle it separately, but the FnF communication should clearly show whether it applies." },
      { question: "Can FnF be delayed?", answer: "Incomplete handover, asset returns, approvals, reimbursements or disputes can cause delays. A structured workflow and clear employee communication help minimize them." },
      { question: "Can PF be included in FnF?", answer: "PF is usually processed separately through the EPF system, where the employee can transfer or withdraw the balance subject to applicable rules. It should still be explained in the final communication." }
    ]
  }
];

function SearchBox({ onSelectArticle }) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      articles
        .filter((article) =>
          `${article.title} ${article.category} ${article.description}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, 4),
    [query]
  );

  return (
    <div style={{ position: "relative", maxWidth: 650 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: 14,
          border: query ? "2px solid #fc326c" : "2px solid #e0e0e0",
          background: "#fff",
          padding: "0 1.25rem",
          boxShadow: query
            ? "0 3px 10px rgba(255,105,180,0.18)"
            : "0 3px 10px rgba(0,0,0,0.05)",
          transition: "border .2s ease",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7b18cc"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search HR, payroll or compliance guides"
          style={{
            width: "100%",
            border: 0,
            background: "transparent",
            padding: "1rem .85rem",
            fontSize: ".95rem",
            fontWeight: 500,
            color: "var(--ink)",
            outline: "none",
          }}
        />
      </div>

      {query && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 8px)",
            zIndex: 30,
            borderRadius: 14,
            border: "1px solid var(--line-2)",
            background: "#fff",
            padding: ".5rem",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          }}
        >
          {results.length ? (
            results.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                onClick={() => setQuery("")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  borderRadius: 8,
                  padding: ".75rem 1rem",
                  fontSize: ".92rem",
                  fontWeight: 500,
                  color: "var(--ink)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f2ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span>{article.title}</span>
                <span style={{ color: "#7b18cc", fontWeight: 700 }}>&nearr;</span>
              </Link>
            ))
          ) : (
            <p style={{ padding: ".8rem 1rem", fontSize: ".9rem", color: "var(--muted)", margin: 0 }}>
              No guides found. Try another search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MetaRow({ article }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", fontSize: ".82rem", color: "#696969" }}>
      <span>📅 {article.date}</span>
      <span>⏱️ {article.readTime}</span>
    </div>
  );
}

function ArticleCard({ article, compact = false }) {
  const tone = categoryToneStyles[article.categoryTone] || categoryToneStyles.green;

  return (
    <article
      style={{
        borderRadius: 14,
        border: "1px solid #f0f2f5",
        background: "#fff",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: compact ? "row" : "column",
        transition: "transform .25s ease, box-shadow .25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(25,55,101,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)";
      }}
    >
      <Link
        to={`/blog/${article.slug}`}
        style={{
          width: compact ? "40%" : "100%",
          height: compact ? "auto" : 210,
          flexShrink: 0,
          overflow: "hidden",
          display: "block",
        }}
      >
        <img
          src={article.image}
          alt={article.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </Link>

      <div style={{ padding: compact ? "1.1rem" : "1.4rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <span
          style={{
            display: "inline-block",
            width: "fit-content",
            borderRadius: 999,
            padding: ".25rem .7rem",
            fontSize: ".75rem",
            fontWeight: 600,
            background: tone.background,
            color: tone.color,
            marginBottom: ".65rem",
          }}
        >
          {article.category}
        </span>

        <Link
          to={`/blog/${article.slug}`}
          style={{
            fontSize: compact ? "1rem" : "1.2rem",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "var(--ink)",
            textDecoration: "none",
            marginBottom: ".5rem",
          }}
        >
          {article.title}
        </Link>

        {!compact && (
          <p style={{ fontSize: ".9rem", lineHeight: 1.55, color: "#4f5354", margin: "0 0 1rem 0" }}>
            {article.description}
          </p>
        )}

        <div
          style={{
            marginTop: "auto",
            paddingTop: ".8rem",
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to={`/blog/${article.slug}`}
            style={{ fontSize: ".88rem", fontWeight: 600, color: "#7b18cc", textDecoration: "none" }}
          >
            Read more &rarr;
          </Link>
          <span style={{ fontSize: ".75rem", color: "#696969" }}>{article.date}</span>
        </div>
      </div>
    </article>
  );
}

function BlogDetailView({ article }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileToc, setMobileToc] = useState(false);
  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  const tocItems = article.sections.map((section, index) => ({ ...section, id: `section-${index}` }));
  const tone = categoryToneStyles[article.categoryTone] || categoryToneStyles.green;

  return (
    <div style={{ background: "#fff", color: "#272127", minHeight: "100vh" }}>
      {/* Top Breadcrumb & Title Section */}
      <section style={{ padding: "2.5rem 0 1.5rem", borderBottom: "1px solid #f0f2f5" }}>
        <div className="wrap" style={{ maxWidth: 1312 }}>
          <div style={{ marginBottom: "1rem" }}>
            <Link to="/blog" style={{ color: "#7b18cc", textDecoration: "none", fontSize: ".92rem", fontWeight: 600 }}>
              &larr; Back to all guides &amp; articles
            </Link>
          </div>

          <span
            style={{
              display: "inline-block",
              borderRadius: 999,
              padding: ".35rem 1rem",
              fontSize: ".85rem",
              fontWeight: 600,
              background: tone.background,
              color: tone.color,
            }}
          >
            {article.category}
          </span>

          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.25, margin: "1.2rem 0 1rem" }}>
            {article.title}
          </h1>

          <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#4f5354", maxWidth: 880, margin: "0 0 1.5rem" }}>
            {article.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem", fontSize: ".92rem" }}>
            <span style={{ fontWeight: 600, color: "var(--ink)" }}>{article.author}</span>
            <MetaRow article={article} />
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".4rem",
                padding: ".35rem .85rem",
                borderRadius: 999,
                border: "1px solid #e2e8f0",
                color: "var(--ink)",
                textDecoration: "none",
                fontSize: ".85rem",
                fontWeight: 500,
              }}
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Main Grid: TOC / Article / Sidebar */}
      <div
        className="wrap"
        style={{
          maxWidth: 1360,
          padding: "2rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2.5rem",
          alignItems: "start",
        }}
      >
        {/* Left TOC */}
        <aside style={{ position: "sticky", top: 90 }}>
          <div style={{ background: "#f9f2ff", borderRadius: 16, padding: "1.2rem", border: "1px solid #ede4f5" }}>
            <button
              onClick={() => setMobileToc((v) => !v)}
              type="button"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                background: "none",
                border: "none",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "#334d74",
                cursor: "pointer",
              }}
            >
              <span>Table of contents</span>
              <span>{mobileToc ? "▲" : "▼"}</span>
            </button>

            <nav style={{ display: mobileToc ? "block" : "block", marginTop: ".8rem" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: ".35rem" }}>
                {tocItems.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      style={{
                        display: "block",
                        fontSize: ".88rem",
                        color: "#334d74",
                        textDecoration: "none",
                        padding: ".4rem .5rem",
                        borderRadius: 6,
                        lineHeight: 1.35,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#7b18cc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#334d74";
                      }}
                    >
                      &rarr; {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Center Article Content */}
        <article style={{ minWidth: 0, gridColumn: "span 2" }}>
          {/* Quick Summary Box */}
          <div style={{ background: "#f9f2ff", border: "1px solid #ede4f5", borderRadius: 16, padding: "1.6rem", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#5d1498", margin: "0 0 1rem" }}>In short</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: ".75rem" }}>
              {article.quickAnswer.map((ans, i) => (
                <li key={i} style={{ display: "flex", gap: ".75rem", fontSize: ".98rem", lineHeight: 1.6 }}>
                  <span style={{ color: "#7b18cc", fontWeight: 700 }}>✓</span>
                  <span>{ans}</span>
                </li>
              ))}
            </ul>
          </div>

          <img
            src={article.image}
            alt={article.title}
            style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 16, marginBottom: "2.5rem" }}
          />

          <div style={{ display: "grid", gap: "2.5rem" }}>
            {article.sections.map((section, idx) => (
              <section key={section.heading} id={`section-${idx}`} style={{ scrollMarginTop: 100 }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)", marginBottom: "1rem" }}>
                  {section.heading}
                </h2>

                {section.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx} style={{ fontSize: "1.02rem", lineHeight: 1.75, color: "#272127", marginBottom: "1rem" }}>
                    {p}
                  </p>
                ))}

                {section.bullets && (
                  <ul style={{ paddingLeft: "1.4rem", fontSize: "1rem", lineHeight: 1.7, color: "#272127", margin: "1rem 0" }}>
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: ".4rem" }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {section.numbered && (
                  <ol style={{ paddingLeft: "1.4rem", fontSize: "1rem", lineHeight: 1.7, color: "#272127", margin: "1rem 0" }}>
                    {section.numbered.map((n, nIdx) => (
                      <li key={nIdx} style={{ marginBottom: ".65rem" }}>
                        {n}
                      </li>
                    ))}
                  </ol>
                )}

                {section.table && (
                  <div style={{ overflowX: "auto", margin: "1.5rem 0", borderRadius: 12, border: "1px solid #d5d9e0" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: ".92rem" }}>
                      <thead style={{ background: "#f9f2ff", color: "#46077a" }}>
                        <tr>
                          {section.table.headers.map((h, hIdx) => (
                            <th key={hIdx} style={{ padding: ".85rem 1rem", borderBottom: "1px solid #d5d9e0", fontWeight: 700 }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ padding: ".85rem 1rem", color: "#334155", verticalAlign: "top" }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Author Box */}
          <div style={{ background: "#f9f2ff", borderRadius: 16, padding: "1.8rem", marginTop: "3rem", display: "flex", gap: "1.2rem", alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#38095e", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: ".9rem", flexShrink: 0 }}>
              360
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>{article.author}</h3>
              <p style={{ fontSize: ".9rem", color: "#64748b", margin: ".3rem 0 0", lineHeight: 1.5 }}>
                Our editorial team turns complex HR, payroll and compliance topics into practical guidance for business leaders.
              </p>
            </div>
          </div>
        </article>

        {/* Right Sidebar */}
        <aside style={{ position: "sticky", top: 90, display: "grid", gap: "1.8rem" }}>
          <div style={{ background: "#f9f2ff", borderRadius: 16, padding: "1.5rem", border: "1px solid #ede4f5" }}>
            <div style={{ fontSize: "1.6rem", marginBottom: ".6rem" }}>✨</div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 .5rem", lineHeight: 1.3 }}>Make benefits and HR simpler.</h2>
            <p style={{ fontSize: ".9rem", color: "#4f5354", lineHeight: 1.5, margin: "0 0 1.2rem" }}>
              Talk to our team about a smoother, more compliant employee experience.
            </p>
            <Link
              to="/contact"
              className="btn btn--primary"
              style={{ width: "100%", justifyContent: "center", borderRadius: 999, fontSize: ".9rem" }}
            >
              Get a quote &rarr;
            </Link>
          </div>

          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1rem" }}>Related articles</h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} compact />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Gradient CTA */}
      <section style={{ maxWidth: 1312, margin: "2rem auto 4rem", padding: "0 1.5rem" }}>
        <div
          style={{
            borderRadius: 20,
            background: "linear-gradient(135deg, #7b18cc 0%, #38095e 100%)",
            color: "#fff",
            padding: "clamp(2rem, 5vw, 3.5rem)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div>
            <p style={{ fontSize: ".85rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#ffdc79", margin: 0 }}>
              Better HR starts here
            </p>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", margin: ".6rem 0", fontWeight: 600 }}>
              Give your team the clarity and support they need.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.8)", margin: 0, maxWidth: 600 }}>
              Bring payroll, compliance and employee operations together with an experienced partner.
            </p>
          </div>

          <Link
            to="/contact"
            className="btn"
            style={{
              background: "var(--red)",
              color: "#fff",
              borderRadius: 999,
              padding: ".85rem 1.8rem",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Talk to an expert &rarr;
          </Link>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section style={{ background: "#38095e", color: "#fff", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 600, marginBottom: "2rem" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "grid" }}>
            {article.faqs.map((faq, index) => (
              <div key={faq.question} style={{ borderBottom: "1px solid rgba(255,255,255,0.25)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  type="button"
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1.5rem",
                    padding: "1.3rem 0",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    textAlign: "left",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{ fontSize: "1.2rem", transform: openFaq === index ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}>
                    ▼
                  </span>
                </button>
                {openFaq === index && (
                  <p style={{ paddingBottom: "1.3rem", fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.85)", margin: 0 }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Blog() {
  const { slug } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (slug) {
    const article = articles.find((a) => a.slug === slug) || articles[0];
    return <BlogDetailView article={article} />;
  }

  const featured = articles[0];
  const visibleArticles =
    selectedTopic === "Business guides"
      ? articles
      : selectedTopic
      ? articles.filter((article) => article.category === selectedTopic)
      : articles.slice(1);

  const selectTopic = (topic) => {
    setSelectedTopic(topic);
    window.setTimeout(() => {
      document.getElementById("latest")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const featuredTone = categoryToneStyles[featured.categoryTone] || categoryToneStyles.green;

  return (
    <div style={{ background: "#fff", color: "#272127", minHeight: "100vh" }}>
      {/* Top Banner Notice */}
      <div style={{ background: "#46077a", color: "#fff", padding: ".6rem 1rem", textAlign: "center", fontSize: ".88rem", fontWeight: 500 }}>
        Practical HR insights for India&apos;s modern workplaces{" "}
        <span style={{ color: "#ffdc79", fontWeight: 700, marginLeft: ".5rem" }}>Explore the latest guides &rarr;</span>
      </div>

      {/* Search Section */}
      <section style={{ maxWidth: 1312, margin: "0 auto", padding: "1.8rem 1.5rem 1rem" }}>
        <SearchBox />
      </section>

      {/* Featured Hero Article */}
      <section style={{ maxWidth: 1312, margin: "0 auto", padding: "0 1.5rem 3.5rem" }}>
        <Link
          to={`/blog/${featured.slug}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            borderRadius: 20,
            background: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            overflow: "hidden",
            textDecoration: "none",
            color: "inherit",
            border: "1px solid #f0f2f5",
          }}
        >
          <div style={{ minHeight: 320, overflow: "hidden" }}>
            <img
              src={featured.image}
              alt={featured.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div style={{ padding: "clamp(1.8rem, 4vw, 2.8rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: "fit-content",
                borderRadius: 999,
                padding: ".3rem .8rem",
                fontSize: ".8rem",
                fontWeight: 600,
                background: featuredTone.background,
                color: featuredTone.color,
                marginBottom: "1rem",
              }}
            >
              {featured.category}
            </span>

            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, lineHeight: 1.3, color: "#272127", margin: "0 0 1rem" }}>
              {featured.title}
            </h1>

            <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "#4f5354", margin: "0 0 1.5rem" }}>
              {featured.description}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: ".9rem" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#38095e", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: ".85rem" }}>
                ✨
              </div>
              <div>
                <p style={{ fontSize: ".92rem", fontWeight: 700, margin: 0, color: "var(--ink)" }}>{featured.author}</p>
                <MetaRow article={featured} />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Recent Articles Section */}
      <section id="latest" style={{ maxWidth: 1312, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 600, color: "#272127", margin: 0 }}>
          {selectedTopic ? `${selectedTopic} Articles` : "Our Recent Articles"}
        </h2>
        <p style={{ fontSize: "1rem", color: "#4f5354", margin: ".5rem 0 2rem" }}>
          Practical explainers and checklists for smarter people operations.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {visibleArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* Explore by Topic */}
      <section id="topics" style={{ background: "#f9f2ff", borderTop: "1px solid #ede4f5", borderBottom: "1px solid #ede4f5", padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1312, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 600, color: "#272127", margin: "0 0 1.5rem" }}>
            Explore by topic
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem" }}>
            {["HR compliance", "HR technology", "Payroll & exits", "Workplace culture", "Business guides"].map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => selectTopic(topic)}
                style={{
                  borderRadius: 999,
                  padding: ".55rem 1.2rem",
                  fontSize: ".92rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "all .18s ease",
                  background: selectedTopic === topic ? "#46077a" : "#fff",
                  color: selectedTopic === topic ? "#fff" : "#5d1498",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                {topic}
              </button>
            ))}
          </div>

          {selectedTopic && (
            <button
              type="button"
              onClick={() => setSelectedTopic(null)}
              style={{
                marginTop: "1.2rem",
                background: "none",
                border: "none",
                fontSize: ".95rem",
                fontWeight: 600,
                color: "#7b18cc",
                cursor: "pointer",
              }}
            >
              Show all articles &rarr;
            </button>
          )}
        </div>
      </section>

      {/* Essential Business Guides */}
      <section id="guides" style={{ maxWidth: 1312, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 600, color: "#272127", margin: 0 }}>
              Essential business guides
            </h2>
            <p style={{ fontSize: "1rem", color: "#4f5354", margin: ".5rem 0 0" }}>
              Long-form explainers for the decisions HR teams make every day.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <ArticleCard article={articles[1]} />
          <div style={{ display: "grid", gap: "1.2rem" }}>
            {articles.slice(2).map((article) => (
              <ArticleCard key={article.slug} article={article} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Promo Section */}
      <section style={{ maxWidth: 1312, margin: "0 auto 4rem", padding: "0 1.5rem" }}>
        <div
          style={{
            borderRadius: 20,
            border: "1px solid #d5d9e0",
            padding: "clamp(1.8rem, 4vw, 2.5rem)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            alignItems: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <img
            src={teamRetreatsImage}
            alt="Teams working together"
            style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 14 }}
          />

          <div>
            <p style={{ fontSize: ".85rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#7b18cc", margin: 0 }}>
              Build a stronger people function
            </p>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, lineHeight: 1.3, color: "#272127", margin: ".6rem 0 1rem" }}>
              Make employee operations simpler for everyone.
            </h2>
            <p style={{ fontSize: ".98rem", color: "#4f5354", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
              From payroll and compliance to employee benefits, get one partner for the systems and support your team needs.
            </p>
            <Link
              to="/contact"
              className="btn"
              style={{
                background: "var(--red)",
                color: "#fff",
                borderRadius: 999,
                padding: ".75rem 1.8rem",
                fontWeight: 700,
                fontSize: ".95rem",
              }}
            >
              Get a quote &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
