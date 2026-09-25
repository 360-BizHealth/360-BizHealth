import { Link } from "react-router-dom";
import { BIZ } from "../data/site.js";
import { SERVICES, SERVICE_SLUGS } from "../data/services.js";
import { EmailLink } from "./ContactLinks.jsx";
import logo from "../assets/logo.png";

/* Footer service labels are the long-form names used in the original footer. */
const FOOTER_SERVICE_LABELS = {
  "hrms-software-solutions": "HRMS software solutions",
  "payroll-tds-labour-compliance": "Payroll, TDS & labour compliance",
  "business-registration-ipr-certifications": "Business registration, IPR & certifications",
  "corporate-retreats-workations": "Corporate retreats & workations",
};

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__grid">
          <div>
            <div className="brand">
              <img src={logo} alt="360 Biz Health" className="brand__logo brand__logo--ftr" />
            </div>
            <p>A multi-service business solutions company. We help businesses handle HR technology, payroll, compliance, business setup and corporate experiences through one coordinated point of contact, working with specialist technology and service partners.</p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              {SERVICE_SLUGS.map((slug) => (
                <li key={slug}><Link to={"/" + slug}>{FOOTER_SERVICE_LABELS[slug] || SERVICES[slug].nav}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><EmailLink>Email us</EmailLink></li>
              <li>{BIZ.area}</li>
            </ul>
          </div>
        </div>
        <div className="ftr__bottom">
          <span>&copy; {new Date().getFullYear()} 360 Biz Health. All rights reserved.</span>
          <span className="ftr__legal">
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; conditions</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
