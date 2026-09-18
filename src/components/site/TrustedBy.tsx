import {
  HeartPulse,
  Calculator,
  ShieldCheck,
  HeartHandshake,
  FileCheck2,
  ShieldAlert,
  Scale,
  Stethoscope,
  Sparkles,
  Plane,
  Headphones,
} from "lucide-react";

// Rich, high-contrast pastel themes matching the site's design system
const coreSolutions = [
  {
    icon: HeartPulse,
    title: "Group Health Insurance",
    code: "GHI",
    desc: "Cashless Hospitalization",
    theme: {
      card: "bg-[#FFF0F3] border-[#FDC2CC] hover:border-[#F43F5E] hover:shadow-[0_8px_24px_-6px_rgba(244,63,94,0.22)]",
      iconBg: "bg-[#FFE4E8] text-[#E11D48]",
      badge: "bg-[#FFE4E8] text-[#BE123C]",
    },
  },
  {
    icon: Calculator,
    title: "Automated Payroll",
    code: "HRMS",
    desc: "1-Click Salary Disbursal",
    theme: {
      card: "bg-[#FFF8EB] border-[#FDE3B2] hover:border-[#F59E0B] hover:shadow-[0_8px_24px_-6px_rgba(245,158,11,0.22)]",
      iconBg: "bg-[#FEF0D4] text-[#D97706]",
      badge: "bg-[#FEF0D4] text-[#B45309]",
    },
  },
  {
    icon: ShieldCheck,
    title: "PF, ESIC & LWF",
    code: "STATUTORY",
    desc: "100% On-Time Filing",
    theme: {
      card: "bg-[#ECFDF5] border-[#A7F3D0] hover:border-[#10B981] hover:shadow-[0_8px_24px_-6px_rgba(16,185,129,0.22)]",
      iconBg: "bg-[#D1FAE5] text-[#059669]",
      badge: "bg-[#D1FAE5] text-[#047857]",
    },
  },
  {
    icon: HeartHandshake,
    title: "Group Term Life",
    code: "GTL",
    desc: "Financial Family Security",
    theme: {
      card: "bg-[#EEF2FF] border-[#C7D2FE] hover:border-[#6366F1] hover:shadow-[0_8px_24px_-6px_rgba(99,102,241,0.22)]",
      iconBg: "bg-[#E0E7FF] text-[#4F46E5]",
      badge: "bg-[#E0E7FF] text-[#4338CA]",
    },
  },
  {
    icon: FileCheck2,
    title: "TDS & Form 16",
    code: "TAXATION",
    desc: "Zero-Penalty Compliance",
    theme: {
      card: "bg-[#F0F9FF] border-[#BAE6FD] hover:border-[#0EA5E9] hover:shadow-[0_8px_24px_-6px_rgba(14,165,233,0.22)]",
      iconBg: "bg-[#E0F2FE] text-[#0284C7]",
      badge: "bg-[#E0F2FE] text-[#0369A1]",
    },
  },
  {
    icon: ShieldAlert,
    title: "Personal Accident Cover",
    code: "GPA",
    desc: "24x7 Comprehensive Shield",
    theme: {
      card: "bg-[#FFF4ED] border-[#FED4BD] hover:border-[#F97316] hover:shadow-[0_8px_24px_-6px_rgba(249,115,22,0.22)]",
      iconBg: "bg-[#FFE7D6] text-[#EA580C]",
      badge: "bg-[#FFE7D6] text-[#C2410C]",
    },
  },
  {
    icon: Scale,
    title: "POSH & Labour Laws",
    code: "LEGAL",
    desc: "Statutory Legal Framework",
    theme: {
      card: "bg-[#FAF5FF] border-[#E9D5FF] hover:border-[#A855F7] hover:shadow-[0_8px_24px_-6px_rgba(168,85,247,0.22)]",
      iconBg: "bg-[#F3E8FF] text-[#9333EA]",
      badge: "bg-[#F3E8FF] text-[#7E22CE]",
    },
  },
  {
    icon: Stethoscope,
    title: "OPD & Wellness Care",
    code: "HEALTH",
    desc: "Annual Executive Checkups",
    theme: {
      card: "bg-[#F0FDFA] border-[#99F6E4] hover:border-[#14B8A6] hover:shadow-[0_8px_24px_-6px_rgba(20,184,166,0.22)]",
      iconBg: "bg-[#CCFBF1] text-[#0D9488]",
      badge: "bg-[#CCFBF1] text-[#0F766E]",
    },
  },
  {
    icon: Sparkles,
    title: "Super Top-up Health",
    code: "COVERAGE",
    desc: "High Sum-Insured Boost",
    theme: {
      card: "bg-[#FDF2F8] border-[#FBCFE8] hover:border-[#EC4899] hover:shadow-[0_8px_24px_-6px_rgba(236,72,153,0.22)]",
      iconBg: "bg-[#FCE7F3] text-[#DB2777]",
      badge: "bg-[#FCE7F3] text-[#BE185D]",
    },
  },
  {
    icon: Plane,
    title: "Corporate Retreats",
    code: "WORKATION",
    desc: "Curated Team Offsites",
    theme: {
      card: "bg-[#F5F3FF] border-[#DDD6FE] hover:border-[#8B5CF6] hover:shadow-[0_8px_24px_-6px_rgba(139,92,246,0.22)]",
      iconBg: "bg-[#EDE9FE] text-[#7C3AED]",
      badge: "bg-[#EDE9FE] text-[#6D28D9]",
    },
  },
  {
    icon: Headphones,
    title: "Dedicated Claims Desk",
    code: "SUPPORT",
    desc: "Fast 24-48h Assistance",
    theme: {
      card: "bg-[#F0FDF4] border-[#BBF7D0] hover:border-[#22C55E] hover:shadow-[0_8px_24px_-6px_rgba(34,197,94,0.22)]",
      iconBg: "bg-[#DCFCE7] text-[#16A34A]",
      badge: "bg-[#DCFCE7] text-[#15803D]",
    },
  },
];

export function TrustedBy() {
  return (
    <section className="relative bg-[#FAF6FC] py-11 sm:py-14 overflow-hidden">
      {/* Subtle glowing ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(226,27,60,0.06),transparent_70%)]" />

      <div className="section-x relative">
        <div className="mx-auto flex flex-col items-center text-center">
          <h2 className="mx-auto max-w-4xl text-2xl font-semibold leading-[1.2] text-foreground sm:text-[34px] md:text-[38px]">
            Everything Your Business Needs for HR, Payroll, Compliance &amp; Benefits
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-[17px]">
            A unified partner built to simplify daily operations and protect your team without managing multiple vendors.
          </p>
        </div>
      </div>

      {/* Modern High-End Infinite Marquee */}
      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-x-4 py-2">
          {[...coreSolutions, ...coreSolutions].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.title}-${i}`}
                className={`group flex items-center gap-3 rounded-2xl border px-4 py-2.5 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-default ${item.theme.card}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${item.theme.iconBg}`}
                >
                  <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#241031] whitespace-nowrap">
                      {item.title}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${item.theme.badge}`}
                    >
                      {item.code}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#5F4768] whitespace-nowrap">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
