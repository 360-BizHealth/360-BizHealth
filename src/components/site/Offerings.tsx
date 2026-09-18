import { useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  CalendarCheck2,
  FileCheck2,
  Fingerprint,
  LayoutDashboard,
  Plane,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { offerings } from "./site-data";

const tabs: string[] = Object.keys(offerings);

const cardTints = [
  "bg-[oklch(0.93_0.05_150)]",
  "bg-[oklch(0.91_0.03_255)]",
  "bg-[oklch(0.94_0.06_95)]",
  "bg-[oklch(0.92_0.03_20)]",
];

const offeringIcons: Record<string, LucideIcon> = {
  "End-to-End HRMS": LayoutDashboard,
  "Attendance & Leave Management": CalendarCheck2,
  "Payroll & Salary Processing": Banknote,
  "Expense & Performance Management": BarChart3,
  "Payroll, TDS & Labour Compliance": ShieldCheck,
  "PF, ESIC & LWF Filing": FileCheck2,
  "TDS Returns & Form 16": Calculator,
  "Tax Planning & Financial Advisory": Scale,
  "IPR & Certifications": BadgeCheck,
  "Trademark & Copyright Registration": Fingerprint,
  "Company Registration & Licensing": Building2,
  "Corporate Retreats & Workation": Plane,
};

export function Offerings() {
  const [active, setActive] = useState<string>(tabs[0] ?? "");
  const items = offerings[active] ?? [];

  return (
    <section id="offerings" className="py-20 lg:py-24">
      <div className="section-x flex flex-col gap-12 lg:flex-row lg:gap-16">
        <div className="w-full lg:w-[36%]">
          <h2 className="text-3xl font-semibold leading-[1.15] text-foreground sm:text-[40px]">
            Everything you need to run your business better.
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-soft">
            From HR and payroll to compliance, taxation, IP, and team experiences—manage the essentials with confidence.
          </p>

          <div className="mt-10 flex max-w-[420px] flex-col gap-4">
            {tabs.map((tab) => {
              const isActive = active === tab;
              const first = tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={
                    "cursor-pointer rounded-full border px-8 py-5 text-left text-xl transition-colors " +
                    (isActive
                      ? "border-ink bg-ink text-ink-foreground"
                      : "border-border bg-card text-ink hover:border-brand")
                  }
                >
                  <span className="font-bold">{first.toLowerCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2 lg:w-[64%]">
          {items.map((item, i) => {
            const VisualIcon = offeringIcons[item.title] ?? Briefcase;
            return (
              <a
                key={item.title}
                href="#quote"
                className={
                  "group relative flex min-h-[250px] flex-col rounded-3xl p-8 transition-all hover:-translate-y-1 " +
                  (cardTints[i % cardTints.length] ?? "")
                }
              >
                <ArrowUpRight className="absolute right-6 top-6 size-5 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <h3 className="max-w-[75%] text-xl font-medium leading-snug text-ink">
                  {item.title}
                </h3>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <p className="max-w-[60%] text-[15px] leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                  <VisualIcon aria-hidden="true" className="h-16 w-16 shrink-0 stroke-[1.2] text-ink" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
