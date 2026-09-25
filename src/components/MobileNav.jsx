import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import Button from "./Button.jsx";

const SERVICES_LIST = [
  { to: "/hrms-software-solutions", label: "HRMS software solutions" },
  { to: "/payroll-tds-labour-compliance", label: "Payroll & labour compliance" },
  { to: "/business-registration-ipr-certifications", label: "Business setup & IPR" },
  { to: "/corporate-retreats-workations", label: "Corporate retreats & workations" },
];

const OTHER_LINKS = [
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

/* Full-screen menu for narrow screens. Closes on link click, the close button or Escape. */
export default function MobileNav({ open, onClose }) {
  const firstLink = useRef(null);
  const [servicesOpen, setServicesOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open && firstLink.current) firstLink.current.focus();
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onClickInside = (e) => { if (e.target.closest("a")) onClose({ keepFocus: true }); };

  return (
    <div className="mnav" id="mobilenav" data-open={open ? "true" : "false"} role="dialog" aria-modal="true" aria-label="Menu" onClick={onClickInside}>
      <div className="mnav__top">
        <span className="brand">
          <img src={logo} alt="360 Biz Health" className="brand__logo brand__logo--ftr" />
        </span>
        <button className="mnav__close" type="button" aria-label="Close menu" onClick={() => onClose()}>&times;</button>
      </div>
      <nav aria-label="Mobile" className="mnav__links">
        <NavLink to="/" end ref={firstLink}>Home</NavLink>
        
        <div className="mnav__services-group">
          <button
            type="button"
            className="mnav__services-toggle"
            onClick={() => setServicesOpen(!servicesOpen)}
          >
            <span>Services</span>
            <span style={{ fontSize: ".85rem", transform: servicesOpen ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}>▼</span>
          </button>
          {servicesOpen && (
            <div className="mnav__sublinks">
              {SERVICES_LIST.map((s) => (
                <NavLink key={s.to} to={s.to} end>{s.label}</NavLink>
              ))}
            </div>
          )}
        </div>

        {OTHER_LINKS.map((n) => (
          <NavLink key={n.to} to={n.to} end>{n.label}</NavLink>
        ))}
      </nav>
      <Button variant="primary" to="/contact">Talk to an expert</Button>
    </div>
  );
}
