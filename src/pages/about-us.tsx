import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck2,
  Handshake,
  Scale,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  [
    "01",
    "HRMS & Payroll",
    "Build dependable HR operations with attendance, leave, payroll, expense, and performance workflows.",
    UsersRound,
  ],
  [
    "02",
    "Statutory Compliance",
    "Stay ready for PF, ESIC, LWF, TDS, labour law, and recurring compliance requirements.",
    ShieldCheck,
  ],
  [
    "03",
    "Business Setup",
    "Get practical help with company registration, licensing, GST, MSME, and certification support.",
    Building2,
  ],
  [
    "04",
    "IPR & Brand Protection",
    "Protect your brand and ideas with trademark, copyright, and intellectual property guidance.",
    BadgeCheck,
  ],
  [
    "05",
    "Payroll Advisory",
    "Improve salary structures, tax planning, Form 16, Form 24Q, and full & final settlement processes.",
    FileCheck2,
  ],
  [
    "06",
    "Corporate Experiences",
    "Plan retreats, workations, leadership meets, and team experiences end to end.",
    Sparkles,
  ],
] as const;

const values = [
  [
    "Independent advice",
    "We recommend what fits your business, not what a single software vendor wants to sell.",
  ],
  [
    "One accountable partner",
    "Bring HR, payroll, compliance, taxation, and business support together with one team.",
  ],
  [
    "Practical delivery",
    "Our work goes beyond advice—we help configure, implement, organize, and support.",
  ],
  [
    "Long-term thinking",
    "We build systems and processes that keep working as your people and business grow.",
  ],
];

const steps = [
  [
    "01",
    "Understand",
    "We learn how your business runs, where the gaps are, and what your team needs next.",
  ],
  [
    "02",
    "Plan",
    "We create a clear, practical roadmap across HR, payroll, compliance, and business operations.",
  ],
  [
    "03",
    "Implement",
    "We help configure systems, organize data, train teams, and make the transition simple.",
  ],
  [
    "04",
    "Support",
    "We stay available for recurring filings, improvements, audits, and the questions that follow.",
  ],
];

const audiences = [
  [
    "Startups",
    "Set up strong HR and compliance foundations without adding unnecessary complexity.",
  ],
  [
    "Growing businesses",
    "Replace spreadsheets and disconnected vendors with processes that scale with your team.",
  ],
  [
    "Multi-location teams",
    "Bring consistency to payroll, policies, compliance, and employee operations across locations.",
  ],
  [
    "Established companies",
    "Close operational gaps and access specialist support without building every capability in-house.",
  ],
];

export default function AboutUs({ onNavigate }: { onNavigate: (page: string) => void }) {
  useEffect(() => {
    document.title = "About 360 Biz Health";
  }, []);

  const goToContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate("/contact");
  };

  return (
    <div className="paz-page about-page min-h-screen bg-background">
      <Header onNavigate={onNavigate} />
      <main>
        <section className="relative overflow-hidden bg-hero-gradient pt-32 text-foreground lg:pt-40">
          <div className="pointer-events-none absolute -right-40 -top-32 size-[620px] rounded-full border border-brand/15" />
          <div className="pointer-events-none absolute right-20 top-24 size-[340px] rounded-full border border-brand/30" />
          <div className="pointer-events-none absolute bottom-24 left-[-5rem] size-56 rounded-full bg-brand/10 blur-3xl" />
          <div className="section-x relative">
            <div className="grid items-start gap-14 pb-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-20 lg:pb-24">
              <div>
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                  <span className="h-px w-10 bg-brand" />
                  About 360 Biz Health
                </div>
                <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] text-foreground sm:text-[50px] lg:text-[64px]">
                  The people behind better business operations.
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-[20px]">
                  We bring HR, payroll, compliance, taxation, business setup, and employee
                  experiences together so your business can move with clarity.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="/contact"
                    onClick={goToContact}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-brand-foreground shadow-card transition hover:-translate-y-0.5 hover:bg-brand/90"
                  >
                    Talk to a 360 Biz Health Expert
                    <ArrowRight className="size-4" />
                  </a>
                  <span className="text-sm text-ink-soft">
                    Independent advice. Practical delivery.
                  </span>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[500px] lg:pb-3">
                <div className="relative overflow-hidden rounded-[2rem] border border-brand/15 bg-card p-7 shadow-card sm:p-9">
                  <div className="absolute -right-16 -top-16 size-48 rounded-full bg-brand/10" />
                  <div className="absolute -bottom-20 -left-20 size-48 rounded-full border border-brand/15" />
                  <div className="relative flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                      <Scale className="size-5" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                      Our approach
                    </p>
                  </div>
                  <h2 className="relative mt-6 max-w-sm text-2xl font-semibold leading-tight text-ink">
                    One clear partner for every essential.
                  </h2>
                  <p className="relative mt-3 text-sm leading-relaxed text-ink-soft">
                    Simpler systems, practical support, and a clear way forward.
                  </p>
                  <div className="relative mt-5 grid gap-2 border-t border-border pt-5 sm:grid-cols-3">
                    {[
                      ["01", "Understand"],
                      ["02", "Organise"],
                      ["03", "Stay ahead"],
                    ].map(([number, title]) => (
                      <div
                        key={number}
                        className="rounded-2xl border border-border bg-surface-soft p-3"
                      >
                        <span className="text-xs font-semibold tracking-[0.15em] text-brand">
                          {number}
                        </span>
                        <p className="mt-2 text-sm font-semibold text-ink">{title}</p>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-5 flex items-center gap-3 border-t border-border pt-4 text-sm font-medium text-ink">
                    <Handshake className="size-5 text-brand" />
                    Built for growing businesses.
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-8 border-t border-border py-10 sm:grid-cols-3">
              {[
                ["95%", "HR processing time saved"],
                ["Zero", "Compliance penalties"],
                ["500+", "Businesses supported"],
              ].map(([value, label]) => (
                <div key={value} className="border-l-[3px] border-brand pl-4">
                  <p className="text-3xl font-bold text-ink sm:text-[38px]">{value}</p>
                  <p className="mt-1 text-sm text-ink-soft">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="section-x grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Our Story
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-[42px]">
                Your business is growing. Your operations should grow with it.
              </h2>
            </div>
            <div className="space-y-5 text-[17px] leading-relaxed text-ink-soft">
              <p>
                As teams grow, HR stops being a spreadsheet problem. Payroll needs accuracy,
                compliance needs ownership, and founders need a clear view of what is happening
                across the business.
              </p>
              <p>
                Most companies end up coordinating separate conversations for HR technology,
                payroll, statutory filings, labour law, registrations, and employee engagement. That
                is where things become slow, disconnected, and difficult to manage.
              </p>
              <p>
                360 Biz Health exists to close that gap. We bring the right expertise together so
                you have one accountable partner and a simpler way to run the essentials.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface-soft py-20 lg:py-28">
          <div className="section-x">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                What Makes Us Different
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-[42px]">
                The right fit comes before the software.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                We do not push one platform or one template. We start with your business, understand
                the constraints, and then help you choose and implement what will actually work.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(([title, detail]) => (
                <article key={title} className="rounded-3xl bg-card p-7 shadow-card">
                  <Handshake className="size-6 text-brand" />
                  <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="section-x grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                What We Do
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-[42px]">
                The work behind a well-run business.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                From the first setup to ongoing support, we help keep your people operations
                organized and ready for what is next.
              </p>
            </div>
            <div className="border-t border-border">
              {services.map(([number, title, detail, Icon]) => (
                <article
                  key={number}
                  className="grid gap-4 border-b border-border py-7 sm:grid-cols-[52px_32px_220px_1fr] sm:items-center sm:gap-5"
                >
                  <span className="text-sm font-semibold tracking-[0.15em] text-brand">
                    {number}
                  </span>
                  <Icon className="size-5 text-brand" />
                  <h3 className="text-xl font-semibold leading-tight text-ink">{title}</h3>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-soft py-20 lg:py-28">
          <div className="section-x">
            <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                  How We Work
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-[42px]">
                  A clear path from uncertainty to order.
                </h2>
              </div>
              <div className="border-t border-border">
                {steps.map(([number, title, detail]) => (
                  <div
                    key={number}
                    className="grid gap-3 border-b border-border py-7 sm:grid-cols-[52px_150px_1fr] sm:items-start sm:gap-5"
                  >
                    <span className="text-sm font-semibold tracking-[0.15em] text-brand">
                      {number}
                    </span>
                    <h3 className="text-xl font-semibold text-ink">{title}</h3>
                    <p className="text-[15px] leading-relaxed text-ink-soft">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="section-x grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Who We Serve
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-[42px]">
                At every stage of growth.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                What works for a 15-person startup will not work for a 200-person company with three
                offices. We meet your business where it is and help it move forward.
              </p>
            </div>
            <div className="grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
              {audiences.map(([title, detail]) => (
                <article key={title} className="border-b border-border py-7">
                  <h3 className="text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-soft py-20 lg:py-24">
          <div className="section-x text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Why 500+ Businesses Trust Us
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-[42px]">
              A partner who stays accountable after the recommendation.
            </h2>
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 text-left sm:grid-cols-2">
              {[
                "Independent recommendations",
                "One accountable point of contact",
                "Hands-on implementation support",
                "Built for startups and growing teams",
                "HR, payroll, and compliance expertise",
                "Long-term operational partnership",
              ].map((reason) => (
                <div
                  key={reason}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 text-[15px] font-medium text-ink shadow-card"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-brand" />
                  {reason}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="section-x">
            <div className="bg-brand-gradient flex flex-col items-center gap-7 rounded-[2rem] px-8 py-16 text-center sm:px-16">
              <Scale className="size-8 text-brand-foreground" />
              <h2 className="max-w-3xl text-3xl font-semibold text-brand-foreground sm:text-[42px]">
                Ready to make your business operations simpler?
              </h2>
              <p className="max-w-2xl text-[17px] leading-relaxed text-brand-foreground/80">
                Tell us where your business is today. We will help you build the systems, support,
                and clarity you need for what comes next.
              </p>
              <a
                href="/contact"
                onClick={goToContact}
                className="inline-flex items-center gap-2 rounded-full bg-brand-foreground px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-brand-foreground/90"
              >
                Talk to our team <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
