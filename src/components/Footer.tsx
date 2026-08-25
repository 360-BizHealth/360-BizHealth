import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";
import logoImg from "@/assets/logo.png";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === "#" || !href) {
      e.preventDefault();
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const currentPath = window.location.pathname;
      if (currentPath !== "/") {
        onNavigate("/");
        setTimeout(() => {
          const el = document.getElementById(href.substring(1));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById(href.substring(1));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.startsWith("/")) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const productLinks = [
    { title: "HRMS Suite", href: "/services/hrms" },
    { title: "Attendance & Leave", href: "/services/hrms" },
    { title: "Payroll & Salary", href: "/services/hrms" },
    { title: "Expense & Timesheet", href: "/services/hrms" },
    { title: "Performance Management", href: "/services/hrms" },
  ];

  const serviceLinks = [
    { title: "Payroll, TDS & Labour Compliance", href: "/services/statutory-compliance" },
    { title: "IPR & Certifications", href: "/services/ipr-brand-protection" },
    { title: "Corporate Retreats & Workation", href: "/services/corporate-retreats" },
  ];

  const resourceLinks = [
    { title: "Blogs & News", href: "/resources/blogs-news" },
    { title: "Tax Calculators", href: "/resources/tax-calculators" },
    { title: "Case Studies", href: "/resources/case-studies" },
    { title: "Help Center", href: "/contact" },
  ];

  const companyLinks = [
    { title: "About Us", href: "/about-us" },
    { title: "Careers", href: "#", badge: "We're Hiring!" },
    { title: "Pricing", href: "/pricing" },
    { title: "Contact Us", href: "/contact" },
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
  ];

  return (
    <footer className="bg-[#FFFBF8] text-slate-600 pt-20 pb-10 border-t border-[#E8DDD3] relative overflow-hidden">
      {/* Background soft glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="mx-auto max-w-[1180px] px-6 relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pb-16">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="flex items-center shrink-0 transition-transform hover:scale-[1.01]"
            >
              <img
                src={logoImg}
                alt="360 BizHealth"
                className="h-[58px] w-auto object-contain"
              />
            </a>
            <p className="text-[14px] leading-relaxed text-slate-600 font-medium">
              A smarter way to manage your business. Seamless HR, payroll, statutory compliance, taxation, and employee benefits in one integrated platform.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mt-2">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full border border-[#E8DDD3] text-slate-500 flex items-center justify-center hover:border-primary hover:text-primary hover:bg-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full border border-[#E8DDD3] text-slate-500 flex items-center justify-center hover:border-primary hover:text-primary hover:bg-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full border border-[#E8DDD3] text-slate-500 flex items-center justify-center hover:border-primary hover:text-primary hover:bg-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-[#E8DDD3] text-slate-500 flex items-center justify-center hover:border-primary hover:text-primary hover:bg-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: HRMS */}
          <div>
            <h3 className="text-slate-900 text-sm font-bold tracking-wider uppercase mb-5">HRMS</h3>
            <ul className="space-y-3.5">
              {productLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[14px] text-slate-600 hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block font-medium"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-slate-900 text-sm font-bold tracking-wider uppercase mb-5">Services</h3>
            <ul className="space-y-3.5">
              {serviceLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[14px] text-slate-600 hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block font-medium"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h3 className="text-slate-900 text-sm font-bold tracking-wider uppercase mb-5">Resources</h3>
            <ul className="space-y-3.5">
              {resourceLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[14px] text-slate-600 hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block font-medium"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Company & Contact */}
          <div>
            <h3 className="text-slate-900 text-sm font-bold tracking-wider uppercase mb-5">Company</h3>
            <ul className="space-y-3.5 mb-6">
              {companyLinks.map((link) => (
                <li key={link.title} className="flex items-center gap-2">
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[14px] text-slate-600 hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block font-medium"
                  >
                    {link.title}
                  </a>
                  {link.badge && (
                    <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-medium">
                      {link.badge}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Contact Details */}
            <div className="space-y-2.5 pt-4 border-t border-[#E8DDD3]">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <a href="mailto:contact@360bizhealth.com" className="hover:text-primary transition-colors">
                  contact@360bizhealth.com
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-[#E8DDD3] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} 360 BizHealth. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-700 transition-colors">Security</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Sitemap</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
