import { track, currentPath } from "../lib/analytics.js";
import { waLink, telLink, mailLink } from "../lib/contact.js";

/* WhatsApp, phone and email anchors. Each records its click event, and an
   optional `ev` also records a cta_click, matching the original data-ev hooks. */

function withTracking(eventName, ev, onClick) {
  return (e) => {
    track(eventName, { page_path: currentPath() });
    if (ev) track("cta_click", { cta: ev, page_path: currentPath() });
    if (onClick) onClick(e);
  };
}

export function WhatsAppLink({ msg, ev, onClick, children, ...rest }) {
  return (
    <a href={waLink(msg)} target="_blank" rel="noopener" onClick={withTracking("whatsapp_click", ev, onClick)} {...rest}>
      {children}
    </a>
  );
}

export function PhoneLink({ ev, onClick, children, ...rest }) {
  return (
    <a href={telLink()} onClick={withTracking("phone_click", ev, onClick)} {...rest}>
      {children}
    </a>
  );
}

export function EmailLink({ ev, onClick, children, ...rest }) {
  return (
    <a href={mailLink()} onClick={withTracking("email_click", ev, onClick)} {...rest}>
      {children}
    </a>
  );
}
