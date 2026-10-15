import Breadcrumbs from "./Breadcrumbs.jsx";

/* Green page header used by inner pages: breadcrumbs, H1, lede, optional CTAs.
   The sage ring and orange dot echo the logo mark. */
export default function PageHead({ crumbs, title, lede, eyebrow, children, plain = false }) {
  return (
    <section className={"phead" + (plain ? " phead--plain" : "")}>
      <div className="wrap">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow ? <p className="eyebrow eyebrow--ondark">{eyebrow}</p> : <div className="phead__rule" aria-hidden="true" />}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children && <div className="phead__cta">{children}</div>}
      </div>
    </section>
  );
}
