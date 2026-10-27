import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAdmin, useCrumbs } from "./AdminApp.jsx";
import Icon from "./Icon.jsx";
import { PostStatus, fmtDate, Msg } from "./ui.jsx";

const KEYS = ["q", "status", "category", "sort", "page"];

/* Confirmation dialog built on <dialog> (native focus trapping and Escape). */
export function ConfirmDialog({ open, title, body, confirmLabel, danger, busy, onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="dlg" aria-labelledby="dlg-t" onCancel={(e) => { e.preventDefault(); onCancel(); }}>
      <h2 id="dlg-t" className="adm__h2">{title}</h2>
      <p>{body}</p>
      <div className="dlg__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="button" className={"btn btn--sm " + (danger ? "btn--danger" : "btn--green")} onClick={onConfirm} disabled={busy} aria-busy={busy ? "true" : "false"}>
          {busy ? "Working…" : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

export default function BlogList() {
  const { user, onAuthError } = useAdmin();
  useCrumbs([["Dashboard", "/admin"], ["Blog Management"]]);
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => Object.fromEntries(KEYS.map((k) => [k, params.get(k) || ""])), [params]);
  const [q, setQ] = useState(filters.q);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ kind: "", text: "" });
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const isAdmin = user.role === "admin";

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && p.set(k, v));
    return p.toString();
  }, [filters]);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api("/api/v1/admin/posts?" + qs)
      .then(setData)
      .catch((err) => { onAuthError(err); setError(err.message); })
      .finally(() => setLoading(false));
  }, [qs, onAuthError]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setQ(filters.q); }, [filters.q]);

  const set = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    if (!("page" in next)) p.delete("page");
    setParams(p);
  };

  const run = async () => {
    const { kind, post } = confirm;
    setBusy(true);
    try {
      if (kind === "delete") {
        await api(`/api/v1/admin/posts/${post.id}`, { method: "DELETE" });
        setMsg({ kind: "ok", text: `"${post.title}" was deleted.` });
      } else {
        const status = kind === "publish" ? "published" : "draft";
        await api(`/api/v1/admin/posts/${post.id}/status`, { method: "POST", body: { status } });
        setMsg({ kind: "ok", text: kind === "publish" ? `"${post.title}" is now live on the blog.` : `"${post.title}" was unpublished and removed from the public blog.` });
      }
      setConfirm(null);
      load();
    } catch (err) {
      onAuthError(err);
      setMsg({ kind: "error", text: err.message });
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  };

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const filtered = Boolean(filters.q || filters.status || filters.category);

  return (
    <>
      <div className="pagehead">
        <div>
          <h1 className="adm__h1">Blog Management</h1>
          <p className="muted">Published posts appear on the public <a href="/blog" target="_blank" rel="noopener noreferrer">blog<span className="sr-only"> (opens in a new tab)</span></a> straight away. Drafts are visible only here.</p>
        </div>
        <div className="pagehead__actions">
          <Link className="btn btn--primary" to="/admin/blog/new"><Icon name="plus" size={18} /> Add New Blog</Link>
        </div>
      </div>

      {data && (
        <div className="tabs" role="group" aria-label="Filter by status">
          {[["", "All", (data.counts.draft || 0) + (data.counts.published || 0)], ["published", "Published", data.counts.published || 0], ["draft", "Drafts", data.counts.draft || 0]].map(([v, l, n]) => (
            <button key={l} type="button" className="tabs__btn" aria-pressed={filters.status === v ? "true" : "false"} onClick={() => set({ status: v })}>{l} <span className="tabs__n">{n}</span></button>
          ))}
        </div>
      )}

      <form className="panel-card blogfilters" role="search" aria-label="Search posts" onSubmit={(e) => { e.preventDefault(); set({ q: q.trim() }); }}>
        <div className="field">
          <label htmlFor="b-q">Search</label>
          <input id="b-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, slug, excerpt or author" />
        </div>
        <div className="field">
          <label htmlFor="b-cat">Category</label>
          <select id="b-cat" value={filters.category} onChange={(e) => set({ category: e.target.value })}>
            <option value="">All categories</option>
            {(data ? data.categories : []).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="b-sort">Sort</label>
          <select id="b-sort" value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
            <option value="">Last updated</option><option value="created">Created</option><option value="published">Published date</option><option value="title">Title A to Z</option>
          </select>
        </div>
        <div className="blogfilters__go"><button className="btn btn--green btn--sm" type="submit">Search</button></div>
      </form>

      <Msg msg={msg} style={{ marginTop: "1rem" }} />
      {error && <div className="alert alert--error" role="alert">{error} <button type="button" className="btn btn--ghost btn--sm" onClick={load}>Try again</button></div>}
      {!data && loading && <p className="adm__loading"><span className="spinner" aria-hidden="true" /> Loading posts…</p>}

      {data && (data.items.length === 0 ? (
        <div className="panel-card empty">
          <h2 className="adm__h2">{filtered ? "No posts match" : "No posts yet"}</h2>
          <p className="muted">{filtered ? "Try a different search or clear the filters." : "Write the first article and publish it to the public blog."}</p>
          {filtered ? <button type="button" className="btn btn--ghost btn--sm" onClick={() => setParams(new URLSearchParams())}>Clear filters</button>
            : <Link className="btn btn--primary btn--sm" to="/admin/blog/new">Add New Blog</Link>}
        </div>
      ) : (
        <div className="ltable-wrap">
          <table className="ltable btable">
            <caption className="sr-only">Blog posts, page {data.page} of {pages}</caption>
            <thead>
              <tr><th scope="col"><span className="sr-only">Image</span></th><th scope="col">Title</th><th scope="col">Category</th><th scope="col">Author</th><th scope="col">Status</th><th scope="col">Dates</th><th scope="col"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p.id}>
                  <td data-label="Image" className="btable__thumb">{p.image_url ? <img src={p.image_url} alt="" width="72" height="48" loading="lazy" /> : <span className="thumb-empty" aria-hidden="true"><Icon name="image" /></span>}</td>
                  <td data-label="Title"><div><Link to={`/admin/blog/${p.id}`} className="ltable__name">{p.title}</Link><div className="muted small">/blog/{p.slug}</div></div></td>
                  <td data-label="Category">{p.category}</td>
                  <td data-label="Author">{p.author}</td>
                  <td data-label="Status"><PostStatus post={p} /></td>
                  <td data-label="Dates">
                    <dl className="dates">
                      <dt>Created</dt><dd>{fmtDate(p.created_at)}</dd>
                      <dt>Published</dt><dd>{p.published_at ? fmtDate(p.published_at) : "—"}</dd>
                      <dt>Updated</dt><dd>{fmtDate(p.updated_at)}</dd>
                    </dl>
                  </td>
                  <td data-label="Actions">
                    <div className="rowactions">
                      <Link className="iconbtn" to={`/admin/blog/${p.id}`} title="Edit" aria-label={`Edit ${p.title}`}><Icon name="edit" size={18} /></Link>
                      <Link className="iconbtn" to={`/admin/blog/${p.id}/preview`} title="Preview" aria-label={`Preview ${p.title}`}><Icon name="eye" size={18} /></Link>
                      {isAdmin && (p.status === "published"
                        ? <button type="button" className="btn btn--ghost btn--xs" onClick={() => setConfirm({ kind: "unpublish", post: p })}>Unpublish</button>
                        : <button type="button" className="btn btn--green btn--xs" onClick={() => setConfirm({ kind: "publish", post: p })}>Publish</button>)}
                      {isAdmin && <button type="button" className="iconbtn iconbtn--danger" title="Delete" aria-label={`Delete ${p.title}`} onClick={() => setConfirm({ kind: "delete", post: p })}><Icon name="trash" size={18} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {data && pages > 1 && (
        <nav className="pager" aria-label="Pagination">
          <button type="button" className="btn btn--ghost btn--sm" disabled={data.page <= 1} onClick={() => set({ page: String(data.page - 1) })}>Previous</button>
          <span>Page {data.page} of {pages}</span>
          <button type="button" className="btn btn--ghost btn--sm" disabled={data.page >= pages} onClick={() => set({ page: String(data.page + 1) })}>Next</button>
        </nav>
      )}
      {!isAdmin && <p className="muted small" style={{ marginTop: "1rem" }}>Staff accounts can write and edit drafts. An administrator publishes, unpublishes and deletes posts.</p>}

      <ConfirmDialog
        open={Boolean(confirm)}
        busy={busy}
        danger={confirm && confirm.kind !== "publish"}
        title={confirm ? (confirm.kind === "delete" ? "Delete this post?" : confirm.kind === "publish" ? "Publish this post?" : "Unpublish this post?") : ""}
        body={confirm ? (confirm.kind === "delete"
          ? `"${confirm.post.title}" will be permanently deleted and its URL will stop working. This cannot be undone.`
          : confirm.kind === "publish" ? `"${confirm.post.title}" will appear on the public blog at /blog/${confirm.post.slug}.`
          : `"${confirm.post.title}" will be removed from the public blog. Visitors to /blog/${confirm.post.slug} will see a "page not found" message. You can publish it again later.`) : ""}
        confirmLabel={confirm ? (confirm.kind === "delete" ? "Delete post" : confirm.kind === "publish" ? "Publish" : "Unpublish") : ""}
        onConfirm={run}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
