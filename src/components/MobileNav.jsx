import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { NAV } from "../data/site.js";
import Button from "./Button.jsx";

const LINKS = [{ label: "Home", to: "/" }, ...NAV, { label: "FAQ", to: "/faq" }];

/* Full-screen menu for narrow screens. Closes on link click, the close button or Escape. */
export default function MobileNav({ open, onClose }) {
  const firstLink = useRef(null);

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
        <span className="brand" style={{ color: "#fff" }}>360 Biz Health</span>
        <button className="mnav__close" type="button" aria-label="Close menu" onClick={() => onClose()}>&times;</button>
      </div>
      <nav aria-label="Mobile" className="mnav__links">
        {LINKS.map((n, i) => (
          <NavLink key={n.to} to={n.to} end ref={i === 0 ? firstLink : undefined}>{n.label}</NavLink>
        ))}
      </nav>
      <Button variant="primary" to="/contact">Talk to an expert</Button>
    </div>
  );
}
