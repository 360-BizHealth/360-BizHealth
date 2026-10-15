import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ARTICLES, CATEGORIES } from "../data/blog.js";
import PageHead from "../components/PageHead.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import CtaBand from "../components/CtaBand.jsx";

export function ArticleCard({ article, headingLevel: H = "h3" }) {
  return (
    <article className="acard">
      <img className="acard__img" src={article.image.sm} width="640" height="360" alt="" loading="lazy" decoding="async" />
      <div className="acard__body">
        <span className="tag">{article.category}</span>
        <H><Link to={`/blog/${article.slug}`}>{article.title}</Link></H>
        <p>{article.description}</p>
        <div className="acard__meta">
          <time dateTime={article.datePublished}>{article.date}</time>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7.5" /><line x1="20.5" y1="20.5" x2="16.4" y2="16.4" />
  </svg>
);

/* Blog listing with search and category filters. Filters are mirrored in the URL
   (?q=, ?category=) so filtered views can be shared; the canonical URL stays /blog. */
export default function BlogIndex() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const category = CATEGORIES.includes(params.get("category")) ? params.get("category") : "";

  const update = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p, { replace: true });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      if (category && a.category !== category) return false;
      if (!q) return true;
      const hay = [a.title, a.description, a.category, ...a.quickAnswer, ...a.sections.map((s) => s.heading)].join(" ").toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [query, category]);

  const filtering = Boolean(query.trim() || category);
  const featured = !filtering ? ARTICLES[0] : null;
  const list = featured ? results.filter((a) => a !== featured) : results;

  return (
    <>
      <PageHead crumbs={[["Blog"]]} eyebrow="Blog & practical guides" title="Practical guides on HR, payroll and compliance"
        lede="Frameworks and operational notes on HRMS, payroll compliance, business setup and corporate offsites, written for the person who has to make the decision." />

      <Section tight>
        <div className="wrap">
          <form className="blog-tools" role="search" onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <label htmlFor="blog-q">Search guides</label>
              <div className="search">
                <SearchIcon />
                <input id="blog-q" type="search" className="input" placeholder="Search HR, payroll or compliance guides" value={query}
                  onChange={(e) => { setQuery(e.target.value); update({ q: e.target.value.trim() }); }} />
              </div>
            </div>
            <div className="filters" role="group" aria-label="Filter by category">
              <button type="button" className="filter" aria-pressed={!category ? "true" : "false"} onClick={() => update({ category: "" })}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c} type="button" className="filter" aria-pressed={category === c ? "true" : "false"} onClick={() => update({ category: c })}>{c}</button>
              ))}
            </div>
          </form>
          <p className="sr-only" role="status" aria-live="polite">{filtering ? `${results.length} ${results.length === 1 ? "guide" : "guides"} found` : ""}</p>

          {featured && (
            <article className="feature" style={{ marginTop: "2rem" }}>
              <img src={featured.image.lg} srcSet={featured.image.srcSet} sizes="(max-width: 980px) 92vw, 640px" width={featured.image.w} height={featured.image.h} alt="" fetchpriority="high" decoding="async" />
              <div className="feature__body">
                <span className="tag">Featured · {featured.category}</span>
                <h2><Link to={`/blog/${featured.slug}`}>{featured.title}</Link></h2>
                <p className="muted" style={{ margin: 0 }}>{featured.description}</p>
                <p className="small muted" style={{ margin: 0 }}>
                  {featured.author} · <time dateTime={featured.datePublished}>{featured.date}</time> · {featured.readTime}
                </p>
              </div>
            </article>
          )}

          <div style={{ marginTop: "2.4rem" }}>
            <Eyebrow>{filtering ? "Results" : "Latest guides"}</Eyebrow>
            {list.length ? (
              <div className="grid g3" style={{ marginTop: "1rem" }}>
                {list.map((a) => <ArticleCard key={a.slug} article={a} headingLevel={featured ? "h3" : "h2"} />)}
              </div>
            ) : (
              <div className="card card--flat" style={{ marginTop: "1rem" }}>
                <h2 style={{ fontSize: "1.15rem" }}>No guides match that search</h2>
                <p className="muted">Try a broader term, or clear the filters.</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setQuery(""); setParams(new URLSearchParams(), { replace: true }); }}>Clear search and filters</button>
              </div>
            )}
          </div>
        </div>
      </Section>

      <CtaBand
        title="Have a question these guides don't answer?"
        text="Tell us what you are working through. If it is something we handle, we will explain how we would approach it."
        waMsg="Hi 360 Biz Health, I have a question after reading your blog."
      />
    </>
  );
}
