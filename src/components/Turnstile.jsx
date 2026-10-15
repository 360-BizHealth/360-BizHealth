import { useEffect, useRef } from "react";

/* Optional Cloudflare Turnstile widget. Enabled only when VITE_TURNSTILE_SITE_KEY is set
   at build time (the site key is public by design; the secret stays on the server). */
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

let loader = null;
function loadScript() {
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return loader;
}

export default function Turnstile({ onToken }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!TURNSTILE_ENABLED) return undefined;
    let id = null;
    let alive = true;
    loadScript().then((ts) => {
      if (!alive || !ref.current || !ts) return;
      id = ts.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (t) => onToken(t),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    }).catch(() => onToken(""));
    return () => { alive = false; if (id && window.turnstile) window.turnstile.remove(id); };
  }, [onToken]);
  return <div ref={ref} />;
}
