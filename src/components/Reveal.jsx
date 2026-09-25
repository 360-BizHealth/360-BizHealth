import { useEffect, useRef, useState } from "react";

/* Renders an element with the .rv class and adds .in when it scrolls into view,
   the same reveal behaviour as the original revealInit(). */
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduce) { setShown(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { setShown(true); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [className, "rv", shown && "in"].filter(Boolean).join(" ");
  return <Tag ref={ref} className={cls} {...rest}>{children}</Tag>;
}
