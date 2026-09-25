import { Link } from "react-router-dom";
import { track, currentPath } from "../lib/analytics.js";
import { WhatsAppLink } from "./ContactLinks.jsx";

/* variant: primary | ink | ghost | onink | wa.  `to` renders a router link,
   `whatsapp` renders a WhatsApp link (with `msg`), otherwise `href`. */
export function btnClass(variant = "primary", size, extra) {
  return ["btn", "btn--" + variant, size === "sm" && "btn--sm", extra].filter(Boolean).join(" ");
}

export default function Button({ variant, size, className, to, whatsapp, msg, ev, onClick, children, ...rest }) {
  const cls = btnClass(variant, size, className);
  if (whatsapp) {
    return <WhatsAppLink className={cls} msg={msg} ev={ev} onClick={onClick} {...rest}>{children}</WhatsAppLink>;
  }
  const handle = (e) => {
    if (ev) track("cta_click", { cta: ev, page_path: currentPath() });
    if (onClick) onClick(e);
  };
  if (to) return <Link className={cls} to={to} onClick={handle} {...rest}>{children}</Link>;
  if (rest.href) return <a className={cls} onClick={handle} {...rest}>{children}</a>;
  return <button className={cls} type="button" onClick={handle} {...rest}>{children}</button>;
}

/* The gold-underlined text link (.link) */
export function TextLink({ to, ev, children, ...rest }) {
  const handle = () => { if (ev) track("cta_click", { cta: ev, page_path: currentPath() }); };
  return <Link className="link" to={to} onClick={handle} {...rest}>{children}</Link>;
}
