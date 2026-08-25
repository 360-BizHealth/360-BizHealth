import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  FileCheck2,
  Handshake,
  HeartHandshake,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

const processSteps = [
  [
    "01",
    "Understand",
    "We learn how your business actually runs — your headcount, growth plans, pain points and what is not working in your existing setup.",
  ],
  [
    "02",
    "Recommend",
    "We shortlist HRMS options or map a payroll and compliance structure that fits your business, without pushing one platform.",
  ],
  [
    "03",
    "Implement",
    "We handle configuration, data migration, admin training and onboarding so the transition does not become another burden.",
  ],
  [
    "04",
    "Support",
    "We stay involved for ongoing support because systems need upkeep and compliance deadlines do not pause.",
  ],
  [
    "05",
    "Scale",
    "As your team, locations and complexity grow, we help your systems and processes grow with you.",
  ],
];

const services = [
  [
    "01",
    "HRMS Advisory & Implementation",
    "Compare HRMS platforms against your actual requirements — then get configuration, employee data migration, admin training and support once the system is live.",
    BarChart3,
  ],
  [
    "02",
    "Payroll Outsourcing",
    "End-to-end payroll processing, from CTC and salary structuring to monthly runs, payslips, TDS, Form 24Q, Form 16 and full & final settlement.",
    FileCheck2,
  ],
  [
    "03",
    "Statutory Compliance",
    "PF, ESIC, Professional Tax and Labour Welfare Fund registrations and periodic filings, handled with the documentation discipline that keeps you audit-ready.",
    ShieldCheck,
  ],
  [
    "04",
    "Labour Law & HR Compliance",
    "Advisory around Shops & Establishments, POSH, Maternity Benefit, Minimum Wages, Contract Labour and Gratuity, with audits that flag gaps early.",
    Scale,
  ],
  [
    "05",
    "Business Setup & Registrations",
    "Company incorporation, MSME/Udyam, GST registration and filing, and ISO certification support — the groundwork businesses need to grow properly.",
    Building2,
  ],
  [
    "06",
    "IPR & Brand Protection",
    "Trademark search, filing and registration support, along with copyright registration and brand protection advisory.",
    BadgeCheck,
  ],
  [
    "07",
    "Corporate Offsites & Workations",
    "Leadership retreats, strategy meets and curated corporate experiences planned end to end, from destinations to travel and accommodation.",
    UsersRound,
  ],
];

const audiences = [
  [
    "Startups",
    "Clarity matters more than complexity: build the right foundational systems without over-investing before you know what comes next.",
  ],
  [
    "Small and medium businesses",
    "Move beyond spreadsheets and ad-hoc processes with HR and payroll systems that can keep pace without a six-month implementation cycle.",
  ],
  [
    "Growing and multi-location companies",
    "Make policies work consistently across teams and geographies as compliance requirements begin to vary by state.",
  ],
  [
    "Established organisations",
    "Fix gaps, add capabilities or manage the parts of HR operations that should not require a full-time internal team.",
  ],
];

const principles = [
  [
    "Independence",
    "Recommendations are based on fit, not on which HRMS pays the better partnership incentive.",
  ],
  ["Transparency", "You should know what is being done, why it is being done and what it costs."],
  [
    "Client-first thinking",
    "Our advice starts with your business's actual situation, not a template answer.",
  ],
  [
    "Accountability",
    "A filing date, payslip or implementation milestone has a clear owner on our side.",
  ],
  [
    "Simplicity",
    "HR, payroll and compliance are complicated enough. We keep the way we work clear.",
  ],
  [
    "Long-term partnership",
    "We would rather be the team you call every quarter for years than a vendor you engage once.",
  ],
];

const reasons = [
  "We are independent — there is no single HRMS ecosystem to push.",
  "We are one partner instead of five disconnected vendor conversations.",
  "You can reach someone who understands your business context, not just a ticket queue.",
  "We work at your scale, from an early startup to a multi-location organisation.",
  "We implement, not just advise: configuration, migration, training and support included.",
  "We think in years, not projects.",
];

const faqs = [
  [
    "How does 360 Biz Health help businesses choose the right HRMS?",
    "We start by understanding your team size, budget, industry requirements and current pain points, then compare relevant HRMS platforms against those needs. Since we are not tied to one software provider, our shortlist is based on fit, not on which platform we are incentivised to sell.",
  ],
  [
    "Can you help implement an HRMS after we have selected one?",
    "Yes. Implementation is a core part of what we do — configuration, employee data migration, admin training and ongoing support after go-live, not just the initial recommendation.",
  ],
  [
    "Do you provide payroll outsourcing services?",
    "Yes. We handle end-to-end payroll processing, including CTC structuring, monthly payroll runs, payslip generation, TDS management, Form 24Q filing, Form 16 generation and full & final settlement support.",
  ],
  [
    "Do you manage PF, ESIC, Professional Tax and LWF compliance?",
    "Yes. We support statutory registrations and periodic compliance filings across PF, ESIC, Professional Tax and Labour Welfare Fund requirements.",
  ],
  [
    "Can you support labour law compliance beyond payroll-related filings?",
    "Yes. Our advisory support covers Shops & Establishments registration, POSH, Maternity Benefit, Minimum Wages and Contract Labour requirements, along with compliance audits to identify gaps.",
  ],
  [
    "Do you work with startups and small businesses, or only larger companies?",
    "We work across the spectrum — from early-stage startups setting up HR for the first time to established, multi-location organisations. The scope of engagement is adjusted to what each stage needs.",
  ],
  [
    "Can you manage multiple HR and compliance requirements through one partner instead of separate vendors?",
    "Yes. HR technology, payroll, statutory compliance, labour law advisory, business registrations and IPR support are coordinated through a single point of contact rather than disconnected engagements.",
  ],
];

export default function AboutUs({ onNavigate }: AboutUsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = "About 360 Biz Health | Independent HRMS & Payroll Partner";
    const description = document.querySelector('meta[name="description"]');
    const content =
      "360 Biz Health is an independent HRMS, payroll and compliance partner for growing Indian businesses. No single-vendor bias — just the right fit.";
    if (description) {
      description.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#272127]">
      <Header onNavigate={onNavigate} />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F9F2FF] to-white pb-16 pt-32 lg:pb-20 lg:pt-40">
          <div className="pointer-events-none absolute -right-28 top-20 h-[520px] w-[520px] rounded-full border border-[#e6377a]/20" />
          <div className="pointer-events-none absolute -right-2 top-40 h-[320px] w-[320px] rounded-full border border-[#e6377a]/20" />
          <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-[#FFF7F1] blur-[90px]" />
          <div className="relative mx-auto max-w-[1312px] px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
              <div className="max-w-[690px]">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
                  Independent HRMS implementation partner
                </p>
                <h1 className="font-serif text-[40px] font-bold leading-[1.16] tracking-[-0.045em] text-[#46077a] md:text-[52px] lg:text-[58px]">
                  We help growing businesses bring order to
                  <br />
                  <span className="text-[#e6377a]">HR, payroll and compliance —</span>
                  <br />
                  without locking you into one software.
                </h1>
                <p className="mt-7 max-w-[610px] text-[17px] leading-8 text-[#272127]">
                  Without locking you into one software. 360 Biz Health helps startups, SMEs and
                  growing companies coordinate HR technology, payroll, statutory compliance, labour
                  law, business registrations, intellectual property and employee engagement through
                  one independent partner.
                </p>
                <a
                  href="/contact"
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate("/contact");
                  }}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e6377a] px-8 py-3.5 text-base font-semibold leading-[22px] text-white transition hover:bg-[#bd245a]"
                >
                  Talk to a 360 Biz Health Expert
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto">
                <div className="relative overflow-hidden rounded-[36px] bg-[#46077a] px-8 pb-10 pt-9 text-white shadow-[0_22px_50px_-25px_rgba(70,7,122,0.7)] md:px-10">
                  <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#ffdc79]/30" />
                  <Sparkles className="relative h-7 w-7 text-[#ffdc79]" />
                  <p className="relative mt-8 max-w-[340px] font-serif text-[25px] font-semibold leading-[1.35] tracking-[-0.03em] text-white">
                    A business does not grow in silos. Its HR operations should not have to either.
                  </p>
                  <div className="relative mt-9 border-t border-white/20 pt-5 text-sm leading-6 text-white/80">
                    <p>One number to call instead of five.</p>
                    <p className="mt-1 font-semibold text-[#ffdc79]">
                      Independent advice. Practical delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-8 border-t border-[#46077a]/15 pt-10 lg:grid-cols-[1.8fr_1fr] lg:gap-24">
              <h2 className="max-w-[720px] font-serif text-[27px] font-semibold leading-[1.35] tracking-[-0.025em] text-[#272127]">
                Most businesses do not set out to manage five different vendors for their HR needs.
              </h2>
              <p className="border-l-2 border-[#e6377a]/50 pl-6 text-[16px] leading-7 text-[#272127]">
                It starts with one HRMS, then payroll, then compliance — and somewhere along the
                way, nobody has a complete picture anymore.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[940px] px-6 py-20 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
            Our Story
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <h2 className="font-serif text-[32px] font-bold leading-[1.2] tracking-[-0.04em] text-[#46077a] md:text-[40px]">
              The business is growing. HR is no longer a spreadsheet problem.
            </h2>
            <div className="space-y-5 text-[17px] leading-8 text-[#272127]">
              <p>
                Every founder we speak with has some version of the same story. Hiring is picking
                up, teams are getting bigger and suddenly HR is a compliance problem, a payroll
                accuracy problem and a “which HRMS should we even buy?” problem.
              </p>
              <p>
                Most HRMS vendors have one product to sell. Most payroll consultants know payroll,
                but not necessarily how it should connect to the HRMS you are evaluating. Most
                compliance advisors can tell you what the law requires, but not how to
                operationalise it inside a growing team.
              </p>
              <p>
                None of them are wrong at what they do. But a business does not grow in silos, and
                it should not have to manage its HR operations in silos either. That gap is why 360
                Biz Health exists.
              </p>
              <p>
                We bring HR technology, payroll, compliance, labour law, business registrations and
                IPR support under one roof, so a business owner has one number to call instead of
                five.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white via-[#FFF7F1] to-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
                  What Makes 360 Biz Health Different
                </p>
                <h2 className="mt-5 font-serif text-[32px] font-bold leading-[1.2] tracking-[-0.04em] text-[#46077a] md:text-[42px]">
                  The right fit comes before the software.
                </h2>
              </div>
              <div className="max-w-[650px] text-[17px] leading-8 text-[#272127]">
                <p>
                  We are not an HRMS company. We are an independent advisory and implementation
                  partner who happens to work across multiple HRMS platforms.
                </p>
                <p className="mt-5">
                  When a company sells one product, every conversation eventually leads back to that
                  product. Our starting point is your business — what you are trying to solve, how
                  your team works, what is realistic for your budget and timeline — and only then do
                  we talk about which platform makes sense.
                </p>
                <p className="mt-5">
                  There is a real difference between a company that sells software and a company
                  that helps you choose, implement and actually use the right technology. We do the
                  second.
                </p>
              </div>
            </div>
            <div className="mt-16 grid border-y border-[#46077a]/15 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Independent", "No single-vendor incentive."],
                ["Connected", "One view across HR operations."],
                ["Hands-on", "We stay through implementation."],
                ["Practical", "Built around your real constraints."],
              ].map(([title, detail]) => (
                <div
                  key={title}
                  className="border-b border-[#46077a]/15 py-7 md:px-6 md:last:border-b-0 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                >
                  <h3 className="text-lg font-semibold text-[#46077a]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#272127]">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
                How We Work
              </p>
              <h2 className="mt-5 font-serif text-[32px] font-bold leading-[1.2] tracking-[-0.04em] text-[#46077a] md:text-[42px]">
                A clear path from uncertainty to order.
              </h2>
            </div>
            <div className="border-t border-[#46077a]/15">
              {processSteps.map(([number, title, detail]) => (
                <div
                  key={number}
                  className="grid gap-4 border-b border-[#46077a]/15 py-7 sm:grid-cols-[58px_145px_1fr] sm:items-start sm:gap-6"
                >
                  <span className="text-sm font-semibold tracking-[0.18em] text-[#e6377a]">
                    {number}
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#46077a]">
                    {title}
                  </h3>
                  <p className="text-[15px] leading-7 text-[#272127]">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F9F2FF] py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="flex flex-wrap items-end justify-between gap-7 border-b border-[#46077a]/15 pb-10">
              <div className="max-w-[620px]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
                  What We Do
                </p>
                <h2 className="mt-5 font-serif text-[32px] font-bold leading-[1.2] tracking-[-0.04em] text-[#46077a] md:text-[42px]">
                  The work behind a well-run business.
                </h2>
              </div>
              <p className="max-w-[360px] text-[16px] leading-7 text-[#272127]">
                A single partner for the details that keep your business moving with confidence.
              </p>
            </div>
            <div>
              {services.map(([number, title, detail, Icon]) => {
                const ServiceIcon = Icon as typeof BarChart3;
                return (
                  <article
                    key={number}
                    className="grid gap-5 border-b border-[#46077a]/15 py-8 md:grid-cols-[60px_48px_235px_1fr] md:items-center md:gap-6"
                  >
                    <span className="text-sm font-semibold tracking-[0.18em] text-[#e6377a]">
                      {number}
                    </span>
                    <ServiceIcon className="h-5 w-5 text-[#e6377a]" />
                    <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-[#46077a]">
                      {title}
                    </h3>
                    <p className="text-[15px] leading-7 text-[#272127]">{detail}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
                  Who We Serve
                </p>
                <h2 className="mt-5 font-serif text-[32px] font-bold leading-[1.2] tracking-[-0.04em] text-[#46077a] md:text-[42px]">
                  At every stage of growth.
                </h2>
                <p className="mt-5 text-[16px] leading-7 text-[#272127]">
                  What works for a 15-person startup will not work for a 200-person company with
                  three offices. We work with you at whichever stage you are in, and expect that
                  stage to change.
                </p>
              </div>
              <div className="grid border-t border-[#46077a]/15 sm:grid-cols-2 sm:gap-x-10">
                {audiences.map(([title, detail]) => (
                  <article key={title} className="border-b border-[#46077a]/15 py-7">
                    <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#46077a]">
                      {title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-[#272127]">{detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#F9F2FF] to-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="mx-auto max-w-[660px] text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
                What Guides Our Work
              </p>
              <h2 className="mt-5 font-serif text-[32px] font-bold leading-[1.2] tracking-[-0.04em] text-[#46077a] md:text-[42px]">
                Principles that keep the partnership useful.
              </h2>
            </div>
            <div className="mt-14 grid border-y border-[#46077a]/15 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map(([title, detail]) => (
                <article
                  key={title}
                  className="border-b border-[#46077a]/15 py-7 sm:px-7 sm:nth-[2n+1]:pl-0 lg:nth-[3n+1]:pl-0 lg:nth-last-[1]:border-b-0"
                >
                  <Handshake className="h-5 w-5 text-[#e6377a]" />
                  <h3 className="mt-4 text-lg font-semibold text-[#46077a]">{title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-[#272127]">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
                Why Clients Choose to Work With Us
              </p>
              <h2 className="mt-5 font-serif text-[32px] font-bold leading-[1.2] tracking-[-0.04em] text-[#46077a] md:text-[42px]">
                A partner built for the work after the recommendation.
              </h2>
            </div>
            <div className="border-t border-[#46077a]/15">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="flex gap-4 border-b border-[#46077a]/15 py-5 text-[16px] leading-7 text-[#272127]"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#e6377a]" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FFF7F1] py-20 lg:py-28">
          <div className="mx-auto max-w-[900px] px-6">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6377a]">
                Frequently Asked Questions
              </p>
              <h2 className="mt-5 font-serif text-[32px] font-bold leading-[1.2] tracking-[-0.04em] text-[#46077a] md:text-[42px]">
                Before we talk.
              </h2>
            </div>
            <div className="mt-12 border-t border-[#46077a]/15">
              {faqs.map(([question, answer], index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={question} className="border-b border-[#46077a]/15">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left text-[16px] font-semibold text-[#46077a] transition hover:text-[#e6377a]"
                    >
                      <span>{question}</span>
                      <span
                        className={`shrink-0 text-2xl font-normal text-[#e6377a] transition-transform ${isOpen ? "rotate-45" : ""}`}
                      >
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="max-w-[770px] pb-6 pr-10 text-[15px] leading-7 text-[#272127]">
                        {answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-[#46077a] px-7 py-14 text-center shadow-[0_24px_60px_-30px_rgba(70,7,122,0.7)] md:px-14 md:py-18">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              Let&apos;s talk about what you actually need
            </p>
            <h2 className="mx-auto mt-5 max-w-[760px] text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-white md:text-[44px]">
              Tell us where things stand. We&apos;ll help you find the right next step.
            </h2>
            <p className="mx-auto mt-5 max-w-[600px] text-[16px] leading-7 text-white/85">
              No obligation, no generic pitch — just a practical conversation about your HR, payroll
              and compliance operations.
            </p>
            <a
              href="/contact"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/contact");
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold leading-[22px] text-[#e6377a] transition hover:bg-[#fff5f8]"
            >
              Talk to a 360 Biz Health Expert
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
