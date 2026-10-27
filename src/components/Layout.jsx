import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import MobileNav from "./MobileNav.jsx";
import Footer from "./Footer.jsx";
import MobileBar from "./MobileBar.jsx";

/* Public site chrome. On client-side navigation it scrolls to the top (or to the
   #hash target) and moves focus to <main> so screen readers announce the new page. */
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef(null);
  const mainRef = useRef(null);
  const lastPath = useRef(null);
  const { pathname, hash } = useLocation();

  const closeMenu = useCallback((opts) => {
    setMenuOpen(false);
    if (!opts || !opts.keepFocus) burgerRef.current && burgerRef.current.focus();
  }, []);

  useEffect(() => {
    const first = lastPath.current === null;
    const changed = lastPath.current !== pathname;
    lastPath.current = pathname;
    if (first || !changed) return;
    setMenuOpen(false);
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
    if (mainRef.current) mainRef.current.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <>
      <a className="skip" href="#main">Skip to main content</a>
      <Header ref={burgerRef} menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={closeMenu} />
      <main id="main" ref={mainRef} tabIndex={-1} style={{ outline: "none" }}>
        <Outlet />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
