import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleCheck,
  FileCheck2,
  Handshake,
  HeartHandshake,
  Lightbulb,
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
  {
    title: "Understand",
    detail:
      "We learn how your business runs, your growth plans, current pain points and what is not working in your existing setup.",
  },
  {
    title: "Recommend",
    detail:
      "We shortlist HRMS options or map the payroll and compliance structure that fits your business without pushing one platform.",
  },
  {
    title: "Implement",
    detail:
      "We handle configuration, data migration, admin training and onboarding so the transition does not burden your team.",
  },
  {
    title: "Support",
    detail:
      "We stay involved for ongoing support, helping keep systems current and compliance deadlines on track.",
  },
  {
    title: "Scale",
    detail:
      "As your team, locations and complexity grow, we adapt your systems and processes instead of making you start again.",
  },
];

const services = [
  {
    title: "HRMS Advisory & Implementation",
    detail:
      "Compare platforms against your core HR, attendance, leave, payroll, ESS, recruitment, expense and performance needs, then get hands-on configuration, migration, training and support.",
    icon: BarChart3,
  },
  {
    title: "Payroll Outsourcing",
    detail:
      "End-to-end payroll processing, from CTC structuring and monthly runs to payslips, investment declarations, TDS, Form 24Q, Form 16 and full & final settlement.",
    icon: FileCheck2,
  },
  {
    title: "Statutory Compliance",
    detail:
      "PF, ESIC, Professional Tax and Labour Welfare Fund registrations and periodic filings, managed with disciplined documentation.",
    icon: ShieldCheck,
  },
  {
    title: "Labour Law & HR Compliance",
    detail:
      "Support for Shops & Establishments, POSH, Maternity Benefit, Minimum Wages, Contract Labour, Gratuity and proactive compliance audits.",
    icon: Scale,
  },
  {
    title: "Business Setup & Registrations",
    detail:
      "Company incorporation, MSME/Udyam registration, GST registration and filing, and ISO certification support.",
    icon: Building2,
  },
  {
    title: "IPR & Brand Protection",
    detail:
      "Trademark search, filing and registration support, plus copyright registration and brand protection advisory.",
    icon: BadgeCheck,
  },
  {
    title: "Corporate Offsites & Workations",
    detail:
      "Leadership retreats, strategy meets and team-building experiences planned end to end, from destination selection to travel coordination.",
    icon: UsersRound,
  },
];

const audiences = [
  {
    title: "Startups",
    detail:
      "Build the right HR foundations without over-investing before your next stage of growth is clear.",
  },
  {
    title: "Small and medium businesses",
    detail:
      "Move beyond spreadsheets and ad-hoc processes with systems that can keep pace without a six-month implementation cycle.",
  },
  {
    title: "Growing and multi-location companies",
    detail:
      "Keep policies consistent across teams and geographies as state-specific compliance requirements increase.",
  },
  {
    title: "Established organisations",
    detail:
      "Fix gaps, add capabilities or outsource the parts of HR operations that do not need a full-time internal team.",
  },
];

const principles = [
  [
    "Independence",
    "We are not paid more to recommend one HRMS over another, so our advice stays focused on fit.",
  ],
  [
    "Transparency",
    "You should know what is being done, why and what it costs, with no buried fine print.",
  ],
  [
    "Client-first thinking",
    "Our advice begins with your business situation, not a template answer.",
  ],
  [
    "Accountability",
    "Filing dates, payroll and implementation milestones have a clear owner, not a gap between vendors.",
  ],
  [
    "Simplicity",
    "HR, payroll and compliance are already complex enough. We keep our guidance clear and practical.",
  ],
  [
    "Long-term partnership",
    "We aim to be the team you call every quarter for years, not a vendor you engage once.",
  ],
];

const reasons = [
  "We are independent, with no single HRMS ecosystem to push.",
  "We coordinate HR technology, payroll, compliance, registrations and IPR through one point of contact.",
  "You can reach a team that understands your business context, not just a ticket queue.",
  "Our partnership model works from a 20-person startup to a 300-person multi-location company.",
  "We implement as well as advise, including configuration, migration, training and post-launch support.",
  "We think in years, not projects.",
];

const faqs = [
  {
    question: "How does 360 Biz Health help businesses choose the right HRMS?",
    answer:
      "We start by understanding your team size, budget, industry requirements and current pain points, then compare relevant HRMS platforms against those needs. Since we are not tied to one software provider, our shortlist is based on fit, not on which platform we are incentivised to sell.",
  },
  {
    question: "Can you help implement an HRMS after we have selected one?",
    answer:
      "Yes. Implementation is a core part of what we do: configuration, employee data migration, admin training and ongoing support after go-live, not just the initial recommendation.",
  },
  {
    question: "Do you provide payroll outsourcing services?",
    answer:
      "Yes. We handle end-to-end payroll processing, including CTC structuring, monthly payroll runs, payslip generation, TDS management, Form 24Q filing, Form 16 generation and full & final settlement support.",
  },
  {
    question: "Do you manage PF, ESIC, Professional Tax and LWF compliance?",
    answer:
      "Yes. We support statutory registrations and periodic compliance filings across PF, ESIC, Professional Tax and Labour Welfare Fund requirements.",
  },
  {
    question: "Can you support labour law compliance beyond payroll-related filings?",
    answer:
      "Yes. Our advisory support covers Shops & Establishments registration, POSH, Maternity Benefit, Minimum Wages and Contract Labour requirements, along with compliance audits to identify gaps.",
  },
  {
    question: "Do you work with startups and small businesses, or only larger companies?",
    answer:
      "We work across the spectrum, from early-stage startups setting up HR for the first time to established, multi-location organisations. The scope of engagement is adjusted to what each stage of business needs.",
  },
  {
    question:
      "Can you manage multiple HR and compliance requirements through one partner instead of separate vendors?",
    answer:
      "Yes. HR technology, payroll, statutory compliance, labour law advisory, business registrations and IPR support are coordinated through a single point of contact rather than disconnected engagements with different vendors.",
  },
];

export default function AboutUs({ onNavigate }: AboutUsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = "About 360 Biz Health | Independent HRMS & Payroll Partner";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "360 Biz Health is an independent HRMS, payroll and compliance partner for growing Indian businesses. No single-vendor bias — just the right fit.",
      );
      return;
    }
    const newMetaDescription = document.createElement("meta");
    newMetaDescription.name = "description";
    newMetaDescription.content =
      "360 Biz Health is an independent HRMS, payroll and compliance partner for growing Indian businesses. No single-vendor bias — just the right fit.";
    document.head.appendChild(newMetaDescription);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-slate-800">
      <Header onNavigate={onNavigate} />

      <main>
        <section className="relative overflow-hidden bg-[#FEF4EA] pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="pointer-events-none absolute left-0 top-8 h-72 w-72 rounded-full bg-primary/10 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[140px]" />
          <div className="relative mx-auto max-w-[1180px] px-6">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Your independent HRMS implementation partner</span>
                </div>
                <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 md:text-5xl lg:text-[56px]">
                  We Help Growing Businesses Bring Order to HR, Payroll and Compliance{" "}
                  <span className="text-primary">Without Locking You Into One Software</span>
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                  360 Biz Health helps startups, SMEs and growing companies coordinate HR
                  technology, payroll, statutory compliance, labour law, business registrations,
                  intellectual property and employee engagement through one independent partner,
                  without single-vendor HRMS bias.
                </p>
                <a
                  href="/contact"
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate("/contact");
                  }}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,92,53,0.24)] transition hover:scale-[1.01] hover:bg-primary/95"
                >
                  Talk to a 360 Biz Health Expert
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <aside className="lg:col-span-5">
                <div className="rounded-[30px] border border-[#E8DDD3] bg-white p-7 shadow-[0_20px_55px_-25px_rgba(255,92,53,0.26)] md:p-9">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-lg font-bold leading-snug text-slate-900">
                    One partner who understands the whole picture, not five vendors who each
                    understand a slice of it.
                  </p>
                  <div className="mt-6 space-y-3 border-t border-[#E8DDD3] pt-6">
                    {[
                      "Independent advice",
                      "Hands-on implementation",
                      "Ongoing operational support",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                      >
                        <CircleCheck className="h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-6 py-20 lg:py-28">
          <div className="text-center">
            <span className="text-sm font-semibold text-primary">Our Story</span>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Growing businesses should not have to manage HR operations in silos.
            </h2>
          </div>
          <div className="mx-auto mt-10 max-w-3xl space-y-5 text-base leading-8 text-slate-600">
            <p>
              Most businesses do not set out to manage five different vendors for their HR needs. It
              often starts with one HRMS purchase, then a payroll consultant gets added because
              statutory filings need help, then a compliance advisor comes in because PF and ESIC
              deadlines keep slipping.
            </p>
            <p>
              Every founder we speak with has some version of the same story: the business is
              growing, hiring is picking up and HR is no longer a spreadsheet problem. It is a
              compliance problem, a payroll accuracy problem and an HRMS selection problem.
            </p>
            <p>
              Most vendors are good at their individual slice. But a business does not grow in
              silos, and it should not have to manage its HR operations in silos either. That gap is
              why 360 Biz Health exists.
            </p>
            <p>
              We bring HR technology, payroll, compliance, labour law, business registrations and
              IPR support under one roof, so a business owner has one number to call instead of
              five.
            </p>
          </div>
        </section>

        <section className="bg-[#F6F9FC] py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-sm font-semibold text-primary">
                What Makes 360 Biz Health Different
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                The right fit comes before the software.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                We are not an HRMS company. We are an independent advisory and implementation
                partner who happens to work across multiple HRMS platforms.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Our starting point is your business: what you need to solve, how your team works and
                what is realistic for your budget and timeline. Only after that do we talk about
                technology.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {[
                [
                  "No single-vendor bias",
                  "Recommendations shaped by your needs, not a partnership incentive.",
                ],
                [
                  "Beyond the sale",
                  "Configuration, employee migration, training and sustained support.",
                ],
                [
                  "One connected view",
                  "HR technology, payroll and compliance coordinated together.",
                ],
                ["Practical delivery", "Advice backed by people who help make it work."],
              ].map(([title, detail]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-[#E8DDD3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-primary">How We Work</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              A clear path from uncertainty to order.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-[#E8DDD3] bg-white p-6 shadow-sm"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#FFFBF8] py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold text-primary">What We Do</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Connected support for the business behind your business.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article
                    key={service.title}
                    className="group rounded-3xl border border-[#E8DDD3] bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{service.detail}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#F6F9FC] py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="text-sm font-semibold text-primary">Who We Serve</span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                  At every stage of growth.
                </h2>
                <p className="mt-5 text-base leading-7 text-slate-600">
                  What works for a 15-person startup will not work for a 200-person company with
                  three offices. We work with you at the stage you are in, knowing that stage will
                  change.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                {audiences.map((audience) => (
                  <article
                    key={audience.title}
                    className="rounded-3xl border border-[#E8DDD3] bg-white p-6"
                  >
                    <h3 className="text-base font-bold text-slate-900">{audience.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{audience.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-20 lg:py-28">
          <div className="text-center">
            <span className="text-sm font-semibold text-primary">What Guides Our Work</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Principles that keep the partnership useful.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {principles.map(([title, detail]) => (
              <article key={title} className="rounded-3xl border border-[#E8DDD3] bg-[#FFFBF8] p-7">
                <Handshake className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#FEF4EA] py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-sm font-semibold text-primary">Why Clients Choose Us</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                A partner built for the work after the recommendation.
              </h2>
            </div>
            <div className="grid gap-4 lg:col-span-7">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="flex items-start gap-3 rounded-2xl border border-[#E8DDD3] bg-white px-5 py-4 text-sm font-semibold leading-6 text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-6 py-20 lg:py-28">
          <div className="text-center">
            <span className="text-sm font-semibold text-primary">Frequently Asked Questions</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Answers before we talk.
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-[#E8DDD3] bg-white"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 p-5 text-left text-sm font-bold text-slate-800 transition hover:text-primary md:px-6"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${isOpen ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-400"}`}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-500 md:px-6">
                      {faq.answer}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="px-6 pb-20 lg:pb-28">
          <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[32px] bg-primary px-7 py-12 text-center shadow-[0_20px_55px_-25px_rgba(255,92,53,0.55)] md:px-14 md:py-16">
            <span className="text-sm font-semibold text-white/80">
              Let&apos;s Talk About What You Actually Need
            </span>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Get your HR, payroll and compliance operations moving in the same direction.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85">
              Tell us where things stand, and we will help you figure out the right next step with
              no obligation and no generic pitch.
            </p>
            <a
              href="/contact"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/contact");
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-sm transition hover:scale-[1.01] hover:bg-[#FFFBF8]"
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
