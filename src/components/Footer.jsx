import { Link } from "react-router-dom";
import { BIZ } from "../data/site.js";
import { SERVICE_NAV, FOOTER_COMPANY, FOOTER_LEGAL } from "../data/navigation.js";
import { EmailLink, PhoneLink } from "./ContactLinks.jsx";
import { HAS_PHONE } from "../lib/contact.js";
import BrandLogo from "./BrandLogo.jsx";

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__grid">
          <div className="ftr__brand">
            <Link to="/" className="ftr__logo" aria-label="360 Biz Health home"><BrandLogo reverse height={52} alt="" /></Link>
            <p>An independent business advisory and channel-partner company. One coordinated point of contact for HR technology, payroll, compliance, business setup and corporate experiences, working with specialist technology and service partners.</p>
          </div>
          <nav aria-labelledby="ftr-services">
            <h2 id="ftr-services">Services</h2>
            <ul>{SERVICE_NAV.map((s) => <li key={s.to}><Link to={s.to}>{s.label}</Link></li>)}</ul>
          </nav>
          <nav aria-labelledby="ftr-company">
            <h2 id="ftr-company">Company</h2>
            <ul>{FOOTER_COMPANY.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
          </nav>
          <div className="ftr__contact">
            <h2>Get in touch</h2>
            <ul>
              <li><EmailLink>{BIZ.email}</EmailLink></li>
              {HAS_PHONE && <li><PhoneLink>{BIZ.phoneDisplay}</PhoneLink></li>}
              <li>{BIZ.area}</li>
              <li><Link to="/contact">Send an enquiry</Link></li>
            </ul>
          </div>
        </div>
        <div className="ftr__bottom">
          <span>&copy; {new Date().getFullYear()} 360 Biz Health. All rights reserved.</span>
          <span className="ftr__legal">
            {FOOTER_LEGAL.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          </span>
        </div>
      </div>
    </footer>
  );
}
