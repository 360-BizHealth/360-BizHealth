import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import logoImg from "@/assets/logo.png";

export interface FooterProps {
  onNavigate?: (page: string) => void;
}

const footerColumns = [
  {
    title: "PLATFORM",
    links: [
      { label: "Overview", href: "#offerings" },
      { label: "Employer Experience", href: "#why-us" },
    ],
  },
  {
    title: "SERVICES",
    links: [
      { label: "End-to-End HRMS", href: "/services/hrms" },
      { label: "Payroll, TDS & Labour Compliance", href: "/services/statutory-compliance" },
      { label: "IPR & Certifications", href: "/services/ipr-brand-protection" },
      { label: "Corporate Retreats & Workation", href: "/services/corporate-retreats" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "State of employee insurance 2.0 in India", href: "/resources/blogs-news" },
      { label: "Employee health & wellness report", href: "/resources/blogs-news" },
      { label: "Guide to group health insurance", href: "/resources/blogs-news" },
      { label: "Salary hike calculator", href: "/resources/tax-calculators" },
      { label: "HRA exemption calculator", href: "/resources/tax-calculators" },
      { label: "Gratuity calculator", href: "/resources/tax-calculators" },
      { label: "HR glossary", href: "/resources/blogs-news" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "360 Biz Health Reviews", href: "#testimonials" },
      { label: "Contact Us", href: "/contact" },
      { label: "About Us", href: "/about-us" },
      { label: "Careers", href: "#careers" },
      { label: "Get Help", href: "/contact" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export function Footer({ onNavigate }: FooterProps) {
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === "#" || !href) {
      e.preventDefault();
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (onNavigate) {
        onNavigate("/");
        setTimeout(() => {
          const target = document.getElementById(href.substring(1));
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } else if (href.startsWith("/") && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <footer
      style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif" }}
      className="relative bg-[#FAF6FC] text-[#1F0436] pt-20 pb-12 overflow-hidden"
    >
      {/* Subtle glowing ambient background matching TrustedBy section */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(226,27,60,0.06),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(123,24,204,0.04),transparent_70%)]" />

      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 relative z-10">
        {/* Top 4-Column Navigation Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-14 border-b border-[#E2D5EA]">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-[#E21B3C]">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-sm font-medium text-[#2A103D] transition-colors duration-200 hover:text-[#E21B3C] hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle Brand, Contact Details & CTA */}
        <div className="py-12 grid gap-10 lg:grid-cols-3 items-start border-b border-[#E2D5EA]">
          {/* Brand Info */}
          <div className="space-y-4">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="inline-block transition-transform hover:scale-[1.02]"
            >
              <img
                src={logoImg}
                alt="360 Biz Health"
                className="h-14 sm:h-16 md:h-[62px] w-auto object-contain"
              />
            </a>
            <p className="text-sm font-normal leading-relaxed text-[#3B1B54] max-w-sm">
              Empowering fast-growing startups and enterprises with automated HR technology, accurate statutory compliance, and strategic brand advisory.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#social"
                  aria-label="360 Biz Health social profile"
                  className="rounded-full border border-[#D5C2E2] bg-white p-2.5 text-[#2A103D] shadow-2xs transition-all hover:border-[#E21B3C] hover:text-[#E21B3C] hover:bg-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Support Desk */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E21B3C]">
              Support &amp; Advisory Desk
            </p>
            <div className="space-y-2 text-sm font-semibold text-[#1F0436] pt-1">
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#E21B3C] shrink-0" />
                <a href="mailto:support@360bizhealth.com" className="hover:text-[#E21B3C] transition-colors">
                  support@360bizhealth.com
                </a>
              </div>
              {/* <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-[#E21B3C] shrink-0" />
                <a href="tel:+918037834753" className="hover:text-[#E21B3C] transition-colors">
                  +91 80378 34753
                </a>
              </div> */}
            </div>
          </div>

          {/* Quick CTA Box */}
          <div className="space-y-4 lg:pl-6">
            <div>
              <p className="text-lg font-bold text-[#1F0436]">
                Best pricing for you.
              </p>
              <p className="text-sm font-medium text-[#4A256B]">
                Best claim support for your team.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="#quote"
                onClick={(e) => handleLinkClick(e, "#quote")}
                className="rounded-full bg-[#E21B3C] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C71565] inline-flex items-center justify-center"
              >
                Get a Quote
              </a>
              <button
                type="button"
                onClick={(e) => handleLinkClick(e, "/contact")}
                className="rounded-full border border-[#D5C2E2] bg-white px-7 py-3 text-sm font-semibold text-[#1F0436] transition hover:bg-[#F3ECFB] shadow-2xs inline-flex items-center justify-center"
              >
                Talk to an expert
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-medium text-[#4A256B]">
          <p>
            © {new Date().getFullYear()} 360 Biz Health. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="/privacy"
              onClick={(e) => handleLinkClick(e, "/privacy")}
              className="text-[#4A256B] transition-colors duration-200 hover:text-[#E21B3C]"
            >
              Privacy Policy
            </a>
            <span className="text-[#D5C2E2]">•</span>
            <a
              href="/terms"
              onClick={(e) => handleLinkClick(e, "/terms")}
              className="text-[#4A256B] transition-colors duration-200 hover:text-[#E21B3C]"
            >
              Terms of Service
            </a>
            <span className="text-[#D5C2E2]">•</span>
            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, "/contact")}
              className="text-[#4A256B] transition-colors duration-200 hover:text-[#E21B3C]"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
