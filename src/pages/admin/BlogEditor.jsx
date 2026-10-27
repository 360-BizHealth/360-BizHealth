import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import { renderMarkdown, readMinutes } from "../../../shared/markdown.js";
import { validatePost, slugFromTitle, DEFAULT_AUTHOR, SUGGESTED_CATEGORIES, LIMITS } from "../../../shared/blog.js";
import { ArticleView } from "../BlogArticle.jsx";
import { useAdmin, useCrumbs } from "./AdminApp.jsx";
import { ConfirmDialog } from "./BlogList.jsx";
import Icon from "./Icon.jsx";
import { PostStatus, Msg, Loading, ErrorCard, fmtDateTime } from "./ui.jsx";

const EMPTY = {
  title: "", slug: "", excerpt: "", content: "", category: "", author: DEFAULT_AUTHOR,
  imageUrl: "", imageAlt: "", seoTitle: "", seoDescription: "", publishedAt: "", keyPoints: "", faqs: [],
};
const MAX_UPLOAD = 2 * 1024 * 1024;
const istDay = (iso) => (iso ? new Date(new Date(iso).getTime() + 5.5 * 3600e3).toISOString().slice(0, 10) : "");

function normalizeFaq(f) {
  if (Array.isArray(f)) return { q: String(f[0] || ""), a: String(f[1] || "") };
  if (f && typeof f === "object") {
    const q = f.q !== undefined ? f.q : f.question !== undefined ? f.question : f.title || "";
    const a = f.a !== undefined ? f.a : f.answer !== undefined ? f.answer : Array.isArray(f.body) ? f.body.join("\n\n") : f.body || "";
    return { q: String(q || ""), a: String(a || "") };
  }
  return { q: "", a: "" };
}

function fromRow(r) {
  return {
    title: r.title || "", slug: r.slug || "", excerpt: r.excerpt || "", content: r.content_md || "", category: r.category || "", author: r.author || DEFAULT_AUTHOR,
    imageUrl: r.image_url || "", imageAlt: r.image_alt || "", seoTitle: r.seo_title || "", seoDescription: r.seo_description || "",
    publishedAt: istDay(r.published_at),
    keyPoints: (Array.isArray(r.key_points) ? r.key_points : []).join("\n"),
    faqs: (Array.isArray(r.faqs) ? r.faqs : []).map(normalizeFaq),
  };
}
const toPayload = (f) => ({ ...f, keyPoints: f.keyPoints.split("\n").map((s) => s.trim()).filter(Boolean), faqs: f.faqs.map(({ q, a }) => [q, a]) });

/* Uploads raw image bytes; the server checks the real file type and size. */
export async function uploadImage(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPEG, PNG or WebP image.");
  if (file.size > MAX_UPLOAD) throw new Error("Images must be 2 MB or smaller. Export a smaller version and try again.");
  let res;
  try {
    res = await fetch("/api/v1/admin/media", {
      method: "POST",
      headers: { "Content-Type": file.type, "X-File-Name": encodeURIComponent(file.name), "X-BH-CSRF": "1", Accept: "application/json" },
      body: file,
      credentials: "same-origin",
    });
  } catch {
    throw new Error("The upload did not reach the server. Check your connection and try again.");
  }
  let data = null;
  try { data = await res.json(); } catch { /* handled below */ }
  if (!res.ok || !data || !data.ok) {
    const e = new Error((data && data.error && data.error.message) || "The image could not be uploaded.");
    e.status = res.status;
    throw e;
  }
  return data.media;
}

function Counter({ value, max }) {
  const n = value.length;
  return <span className={"counter" + (n > max ? " counter--over" : "")} aria-hidden="true">{n}/{max}</span>;
}

function Field({ id, label, error, hint, children, optional, counter }) {
  return (
    <div className="field" data-invalid={error ? "true" : "false"}>
      <div className="field__top">
        <label htmlFor={id}>{label}{optional && <span className="opt"> (optional)</span>}</label>
        {counter}
      </div>
      {children}
      {hint && <p className="hint" id={id + "-hint"}>{hint}</p>}
      <p className="err" id={id + "-err"} aria-live="polite">{error || ""}</p>
    </div>
  );
}

const TOOLS = [
  { label: "Heading", icon: "H2", wrap: ["\n## ", ""], line: true },
  { label: "Subheading", icon: "H3", wrap: ["\n### ", ""], line: true },
  { label: "Bold", icon: "B", wrap: ["**", "**"] },
  { label: "Italic", icon: "I", wrap: ["_", "_"] },
  { label: "Link", icon: "Link", wrap: ["[", "](https://)"] },
  { label: "Bulleted list", icon: "• List", wrap: ["\n- ", ""], line: true },
  { label: "Numbered list", icon: "1. List", wrap: ["\n1. ", ""], line: true },
  { label: "Quote", icon: "❝", wrap: ["\n> ", ""], line: true },
];

export default function BlogEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { user, onAuthError } = useAdmin();
  const isAdmin = user.role === "admin";
  const [row, setRow] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(JSON.stringify(EMPTY));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [loadErr, setLoadErr] = useState("");
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ kind: "", text: "" });
  const [busy, setBusy] = useState("");
  const [tab, setTab] = useState("edit");
  const [contentTab, setContentTab] = useState("write");
  const [upload, setUpload] = useState({ busy: false, error: "" });
  const [confirm, setConfirm] = useState(null);
  const contentRef = useRef(null);
  const alertRef = useRef(null);
  useCrumbs([["Dashboard", "/admin"], ["Blog Management", "/admin/blog"], [isNew ? "New post" : form.title || "Edit post"]]);

  const load = useCallback(async () => {
    if (isNew) return;
    setLoadErr("");
    try {
      const r = await api(`/api/v1/admin/posts/${encodeURIComponent(id)}`);
      const f = fromRow(r.post);
      setRow(r.post); setForm(f); setSaved(JSON.stringify(f));
    } catch (err) {
      onAuthError(err);
      setLoadErr(err.message);
    }
  }, [id, isNew, onAuthError]);
  useEffect(() => { load(); }, [load]);

  const dirty = JSON.stringify(form) !== saved;
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "title" && !slugTouched) next.slug = slugFromTitle(v);
      return next;
    });
    if (errors[k]) setErrors((x) => ({ ...x, [k]: "" }));
  };

  const applyTool = (t) => {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b, value } = el;
    const sel = value.slice(a, b) || (t.line ? "" : t.label.toLowerCase());
    const before = t.line && (a === 0 || value[a - 1] === "\n") ? t.wrap[0].replace(/^\n/, "") : t.wrap[0];
    const next = value.slice(0, a) + before + sel + t.wrap[1] + value.slice(b);
    setForm((f) => ({ ...f, content: next }));
    requestAnimationFrame(() => { el.focus(); const pos = a + before.length; el.setSelectionRange(pos, pos + sel.length); });
  };

  const onUpload = async (file, target) => {
    if (!file) return;
    setUpload({ busy: true, error: "" });
    try {
      const media = await uploadImage(file);
      if (target === "featured") {
        setForm((f) => ({ ...f, imageUrl: media.url, imageAlt: f.imageAlt || "" }));
        setErrors((x) => ({ ...x, imageUrl: "" }));
      } else {
        const el = contentRef.current;
        const pos = el ? el.selectionStart : form.content.length;
        const snippet = `\n![Describe the image](${media.url})\n`;
        setForm((f) => ({ ...f, content: f.content.slice(0, pos) + snippet + f.content.slice(pos) }));
      }
      setUpload({ busy: false, error: "" });
    } catch (err) {
      if (err.status === 401) onAuthError(err);
      setUpload({ busy: false, error: err.message });
    }
  };

  const focusFirstError = () => requestAnimationFrame(() => {
    const bad = document.querySelector('.editor [data-invalid="true"] input, .editor [data-invalid="true"] textarea, .editor [data-invalid="true"] select');
    if (bad) { setTab("edit"); bad.focus(); }
  });

  /* mode: "draft" (save, keep status) | "publish" | "update" (published post) */
  const save = async (mode) => {
    const payload = toPayload(form);
    const check = validatePost(payload);
    setErrors(check.errors);
    if (!check.ok) {
      setMsg({ kind: "error", text: "Some fields need attention before this can be saved." });
      focusFirstError();
      return;
    }
    setBusy(mode);
    setMsg({ kind: "", text: mode === "publish" ? "Publishing…" : "Saving…" });
    try {
      const publish = mode === "publish";
      const r = isNew
        ? await api("/api/v1/admin/posts", { method: "POST", body: { post: payload, publish } })
        : await api(`/api/v1/admin/posts/${row.id}`, { method: "PUT", body: { post: payload, publish, expectedUpdatedAt: row.updated_at } });
      const f = fromRow(r.post);
      setRow(r.post); setForm(f); setSaved(JSON.stringify(f)); setSlugTouched(true);
      const live = r.post.status === "published";
      setMsg({ kind: "ok", text: publish ? "Published. The post is now live on the public blog." : live ? "Changes saved and live on the public blog." : "Draft saved. It is not visible on the public site." });
      if (isNew) navigate(`/admin/blog/${r.post.id}`, { replace: true });
    } catch (err) {
      onAuthError(err);
      if (err.fields) { setErrors((x) => ({ ...x, ...err.fields })); focusFirstError(); }
      setMsg({ kind: "error", text: err.message });
      requestAnimationFrame(() => alertRef.current && alertRef.current.focus());
    } finally {
      setBusy("");
    }
  };

  const runConfirm = async () => {
    const kind = confirm;
    setBusy(kind);
    try {
      if (kind === "delete") {
        await api(`/api/v1/admin/posts/${row.id}`, { method: "DELETE" });
        setSaved(JSON.stringify(form));
        navigate("/admin/blog", { replace: true });
        return;
      }
      const r = await api(`/api/v1/admin/posts/${row.id}/status`, { method: "POST", body: { status: "draft" } });
      setRow(r.post);
      setMsg({ kind: "ok", text: "Unpublished. The post is no longer on the public blog." });
    } catch (err) {
      onAuthError(err);
      setMsg({ kind: "error", text: err.message });
    } finally {
      setBusy("");
      setConfirm(null);
    }
  };

  const preview = useMemo(() => {
    if (tab !== "preview" && contentTab !== "preview") return null;
    const { html, headings } = renderMarkdown(form.content);
    return {
      slug: form.slug || "draft", title: form.title || "Untitled post", excerpt: form.excerpt, category: form.category || "Uncategorised",
      author: form.author, publishedAt: form.publishedAt ? form.publishedAt + "T00:00:00+05:30" : row && row.published_at,
      readMinutes: readMinutes(form.content), imageUrl: form.imageUrl, imageAlt: form.imageAlt, html, headings,
      keyPoints: form.keyPoints.split("\n").map((s) => s.trim()).filter(Boolean), faqs: form.faqs.filter((f) => f.q && f.a).map(({ q, a }) => [q, a]),
    };
  }, [tab, contentTab, form, row]);

  if (loadErr) return <ErrorCard title="This post could not be opened" error={loadErr} onRetry={load} />;
  if (!isNew && !row) return <Loading label="Loading post…" />;

  const live = row && row.status === "published";
  const lockedForStaff = live && !isAdmin;
  const err = (k) => errors[k];
  const describedBy = (idv, hint) => (hint ? `${idv}-err ${idv}-hint` : `${idv}-err`);

  return (
    <div className="editor">
      <div className="pagehead">
        <div>
          <p className="muted small" style={{ margin: 0 }}><Link to="/admin/blog" className="link link--back">All posts</Link></p>
          <h1 className="adm__h1">{isNew ? "New blog post" : "Edit blog post"}</h1>
          <p className="muted small editor__status">
            {row ? <><PostStatus post={row} /> Last saved {fmtDateTime(row.updated_at)}{row.updated_by_email ? ` by ${row.updated_by_email}` : ""}</> : "Not saved yet"}
            {dirty && <span className="unsaved"> · Unsaved changes</span>}
          </p>
        </div>
        <div className="pagehead__actions">
          <div className="seg" role="group" aria-label="Editor view">
            <button type="button" aria-pressed={tab === "edit" ? "true" : "false"} onClick={() => setTab("edit")}><Icon name="edit" size={16} /> Edit</button>
            <button type="button" aria-pressed={tab === "preview" ? "true" : "false"} onClick={() => setTab("preview")}><Icon name="eye" size={16} /> Preview article</button>
          </div>
          {live && <a className="btn btn--ghost btn--sm" href={`/blog/${row.slug}`} target="_blank" rel="noopener noreferrer">View live<span className="sr-only"> (opens in a new tab)</span></a>}
        </div>
      </div>

      <Msg msg={msg} tabIndex={-1} ref={alertRef} />
      {lockedForStaff && <div className="alert alert--ok" role="status">This post is live. Only an administrator can change it.</div>}

      {tab === "preview" && preview && (
        <div className="previewframe" aria-label="Article preview">
          <p className="previewframe__bar">Preview of {dirty ? "unsaved changes" : "the saved post"}. This is how the article will look on the public blog.</p>
          <div className="previewframe__page"><ArticleView post={preview} preview /></div>
        </div>
      )}

      <form className={"editor__grid" + (tab === "preview" ? " is-hidden" : "")} onSubmit={(e) => { e.preventDefault(); save(live ? "update" : "draft"); }} noValidate>
        <div className="editor__main">
          <section className="panel-card">
            <Field id="p-title" label="Title" error={err("title")} counter={<Counter value={form.title} max={LIMITS.title[1]} />}>
              <input id="p-title" value={form.title} onChange={set("title")} maxLength={200} required aria-invalid={err("title") ? "true" : "false"} aria-describedby={describedBy("p-title")} className="input--lg" placeholder="A clear, specific headline" />
            </Field>
            <Field id="p-slug" label="URL slug" error={err("slug")} hint={`The article will live at /blog/${form.slug || "your-slug"}${live ? ". Changing it changes the public URL." : ""}`}>
              <div className="prefix"><span aria-hidden="true">/blog/</span>
                <input id="p-slug" value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug")(e); }} maxLength={120} aria-invalid={err("slug") ? "true" : "false"} aria-describedby={describedBy("p-slug", true)} />
              </div>
            </Field>
            <Field id="p-excerpt" label="Short excerpt" error={err("excerpt")} hint="Shown on the blog listing and used as the meta description unless you set one below." counter={<Counter value={form.excerpt} max={LIMITS.excerpt[1]} />}>
              <textarea id="p-excerpt" rows={3} value={form.excerpt} onChange={set("excerpt")} maxLength={400} aria-invalid={err("excerpt") ? "true" : "false"} aria-describedby={describedBy("p-excerpt", true)} />
            </Field>
          </section>

          <section className="panel-card" aria-labelledby="content-h">
            <div className="panel-card__head">
              <h2 className="adm__h2" id="content-h">Content</h2>
              <div className="seg seg--sm" role="group" aria-label="Content view">
                <button type="button" aria-pressed={contentTab === "write" ? "true" : "false"} onClick={() => setContentTab("write")}>Write</button>
                <button type="button" aria-pressed={contentTab === "preview" ? "true" : "false"} onClick={() => setContentTab("preview")}>Preview</button>
              </div>
            </div>
            {contentTab === "write" ? (
              <div className="field" data-invalid={err("content") ? "true" : "false"}>
                <div className="toolbar" role="toolbar" aria-label="Formatting" aria-controls="p-content">
                  {TOOLS.map((t) => <button key={t.label} type="button" onClick={() => applyTool(t)} title={t.label} aria-label={t.label}>{t.icon}</button>)}
                  <label className="toolbar__file" title="Insert image">
                    <Icon name="image" size={16} /><span className="sr-only">Insert image</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { onUpload(e.target.files[0], "content"); e.target.value = ""; }} />
                  </label>
                </div>
                <label htmlFor="p-content" className="sr-only">Article content (Markdown)</label>
                <textarea id="p-content" ref={contentRef} className="editor__content" rows={22} value={form.content} onChange={set("content")}
                  aria-invalid={err("content") ? "true" : "false"} aria-describedby="p-content-err p-content-hint" spellCheck="true" />
                <p className="hint" id="p-content-hint">Write in Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>- list item</code>, <code>[link text](https://…)</code>, <code>&gt; quote</code>, tables with <code>| a | b |</code>. Raw HTML is shown as text. {readMinutes(form.content)} min read.</p>
                <p className="err" id="p-content-err" aria-live="polite">{err("content") || ""}</p>
              </div>
            ) : (
              <div className="article-body md-preview" dangerouslySetInnerHTML={{ __html: preview ? preview.html : "" }} />
            )}
            {upload.error && <p className="err" role="alert">{upload.error}</p>}
          </section>

          <section className="panel-card" aria-labelledby="extras-h">
            <h2 className="adm__h2" id="extras-h">Key points and FAQs</h2>
            <Field id="p-points" label="Key points (“In short” box)" optional error={err("keyPoints")} hint="One point per line. Up to 8.">
              <textarea id="p-points" rows={4} value={form.keyPoints} onChange={set("keyPoints")} aria-describedby={describedBy("p-points", true)} />
            </Field>
            <fieldset className="faqs" aria-describedby="p-faqs-err">
              <legend>Frequently asked questions <span className="opt">(optional, also added to search results markup)</span></legend>
              {form.faqs.map((f, i) => (
                <div key={i} className="faqs__item">
                  <div className="field"><label htmlFor={`faq-q-${i}`}>Question {i + 1}</label>
                    <input id={`faq-q-${i}`} value={f.q} onChange={(e) => setForm((x) => ({ ...x, faqs: x.faqs.map((y, j) => (j === i ? { ...y, q: e.target.value } : y)) }))} /></div>
                  <div className="field"><label htmlFor={`faq-a-${i}`}>Answer {i + 1}</label>
                    <textarea id={`faq-a-${i}`} rows={2} value={f.a} onChange={(e) => setForm((x) => ({ ...x, faqs: x.faqs.map((y, j) => (j === i ? { ...y, a: e.target.value } : y)) }))} /></div>
                  <button type="button" className="btn btn--ghost btn--xs" onClick={() => setForm((x) => ({ ...x, faqs: x.faqs.filter((_, j) => j !== i) }))}>Remove question {i + 1}</button>
                </div>
              ))}
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setForm((x) => ({ ...x, faqs: [...x.faqs, { q: "", a: "" }] }))} disabled={form.faqs.length >= 15}><Icon name="plus" size={16} /> Add a question</button>
              <p className="err" id="p-faqs-err" aria-live="polite">{err("faqs") || ""}</p>
            </fieldset>
          </section>
        </div>

        <aside className="editor__side">
          <section className="panel-card" aria-labelledby="pub-h">
            <h2 className="adm__h2" id="pub-h">Publishing</h2>
            <dl className="dl dl--tight">
              <dt>Status</dt><dd>{row ? <PostStatus post={row} /> : <span className="pill pill--draft">Not saved</span>}</dd>
            </dl>
            <Field id="p-date" label="Publication date" optional error={err("publishedAt")} hint={live ? "Shown on the article." : "Leave empty to use the day you publish."}>
              <input id="p-date" type="date" value={form.publishedAt} onChange={set("publishedAt")} aria-describedby={describedBy("p-date", true)} />
            </Field>
            <div className="pubactions">
              {!live && <button type="submit" className="btn btn--ghost btn--block" disabled={Boolean(busy)}>{busy === "draft" ? "Saving…" : "Save draft"}</button>}
              {!live && isAdmin && <button type="button" className="btn btn--primary btn--block" onClick={() => save("publish")} disabled={Boolean(busy)}>{busy === "publish" ? "Publishing…" : "Publish"}</button>}
              {live && isAdmin && <button type="submit" className="btn btn--primary btn--block" disabled={Boolean(busy)}>{busy === "update" ? "Saving…" : "Update live post"}</button>}
              {row && <Link className="btn btn--ghost btn--block" to={`/admin/blog/${row.id}/preview`}><Icon name="eye" size={16} /> Preview saved version</Link>}
              {live && isAdmin && <button type="button" className="btn btn--ghost btn--block" onClick={() => setConfirm("unpublish")} disabled={Boolean(busy)}>Unpublish</button>}
              {row && isAdmin && <button type="button" className="btn btn--danger-ghost btn--block" onClick={() => setConfirm("delete")} disabled={Boolean(busy)}><Icon name="trash" size={16} /> Delete post</button>}
            </div>
            {!isAdmin && <p className="muted small">Save your draft; an administrator publishes it.</p>}
          </section>

          <section className="panel-card" aria-labelledby="img-h">
            <h2 className="adm__h2" id="img-h">Featured image</h2>
            {form.imageUrl ? (
              <div className="featimg">
                <img src={form.imageUrl} alt="" />
                <button type="button" className="btn btn--ghost btn--xs" onClick={() => setForm((f) => ({ ...f, imageUrl: "", imageAlt: "" }))}>Remove image</button>
              </div>
            ) : <div className="featimg featimg--empty"><Icon name="image" size={28} /><span className="muted small">No image yet</span></div>}
            <div className="field" data-invalid={err("imageUrl") ? "true" : "false"}>
              <label className="btn btn--ghost btn--sm btn--block upload">
                {upload.busy ? "Uploading…" : form.imageUrl ? "Replace image" : "Upload image"}
                <input type="file" accept="image/jpeg,image/png,image/webp" disabled={upload.busy} onChange={(e) => { onUpload(e.target.files[0], "featured"); e.target.value = ""; }} aria-describedby="p-img-hint p-imageUrl-err" />
              </label>
              <p className="hint" id="p-img-hint">JPEG, PNG or WebP, up to 2 MB. A 1200 × 750 px landscape image works best.</p>
              <p className="err" id="p-imageUrl-err" aria-live="polite">{err("imageUrl") || ""}</p>
            </div>
            <Field id="p-alt" label="Image alt text" optional={!form.imageUrl} error={err("imageAlt")} counter={<Counter value={form.imageAlt} max={LIMITS.imageAlt[1]} />}>
              <input id="p-alt" value={form.imageAlt} onChange={set("imageAlt")} maxLength={240} aria-describedby={describedBy("p-alt")} placeholder="What the image shows" />
            </Field>
          </section>

          <section className="panel-card" aria-labelledby="meta-h">
            <h2 className="adm__h2" id="meta-h">Details</h2>
            <Field id="p-cat" label="Category" error={err("category")}>
              <input id="p-cat" list="p-cat-list" value={form.category} onChange={set("category")} maxLength={80} aria-describedby={describedBy("p-cat")} />
              <datalist id="p-cat-list">{SUGGESTED_CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
            <Field id="p-author" label="Author" error={err("author")}>
              <input id="p-author" value={form.author} onChange={set("author")} maxLength={120} aria-describedby={describedBy("p-author")} />
            </Field>
          </section>

          <section className="panel-card" aria-labelledby="seo-h">
            <h2 className="adm__h2" id="seo-h">Search engine listing</h2>
            <Field id="p-seot" label="SEO title" optional error={err("seoTitle")} hint="Defaults to the post title." counter={<Counter value={form.seoTitle} max={LIMITS.seoTitle[1]} />}>
              <input id="p-seot" value={form.seoTitle} onChange={set("seoTitle")} maxLength={100} aria-describedby={describedBy("p-seot", true)} />
            </Field>
            <Field id="p-seod" label="SEO meta description" optional error={err("seoDescription")} hint="Defaults to the excerpt." counter={<Counter value={form.seoDescription} max={LIMITS.seoDescription[1]} />}>
              <textarea id="p-seod" rows={3} value={form.seoDescription} onChange={set("seoDescription")} maxLength={220} aria-describedby={describedBy("p-seod", true)} />
            </Field>
            <div className="serp" aria-label="Search result preview">
              <span className="serp__url">360bizhealth.com › blog › {form.slug || "your-slug"}</span>
              <span className="serp__title">{(form.seoTitle || form.title || "Post title") + " | 360 Biz Health"}</span>
              <span className="serp__desc">{form.seoDescription || form.excerpt || "The excerpt or meta description appears here."}</span>
            </div>
          </section>
        </aside>
      </form>

      <ConfirmDialog
        open={Boolean(confirm)}
        busy={Boolean(busy)}
        danger
        title={confirm === "delete" ? "Delete this post?" : "Unpublish this post?"}
        body={confirm === "delete"
          ? `"${form.title}" will be permanently deleted and /blog/${row ? row.slug : ""} will stop working. This cannot be undone.`
          : `"${form.title}" will be removed from the public blog. You can publish it again later.`}
        confirmLabel={confirm === "delete" ? "Delete post" : "Unpublish"}
        onConfirm={runConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
