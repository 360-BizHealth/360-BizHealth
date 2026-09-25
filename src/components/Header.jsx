import { forwardRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV } from "../data/site.js";
import BrandMark from "./BrandMark.jsx";
import Button from "./Button.jsx";

/* Sticky site header. NavLink sets aria-current="page" on the active route,
   which the stylesheet underlines in gold. */
const Header = forwardRef(function Header({ menuOpen, onOpenMenu }, burgerRef) {
  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <Link className="brand" to="/">
          <BrandMark />
          360 Biz Health
        </Link>
        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end>{n.label}</NavLink>)}
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
