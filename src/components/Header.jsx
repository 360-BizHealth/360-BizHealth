import { forwardRef, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import Button from "./Button.jsx";
import { SERVICE_NAV, PRIMARY_NAV, CONTACT_CTA } from "../data/navigation.js";

const Chevron = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* Sticky header: logo, Services disclosure menu, primary links, CTA, mobile burger. */
const Header = forwardRef(function Header({ menuOpen, onOpenMenu }, burgerRef) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const { pathname } = useLocation();
  const serviceActive = SERVICE_NAV.some((s) => s.to === pathname);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const outside = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === "Escape") { setOpen(false); btnRef.current && btnRef.current.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", key); };
  }, [open]);

  /* close when focus leaves the menu (keyboard users tabbing past it) */
  const onBlur = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.relatedTarget)) setOpen(false); };

  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <Link className="brand" to="/" aria-label="360 Biz Health home">
          <BrandLogo alt="" />
        </Link>
        <nav className="nav" aria-label="Primary">
          <div
            className={"nav-dd" + (open ? " is-open" : "")}
            ref={wrapRef}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onBlur={onBlur}
          >
            <button
              ref={btnRef}
              type="button"
              className={"nav-dd__btn" + (serviceActive ? " is-active" : "")}
              aria-expanded={open ? "true" : "false"}
              aria-controls="services-menu"
              onClick={() => setOpen((v) => !v)}
            >
              Services <Chevron className="nav-dd__chev" />
            </button>
            <div className="nav-dd__menu" id="services-menu">
              {SERVICE_NAV.map((s) => (
                <NavLink key={s.to} to={s.to} className="nav-dd__item">
                  <span className="nav-dd__dot" aria-hidden="true" />
                  <span>
                    <span className="nav-dd__label">{s.label}</span>
                    <span className="nav-dd__note">{s.note}</span>
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
          {PRIMARY_NAV.map((n) => <NavLink key={n.to} to={n.to}>{n.label}</NavLink>)}
        </nav>
        <div className="hdr__cta">
          <Button variant="primary" size="sm" to={CONTACT_CTA.to} ev="header_cta">{CONTACT_CTA.label}</Button>
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
          <span aria-hidden="true"></span>
        </button>
      </div>
    </header>
  );
});

export default Header;
export { Chevron };
