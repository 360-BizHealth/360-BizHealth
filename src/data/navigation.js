/* Single source of truth for header, mobile menu, footer and 404 links. */

export const SERVICE_NAV = [
  {
    slug: "hrms-software-solutions",
    to: "/hrms-software-solutions",
    label: "HRMS software solutions",
    short: "HRMS solutions",
    note: "Platform selection, configuration and rollout",
  },
  {
    slug: "payroll-tds-labour-compliance",
    to: "/payroll-tds-labour-compliance",
    label: "Payroll, TDS & labour compliance",
    short: "Payroll & compliance",
    note: "Monthly processing, TDS and statutory filings",
  },
  {
    slug: "business-registration-ipr-certifications",
    to: "/business-registration-ipr-certifications",
    label: "Business registration, IPR & certifications",
    short: "Business setup & IPR",
    note: "Entity, GST, Udyam, trademark and ISO",
  },
  {
    slug: "corporate-retreats-workations",
    to: "/corporate-retreats-workations",
    label: "Corporate retreats & workations",
    short: "Corporate retreats",
    note: "Offsites, workations and annual meets",
  },
];

/* Shown after the Services menu in the desktop header */
export const PRIMARY_NAV = [
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "Resources", to: "/resources" },
  { label: "Contact", to: "/contact" },
];

/* Mobile menu: Home first, the same primary links, plus FAQ */
export const MOBILE_NAV = [{ label: "Home", to: "/" }, ...PRIMARY_NAV, { label: "FAQ", to: "/faq" }];

export const FOOTER_COMPANY = [
  { label: "About us", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "Resources", to: "/resources" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export const FOOTER_LEGAL = [
  { label: "Privacy policy", to: "/privacy-policy" },
  { label: "Terms & conditions", to: "/terms-and-conditions" },
  { label: "Disclaimer", to: "/disclaimer" },
];

export const CONTACT_CTA = { label: "Talk to an expert", to: "/contact" };
