import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "../data/images.js";
import { PACKAGES, PLANNING_STEPS, RETREAT_FAQS, INTRO_POINTS, WHY } from "../data/retreats.js";
import { track, currentPath } from "../lib/analytics.js";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import Reveal from "../components/Reveal.jsx";
import { Eyebrow } from "../components/Section.jsx";
import Button from "../components/Button.jsx";
import RetreatEnquiryForm from "../components/RetreatEnquiryForm.jsx";

/*
 * Corporate Retreats landing page (route /corporate-retreats-workations).
 * Order: hero image, heading and introduction, enquiry form + FAQ, packages,
 * why choose us, final CTA. Every CTA leads to the enquiry form on this page;
 * package buttons also preselect that package in the form.
 */

const FORMATS = ["Team building", "Leadership retreats", "Corporate offsites", "Annual meets", "Workations"];

function Photo({ image, className, sizes, eager = false, alt }) {
  return (
    <img
      className={className}
      src={image.lg}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.w}
      height={image.h}
      alt={alt !== undefined ? alt : image.alt}
      loading={eager ? "eager" : "lazy"}
      fetchpriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
}

const ICONS = {
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M14.8 14.3c2.6-.4 4.9 1 5.7 4.2" /></>,
  plan: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M8 3v4M16 3v4M4 10h16M8.5 14.5l2 2 4-4" /></>,
  scale: <><path d="M4 18h16M7 18V9M12 18V5M17 18v-6" /></>,
};
function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* Card accordion: a button per question (aria-expanded / aria-controls) and a
   labelled region that opens with a height transition. Several can be open. */
function FaqCards({ items }) {
  const [open, setOpen] = useState(() => new Set());
  const base = useId().replace(/:/g, "");
  const toggle = (i) => setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <ul className="rt-faq__list">
      {items.map(([q, a], i) => {
        const isOpen = open.has(i);
        const bid = `${base}-q${i}`, pid = `${base}-a${i}`;
        return (
          <li key={i} className={"rt-faq__item" + (isOpen ? " is-open" : "")}>
            <h3 className="rt-faq__q">
              <button type="button" id={bid} aria-expanded={isOpen ? "true" : "false"} aria-controls={pid} onClick={() => toggle(i)}>
                <span>{q}</span>
                <span className="rt-faq__icon" aria-hidden="true" />
              </button>
            </h3>
            <div className="rt-faq__a" id={pid} role="region" aria-labelledby={bid} inert={isOpen ? undefined : ""}>
              <div><p>{a}</p></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* "Explore Package": a native modal dialog (focus is trapped and Escape closes it;
   focus returns to the button that opened it). */
function PackageDialog({ pkg, onClose, onEnquire }) {
  const ref = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (pkg && !d.open) { opener.current = document.activeElement; d.showModal(); }
    if (!pkg && d.open) d.close();
  }, [pkg]);
  const close = () => {
    onClose();
    if (opener.current && opener.current.focus) opener.current.focus();
  };
  return (
    <dialog ref={ref} className="rt-dlg" aria-labelledby="rt-dlg-title" onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === ref.current) close(); }}>
      {pkg && (
        <div className="rt-dlg__in">
          <div className="rt-dlg__media">
            <Photo image={pkg.image} sizes="(max-width: 700px) 100vw, 680px" />
            <button type="button" className="rt-dlg__close" onClick={close} aria-label="Close package details">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div className="rt-dlg__body">
            <p className="rt-dlg__tag">{pkg.tag}</p>
            <h2 id="rt-dlg-title">{pkg.name}</h2>
            <p className="rt-dlg__lede">{pkg.text}</p>
            <div className="rt-dlg__cols">
              <div>
                <h3>Highlights</h3>
                <ul className="checklist">{pkg.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
              </div>
              <div>
                <h3>Well suited to</h3>
                <p>{pkg.suits}</p>
              </div>
            </div>
            <h3>How planning works</h3>
            <ol className="rt-dlg__steps">{PLANNING_STEPS.map((s) => <li key={s}>{s}</li>)}</ol>
            <p className="rt-dlg__note">Destinations, inclusions and availability are confirmed in your proposal for your dates and group size.</p>
            <div className="rt-dlg__foot">
              <p className="rt-pkg__price"><span>Pricing</span> Request a Quote</p>
              <div className="rt-dlg__actions">
                <button type="button" className="btn btn--ghost" onClick={close}>Close</button>
                <button type="button" className="btn btn--primary" onClick={() => onEnquire(pkg.id)}>Enquire Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function CorporateRetreats() {
  const [pick, setPick] = useState(null);
  const [explore, setExplore] = useState(null);
  const formRef = useRef(null);

  const toForm = useCallback((ev, cta) => {
    if (ev) ev.preventDefault();
    if (cta) track("cta_click", { cta, page_path: currentPath() });
    const target = document.getElementById("enquiry-form");
    if (!target) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (formRef.current) formRef.current.focusStart();
  }, []);

  const choosePackage = (id) => {
    setExplore(null);
    setPick((p) => ({ id, n: p ? p.n + 1 : 1 }));
    toForm(null, "retreat_package_" + id);
  };

  return (
    <div className="rt">
      {/* 1. Hero image, with the page heading set on a card below it */}
      <section className="rt-hero" aria-labelledby="rt-title">
        <div className="rt-hero__media">
          <Photo image={IMAGES.retreatAlpineLake} eager sizes="100vw" />
        </div>
        <div className="wrap">
          <div className="rt-hero__card">
            <Breadcrumbs items={[["Corporate retreats", "/corporate-retreats-workations"]]} />
            <Eyebrow>Corporate retreats &amp; workations</Eyebrow>
            <h1 id="rt-title">Corporate Retreats</h1>
            <p className="rt-hero__lede">Time away from the office helps teams reconnect, collaborate more openly, build stronger relationships and share experiences they will remember. We plan the destination, stay, activities and coordination around what your team needs.</p>
            <div className="rt-hero__cta">
              <Button variant="primary" href="#enquiry-form" onClick={(e) => toForm(e, "retreat_hero_cta")}>Plan Your Corporate Retreat</Button>
              <Button variant="text" href="#packages">View packages</Button>
            </div>
            <ul className="rt-formats" aria-label="Retreat formats we plan">
              {FORMATS.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="rt-sec" aria-labelledby="rt-intro-title">
        <Reveal className="wrap rt-intro">
          <div className="rt-intro__text">
            <Eyebrow>Why teams go away together</Eyebrow>
            <h2 id="rt-intro-title">Bring Your Team Together Beyond the Workplace</h2>
            <p className="rt-lede">A good retreat balances rest with purpose: time to relax, activities that bring people closer, focused sessions for planning, and a destination that makes it all memorable.</p>
            <ul className="rt-points">
              {INTRO_POINTS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
            </ul>
          </div>
          <div className="rt-intro__media">
            <Photo image={IMAGES.retreatWorkation} className="rt-intro__a" sizes="(max-width: 980px) 70vw, 420px" />
            <Photo image={IMAGES.retreatHighPlateau} className="rt-intro__b" sizes="(max-width: 980px) 50vw, 300px" />
          </div>
        </Reveal>
      </section>

      {/* 3. Enquiry form + FAQ */}
      <section className="rt-sec rt-sec--white" id="enquiry" aria-label="Enquiry and frequently asked questions">
        <div className="wrap rt-ask">
          <div className="rt-ask__form" id="enquiry-form">
            <h2 id="rt-form-title">Let&rsquo;s Plan Your Corporate Retreat</h2>
            <p className="rt-ask__intro">Tell us about your team and your goals. We&rsquo;ll help you plan a retreat that fits your requirements.</p>
            <RetreatEnquiryForm ref={formRef} pick={pick} />
          </div>
          <div className="rt-faq" id="faq">
            <h2 id="rt-faq-title">Corporate Retreat FAQs</h2>
            <FaqCards items={RETREAT_FAQS} />
            <p className="rt-faq__more">Have more questions? Tell us about your retreat, and we&rsquo;ll help you explore the options.</p>
          </div>
        </div>
      </section>

      {/* 4. Packages */}
      <section className="rt-sec" id="packages" aria-labelledby="rt-pkg-title">
        <div className="wrap">
          <Reveal className="rt-head">
            <Eyebrow>Corporate retreat packages</Eyebrow>
            <h2 id="rt-pkg-title">Explore Our Corporate Retreat Packages</h2>
            <p className="rt-lede">Discover thoughtfully planned corporate retreats that bring teams together through inspiring destinations, meaningful activities, and memorable shared experiences.</p>
          </Reveal>
          <Reveal className="rt-pkgs">
            {PACKAGES.map((p) => (
              <article className="rt-pkg" key={p.id} aria-labelledby={"pkg-" + p.id}>
                <div className="rt-pkg__media">
                  <Photo image={p.image} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 40vw, 400px" />
                  <span className="rt-pkg__tag">{p.tag}</span>
                </div>
                <div className="rt-pkg__body">
                  <h3 id={"pkg-" + p.id}>{p.name}</h3>
                  <p>{p.text}</p>
                  <ul className="checklist rt-pkg__list" aria-label={`${p.name} highlights`}>{p.highlights.map((x) => <li key={x}>{x}</li>)}</ul>
                  <div className="rt-pkg__foot">
                    <p className="rt-pkg__price"><span>Pricing</span> Request a Quote</p>
                    <div className="rt-pkg__actions">
                      <button type="button" className="btn btn--ghost" onClick={() => { setExplore(p); track("cta_click", { cta: "retreat_explore_" + p.id, page_path: currentPath() }); }} aria-haspopup="dialog" aria-describedby={"pkg-" + p.id}>
                        Explore Package
                      </button>
                      <button type="button" className="btn btn--primary" onClick={() => choosePackage(p.id)} aria-describedby={"pkg-" + p.id}>
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </Reveal>
          <p className="rt-note">Packages are starting points. Inclusions, availability and pricing are confirmed in your proposal, and anything can be adjusted or built as a custom package.</p>
        </div>
        <PackageDialog pkg={explore} onClose={() => setExplore(null)} onEnquire={choosePackage} />
      </section>

      {/* 5. Why choose us */}
      <section className="rt-sec rt-sec--tint" aria-labelledby="rt-why-title">
        <div className="wrap">
          <Reveal className="rt-head">
            <Eyebrow>Why 360 Biz Health</Eyebrow>
            <h2 id="rt-why-title">Corporate Retreats Designed Around Your Team</h2>
          </Reveal>
          <Reveal as="ul" className="rt-why">
            {WHY.map((w) => (
              <li key={w.title}>
                <span className="rt-why__icon"><Icon name={w.icon} /></span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </li>
            ))}
          </Reveal>
          <p className="rt-note">Travel, accommodation and on-ground services are delivered with specialist travel and hospitality partners, coordinated by us as one plan. Read more about <Link to="/about">how we work</Link>.</p>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="rt-sec rt-sec--end" aria-labelledby="rt-cta-title">
        <div className="wrap">
          <Reveal className="rt-cta">
            <Photo image={IMAGES.retreatDesertArch} className="rt-cta__bg" alt="" sizes="(max-width: 1240px) 100vw, 1200px" />
            <div className="rt-cta__body">
              <h2 id="rt-cta-title">Ready to Plan Your Next Corporate Retreat?</h2>
              <p>Tell us what your team has in mind, and let&rsquo;s explore a retreat experience that suits your goals and requirements.</p>
              <Button variant="primary" href="#enquiry-form" onClick={(e) => toForm(e, "retreat_final_cta")}>Start Your Enquiry</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
