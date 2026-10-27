import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import { canonicalUrl, applyHead, buildHead } from "../lib/seo.js";
import { useInitialData, articleMeta, displayDate, isoDay, readTime } from "../lib/blog.js";
import { track } from "../lib/analytics.js";
import { NOT_FOUND_META, NOT_FOUND_ELEMENT } from "../routes.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FaqList from "../components/FaqList.jsx";
import CtaBand from "../components/CtaBand.jsx";
import Button from "../components/Button.jsx";
import { ArticleCard } from "./BlogIndex.jsx";

/*
 * The article layout. `post.html` is produced by the server from the editor's
 * Markdown (shared/markdown.js), which escapes all raw HTML and allows only safe
 * links and same-site images, so it can be inserted as-is. Also used by the
 * admin preview with an unsaved draft.
 */
export function ArticleView({ post, related = [], preview = false }) {
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl("/blog/" + post.slug))}`;
  const toc = post.headings || [];
  return (
    <>
      <section className="phead">
        <div className="wrap">
          <Breadcrumbs items={[["Blog", "/blog"], [post.title]]} />
          <span className="tag tag--ondark">{post.category}</span>
          <h1 style={{ marginTop: ".9rem", maxWidth: "26ch" }}>{post.title}</h1>
          <p className="lede">{post.excerpt}</p>
          <div className="meta-row">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <span>{post.publishedAt ? <>Published <time dateTime={isoDay(post.publishedAt)}>{displayDate(post.publishedAt)}</time></> : "Not yet published"}</span>
            <span aria-hidden="true">·</span>
            <span>{readTime(post.readMinutes)}</span>
            {!preview && <a className="btn btn--onink btn--sm" href={share} target="_blank" rel="noopener noreferrer">Share on LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>}
          </div>
        </div>
      </section>

      <div className="sec--tight">
        <div className="wrap article-layout">
          <nav aria-labelledby="toc-title">
            {toc.length > 0 && (
              <details className="toc" open>
                <summary id="toc-title">Contents</summary>
                <ol>{toc.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.text}</a></li>)}</ol>
              </details>
            )}
          </nav>

          <article className="prose-article" aria-label={post.title}>
            {post.keyPoints && post.keyPoints.length > 0 && (
              <div className="inshort">
                <h2>In short</h2>
                <ul className="checklist">{post.keyPoints.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
            )}
            {post.imageUrl && (
              <img src={post.imageUrl} width="1024" height="640" alt={post.imageAlt || ""}
                style={{ borderRadius: 16, marginBottom: "2.2rem", width: "100%", maxHeight: 420, objectFit: "cover" }} decoding="async" />
            )}
            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.faqs && post.faqs.length > 0 && (
              <section id="faq" aria-labelledby="faq-h" style={{ marginTop: "2.6rem" }}>
                <h2 id="faq-h">Frequently asked questions</h2>
                <FaqList items={post.faqs} />
              </section>
            )}

            <div className="author">
              <img className="author__mark" src="/favicon.svg" width="52" height="52" alt="" />
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: "var(--deep)" }}>{post.author}</p>
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

      {!preview && (
        <CtaBand
          eyebrow="Better HR starts here"
          title="Give your team the clarity and support they need."
          text="Bring payroll, compliance and employee operations together with an experienced partner."
          waMsg="Hi 360 Biz Health, I read one of your guides and have a question."
        />
      )}
    </>
  );
}

/* Route /blog/:slug. First view uses server-rendered data; later navigations fetch. */
export default function BlogArticleRoute() {
  const { slug } = useParams();
  const initial = useInitialData("/blog/" + slug);
  const fromInitial = (d) => (d.unavailable ? { status: "error" } : d.notFound ? { status: "notfound" } : { status: "ready", post: d.post, related: d.related || [] });
  const [state, setState] = useState(() => (initial ? fromInitial(initial) : { status: "loading" }));

  const load = () => {
    setState({ status: "loading" });
    api("/api/v1/posts/" + encodeURIComponent(slug))
      .then((r) => setState({ status: "ready", post: r.post, related: r.related || [] }))
      .catch((err) => setState({ status: err.status === 404 ? "notfound" : "error" }));
  };

  useEffect(() => {
    if (initial && initial.path === "/blog/" + slug) setState(fromInitial(initial));
    else load();
    track("page_view", { page_path: "/blog/" + slug });
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state.status === "ready") applyHead(buildHead(articleMeta(state.post)));
    else if (state.status === "notfound") applyHead(buildHead(NOT_FOUND_META));
  }, [state]);

  if (state.status === "ready") return <ArticleView post={state.post} related={state.related} />;
  if (state.status === "notfound") return NOT_FOUND_ELEMENT;
  if (state.status === "error") {
    return (
      <section className="sec">
        <div className="wrap" role="alert">
          <h1>This article could not be loaded</h1>
          <p className="muted">Please check your connection and try again.</p>
          <button type="button" className="btn btn--ghost" onClick={load}>Try again</button>
        </div>
      </section>
    );
  }
  return <section className="sec"><div className="wrap"><p className="muted" role="status"><span className="spinner" aria-hidden="true" /> Loading article…</p></div></section>;
}
