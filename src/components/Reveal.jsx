import { useEffect, useRef, useState } from "react";

/* Fades content in when it scrolls into view. Content stays visible without
   JavaScript (the hiding rule only applies under html.js) and with reduced motion. */
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduce) { setShown(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { setShown(true); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [className, "rv", shown && "in"].filter(Boolean).join(" ");
  return <Tag ref={ref} className={cls} {...rest}>{children}</Tag>;
}
