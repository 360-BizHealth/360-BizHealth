import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import Button from "./Button.jsx";
import { Chevron } from "./Header.jsx";
import { SERVICE_NAV, MOBILE_NAV, CONTACT_CTA } from "../data/navigation.js";

/* Full-screen menu for narrow screens: modal dialog with a focus trap.
   Closes on link click, the close button or Escape, and returns focus to the burger. */
export default function MobileNav({ open, onClose }) {
  const panel = useRef(null);
  const closeBtn = useRef(null);
  const [servicesOpen, setServicesOpen] = useState(true);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current && closeBtn.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll("a[href], button:not([disabled])");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prevOverflow; document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const onClickInside = (e) => { if (e.target.closest("a")) onClose({ keepFocus: true }); };

  return (
    <div
      className="mnav"
      id="mobilenav"
      ref={panel}
      data-open={open ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!open}
      onClick={onClickInside}
    >
      <div className="mnav__top">
        <BrandLogo reverse height={40} alt="360 Biz Health" />
        <button ref={closeBtn} className="mnav__close" type="button" aria-label="Close menu" onClick={() => onClose()}>&times;</button>
      </div>
      <nav aria-label="Mobile" className="mnav__links">
        <NavLink to="/" end>Home</NavLink>
        <div className="mnav__group">
          <button type="button" className="mnav__toggle" aria-expanded={servicesOpen ? "true" : "false"} aria-controls="mnav-services" onClick={() => setServicesOpen((v) => !v)}>
            <span>Services</span>
            <Chevron width="20" height="20" />
          </button>
          <div className="mnav__sub" id="mnav-services" hidden={!servicesOpen}>
            {SERVICE_NAV.map((s) => <NavLink key={s.to} to={s.to}>{s.label}</NavLink>)}
          </div>
        </div>
        {MOBILE_NAV.filter((n) => n.to !== "/").map((n) => <NavLink key={n.to} to={n.to}>{n.label}</NavLink>)}
      </nav>
      <Button variant="primary" to={CONTACT_CTA.to}>{CONTACT_CTA.label}</Button>
    </div>
  );
}
