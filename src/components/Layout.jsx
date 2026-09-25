import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import MobileNav from "./MobileNav.jsx";
import Footer from "./Footer.jsx";
import MobileBar from "./MobileBar.jsx";

/* Site chrome shared by every route. On navigation (after the first paint) it
   scrolls to top and moves focus to <main>, as the original router did. */
export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef(null);
  const mainRef = useRef(null);
  const lastPath = useRef(null);
  const { pathname } = useLocation();

  const closeMenu = useCallback((opts) => {
    setMenuOpen(false);
    if (!opts || !opts.keepFocus) burgerRef.current && burgerRef.current.focus();
  }, []);

  useEffect(() => {
    const first = lastPath.current === null;
    const changed = lastPath.current !== pathname;
    lastPath.current = pathname;
    if (first || !changed) return;
    window.scrollTo(0, 0);
    if (mainRef.current) mainRef.current.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">Skip to main content</a>
      <Header ref={burgerRef} menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
      <MobileNav open={menuOpen} onClose={closeMenu} />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
