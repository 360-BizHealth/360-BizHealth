import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Check,
  Sparkles,
  HelpCircle,
  Plus,
  Minus,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Calculator,
  UserCheck,
  Clock,
  Layers,
  ChevronDown,
  Info,
  DollarSign
} from "lucide-react";

interface PricingProps {
  onNavigate: (page: string) => void;
}

export default function PricingPage({ onNavigate }: PricingProps) {
  // Toggle between Self-Service (false) and Full-Service (true)
  const [isFullService, setIsFullService] = useState(false);
  
  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Pricing details definition (matches the simplified homepage offerings)
  const plans = [
    {
      name: "Starter",
      icon: Briefcase,
      desc: "Essential HR technology for startups and small teams looking to automate base operations.",
      selfService: { base: 4500, perEmp: 45 },
      fullService: { base: 7500, perEmp: 75 },
      popular: false,
      features: ["HRMS with Payroll", "Basic Compliance Filing", "GST & Income Tax", "Email & Chat Support", "Monthly Reports"]
    },
    {
      name: "Growth",
      icon: TrendingUp,
      desc: "Advanced features and customized configurations for growing companies seeking higher control.",
      selfService: { base: 5500, perEmp: 55 },
      fullService: { base: 8500, perEmp: 85 },
      popular: true,
      features: ["Everything in Starter", "Advanced Compliance", "Insurance Advisory", "Tax Planning", "Dedicated Account Manager"]
    },
    {
      name: "Enterprise",
      icon: Layers,
      desc: "Robust, bank-grade infrastructure for large teams requiring complete personalization and safety.",
      selfService: { base: 10000, perEmp: 100 },
      fullService: { base: 13500, perEmp: 135 },
      popular: false,
      features: ["All Growth features", "IP & Branding Services", "Priority Support", "Custom Integrations", "Strategic Advisory"]
    }
  ];

  // Add-ons list
  const addOns = [
    { title: "Expense Management", desc: "Digital expense submission, OCR receipts scanner, and multi-level approvals.", base: 2500, perEmp: 25, icon: Calculator },
    { title: "Performance Management (PMS)", desc: "Goal tracking, KRA/KPI configuration, and 360° employee reviews.", base: 2500, perEmp: 25, icon: UserCheck },
    { title: "Timesheets", desc: "Project task allocations, time logs tracking, and shift integration.", base: 2000, perEmp: 20, icon: Clock },
    { title: "Flexi-Benefits", desc: "Automate flexible tax-saving components directly in payroll.", base: 2500, perEmp: 25, icon: DollarSign },
    { title: "Compliance Management", desc: "Statutory labor compliance audits and expert consultancy.", base: 5000, perEmp: 50, icon: ShieldCheck, suffix: "for 3 locations" }
  ];

  // FAQs list
  const faqs = [
    {
      q: "What is the difference between Self Service and Full Service Plans?",
      a: "Under the Self-Service Plan, you manage payroll operations on your own using our cloud platform, handling tax calculations, PF/ESIC deposits, and return filings in-house. Under the Full-Service Plan, we assign you a dedicated Account Manager who processes your payroll maker-checker style, manages employee queries, handles all statutory filings (PF, ESIC, Professional Tax, LWF), handles inspections, and keeps you audit-compliant."
    },
    {
      q: "Can I choose custom product modules?",
      a: "Yes! You can configure your subscription by picking a base platform plan (Starter or Growth) and selecting only the specific Add-On modules (like Timesheets, Expense, or PMS) that your company actually needs."
    },
    {
      q: "How will the onboarding process take place?",
      a: "Upon signing up, we assign you an Implementation Specialist who collects your data (employee directories, past salary registers, tax declarations). They setup your settings, customize policies, run validation audits to ensure accuracy, and provide 1-on-1 team training."
    },
    {
      q: "How secure is our employee and data?",
      a: "360 BizHealth is an ISO 27001 and ISO 9001 certified organization. All data transmissions are protected via bank-grade SSL encryption, records are stored in secure tier-4 data centers with multiple backups, and we undergo regular security scans."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF8] text-slate-800 relative overflow-x-hidden">
      <Header onNavigate={onNavigate} />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 top-0 h-[650px] pointer-events-none opacity-40 bg-[linear-gradient(to_right,#E8DDD3_1px,transparent_1px),linear-gradient(to_bottom,#E8DDD3_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Decorative Orbs */}
      <div className="absolute top-28 left-0 w-80 h-80 bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-96 right-0 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      <main className="relative mx-auto max-w-[1180px] px-6 pt-32 pb-24 z-10">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Predictable Pricing. ROI Guaranteed.</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-[52px] leading-[1.1] mb-6">
            Transparent Pricing Tailored for Your Growth
          </h1>
          <p className="text-base text-slate-600 md:text-lg max-w-xl mx-auto leading-relaxed">
            No hidden fees. Pay only for the software and services you use, backed by automated compliance and dedicated support.
          </p>
        </div>

        {/* --- PRICING TOGGLE SWITCHER --- */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-[#E8DDD3] shadow-sm">
            <button
              onClick={() => setIsFullService(false)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
                !isFullService
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-700 hover:text-primary"
              }`}
            >
              Self-Service Software
            </button>
            <button
              onClick={() => setIsFullService(true)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
                isFullService
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-700 hover:text-primary"
              }`}
            >
              Full-Service Outsourcing
            </button>
          </div>
        </div>

        {/* --- THREE PRICING PLANS DISPLAY CARDS --- */}
        <div className="grid gap-8 md:grid-cols-3 mb-24 items-stretch">
          {plans.map((p) => {
            const planRates = isFullService ? p.fullService : p.selfService;
            const Icon = p.icon;

            return (
              <div
                key={p.name}
                className={`relative flex flex-col bg-white/95 backdrop-blur-md rounded-[2rem] border transition-all duration-300 p-8 ${
                  p.popular
                    ? "border-primary shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 scale-[1.02] md:-translate-y-2"
                    : "border-[#E8DDD3] hover:border-primary/30 shadow-sm hover:shadow-md"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-md">
                    Best Seller
                  </span>
                )}

                {/* Plan Header details */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-2xl ${p.popular ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-600"}`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6">{p.desc}</p>

                {/* Rates breakdown info */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">₹{planRates.base.toLocaleString("en-IN")}</span>
                    <span className="text-sm text-slate-500 font-semibold">/month</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    + ₹{planRates.perEmp} per employee /mo
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("/contact")}
                  className={`w-full py-3.5 px-6 rounded-full text-sm font-bold transition-all active:scale-[0.98] mb-8 cursor-pointer ${
                    p.popular
                      ? "bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/20"
                      : "bg-[#FEF4EA] border border-[#E8DDD3] text-slate-700 hover:border-primary/20 hover:text-primary"
                  }`}
                >
                  Start with {p.name}
                </button>

                <div className="h-px bg-slate-100 mb-6" />

                {/* Plan Features lists */}
                <div className="flex-1">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-4">Included Features</h4>
                  <ul className="space-y-3">
                    {p.features.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- ADD-ONS SECTION --- */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-primary">Need More Functionality?</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Pick Your Custom Add-Ons</h2>
            <p className="text-sm text-slate-500 mt-3">
              Only buy what you need. Standard add-on pricing calculated base + per employee.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addOns.map((addon) => {
              const AddonIcon = addon.icon;
              return (
                <div key={addon.title} className="bg-white/80 border border-[#E8DDD3] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="p-2 bg-orange-50 rounded-xl text-primary shrink-0">
                        <AddonIcon className="w-4 h-4 stroke-[2]" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{addon.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">{addon.desc}</p>
                  </div>

                  <div>
                    <div className="h-px bg-slate-100 mb-4" />
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-black text-slate-950">₹{addon.base.toLocaleString("en-IN")}</span>
                        <span className="text-[10px] text-slate-400 font-medium">/mo base</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-primary font-mono">+₹{addon.perEmp}</span>
                        <span className="text-[9px] text-slate-400 block">per employee/mo</span>
                      </div>
                    </div>
                    {addon.suffix && (
                      <span className="text-[10px] text-slate-400 block mt-1 font-medium italic">
                        * {addon.suffix}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- CUSTOM PLAN CTA BANNER --- */}
        <div className="relative rounded-[2rem] p-10 md:p-14 text-left overflow-hidden bg-[#FEF4EA] border border-[#E8DDD3] text-slate-800 mb-24 shadow-sm">
          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-[60px] pointer-events-none translate-x-10 -translate-y-10"></div>
          <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl flex flex-col items-start gap-4">
            <span className="text-xs uppercase tracking-wider font-extrabold bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-bold">Custom Solutions</span>
            <h2 className="text-3xl font-black leading-tight md:text-4xl text-slate-900">Have a Large Organization or Custom Requirements?</h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              For enterprises with 250+ employees, we provide custom integration pipelines, dedicated system specialists, custom service SLAs, and customized billing contracts.
            </p>
            <button
              onClick={() => onNavigate("/contact")}
              className="mt-4 px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/95 transition active:scale-95 shadow-md shadow-primary/10 cursor-pointer animate-fade-in"
            >
              Contact Sales Team
            </button>
          </div>
        </div>

        {/* --- ACCORDION FAQ SECTION --- */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500 mt-2">Have questions about our models? Here are answers to common queries.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white/80 border border-[#E8DDD3] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left cursor-pointer transition hover:bg-orange-50/10 focus:outline-none"
                  >
                    <span className="font-bold text-slate-900 text-sm md:text-base">{faq.q}</span>
                    <span className={`grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </button>
                  
                  {/* Expandable answers */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[300px] border-t border-[#E8DDD3] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 text-xs md:text-sm text-slate-600 leading-relaxed bg-[#FFFBF8]/50">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
