import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logoImg from "@/assets/logo.png";
import hrTechnology from "@/assets/hr-technology.jpg";
import statutoryCompliance from "@/assets/statutory-compliance-2.jpg";
import financialTaxation from "@/assets/tds-labour.jpg";
import insuranceAdvisory from "@/assets/insurance-advisory.jpg";
import heroIllustration from "@/assets/hero-illustration.jpg";
import integrateImg from "@/assets/company-registration.jpg";
import gaugeImg from "@/assets/ipr-brand.jpg";
import envelopeImg from "@/assets/team-retreats.jpg";
import webSeoImg from "@/assets/web-seo.jpg";
import integrateHowItWorks from "@/assets/integrate.jpg";
import gaugeHowItWorks from "@/assets/gauge.jpg";
import envelopeHowItWorks from "@/assets/envelope.jpg";

const FR = "https://framerusercontent.com/images";
const img = {
  dashboard: `${FR}/ZQIj3Thxxza6gmZ33yEqfh0ew.png`,
  unified: `${FR}/UasGKBRyLZHeUJr1HL5mRgukJU.png`,
  ai: `${FR}/eUVqpWJ3R7uJaOJnHDYhRMM4WPE.png`,
  usage: `${FR}/HCkEwVWHcO0voDYrtskCSdReI.png`,
  retention: `${FR}/ukxSF4evyjJNRAA1AxD2RgCC4ds.png`,
  integrate: `${FR}/eZxPRr9DFJ1LBw2C6XgbmteUwk.png`,
  gauge: `${FR}/MTi16xQQXh1uLFK6rlUiLRrhNc4.png`,
  envelope: `${FR}/WVfMImGvfZB1ZvVOi4f8QpGgcQ.png`,
  envelopeFooter: `${FR}/OXyYHX9MW2fCN7IDYfVvNCAqUX0.png`,
  veltix: `${FR}/nJN9fw89j7L0b6R9JJh3qGL98.png`,
  knot: `${FR}/rpot5Bf0TIFeRoXSfetpc2GULFo.png`,
  klyra: `${FR}/GfeiYrM8yVHItoK8N01yQWI7djQ.png`,
  nuvio: `${FR}/3xq9uOvolNwNx1mCSkE8bN0BYQ.png`,
  p1: `${FR}/XreXVnshxtY9J8ZoG3rjAuTzW8E.png`,
  p2: `${FR}/IvVTxoC9vqr4NcKyfF6JMWEc.png`,
  p3: `${FR}/UrClpHTqxXZbq1FAa6sJ9BzS1uk.png`,
  quote: `${FR}/UBNbepHJf0KbEt8th3mWIASU8.svg`,
  stars: `${FR}/7gBs4Qym6w5w5VToXqPFZUirIg.svg`,
  blog1: `${FR}/FtmOrBfo605IzU7NGNBgglpwFg.png`,
  blog2: `${FR}/yWKMBE9ZW7mo4BPJxZ7N3wLJXzY.png`,
  blog3: `${FR}/gAGNRXHMmc0UdJcc054idbIAoM.png`,
  blog4: `${FR}/XD8IOtGZkFXgZsVfKdtEB0hi6s.png`,
  carter: `${FR}/Ja8p9J3F9vN86Z3j6hBjs1zT9SY.png`,
  elena: `${FR}/kVI5rNJF2u29dE47wJKBMhBHIVc.png`,
  james: `${FR}/g9u5lc8a7bhRVYmAcLaz2V8Vd0.png`,
  marcus: `${FR}/toL76daUzF0G3CNvrUyjLIYRBU.png`,
  sarah: `${FR}/eqelcmPilFO99lTneGHDJtQO7w.png`,
  brand1: `${FR}/PGKcy4WmnERCPmeXktSEHoHKnBg.png`,
  brand2: `${FR}/qhXchWGPkz6damUzZuhTuqkwU.png`,
  brand3: `${FR}/JVfYExM1Xs6KQpl1derzB2V1g.png`,
  brand4: `${FR}/wFewVdp3ivv1nwC1Inkn50DQomE.png`,
  brand5: `${FR}/brU1uaEpUTR5y39kjuhXxE5rcn4.png`,
  brand6: `${FR}/mYPlcpoTxOEWAuM8L6AUOpjqjpE.png`,
};

function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient pt-32 pb-24 lg:pt-40 lg:pb-32">
      {/* Background Decorative Gradients/Blobs */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-6 text-left flex flex-col items-start lg:pr-16">
            
            {/* Spacer to preserve alignment after removing Trusted Badge */}
            <div className="h-[58px]" />

            {/* Title */}
            <h1 className="text-[28px] md:text-[34px] lg:text-[40px] font-semibold tracking-[-0.02em] text-[#070707] leading-[1.2] max-w-[500px] animate-fade-in">
              All-in-One Platform to<br />
              Manage Your Business,<br />
              HR & Compliance
            </h1>

            {/* Description */}
            <p className="mt-6 text-[16px] lg:text-[18px] font-semibold text-[#444444] leading-[1.6] max-w-[420px]">
              Simplify your backend operations by integrating HR, compliance, taxation and employee benefits in one place.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-start gap-3 w-full sm:w-auto">
              <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                <a 
                  href="#pricing"
                  className="w-full sm:w-auto text-center rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 transition hover:scale-[1.01] hover:bg-primary/95 active:scale-[0.99]"
                >
                  Schedule Free Consultation
                </a>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <span>📅 30-min consultation included</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Mockup Image */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center">
            
            <img 
              src={heroIllustration} 
              alt="360 Biz Health platform" 
              className="relative w-full h-auto object-contain max-h-[500px] mix-blend-multiply"
            />
            
          </div>

        </div>
      </div>
    </section>
  );
}


function Features() {
  const feats = [
    {
      img: hrTechnology,
      title: "End-to-End HRMS",
      subtitle: "Attendance • Payroll • Expense • Performance",
      bullets: [
        "Real-time Attendance & Leave Management",
        "Automated Payroll Processing & Salary Slips",
        "Expense Reimbursements & Timesheets",
        "Performance Management & Appraisals"
      ]
    },
    {
      img: statutoryCompliance,
      title: "Payroll, TDS & Labour Compliance",
      bullets: [
        "PF, ESIC, LWF Registration & Filing",
        "TDS Returns (Form 24Q) & Form 16",
        "Labour Law Advisory & Auditing",
        "Shops & Establishment Compliance"
      ]
    },
    {
      img: gaugeImg,
      title: "IPR & Certifications",
      bullets: [
        "Trademark Search & Filing",
        "Copyright Registration for Code & Media",
        "Design Patent Registration",
        "Corporate Certifications & Startup India"
      ]
    },
    {
      img: envelopeImg,
      title: "Corporate Retreats & Workation",
      bullets: [
        "Planned Corporate Offsites & Team Trips",
        "Interactive Team Building Activities",
        "Premium Workation Stays at Top Destinations",
        "End-to-End Travel & Event Coordination"
      ]
    }
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="text-sm font-medium text-primary">Everything You Need</span>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">End-to-End Business Solutions</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">From managing your team to staying compliant with tax laws—handle every aspect of your business with confidence.</p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {feats.map((f) => (
          <div key={f.title} className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/20 flex flex-col sm:flex-row h-full">
            <div className="relative w-full h-44 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden">
              <img 
                src={f.img} 
                alt={f.title} 
                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent to-black/10"></div>
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors duration-300 leading-snug">{f.title}</h3>
                {f.subtitle && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider">
                    {f.subtitle}
                  </span>
                )}
                <ul className="mt-4 space-y-2.5">
                  {f.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-655 font-semibold leading-relaxed">
                      <span className="mt-1 flex h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { t: "95% Time Savings", d: "Reduce HR processing time by 95% with automated payroll and attendance." },
    { t: "Zero Compliance Penalties", d: "Stay compliant with all regulations—PF, ESIC, Labour Laws and beyond." },
    { t: "Save ₹Lakhs Annually", d: "Tax optimization and cost savings through expert financial advisory." },
    { t: "Complete Security", d: "Secure handling of sensitive employee and financial data." },
    { t: "5+ Years Expertise", d: "Trusted by 500+ businesses with proven track record of excellence." },
    { t: "Fast Implementation", d: "Quick setup with minimal disruption to your business operations." },
  ];
  const icons = ["⏱️", "✅", "💰", "🔐", "🏆", "🚀"];
  return (
    <section id="benefits" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-medium text-primary">Why 500+ Businesses Trust Us</span>
          <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">Real Results, Real Growth</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Save time, reduce costs, stay compliant, and scale confidently with our proven expertise.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((b, i) => (
            <div key={b.t} className="rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-xl">{icons[i]}</div>
              <h3 className="mt-5 text-lg font-bold">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Quick Implementation", d: "Our team handles the setup in 2-4 weeks. You focus on business while we integrate your systems seamlessly.", img: integrateHowItWorks },
    { n: "02", t: "Centralized Control", d: "Manage HR, compliance, taxes, and insurance from one intelligent dashboard with real-time insights.", img: gaugeHowItWorks },
    { n: "03", t: "Expert Support", d: "Get dedicated advisory, regular audits, and proactive guidance to stay ahead of regulations and optimize costs.", img: envelopeHowItWorks },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="text-sm font-medium text-primary">Getting Started</span>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">Simple, Guided Implementation</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">From day one to ongoing success—we guide every step of your journey.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-3xl border border-border bg-card p-2">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
              <img src={s.img} alt={s.t} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <div className="text-sm font-mono text-primary">{s.n}</div>
              <h3 className="mt-2 text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


function Testimonials() {
  const items = [
    { q: "360 Biz Health transformed our HR operations. We reduced payroll processing time by 95% and finally have zero errors. The savings have been incredible.", n: "Rajesh Kumar", img: img.carter },
    { q: "Their tax advisory alone saved us ₹25 lakhs annually. What impressed me most is how proactive their team is—they catch issues before they become penalties.", n: "Priya Sharma", img: img.elena },
    { q: "Managing compliance across multiple regulations was a nightmare. Now it's automated and we sleep better knowing everything is audit-ready.", n: "Amit Patel", img: img.james },
    { q: "The best investment our business made. All our HR, tax, and compliance needs in one place. The support team is responsive and genuinely cares about our success.", n: "Neha Singh", img: img.marcus },
    { q: "From 80 hours of manual work per month to almost zero. That's the kind of impact 360 Biz Health delivers. Highly recommend.", n: "Vikram Kapoor", img: img.sarah },
  ];
  const row = [...items, ...items];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-medium text-primary">Success Stories</span>
          <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">Trusted by Leading Businesses</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">See how 500+ companies transformed their operations, saved costs, and reduced compliance risk.</p>
        </div>
      </div>
      <div className="mt-14 overflow-hidden">
        <div className="marquee marquee-slow items-stretch">
          {row.map((t, i) => (
            <div key={i} className="w-[380px] shrink-0 rounded-3xl border border-border bg-card p-7 flex flex-col justify-between">
              <div>
                <img src={img.quote} alt="" className="h-5 w-auto opacity-70" />
                <p className="mt-4 text-sm leading-relaxed text-foreground/80">{t.q}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{t.n}</span>
                </div>
                <img src={img.stars} alt="rating" className="h-4 w-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(false);
  const plans = [
    { name: "Starter", m: 4999, y: 49990, d: "Ideal for startups and small teams (up to 50 employees).", f: ["HRMS with Payroll", "Basic Compliance Filing", "GST & Income Tax", "Email & Chat Support", "Monthly Reports"], popular: false },
    { name: "Growth", m: 9999, y: 99990, d: "For growing businesses (50-250 employees). Most popular.", f: ["Everything in Starter", "Advanced Compliance", "Insurance Advisory", "Tax Planning", "Dedicated Account Manager"], popular: true },
    { name: "Enterprise", m: 19999, y: 199990, d: "For large organizations with complex needs.", f: ["All Growth features", "IP & Branding Services", "Priority Support", "Custom Integrations", "Strategic Advisory"], popular: false },
  ];
  return (
    <section id="pricing" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-medium text-primary">Transparent Pricing</span>
          <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">Plans Built for Every Business Size</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Simple, predictable pricing with no hidden fees. ROI guaranteed through compliance certainty and cost savings.</p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card p-1">
            <button onClick={() => setYearly(false)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${!yearly ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${yearly ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}>Annual (Save 20%)</button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-3xl border bg-card p-8 ${p.popular ? "border-primary shadow-2xl shadow-primary/20" : "border-border"}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Most Popular</span>}
              <h3 className="text-base font-semibold text-muted-foreground">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">₹{yearly ? Math.floor(p.y / 12) : p.m}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.d}</p>
              <div className="my-6 h-px bg-border" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What's included</p>
              <ul className="mt-4 space-y-3">
                {p.f.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
              <a href="#" className={`mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold transition ${p.popular ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-foreground text-background hover:opacity-90"}`}>Get Started</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Compare() {
  const others = ["Manage HR, taxes, compliance separately", "Time-consuming compliance filings", "Constant penalty risks", "No strategic tax planning", "Limited regulatory updates"];
  const ours = ["One integrated platform for everything", "Automated compliance filings", "Zero penalties guaranteed", "Proactive tax optimization", "Dedicated expert support"];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="text-sm font-medium text-primary">Why 360 Biz Health</span>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">A Smarter Way to Manage Everything</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Stop managing multiple tools. Consolidate, automate, and scale with confidence.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8">
          <h3 className="text-xl font-bold text-muted-foreground">Traditional Approach</h3>
          <ul className="mt-6 space-y-4">
            {others.map((o) => (
              <li key={o} className="flex items-center gap-3 text-foreground/70">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground">✕</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10">
          <h3 className="text-xl font-bold text-primary">360 Biz Health</h3>
          <ul className="mt-6 space-y-4">
            {ours.map((o) => (
              <li key={o} className="flex items-center gap-3 font-medium">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-primary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    { q: "How quickly can we implement your platform?", a: "Most implementations are complete in 2-4 weeks with our dedicated onboarding team. We ensure minimal disruption to your existing operations." },
    { q: "Do you handle all compliance filings?", a: "Yes, we manage PF, ESIC, PT, LWF, GST, Income Tax and Labour Law compliance. You get expert audit support and zero-penalty guarantee." },
    { q: "How much can we save on taxes?", a: "On average, our clients save ₹25L-₹50L annually through strategic tax planning. Your savings depend on your business structure and transactions." },
    { q: "Is our employee data secure?", a: "Absolutely. We use bank-grade encryption, regular security audits, and comply with all data protection regulations including GDPR." },
    { q: "Can you help with IP registration?", a: "Yes. We handle trademark registration, copyright filing, patent applications, and complete brand protection strategies." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-surface py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="text-sm font-medium text-primary">Questions?</span>
          <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">We Have Answers</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Everything you need to know about implementing our platform and getting maximum value.</p>
        </div>
        <div className="mt-12 space-y-3">
          {items.map((it, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-6 text-left">
                <span className="font-semibold">{it.q}</span>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition ${open === i ? "rotate-45" : ""}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
                </span>
              </button>
              {open === i && <div className="px-6 pb-6 text-sm text-muted-foreground">{it.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Blogs() {
  const posts = [
    { tag: "Compliance", title: "Stay Audit-Ready: Essential Compliance Checklist for 2024", desc: "Never face a compliance penalty again. Learn the critical PF, ESIC, and Labour Law requirements every business must track.", img: img.blog1, read: "6 min read" },
    { tag: "HR", title: "Cut Payroll Processing Time by 95%—Here's How", desc: "Real case study: How one manufacturing firm reduced payroll errors and processing time using automated HRMS solutions.", img: img.blog2, read: "5 min read" },
    { tag: "Taxation", title: "Tax Planning Mistakes That Cost Businesses Lakhs", desc: "Common tax optimization errors and how strategic planning can save you ₹50L+ annually. Expert insights inside.", img: img.blog3, read: "7 min read" },
    { tag: "Business", title: "Insurance Beyond Coverage—Claims Management That Actually Works", desc: "What happens after you file a claim? Discover how expert advisory turns crisis into opportunity.", img: img.blog4, read: "5 min read" },
  ];
  return (
    <section id="blogs" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="text-sm font-medium text-primary">Knowledge Base</span>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold md:text-5xl">Expert Insights for Smart Business Decisions</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Learn from our team's 5+ years of experience. Compliance tips, HR automation hacks, tax strategies, and more.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {posts.map((p) => (
          <a key={p.title} href="#" className="group rounded-3xl border border-border bg-card p-2 transition hover:shadow-lg">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <img src={p.img} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{p.tag}</span>
              <h3 className="mt-2 font-bold leading-snug">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.desc}</p>
              {p.read && <p className="mt-3 text-xs text-muted-foreground">{p.read}</p>}
            </div>
          </a>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a href="#" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold">View all</a>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-12 text-center md:p-20" style={{backgroundColor: "#FFD4B3"}}>
        <img src={img.envelopeFooter} alt="" className="pointer-events-none absolute -left-10 top-1/2 hidden h-56 w-auto -translate-y-1/2 opacity-40 md:block" />
        <img src={img.envelopeFooter} alt="" className="pointer-events-none absolute -right-10 top-1/2 hidden h-56 w-auto -translate-y-1/2 opacity-40 md:block" />
        <h2 className="relative mx-auto max-w-2xl text-4xl font-extrabold text-foreground md:text-5xl">Stay Compliant & Grow Smarter</h2>
        <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">Get monthly insights on compliance updates, tax optimization strategies, and HR best practices—delivered directly to your inbox.</p>
        <a href="#" className="relative mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition">Subscribe Now</a>
      </div>
    </section>
  );
}

export default function Index({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen">
      <Header onNavigate={onNavigate} />
      <Hero />
      <Features />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      {/* <Pricing /> */}
      <Compare />
      <Faq />
      <Blogs />
      <Newsletter />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
