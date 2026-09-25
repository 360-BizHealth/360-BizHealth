import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVICE_OPTIONS, COMPANY_SIZES } from "../data/site.js";
import { track, currentPath } from "../lib/analytics.js";
import { saveLead, utmData } from "../lib/leads.js";

const EMPTY = { name: "", company: "", email: "", phone: "", city: "", size: "", service: "", currentHrms: "", message: "", website: "", consent: false };

const ENQUIRY_EVENTS = {
  "HRMS software": "hrms_enquiry", "Payroll outsourcing": "payroll_enquiry", TDS: "payroll_enquiry",
  "Labour compliance": "payroll_enquiry", "Corporate retreat": "retreat_enquiry", Workation: "retreat_enquiry",
};

function validate(v) {
  const e = {};
  const need = (k, msg) => { if (!String(v[k] || "").trim()) { e[k] = msg; return false; } return true; };
  need("name", "Enter your full name.");
  need("company", "Enter your company name.");
  if (need("email", "Enter your work email.") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (need("phone", "Enter a phone number we can reach you on.") && v.phone.replace(/[^0-9]/g, "").length < 8) e.phone = "Enter a valid phone number.";
  need("service", "Select the service you need.");
  if (need("message", "Tell us briefly what you need.") && v.message.trim().length < 15) e.message = "A little more detail helps us route this correctly.";
  if (!v.consent) e.consent = "Please confirm you agree to be contacted.";
  return e;
}

/* Field wrapper: label, control, inline error. */
function Field({ id, name, label, required, optional, full, errors, children }) {
  const invalid = Boolean(errors[name]);
  return (
    <div className={"field" + (full ? " field--full" : "")} data-invalid={invalid ? "true" : "false"}>
      <label htmlFor={id}>
        {label}{" "}
        {required && <span className="req">*</span>}
        {optional && <span className="muted" style={{ fontWeight: 500 }}>(optional)</span>}
      </label>
      {children}
      <p className="err">{errors[name] || ""}</p>
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const formRef = useRef(null);
  const loadedAt = useRef(Date.now());
  const started = useRef(false);
  const navigate = useNavigate();

  useEffect(() => { loadedAt.current = Date.now(); }, []);

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [k]: val }));
    if (!started.current) { started.current = true; track("form_start", { page_path: currentPath() }); }
  };

  const ctl = (name) => ({ name, value: values[name], onChange: set(name), "aria-invalid": errors[name] ? "true" : "false" });

  const onSubmit = (ev) => {
    ev.preventDefault();

    /* anti-spam: honeypot + minimum time on form */
    if (values.website.trim() !== "" || Date.now() - loadedAt.current < 2500) {
      setStatus("Your enquiry could not be sent. Please try again, or message us on WhatsApp.");
      return;
    }
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("Please correct the highlighted fields.");
      requestAnimationFrame(() => {
        const bad = formRef.current && formRef.current.querySelector('[data-invalid="true"] input, [data-invalid="true"] select, [data-invalid="true"] textarea');
        if (bad) bad.focus();
      });
      return;
    }

    const lead = {
      id: "L" + Date.now().toString(36).toUpperCase(), createdAt: new Date().toISOString(),
      name: values.name, company: values.company, email: values.email, phone: values.phone,
      city: values.city, size: values.size, service: values.service, currentHrms: values.currentHrms,
      message: values.message, source: utmData(), status: "New", owner: "", notes: "", lastFollowUp: "", nextFollowUp: "",
    };
    saveLead(lead);

    track("form_submit", { service: lead.service, page_path: currentPath() });
    if (ENQUIRY_EVENTS[lead.service]) track(ENQUIRY_EVENTS[lead.service], { page_path: currentPath() });

    navigate("/thank-you");
  };

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit} noValidate>
      <Field id="f-name" name="name" label="Full name" required errors={errors}>
        <input id="f-name" autoComplete="name" required {...ctl("name")} />
      </Field>
      <Field id="f-company" name="company" label="Company name" required errors={errors}>
        <input id="f-company" autoComplete="organization" required {...ctl("company")} />
      </Field>
      <Field id="f-email" name="email" label="Work email" required errors={errors}>
        <input id="f-email" type="email" inputMode="email" autoComplete="email" required {...ctl("email")} />
      </Field>
      <Field id="f-phone" name="phone" label="Phone" required errors={errors}>
        <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" required {...ctl("phone")} />
      </Field>
      <Field id="f-city" name="city" label="City" errors={errors}>
        <input id="f-city" autoComplete="address-level2" {...ctl("city")} />
      </Field>
      <Field id="f-size" name="size" label="Company size" errors={errors}>
        <select id="f-size" {...ctl("size")}>
          <option value="">Select</option>
          {COMPANY_SIZES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field id="f-service" name="service" label="Service required" required full errors={errors}>
        <select id="f-service" required {...ctl("service")}>
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field id="f-hrms" name="currentHrms" label="Current HRMS" optional full errors={errors}>
        <input id="f-hrms" placeholder='Platform name, or "none / spreadsheets"' {...ctl("currentHrms")} />
      </Field>
      <Field id="f-msg" name="message" label="Message" required full errors={errors}>
        <textarea id="f-msg" required placeholder="Headcount, states of operation, what you use today, and your timeline." {...ctl("message")} />
      </Field>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Leave this field empty</label>
        <input id="f-website" tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={set("website")} />
      </div>

      <div className="field field--full" data-invalid={errors.consent ? "true" : "false"}>
        <label className="consent">
          <input type="checkbox" id="f-consent" name="consent" required checked={values.consent} onChange={set("consent")} aria-invalid={errors.consent ? "true" : "false"} />{" "}
          <span>I agree that 360 Biz Health may contact me about this enquiry and process the details I have submitted, as described in the <Link to="/privacy-policy">privacy policy</Link>. <span className="req">*</span></span>
        </label>
        <p className="err">{errors.consent || ""}</p>
      </div>

      <div className="field field--full">
        <button className="btn btn--primary" type="submit" style={{ width: "100%" }}>Send enquiry</button>
      </div>
      <p className="formnote" role="status">{status}</p>
      <p className="formnote">We use your details only to respond to this enquiry. We do not sell or share them for marketing.</p>
    </form>
  );
}
