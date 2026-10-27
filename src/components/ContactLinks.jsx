import { track, currentPath } from "../lib/analytics.js";
import { waLink, telLink, mailLink, HAS_PHONE } from "../lib/contact.js";

/* WhatsApp, phone and email anchors with click tracking. Phone and WhatsApp render
   nothing until a verified number is configured in data/site.js (BIZ.phonePublished),
   so the site never shows a dead placeholder number. */

function withTracking(eventName, ev, onClick) {
  return (e) => {
    track(eventName, { page_path: currentPath() });
    if (ev) track("cta_click", { cta: ev, page_path: currentPath() });
    if (onClick) onClick(e);
  };
}

export function WhatsAppLink({ msg, ev, onClick, children, ...rest }) {
  if (!HAS_PHONE) return null;
  return (
    <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" onClick={withTracking("whatsapp_click", ev, onClick)} {...rest}>
      {children}
    </a>
  );
}

export function PhoneLink({ ev, onClick, children, ...rest }) {
  if (!HAS_PHONE) return null;
  return <a href={telLink()} onClick={withTracking("phone_click", ev, onClick)} {...rest}>{children}</a>;
}

export function EmailLink({ ev, onClick, children, ...rest }) {
  return <a href={mailLink()} onClick={withTracking("email_click", ev, onClick)} {...rest}>{children}</a>;
}
