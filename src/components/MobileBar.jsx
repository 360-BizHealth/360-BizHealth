import Button from "./Button.jsx";
import { PhoneLink } from "./ContactLinks.jsx";

/* Sticky action bar shown under 920px */
export default function MobileBar() {
  return (
    <div className="mbar">
      <PhoneLink className="btn btn--ghost">Call</PhoneLink>
      <Button variant="ghost" whatsapp>WhatsApp</Button>
      <Button variant="primary" to="/contact">Enquire</Button>
    </div>
  );
}
