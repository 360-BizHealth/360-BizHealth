import { forwardRef, useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import Button from "./Button.jsx";

const SERVICES_LIST = [
  {
    to: "/hrms-software-solutions",
    label: "HRMS software solutions",
    note: "Software selection, configuration & rollout",
    color: "#2563EB",
  },
  {
    to: "/payroll-tds-labour-compliance",
    label: "Payroll, TDS & labour compliance",
    note: "Multi-state processing, filings & audits",
    color: "#16A34A",
  },
  {
    to: "/business-registration-ipr-certifications",
    label: "Business setup, IPR & ISO",
    note: "Entity incorporation, GST, trademark & MSME",
    color: "#D97706",
  },
  {
    to: "/corporate-retreats-workations",
    label: "Corporate retreats & workations",
    note: "End-to-end offsites & team experiences",
    color: "#9333EA",
  },
];

/* Sticky site header with Services dropdown, Blog, Careers, and CTA */
const Header = forwardRef(function Header({ menuOpen, onOpenMenu }, burgerRef) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isServiceActive = SERVICES_LIST.some((s) => s.to === location.pathname);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <Link className="brand" to="/" aria-label="360 Biz Health">
          <img src={logo} alt="360 Biz Health" className="brand__logo" />
        </Link>
        <nav className="nav" aria-label="Primary">
          <div
            className={`nav-dropdown ${dropdownOpen ? "is-open" : ""}`}
            ref={dropdownRef}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              className={`nav-dropdown__btn ${isServiceActive ? "is-active" : ""}`}
              aria-expanded={dropdownOpen ? "true" : "false"}
              aria-haspopup="true"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Services
              <svg
                className="nav-dropdown__chevron"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              className="nav-dropdown__menu"
              role="menu"
              onClick={(e) => e.stopPropagation()}
            >
              {SERVICES_LIST.map((s) => (
                <NavLink
                  key={s.to}
                  to={s.to}
                  className="nav-dropdown__item"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="nav-dropdown__dot" style={{ background: s.color }} />
                  <div>
                    <div className="nav-dropdown__label">{s.label}</div>
                    <div className="nav-dropdown__note">{s.note}</div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink to="/about" end>About</NavLink>
          <NavLink to="/blog" end>Blog</NavLink>
          <NavLink to="/careers" end>Careers</NavLink>
          <NavLink to="/resources" end>Resources</NavLink>
          <NavLink to="/contact" end>Contact</NavLink>
        </nav>
        <div className="hdr__cta">
          <Button variant="primary" size="sm" to="/contact">Talk to an expert</Button>
        </div>
        <button
          ref={burgerRef}
          className="burger"
          type="button"
          aria-expanded={menuOpen ? "true" : "false"}
          aria-controls="mobilenav"
          aria-label="Open menu"
          onClick={onOpenMenu}
        >
          <span></span>
        </button>
      </div>
    </header>
  );
});

export default Header;
