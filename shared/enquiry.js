/*
 * Enquiry schema shared by the browser form and the serverless API.
 * The browser uses it for instant feedback; the server re-runs it on every
 * request and is the only authority. Never trust the client copy.
 */

export const SERVICE_OPTIONS = [
  { value: "hrms", label: "HRMS software", vertical: "hrms-software-solutions" },
  { value: "payroll", label: "Payroll outsourcing", vertical: "payroll-tds-labour-compliance" },
  { value: "tds", label: "TDS", vertical: "payroll-tds-labour-compliance" },
  { value: "labour-compliance", label: "Labour compliance", vertical: "payroll-tds-labour-compliance" },
  { value: "business-registration", label: "Business registration", vertical: "business-registration-ipr-certifications" },
  { value: "gst", label: "GST", vertical: "business-registration-ipr-certifications" },
  { value: "msme-udyam", label: "MSME / Udyam", vertical: "business-registration-ipr-certifications" },
  { value: "trademark-ipr", label: "Trademark / IPR", vertical: "business-registration-ipr-certifications" },
  { value: "iso", label: "ISO certification", vertical: "business-registration-ipr-certifications" },
  { value: "corporate-retreat", label: "Corporate retreat", vertical: "corporate-retreats-workations" },
  { value: "workation", label: "Workation", vertical: "corporate-retreats-workations" },
  { value: "other", label: "Other", vertical: null },
];

export const SERVICE_LABELS = Object.fromEntries(SERVICE_OPTIONS.map((o) => [o.value, o.label]));

/* Default service pre-selected when the form is opened from a service page */
export const DEFAULT_SERVICE_FOR_VERTICAL = {
  "hrms-software-solutions": "hrms",
  "payroll-tds-labour-compliance": "payroll",
  "business-registration-ipr-certifications": "business-registration",
  "corporate-retreats-workations": "corporate-retreat",
};

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

/* Corporate retreat enquiries: structured answers stored in leads.retreat_package / leads.details */
export const RETREAT_PACKAGES = [
  { value: "team-recharge", label: "Team Recharge" },
  { value: "corporate-offsite", label: "Corporate Offsite" },
  { value: "leadership-retreat", label: "Leadership Retreat" },
  { value: "custom", label: "Custom Package" },
];
export const RETREAT_PACKAGE_LABELS = Object.fromEntries(RETREAT_PACKAGES.map((p) => [p.value, p.label]));
export const RETREAT_PARTICIPANTS = ["10-20", "21-50", "51-100", "101-200", "200+"];
export const RETREAT_DURATIONS = ["1-2 days", "3-4 days", "5+ days"];
export const RETREAT_TYPES = ["Team building", "Leadership retreat", "Corporate offsite", "Annual company retreat", "Strategy planning", "Employee engagement", "Other"];

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal sent" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
  { value: "on_hold", label: "On hold" },
];
export const LEAD_STATUS_VALUES = LEAD_STATUSES.map((s) => s.value);
export const LEAD_STATUS_LABELS = Object.fromEntries(LEAD_STATUSES.map((s) => [s.value, s.label]));

/* Bump this when the consent wording on the form changes; it is stored with each lead. */
export const CONSENT_VERSION = "2026-10-v1";
export const CONSENT_TEXT =
  "I agree that 360 Biz Health may contact me about this enquiry and process the details I have submitted, as described in the privacy policy.";

export const LIMITS = {
  name: [2, 100],
  company: [2, 150],
  email: [6, 254],
  city: [0, 100],
  currentHrms: [0, 120],
  subject: [0, 150],
  message: [15, 4000],
};

/* Minimum time a person plausibly needs to complete the form (ms). */
export const MIN_FILL_MS = 2000;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function cleanLine(v) {
  return String(v ?? "").normalize("NFC").replace(CONTROL, "").replace(/\s+/g, " ").trim();
}
function cleanText(v) {
  return String(v ?? "")
    .normalize("NFC")
    .replace(CONTROL, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export function normalizeEmail(raw) {
  const v = cleanLine(raw);
  const at = v.lastIndexOf("@");
  if (at < 1) return v;
  return v.slice(0, at) + "@" + v.slice(at + 1).toLowerCase();
}

export function isValidEmail(email) {
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return false;
  const local = email.slice(0, email.lastIndexOf("@"));
  return local.length <= 64 && !local.startsWith(".") && !local.endsWith(".") && !local.includes("..");
}

/*
 * Normalises a phone number to E.164 where it can be determined.
 * Indian numbers without a country code are assumed (+91), since the business
 * operates in India. Returns null when the input cannot be a phone number.
 */
export function normalizePhone(raw) {
  const v = cleanLine(raw);
  if (!v || v.length > 25) return null;
  if (!/^[+0-9\s().-]+$/.test(v)) return null;
  const plus = v.trim().startsWith("+");
  let digits = v.replace(/\D/g, "");
  if (plus) {
    if (digits.length < 8 || digits.length > 15) return null;
    if (digits.startsWith("91") && digits.length !== 12) return null;
    return "+" + digits;
  }
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
    return digits.length >= 8 && digits.length <= 15 ? "+" + digits : null;
  }
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 10 && /^[6-9]/.test(digits)) return "+91" + digits;
  // Indian landline with STD code (10 digits after dropping the trunk 0)
  if (digits.length === 10) return "+91" + digits;
  return null;
}

const URL_RE = /(https?:\/\/|www\.)/gi;
const URL_TEST = /(https?:\/\/|www\.)/i;

/**
 * Validates and normalises an enquiry.
 * @returns {{ ok: boolean, data?: object, errors: Record<string,string> }}
 */
export function validateEnquiry(input) {
  const src = input && typeof input === "object" ? input : {};
  const errors = {};
  const data = {
    name: cleanLine(src.name),
    company: cleanLine(src.company),
    email: normalizeEmail(src.email),
    phone: null,
    city: cleanLine(src.city),
    companySize: cleanLine(src.companySize),
    service: cleanLine(src.service),
    currentHrms: cleanLine(src.currentHrms),
    subject: cleanLine(src.subject),
    message: cleanText(src.message),
    consent: src.consent === true,
  };

  const len = (k, label) => {
    const [min, max] = LIMITS[k];
    const n = data[k].length;
    if (min > 0 && n === 0) errors[k] = `Enter your ${label}.`;
    else if (n > 0 && n < min) errors[k] = `Enter at least ${min} characters.`;
    else if (n > max) errors[k] = `Keep this under ${max} characters.`;
  };

  len("name", "full name");
  if (!errors.name && (/[<>{}]/.test(data.name) || URL_TEST.test(data.name) || /\d{4,}/.test(data.name))) {
    errors.name = "Enter your name as you would like us to address you.";
  }
  len("company", "company name");

  if (!data.email) errors.email = "Enter your work email.";
  else if (!isValidEmail(data.email)) errors.email = "Enter a valid email address.";

  const rawPhone = cleanLine(src.phone);
  if (!rawPhone) errors.phone = "Enter a phone number we can reach you on.";
  else {
    data.phone = normalizePhone(rawPhone);
    if (!data.phone) errors.phone = "Enter a valid phone number, with country code if outside India.";
  }

  len("city", "city");
  if (data.companySize && !COMPANY_SIZES.includes(data.companySize)) errors.companySize = "Select a company size from the list.";
  if (!data.service) errors.service = "Select the service you need.";
  else if (!SERVICE_LABELS[data.service]) errors.service = "Select a service from the list.";
  len("currentHrms", "current HRMS");
  len("subject", "subject");

  len("message", "message");
  if (!errors.message && data.message.length > 0 && data.message.length < LIMITS.message[0]) {
    errors.message = "A little more detail helps us route this correctly.";
  }
  if (!errors.message && (data.message.match(URL_RE) || []).length > 3) {
    errors.message = "Please include no more than three links.";
  }

  if (!data.consent) errors.consent = "Please confirm you agree to be contacted.";

  // Optional structured answers from the corporate retreats form.
  data.retreat = null;
  if (src.retreat && typeof src.retreat === "object") {
    const r = src.retreat;
    const rd = {
      package: cleanLine(r.package),
      participants: cleanLine(r.participants),
      duration: cleanLine(r.duration),
      retreatType: cleanLine(r.retreatType),
      destination: cleanLine(r.destination).slice(0, 200),
      travelDates: cleanLine(r.travelDates).slice(0, 200),
    };
    if (rd.package && !RETREAT_PACKAGE_LABELS[rd.package]) errors.package = "Select a package from the list.";
    if (!RETREAT_PARTICIPANTS.includes(rd.participants)) errors.participants = "Select the number of participants.";
    if (!RETREAT_DURATIONS.includes(rd.duration)) errors.duration = "Select how long the retreat should be.";
    if (!RETREAT_TYPES.includes(rd.retreatType)) errors.retreatType = "Select the type of retreat.";
    if (cleanLine(r.destination).length > 120) errors.destination = "Keep this under 120 characters.";
    if (cleanLine(r.travelDates).length > 120) errors.travelDates = "Keep this under 120 characters.";
    if (data.service !== "corporate-retreat" && data.service !== "workation") errors.service = "Retreat details can only be sent with a retreat enquiry.";
    data.retreat = rd;
  }

  return { ok: Object.keys(errors).length === 0, data, errors };
}

/* Metadata about where the enquiry came from. Unknown keys are dropped and values capped. */
export function cleanSource(src) {
  const s = src && typeof src === "object" ? src : {};
  const cap = (v, n) => cleanLine(v).slice(0, n);
  const utm = {};
  const u = s.utm && typeof s.utm === "object" ? s.utm : {};
  for (const k of UTM_KEYS) if (u[k]) utm[k] = cap(u[k], 200);
  const path = cap(s.page, 300);
  return {
    page: path.startsWith("/") ? path : "",
    vertical: /^[a-z0-9-]{1,80}$/.test(s.vertical || "") ? s.vertical : "",
    referrer: cap(s.referrer, 500),
    landing: cap(s.landing, 500),
    utm,
  };
}

export const UTM_PARAM_KEYS = UTM_KEYS;
