import Button from "./Button.jsx";
import { PhoneLink, EmailLink } from "./ContactLinks.jsx";
import { HAS_PHONE } from "../lib/contact.js";

/* Sticky action bar on narrow screens. Shows Call only once a real number is configured. */
export default function MobileBar() {
  return (
    <div className="mbar">
      {HAS_PHONE ? <PhoneLink className="btn btn--ghost">Call</PhoneLink> : <EmailLink className="btn btn--ghost">Email</EmailLink>}
      <Button variant="primary" to="/contact" ev="mobile_bar_cta">Enquire</Button>
    </div>
  );
}
