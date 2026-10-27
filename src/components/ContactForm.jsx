import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVICE_OPTIONS, COMPANY_SIZES, validateEnquiry, MIN_FILL_MS } from "../../shared/enquiry.js";
import { track, currentPath } from "../lib/analytics.js";
import { getAttribution } from "../lib/attribution.js";
import { api, newSubmissionId } from "../lib/api.js";
import { BIZ } from "../data/site.js";
import Turnstile, { TURNSTILE_ENABLED } from "./Turnstile.jsx";

const EMPTY = { name: "", company: "", email: "", phone: "", city: "", companySize: "", service: "", currentHrms: "", subject: "", message: "", consent: false };

const ENQUIRY_EVENTS = {
  hrms: "hrms_enquiry", payroll: "payroll_enquiry", tds: "payroll_enquiry", "labour-compliance": "payroll_enquiry",
  "corporate-retreat": "retreat_enquiry", workation: "retreat_enquiry",
};

/* Label, control, hint and inline error, wired together for assistive tech. */
export function Field({ id, name, label, required, optional, full, errors, hint, children }) {
  const invalid = Boolean(errors[name]);
  return (
    <div className={"field" + (full ? " field--full" : "")} data-invalid={invalid ? "true" : "false"}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
        {optional && <span className="opt"> (optional)</span>}
      </label>
      {children}
      {hint && <p className="hint" id={id + "-hint"}>{hint}</p>}
      <p className="err" id={id + "-err"} aria-live="polite">{errors[name] || ""}</p>
    </div>
  );
}

/**
 * Enquiry form. Submits to POST /api/v1/enquiries and only shows success after
 * the server confirms the enquiry was stored.
 */
export default function ContactForm({ defaultService = "", vertical = "" }) {
  const [values, setValues] = useState({ ...EMPTY, service: defaultService });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ kind: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [hp, setHp] = useState("");
  const [captcha, setCaptcha] = useState("");
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const loadedAt = useRef(0);
  const submissionId = useRef("");
  const started = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadedAt.current = Date.now();
    submissionId.current = newSubmissionId();
  }, []);
  useEffect(() => { if (defaultService) setValues((v) => (v.service ? v : { ...v, service: defaultService })); }, [defaultService]);

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [k]: val }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
    if (!started.current) { started.current = true; track("form_start", { page_path: currentPath() }); }
  };

  const ctl = (name, id) => ({
    id,
    name,
    value: values[name],
    onChange: set(name),
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": id + "-err" + (name === "message" || name === "phone" ? " " + id + "-hint" : ""),
  });

  const focusFirstError = () => requestAnimationFrame(() => {
    const bad = formRef.current && formRef.current.querySelector('[data-invalid="true"] input, [data-invalid="true"] select, [data-invalid="true"] textarea');
    if (bad) bad.focus();
  });

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    const check = validateEnquiry(values);
    setErrors(check.errors);
    if (!check.ok) {
      setStatus({ kind: "error", text: "Please correct the highlighted fields." });
      focusFirstError();
      return;
    }
    if (TURNSTILE_ENABLED && !captcha) {
      setStatus({ kind: "error", text: "Please complete the verification check." });
      return;
    }
    const elapsed = Date.now() - loadedAt.current;
    if (elapsed < MIN_FILL_MS) await new Promise((r) => setTimeout(r, MIN_FILL_MS - elapsed + 50));

    setSubmitting(true);
    setStatus({ kind: "", text: "Sending your enquiry…" });
    const attribution = getAttribution();
    try {
      const res = await api("/api/v1/enquiries", {
        method: "POST",
        body: {
          ...values,
          submissionId: submissionId.current,
          elapsedMs: Date.now() - loadedAt.current,
          bh_hp_field: hp,
          turnstileToken: captcha || undefined,
          source: { page: currentPath(), vertical, referrer: attribution.referrer, landing: attribution.landing, utm: attribution.utm },
        },
      });
      track("form_submit", { service: values.service, page_path: currentPath() });
      if (ENQUIRY_EVENTS[values.service]) track(ENQUIRY_EVENTS[values.service], { page_path: currentPath() });
      navigate("/thank-you", { state: { reference: res.reference } });
    } catch (err) {
      const mail = ` If it keeps happening, email us at ${BIZ.email}.`;
      setStatus({ kind: "error", text: (err.message || "Your enquiry was not sent.") + (err.status === 0 || err.status >= 500 ? mail : "") });
      track("form_error", { code: err.code, page_path: currentPath() });
      if (err.fields) { setErrors(err.fields); focusFirstError(); }
      else requestAnimationFrame(() => alertRef.current && alertRef.current.focus());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-req-note">
      <p className="formnote" id="form-req-note">Fields marked <span className="req">*</span> are required.</p>
      <Field id="f-name" name="name" label="Full name" required errors={errors}>
        <input autoComplete="name" required maxLength={100} {...ctl("name", "f-name")} />
      </Field>
      <Field id="f-company" name="company" label="Company name" required errors={errors}>
        <input autoComplete="organization" required maxLength={150} {...ctl("company", "f-company")} />
      </Field>
      <Field id="f-email" name="email" label="Work email" required errors={errors}>
        <input type="email" inputMode="email" autoComplete="email" required maxLength={254} {...ctl("email", "f-email")} />
      </Field>
      <Field id="f-phone" name="phone" label="Phone" required errors={errors} hint="Indian mobile, or include the country code.">
        <input type="tel" inputMode="tel" autoComplete="tel" required maxLength={25} {...ctl("phone", "f-phone")} />
      </Field>
      <Field id="f-service" name="service" label="Service required" required errors={errors}>
        <select required {...ctl("service", "f-service")}>
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>
      <Field id="f-size" name="companySize" label="Company size" optional errors={errors}>
        <select {...ctl("companySize", "f-size")}>
          <option value="">Select</option>
          {COMPANY_SIZES.map((o) => <option key={o} value={o}>{o} employees</option>)}
        </select>
      </Field>
      <Field id="f-city" name="city" label="City" optional errors={errors}>
        <input autoComplete="address-level2" maxLength={100} {...ctl("city", "f-city")} />
      </Field>
      {(values.service === "hrms" || values.service === "payroll" || values.currentHrms) ? (
        <Field id="f-hrms" name="currentHrms" label="Current HRMS or payroll tool" optional errors={errors}>
          <input placeholder='Platform name, or "none / spreadsheets"' maxLength={120} {...ctl("currentHrms", "f-hrms")} />
        </Field>
      ) : <div aria-hidden="true" />}
      <Field id="f-subject" name="subject" label="Subject" optional full errors={errors}>
        <input maxLength={150} placeholder="For example: Payroll for 120 staff across two states" {...ctl("subject", "f-subject")} />
      </Field>
      <Field id="f-msg" name="message" label="Message" required full errors={errors} hint="Headcount, states of operation, what you use today and your timeline.">
        <textarea required maxLength={4000} {...ctl("message", "f-msg")} />
      </Field>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-bh-hp">Leave this field empty</label>
        <input id="f-bh-hp" tabIndex={-1} autoComplete="off" name="bh_hp_field" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      <div className="field field--full" data-invalid={errors.consent ? "true" : "false"}>
        <label className="consent" htmlFor="f-consent">
          <input type="checkbox" id="f-consent" name="consent" required checked={values.consent} onChange={set("consent")} aria-invalid={errors.consent ? "true" : "false"} aria-describedby="f-consent-err" />
          <span>I agree that 360 Biz Health may contact me about this enquiry and process the details I have submitted, as described in the <Link to="/privacy-policy">privacy policy</Link>. <span className="req" aria-hidden="true">*</span></span>
        </label>
        <p className="err" id="f-consent-err" aria-live="polite">{errors.consent || ""}</p>
      </div>

      {TURNSTILE_ENABLED && <div className="field--full"><Turnstile onToken={setCaptcha} /></div>}

      <div className={"alert" + (status.kind === "error" ? " alert--error" : "")} role={status.kind === "error" ? "alert" : "status"} tabIndex={-1} ref={alertRef}>
        {status.text}
      </div>

      <div className="field field--full">
        <button className="btn btn--primary btn--block" type="submit" disabled={submitting} aria-busy={submitting ? "true" : "false"}>
          {submitting ? <><span className="spinner" aria-hidden="true" /> Sending…</> : "Send enquiry"}
        </button>
      </div>
      <p className="formnote">We use your details only to respond to this enquiry. We do not sell them or share them for marketing.</p>
    </form>
  );
}
