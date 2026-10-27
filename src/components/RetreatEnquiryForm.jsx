import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEnquiry, isValidEmail, normalizeEmail, MIN_FILL_MS } from "../../shared/enquiry.js";
import { PARTICIPANT_OPTIONS, DURATION_OPTIONS, RETREAT_TYPES, PACKAGE_OPTIONS, PACKAGE_LABELS } from "../data/retreats.js";
import { track, currentPath } from "../lib/analytics.js";
import { getAttribution } from "../lib/attribution.js";
import { api, newSubmissionId } from "../lib/api.js";
import { BIZ } from "../data/site.js";
import { Field } from "./ContactForm.jsx";
import Turnstile, { TURNSTILE_ENABLED } from "./Turnstile.jsx";

const VERTICAL = "corporate-retreats-workations";
const EMPTY = {
  name: "", company: "", email: "", phone: "", participants: "", destination: "", dates: "",
  duration: "", retreatType: "", pkg: "", requirements: "", consent: false,
};

/* Retreat-specific checks, run before the shared enquiry validation. */
function validateRetreat(v) {
  const e = {};
  if (!v.participants) e.participants = "Select the number of participants.";
  if (!v.duration) e.duration = "Select how long the retreat should be.";
  if (!v.retreatType) e.retreatType = "Select the type of retreat.";
  if (v.destination.length > 120) e.destination = "Keep this under 120 characters.";
  if (v.dates.length > 120) e.dates = "Keep this under 120 characters.";
  if (v.requirements.length > 2500) e.requirements = "Keep this under 2,500 characters.";
  return e;
}

/*
 * Retreat answers are sent twice: as structured fields (`retreat`, stored in
 * leads.retreat_package and leads.details, filterable in the dashboard) and as a
 * readable summary in the subject and message, so the notification email and
 * CSV export carry them too.
 */
function toEnquiry(v) {
  const lines = [
    "Corporate retreat enquiry",
    `Participants: ${v.participants}`,
    `Type of retreat: ${v.retreatType}`,
    `Duration: ${v.duration}`,
    `Package preference: ${PACKAGE_LABELS[v.pkg] || "Not selected"}`,
    `Preferred destination: ${v.destination.trim() || "Not specified"}`,
    `Preferred travel dates: ${v.dates.trim() || "Not specified"}`,
    "",
    "Additional requirements:",
    v.requirements.trim() || "None provided",
  ];
  return {
    name: v.name, company: v.company, email: v.email, phone: v.phone,
    service: "corporate-retreat",
    subject: `Corporate retreat: ${v.retreatType}, ${v.participants} participants`.slice(0, 150),
    message: lines.join("\n"),
    consent: v.consent,
    // structured copy, stored in leads.retreat_package and leads.details
    retreat: {
      package: v.pkg || "", participants: v.participants, duration: v.duration, retreatType: v.retreatType,
      destination: v.destination.trim(), travelDates: v.dates.trim(),
    },
  };
}

/**
 * Corporate retreat enquiry form. Submits to the existing POST /api/v1/enquiries
 * endpoint and only moves to the thank-you page after the server confirms the
 * enquiry was stored. `pick` lets the page preselect a package.
 */
const RetreatEnquiryForm = forwardRef(function RetreatEnquiryForm({ pick = null }, ref) {
  const [values, setValues] = useState({ ...EMPTY, pkg: pick ? pick.id : "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ kind: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [hp, setHp] = useState("");
  const [captcha, setCaptcha] = useState("");
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const alertRef = useRef(null);
  const loadedAt = useRef(0);
  const submissionId = useRef("");
  const started = useRef(false);
  const navigate = useNavigate();

  useEffect(() => { loadedAt.current = Date.now(); submissionId.current = newSubmissionId(); }, []);
  /* a package chosen from a card (pick = { id, n }, n changes on every click) replaces
     the current choice; everything else the visitor has typed is kept */
  useEffect(() => { if (pick && pick.id) { setValues((v) => ({ ...v, pkg: pick.id })); setErrors((er) => ({ ...er, pkg: "" })); } }, [pick]);
  useImperativeHandle(ref, () => ({ focusStart: () => nameRef.current && nameRef.current.focus({ preventScroll: true }) }));

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [k]: val }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
    if (!started.current) { started.current = true; track("form_start", { page_path: currentPath(), form: "retreat" }); }
  };

  const ctl = (name, id, hint = false) => ({
    id, name, value: values[name], onChange: set(name),
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": id + "-err" + (hint ? " " + id + "-hint" : ""),
  });

  const onEmailBlur = () => {
    const e = normalizeEmail(values.email);
    if (e && !isValidEmail(e)) setErrors((er) => ({ ...er, email: "Enter a valid email address." }));
  };

  const focusFirstError = () => requestAnimationFrame(() => {
    const bad = formRef.current && formRef.current.querySelector('[data-invalid="true"] input, [data-invalid="true"] select, [data-invalid="true"] textarea');
    if (bad) bad.focus();
  });

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    const payload = toEnquiry(values);
    const shared = validateEnquiry(payload);
    const all = { ...validateRetreat(values) };
    for (const k of ["name", "company", "email", "phone", "consent"]) if (shared.errors[k]) all[k] = shared.errors[k];
    if (shared.errors.message || shared.errors.subject) all.requirements = shared.errors.message || shared.errors.subject;
    setErrors(all);
    if (Object.keys(all).length) {
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
          ...payload,
          submissionId: submissionId.current,
          elapsedMs: Date.now() - loadedAt.current,
          bh_hp_field: hp,
          turnstileToken: captcha || undefined,
          source: { page: currentPath(), vertical: VERTICAL, referrer: attribution.referrer, landing: attribution.landing, utm: attribution.utm },
        },
      });
      track("form_submit", { service: "corporate-retreat", package: values.pkg || "none", page_path: currentPath() });
      track("retreat_enquiry", { page_path: currentPath() });
      navigate("/thank-you", { state: { reference: res.reference } });
    } catch (err) {
      const mail = ` If it keeps happening, email us at ${BIZ.email}.`;
      setStatus({ kind: "error", text: (err.message || "Your enquiry was not sent.") + (err.status === 0 || err.status >= 500 ? mail : "") });
      track("form_error", { code: err.code, page_path: currentPath() });
      if (err.fields) {
        const f = { ...err.fields };
        if (f.message || f.subject) { f.requirements = f.message || f.subject; delete f.message; delete f.subject; }
        if (f.package) { f.pkg = f.package; delete f.package; }
        if (f.travelDates) { f.dates = f.travelDates; delete f.travelDates; }
        setErrors(f);
        focusFirstError();
      } else requestAnimationFrame(() => alertRef.current && alertRef.current.focus());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form rt-form" ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby="rt-form-title" aria-describedby="rt-form-req">
      <p className="formnote" id="rt-form-req">Fields marked <span className="req">*</span> are required.</p>
      <Field id="r-name" name="name" label="Full name" required errors={errors}>
        <input ref={nameRef} autoComplete="name" required maxLength={100} placeholder="Your full name" {...ctl("name", "r-name")} />
      </Field>
      <Field id="r-company" name="company" label="Company name" required errors={errors}>
        <input autoComplete="organization" required maxLength={150} placeholder="Company name" {...ctl("company", "r-company")} />
      </Field>
      <Field id="r-email" name="email" label="Work email" required errors={errors}>
        <input type="email" inputMode="email" autoComplete="email" required maxLength={254} placeholder="name@company.com" onBlur={onEmailBlur} {...ctl("email", "r-email")} />
      </Field>
      <Field id="r-phone" name="phone" label="Phone number" required errors={errors} hint="Indian mobile, or include the country code.">
        <input type="tel" inputMode="tel" autoComplete="tel" required maxLength={25} placeholder="+91 98765 43210" {...ctl("phone", "r-phone", true)} />
      </Field>
      <Field id="r-participants" name="participants" label="Number of participants" required errors={errors}>
        <select required {...ctl("participants", "r-participants")}>
          <option value="">Select group size</option>
          {PARTICIPANT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
      <Field id="r-type" name="retreatType" label="Type of retreat" required errors={errors}>
        <select required {...ctl("retreatType", "r-type")}>
          <option value="">Select retreat type</option>
          {RETREAT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
      <Field id="r-duration" name="duration" label="Retreat duration" required errors={errors}>
        <select required {...ctl("duration", "r-duration")}>
          <option value="">Select duration</option>
          {DURATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
      <Field id="r-pkg" name="pkg" label="Package preference" optional errors={errors}>
        <select {...ctl("pkg", "r-pkg")}>
          <option value="">No preference yet</option>
          {PACKAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>
      <Field id="r-dest" name="destination" label="Preferred destination" optional errors={errors}>
        <input maxLength={120} placeholder="A place in mind, or open to ideas" {...ctl("destination", "r-dest")} />
      </Field>
      <Field id="r-dates" name="dates" label="Preferred travel dates" optional errors={errors}>
        <input maxLength={120} placeholder="e.g. mid-March, flexible" {...ctl("dates", "r-dates")} />
      </Field>
      <Field id="r-req" name="requirements" label="Additional requirements" optional full errors={errors} hint="Objectives, budget per person, departure cities, dietary or accessibility needs.">
        <textarea rows={4} maxLength={2500} placeholder="Tell us what the retreat should achieve and anything we should plan around" {...ctl("requirements", "r-req", true)} />
      </Field>

      <div className="hp" aria-hidden="true">
        <label htmlFor="r-bh-hp">Leave this field empty</label>
        <input id="r-bh-hp" tabIndex={-1} autoComplete="off" name="bh_hp_field" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      <div className="field field--full" data-invalid={errors.consent ? "true" : "false"}>
        <label className="consent" htmlFor="r-consent">
          <input type="checkbox" id="r-consent" name="consent" required checked={values.consent} onChange={set("consent")} aria-invalid={errors.consent ? "true" : "false"} aria-describedby="r-consent-err" />
          <span>I agree that 360 Biz Health may contact me about this enquiry and process the details I have submitted, as described in the <Link to="/privacy-policy">privacy policy</Link>. <span className="req" aria-hidden="true">*</span></span>
        </label>
        <p className="err" id="r-consent-err" aria-live="polite">{errors.consent || ""}</p>
      </div>

      {TURNSTILE_ENABLED && <div className="field--full"><Turnstile onToken={setCaptcha} /></div>}

      <div className={"alert" + (status.kind === "error" ? " alert--error" : "")} role={status.kind === "error" ? "alert" : "status"} tabIndex={-1} ref={alertRef}>
        {status.text}
      </div>

      <div className="field field--full">
        <button className="btn btn--primary btn--block rt-form__submit" type="submit" disabled={submitting} aria-busy={submitting ? "true" : "false"}>
          {submitting ? <><span className="spinner" aria-hidden="true" /> Sending…</> : "Submit Enquiry"}
        </button>
      </div>
      <p className="formnote">We use your details only to respond to this enquiry. We do not sell them or share them for marketing.</p>
    </form>
  );
});

export default RetreatEnquiryForm;
