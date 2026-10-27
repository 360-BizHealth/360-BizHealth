import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import { ArticleView } from "../BlogArticle.jsx";
import { useAdmin, useCrumbs } from "./AdminApp.jsx";
import { PostStatus, Loading, ErrorCard } from "./ui.jsx";

/* The saved version of a post (draft or live), rendered with the public article layout. */
export default function BlogPreview() {
  const { id } = useParams();
  const { onAuthError } = useAdmin();
  const [row, setRow] = useState(null);
  const [error, setError] = useState("");
  useCrumbs([["Dashboard", "/admin"], ["Blog Management", "/admin/blog"], [row ? row.title : "Post", `/admin/blog/${id}`], ["Preview"]]);

  const load = useCallback(() => {
    setError("");
    api(`/api/v1/admin/posts/${encodeURIComponent(id)}`)
      .then((r) => setRow(r.post))
      .catch((err) => { onAuthError(err); setError(err.message); });
  }, [id, onAuthError]);
  useEffect(() => { load(); }, [load]);

  if (error) return <ErrorCard title="This post could not be previewed" error={error} onRetry={load} />;
  if (!row) return <Loading label="Loading preview…" />;

  const post = {
    slug: row.slug, title: row.title, excerpt: row.excerpt, category: row.category, author: row.author,
    publishedAt: row.published_at, readMinutes: row.read_minutes, imageUrl: row.image_url, imageAlt: row.image_alt,
    html: row.content_html, headings: row.headings || [], keyPoints: row.key_points || [], faqs: row.faqs || [],
  };
  return (
    <>
      <div className="pagehead">
        <div>
          <h1 className="adm__h1">Preview</h1>
          <p className="muted small editor__status"><PostStatus post={row} /> {row.status === "published" ? "This is the live version." : "Drafts are not visible on the public site."}</p>
        </div>
        <div className="pagehead__actions">
          <Link className="btn btn--ghost btn--sm" to={`/admin/blog/${row.id}`}>Back to editor</Link>
          {row.status === "published" && <a className="btn btn--ghost btn--sm" href={`/blog/${row.slug}`} target="_blank" rel="noopener noreferrer">Open public page<span className="sr-only"> (opens in a new tab)</span></a>}
        </div>
      </div>
      <div className="previewframe">
        <p className="previewframe__bar">Preview of the saved post as it appears at /blog/{row.slug}</p>
        <div className="previewframe__page"><ArticleView post={post} preview /></div>
      </div>
    </>
  );
}
