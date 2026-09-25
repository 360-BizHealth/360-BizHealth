import Breadcrumbs from "./Breadcrumbs.jsx";

/* Dark page header used by every inner page. Pass `crumbs` to show breadcrumbs,
   and CTA buttons as children. */
export default function PageHead({ crumbs, title, lede, children }) {
  return (
    <section className="phead">
      {crumbs && (
        <div className="wrap" style={{ padding: 0 }}>
          <Breadcrumbs items={crumbs} />
        </div>
      )}
      <div className="wrap">
        <h1>{title}</h1>
        {lede && <p className="lede" style={{ color: "rgba(255,255,255,.85)" }}>{lede}</p>}
        {children && <div className="phead__cta">{children}</div>}
      </div>
    </section>
  );
}
