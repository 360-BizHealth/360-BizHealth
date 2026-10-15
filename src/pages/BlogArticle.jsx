import { relatedArticles, slugify } from "../data/blog.js";
import { canonicalUrl } from "../lib/seo.js";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FaqList from "../components/FaqList.jsx";
import CtaBand from "../components/CtaBand.jsx";
import Button from "../components/Button.jsx";
import { ArticleCard } from "./BlogIndex.jsx";

function SectionBody({ section }) {
  return (
    <>
      {section.paragraphs && section.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      {section.bullets && <ul>{section.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
      {section.numbered && <ol>{section.numbered.map((n, i) => <li key={i}>{n}</li>)}</ol>}
      {section.table && (
        <div className="table-wrap" role="region" aria-label={section.heading} tabIndex={0}>
          <table>
            <thead><tr>{section.table.headers.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
            <tbody>{section.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function BlogArticle({ article }) {
  const toc = article.sections.map((s) => ({ ...s, id: slugify(s.heading) }));
  const related = relatedArticles(article, 2);
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl("/blog/" + article.slug))}`;

  return (
    <>
      <section className="phead">
        <div className="wrap">
          <Breadcrumbs items={[["Blog", "/blog"], [article.title]]} />
          <span className="tag tag--ondark">{article.category}</span>
          <h1 style={{ marginTop: ".9rem", maxWidth: "26ch" }}>{article.title}</h1>
          <p className="lede">{article.description}</p>
          <div className="meta-row">
            <span>{article.author}</span>
            <span aria-hidden="true">·</span>
            <span>Published <time dateTime={article.datePublished}>{article.date}</time></span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
            <a className="btn btn--onink btn--sm" href={share} target="_blank" rel="noopener noreferrer">Share on LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </section>

      <div className="sec--tight">
        <div className="wrap article-layout">
          <nav aria-labelledby="toc-title">
            <details className="toc" open>
              <summary id="toc-title">Contents</summary>
              <ol>{toc.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>)}</ol>
            </details>
          </nav>

          <article className="prose-article" aria-label={article.title}>
            <div className="inshort">
              <h2>In short</h2>
              <ul className="checklist">{article.quickAnswer.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
            <img src={article.image.lg} srcSet={article.image.srcSet} sizes="(max-width: 980px) 92vw, 640px" width={article.image.w} height={article.image.h}
              alt={article.image.alt} style={{ borderRadius: 16, marginBottom: "2.2rem", width: "100%", maxHeight: 420, objectFit: "cover" }} decoding="async" />
            {toc.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={s.id + "-h"}>
                <h2 id={s.id + "-h"}>{s.heading}</h2>
                <SectionBody section={s} />
              </section>
            ))}

            {article.faqs && article.faqs.length > 0 && (
              <section id="faq" aria-labelledby="faq-h" style={{ marginTop: "2.6rem" }}>
                <h2 id="faq-h">Frequently asked questions</h2>
                <FaqList items={article.faqs} />
              </section>
            )}

            <div className="author">
              <img className="author__mark" src="/favicon.svg" width="52" height="52" alt="" />
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: "var(--deep)" }}>{article.author}</p>
                <p className="small muted" style={{ margin: ".2rem 0 0" }}>Our editorial team turns HR, payroll and compliance topics into practical guidance for business leaders. This article is general information, not legal or tax advice.</p>
              </div>
            </div>
          </article>

          <aside className="article-aside" aria-label="More from 360 Biz Health" style={{ display: "grid", gap: "1.4rem", alignContent: "start" }}>
            <div className="aside-cta">
              <h2>Need help putting this into practice?</h2>
              <p>Talk to our team about payroll, compliance and HR operations for your business.</p>
              <Button variant="primary" to="/contact" ev="blog_sidebar_cta" className="btn--block">Talk to an expert</Button>
            </div>
            {related.length > 0 && (
              <div>
                <h2 style={{ fontSize: "1.1rem" }}>Related articles</h2>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {related.map((r) => <ArticleCard key={r.slug} article={r} />)}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <CtaBand
        eyebrow="Better HR starts here"
        title="Give your team the clarity and support they need."
        text="Bring payroll, compliance and employee operations together with an experienced partner."
        waMsg="Hi 360 Biz Health, I read one of your guides and have a question."
      />
    </>
  );
}
