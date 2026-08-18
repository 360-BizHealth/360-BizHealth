import { useState, useEffect } from "react";
import logoImg from "@/assets/logo.png";
import {
  ChevronDown,
  Menu,
  X,
  Users,
  CreditCard,
  Calendar,
  Coffee,
  Receipt,
  BarChart3,
  Briefcase,
  Heart,
  Clock,
  Gift,
  FileSpreadsheet,
  ShieldCheck,
  Scale,
  HeartPulse,
  BookOpen,
  Calculator,
  CheckSquare,
  Building2,
  Users2,
  Mail,
  Laptop,
  Search
} from "lucide-react";

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setMobileMenuOpen(false);
  };

  const menuItems = [
    {
      title: "Services",
      key: "services",
      dropdownItems: [
        { title: "End-to-End HRMS", desc: "Attendance, Payroll, Expense & Performance suite", icon: Users, href: "/services/hrms" },
        { title: "Payroll, TDS & Labour Compliance", desc: "PF, ESIC, LWF & labour law compliance", icon: ShieldCheck, href: "/services/statutory-compliance" },
        { title: "IPR & Certifications", desc: "Trademark, Copyright & Design registration", icon: Scale, href: "/services/ipr-brand-protection" },
        { title: "Corporate Retreats & Workation", desc: "Planned business trips, team-building & workations", icon: Coffee, href: "/services/corporate-retreats" },
      ],
    },
    {
      title: "Blog",
      key: "blog",
      href: "/resources/blogs-news",
    },
    {
      title: "Careers",
      key: "careers",
      href: "#",
    },
    {
      title: "About Us",
      key: "about",
      href: "#",
    },
    {
      title: "Contact Us",
      key: "contact",
      href: "/contact",
    },
  ];

  return (
    <>
      {/* ----------------- DESKTOP HEADER (Capsule Navigation) ----------------- */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 lg:block hidden ${isScrolled ? "py-2" : "py-4"}`}>
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <header
            className={`flex items-center justify-between bg-white border border-slate-100 rounded-full transition-all duration-300 ${
              isScrolled 
                ? "h-[66px] px-8 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)]" 
                : "h-[78px] px-10 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.05)]"
            }`}
          >
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="flex items-center transition-transform hover:scale-[1.01] shrink-0"
            >
              <img
                src={logoImg}
                alt="360 BizHealth"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? "h-[42px]" : "h-[50px]"
                }`}
              />
            </a>

            {/* Desktop Nav Links */}
            <nav className="flex items-center gap-7">
              {menuItems.map((item) => {
                const hasDropdown = !!item.dropdownItems;
                return (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => hasDropdown && setActiveDropdown(item.key)}
                    onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                  >
                    {hasDropdown ? (
                      <button
                        className={`flex items-center gap-1 text-[15px] font-semibold text-slate-700 transition-colors cursor-pointer ${
                          activeDropdown === item.key ? "text-primary" : "text-slate-700 hover:text-primary"
                        }`}
                      >
                        {item.title}
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${
                            activeDropdown === item.key ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href || "#")}
                        className="inline-flex items-center text-[15px] font-semibold text-slate-700 hover:text-primary transition-colors cursor-pointer"
                      >
                        {item.title}
                      </a>
                    )}

                    {/* Dropdown Menu Pane */}
                    {hasDropdown && activeDropdown === item.key && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className={`bg-white border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] rounded-[20px] p-3.5 max-h-[480px] overflow-y-auto text-left ${
                          item.key === "services" 
                            ? "w-[360px]" 
                            : item.key === "products" 
                            ? "w-[330px]" 
                            : "w-[240px]"
                        }`}>
                          <div className="space-y-1">
                            {item.dropdownItems?.map((subItem) => {
                              const Icon = subItem.icon;
                              return (
                                <a
                                  key={subItem.title}
                                  href={subItem.href}
                                  onClick={(e) => handleLinkClick(e, subItem.href)}
                                  className="group flex items-center gap-3.5 px-4 py-3 rounded-[12px] bg-transparent hover:bg-slate-50 transition-colors duration-150"
                                >
                                  <Icon className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-primary transition-colors stroke-[1.8]" />
                                  <span className="text-[14.5px] font-semibold text-slate-700 group-hover:text-primary transition-colors">
                                    {subItem.title}
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Buttons */}
            <div className="flex items-center gap-5">
              <a
                href="/contact"
                onClick={(e) => handleLinkClick(e, "/contact")}
                className="px-6 py-2.5 text-[14px] font-semibold text-white bg-primary rounded-full hover:bg-primary/95 transition-all duration-300 hover:scale-[1.01] shadow-sm shadow-primary/10"
              >
                Book a Demo
              </a>
              <a
                href="/login"
                onClick={(e) => handleLinkClick(e, "/login")}
                className="px-6 py-2.5 text-[14px] font-semibold text-white bg-primary rounded-full hover:bg-primary/95 transition-all duration-300 hover:scale-[1.01] shadow-sm shadow-primary/10"
              >
                Login
              </a>
            </div>
          </header>
        </div>
      </div>

      {/* ----------------- MOBILE HEADER (Flat Full-Width White Bar) ----------------- */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <header
          className={`flex items-center justify-between bg-white h-16 px-5 transition-all duration-300 ${
            isScrolled 
              ? "border-b border-slate-100 shadow-sm" 
              : "border-b border-transparent shadow-none"
          }`}
        >
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="flex items-center transition-transform hover:scale-[1.01] shrink-0"
          >
            <img
              src={logoImg}
              alt="360 BizHealth"
              className="h-[42px] w-auto object-contain"
            />
          </a>

          {/* Right side: Login button + Hamburger aligned inline */}
          <div className="flex items-center gap-3">
            <a
              href="/login"
              onClick={(e) => handleLinkClick(e, "/login")}
              className="px-4.5 py-1.5 text-[13px] font-semibold text-white bg-primary rounded-full hover:bg-primary/95 transition-all"
            >
              Login
            </a>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-slate-700 hover:text-primary transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>
      </div>

      {/* ----------------- FULL-SCREEN MOBILE OVERLAY MENU ----------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Full Screen White Overlay Container */}
          <div className="fixed inset-0 h-full w-full bg-white p-6 flex flex-col z-50 animate-in fade-in slide-in-from-right duration-300 overflow-y-auto">
            {/* Header inside overlay */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center">
                <img
                  src={logoImg}
                  alt="360 BizHealth"
                  className="h-[42px] w-auto object-contain"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-primary transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {/* Menu Navigation Links List */}
            <div className="flex-1 py-6 space-y-2">
              {menuItems.map((item) => {
                const hasDropdown = !!item.dropdownItems;
                const isExpanded = expandedMobileSection === item.key;

                return (
                  <div key={item.key} className="py-0.5">
                    {hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setExpandedMobileSection(isExpanded ? null : item.key)}
                          className="flex items-center justify-between w-full text-[17px] font-bold text-slate-800 py-2.5 hover:text-primary transition-colors cursor-pointer"
                        >
                          {item.title}
                          <ChevronDown
                            className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-300 ${
                              isExpanded ? "rotate-180 text-primary" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`pl-3 space-y-2.5 overflow-hidden transition-all duration-300 ${
                            isExpanded ? "max-h-[500px] opacity-100 py-1.5" : "max-h-0 opacity-0 pointer-events-none"
                          }`}
                        >
                          {item.dropdownItems?.map((subItem) => {
                            const Icon = subItem.icon;
                            return (
                              <a
                                key={subItem.title}
                                href={subItem.href}
                                onClick={(e) => handleLinkClick(e, subItem.href)}
                                className="flex items-center gap-3 py-1 hover:text-primary transition-colors animate-in fade-in duration-200"
                              >
                                <div className="flex h-7.5 w-7.5 items-center justify-center rounded bg-slate-50 text-slate-500">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{subItem.title}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href || "#")}
                        className="text-[17px] font-bold text-slate-800 py-2.5 block hover:text-primary transition-colors"
                      >
                        {item.title}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Book a Demo button inside overlay */}
            <div className="border-t border-slate-100 pt-6 mt-auto">
              <a
                href="/contact"
                onClick={(e) => handleLinkClick(e, "/contact")}
                className="flex items-center justify-center w-full py-3.5 text-base font-bold text-white bg-primary rounded-full hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
              >
                Book a Demo →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
