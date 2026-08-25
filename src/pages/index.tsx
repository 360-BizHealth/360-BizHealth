import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import hrTechnology from "@/assets/hr-technology.jpg";
import statutoryCompliance from "@/assets/statutory-compliance-2.jpg";
import financialTaxation from "@/assets/tds-labour.jpg";
import heroIllustration from "@/assets/hero-illustration.jpg";
import integrateHowItWorks from "@/assets/integrate.jpg";
import gaugeHowItWorks from "@/assets/gauge.jpg";
import envelopeHowItWorks from "@/assets/envelope.jpg";
import teamRetreats from "@/assets/team-retreats.jpg";

const FR = "https://framerusercontent.com/images";
const img = {
  quote: `${FR}/UBNbepHJf0KbEt8th3mWIASU8.svg`,
  blog1: `${FR}/FtmOrBfo605IzU7NGNBgglpwFg.png`,
  blog2: `${FR}/yWKMBE9ZW7mo4BPJxZ7N3wLJXzY.png`,
  blog3: `${FR}/gAGNRXHMmc0UdJcc054idbIAoM.png`,
  blog4: `${FR}/XD8IOtGZkFXgZsVfKdtEB0hi6s.png`,
  carter: `${FR}/Ja8p9J3F9vN86Z3j6hBjs1zT9SY.png`,
  elena: `${FR}/kVI5rNJF2u29dE47wJKBMhBHIVc.png`,
  james: `${FR}/g9u5lc8a7bhRVYmAcLaz2V8Vd0.png`,
  marcus: `${FR}/toL76daUzF0G3CNvrUyjLIYRBU.png`,
  sarah: `${FR}/eqelcmPilFO99lTneGHDJtQO7w.png`,
};

type Navigate = (page: string) => void;

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F3FCFF] to-white pt-32 pb-14 lg:pt-40 lg:pb-20">
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full border border-primary/10" />
      <div className="pointer-events-none absolute -right-24 top-36 h-[360px] w-[360px] rounded-full border border-primary/10" />
      <div className="relative mx-auto max-w-[1312px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-[650px]">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Business operations, made human
            </p>
            <h1 className="max-w-[630px] text-[42px] font-extrabold leading-[1.14] tracking-[-0.045em] text-[#032532] md:text-[54px]">
              Bring order to your
              <br />
              <span className="text-primary">HR & compliance.</span>
            </h1>
            <p className="mt-7 max-w-[535px] text-[17px] font-normal leading-8 text-[#272127]">
              One independent partner for HR technology, payroll, statutory compliance and the
              important work that helps growing businesses move forward.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a
                href="/contact"
                className="rounded-full bg-primary px-8 py-3.5 text-base font-semibold leading-[22px] text-white transition hover:bg-primary/90"
              >
                Talk to an expert
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-base font-semibold text-[#032532] transition hover:text-primary"
              >
                See what we do <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[590px] lg:ml-auto">
            <img
              src={heroIllustration}
              alt="360 Biz Health HR and compliance platform"
              className="relative w-full mix-blend-multiply"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-8 border-t border-[#032532]/15 pt-10 lg:grid-cols-[1.8fr_1fr] lg:gap-20">
          <div>
            <h2 className="max-w-[650px] font-sans text-[26px] font-semibold leading-[1.35] tracking-[-0.025em] text-[#272127]">
              Your business is growing. Your backend should not become the thing holding it back.
            </h2>
          </div>
          <div className="border-l-2 border-primary/30 pl-6">
            <p className="text-[16px] leading-7 text-[#272127]">
              We help startups, SMEs and established teams replace scattered vendors and manual work
              with a simpler, more dependable way to run people operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      number: "01",
      title: "End-to-End HRMS",
      description:
        "Choose, configure and launch the right HRMS for attendance, leave, payroll, expenses and performance.",
      image: hrTechnology,
    },
    {
      number: "02",
      title: "Payroll & Statutory Compliance",
      description:
        "Accurate monthly payroll with PF, ESIC, TDS, Professional Tax and Labour Welfare Fund support.",
      image: statutoryCompliance,
    },
    {
      number: "03",
      title: "Labour Law & Business Compliance",
      description:
        "Practical advisory for registrations, POSH, maternity benefits, minimum wages, contracts and audits.",
      image: financialTaxation,
    },
    {
      number: "04",
      title: "IPR & Corporate Experiences",
      description:
        "Protect the brand you are building and create thoughtful offsites, retreats and workations for your team.",
      image: teamRetreats,
    },
  ];

  return (
    <section id="services" className="bg-[#FBFFF7] py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid items-end gap-7 border-b border-[#032532]/15 pb-10 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              What we do
            </p>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-[#032532] md:text-[42px]">
              The work behind a well-run business.
            </h2>
          </div>
          <p className="max-w-[560px] text-[17px] leading-8 text-[#272127]">
            From your first HRMS decision to the monthly details that keep your business compliant,
            we bring the pieces together so your team can focus on growth.
          </p>
        </div>

        <div className="mt-4">
          {services.map((service) => (
            <article
              key={service.number}
              className="grid gap-6 border-b border-[#032532]/15 py-8 md:grid-cols-[72px_180px_1fr] md:items-center md:gap-8 lg:grid-cols-[82px_230px_1fr]"
            >
              <span className="text-sm font-semibold tracking-[0.18em] text-primary">
                {service.number}
              </span>
              <div className="flex items-center gap-5">
                <img src={service.image} alt="" className="h-16 w-20 shrink-0 object-cover" />
                <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-[#032532]">
                  {service.title}
                </h3>
              </div>
              <p className="max-w-[570px] text-[16px] leading-7 text-[#272127] md:pl-4">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const benefits = [
    ["95%", "less time spent on repetitive HR processing"],
    ["1 partner", "for technology, payroll and compliance"],
    ["0 silos", "between advice, implementation and support"],
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-[780px] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Why 360 Biz Health
          </p>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-[#032532] md:text-[42px]">
            Less chasing. More clarity. Better business decisions.
          </h2>
          <p className="mt-5 text-[17px] leading-8 text-[#272127]">
            We turn the operational details that quietly slow teams down into a clear, connected and
            accountable system.
          </p>
        </div>
        <div className="mt-14 grid border-y border-[#032532]/15 md:grid-cols-3">
          {benefits.map(([value, label]) => (
            <div
              key={value}
              className="border-b border-[#032532]/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <p className="text-[42px] font-bold leading-none tracking-[-0.05em] text-primary">
                {value}
              </p>
              <p className="mt-4 max-w-[210px] text-[15px] leading-6 text-[#272127]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Understand",
      description:
        "We start with how your business actually works, your current gaps and where you want to go next.",
      image: integrateHowItWorks,
    },
    {
      number: "02",
      title: "Recommend",
      description:
        "We evaluate the options against your needs, budget and timeline without a single-vendor bias.",
      image: gaugeHowItWorks,
    },
    {
      number: "03",
      title: "Make it work",
      description:
        "We configure, migrate, train and support your team long after the first recommendation.",
      image: envelopeHowItWorks,
    },
  ];

  return (
    <section className="bg-[#F8FDFF] py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              How it works
            </p>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-[#032532] md:text-[42px]">
              A thoughtful process, from first question to ongoing support.
            </h2>
          </div>
          <div>
            {steps.map((step) => (
              <div
                key={step.number}
                className="grid gap-5 border-t border-[#032532]/15 py-7 sm:grid-cols-[62px_100px_1fr] sm:items-center sm:gap-7"
              >
                <span className="text-sm font-semibold tracking-[0.18em] text-primary">
                  {step.number}
                </span>
                <img src={step.image} alt="" className="h-20 w-24 object-cover" />
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#032532]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-6 text-[#272127]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote:
        "360 Biz Health transformed our HR operations. We reduced payroll processing time by 95% and finally have zero errors.",
      name: "Rajesh Kumar",
      role: "Founder, growing business",
      image: img.carter,
    },
    {
      quote:
        "Their tax advisory alone saved us ₹25 lakhs annually. What impressed me most is how proactive their team is.",
      name: "Priya Sharma",
      role: "Finance leader",
      image: img.elena,
    },
    {
      quote:
        "Managing compliance across multiple regulations was a nightmare. Now everything is audit-ready and accountable.",
      name: "Amit Patel",
      role: "Operations head",
      image: img.james,
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-[#FBFFF7] py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mx-auto max-w-[700px] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            From the people we work with
          </p>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-[#032532] md:text-[42px]">
            Good operations change how growth feels.
          </h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.name} className="border-t border-[#032532]/15 pt-7">
              <img src={img.quote} alt="" className="h-5 w-auto opacity-70" />
              <p className="mt-5 text-[17px] leading-8 text-[#272127]">“{testimonial.quote}”</p>
              <footer className="mt-7 flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <cite className="not-italic text-sm font-semibold text-[#032532]">
                    {testimonial.name}
                  </cite>
                  <p className="mt-0.5 text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Compare() {
  const points = [
    "One connected view instead of separate vendor conversations",
    "Recommendations based on your business, not a sales incentive",
    "Configuration, migration, training and support after go-live",
    "Processes that adapt as your team and locations grow",
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            A better way forward
          </p>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-[#032532] md:text-[42px]">
            Your business does not grow in silos. Your operations should not either.
          </h2>
        </div>
        <div className="border-t border-[#032532]/15">
          {points.map((point) => (
            <div
              key={point}
              className="flex gap-4 border-b border-[#032532]/15 py-5 text-[16px] leading-7 text-[#272127]"
            >
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <CheckIcon />
              </span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    >
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Faq() {
  const items = [
    [
      "How quickly can we implement an HRMS?",
      "Most implementations are complete in 2–4 weeks with a dedicated onboarding team and minimal disruption to your existing operations.",
    ],
    [
      "Do you handle payroll and compliance filings?",
      "Yes. We support monthly payroll, PF, ESIC, Professional Tax, LWF, TDS and labour law compliance requirements.",
    ],
    [
      "Can you help us choose between HRMS platforms?",
      "Yes. We compare relevant platforms against your team size, workflows, budget and growth plans without pushing one provider.",
    ],
    [
      "Do you work with startups and small businesses?",
      "Yes. We work with businesses at every stage, adjusting the scope of support to what your current team and operating model need.",
    ],
    [
      "Can one partner manage several HR requirements?",
      "That is exactly how we work. HR technology, payroll, compliance, registrations and IPR support can all be coordinated through one point of contact.",
    ],
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#F8FDFF] py-20 lg:py-28">
      <div className="mx-auto max-w-[900px] px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Questions, answered
          </p>
          <h2 className="mt-4 text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-[#032532] md:text-[42px]">
            Before we talk.
          </h2>
        </div>
        <div className="mt-12 border-t border-[#032532]/15">
          {items.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <div key={question} className="border-b border-[#032532]/15">
                <button
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left text-[16px] font-semibold text-[#032532] transition hover:text-primary"
                >
                  <span>{question}</span>
                  <span
                    className={`text-xl font-normal text-primary transition-transform ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="max-w-[760px] pb-6 pr-10 text-[15px] leading-7 text-[#272127]">
                    {answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Blogs({ onNavigate }: { onNavigate: Navigate }) {
  const posts = [
    {
      tag: "Compliance",
      title: "Stay Audit-Ready: Essential Compliance Checklist",
      image: img.blog1,
    },
    { tag: "HR", title: "Cut Payroll Processing Time by 95%—Here’s How", image: img.blog2 },
    {
      tag: "Taxation",
      title: "Tax Planning Mistakes That Cost Businesses Lakhs",
      image: img.blog3,
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#032532]/15 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              From the journal
            </p>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-[#032532] md:text-[42px]">
              Useful ideas for growing teams.
            </h2>
          </div>
          <a
            href="/resources/blogs-news"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/resources/blogs-news");
            }}
            className="text-sm font-semibold text-primary hover:text-[#032532]"
          >
            Read all insights →
          </a>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <a
              key={post.title}
              href="/resources/blogs-news"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/resources/blogs-news");
              }}
              className="group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#F6F9FC]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {post.tag}
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.025em] text-[#032532] group-hover:text-primary">
                {post.title}
              </h3>
              <span className="mt-4 inline-block text-sm font-semibold text-[#272127]">
                Read more →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="px-6 pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1180px] bg-[#FFE9DB] px-7 py-12 text-center md:px-14 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Stay in the know
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-[34px] font-bold leading-[1.2] tracking-[-0.04em] text-[#032532] md:text-[42px]">
          Practical updates for the work that matters.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-7 text-[#272127]">
          Get useful insights on HR, compliance and business operations delivered to your inbox.
        </p>
        <a
          href="mailto:contact@360bizhealth.com"
          className="mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Subscribe to updates
        </a>
      </div>
    </section>
  );
}

export default function Index({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <div className="min-h-screen bg-white text-[#272127]">
      <Header onNavigate={onNavigate} />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <Compare />
        <Faq />
        <Blogs onNavigate={onNavigate} />
        <Newsletter />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
