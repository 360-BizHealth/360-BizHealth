/*
 * Blog repository. The single source of truth for both the admin CMS and the
 * public /blog pages. All statements are parameterised.
 *
 * Visibility rule: only rows with status = 'published' and a published_at in
 * the past are ever returned by the public functions. Drafts and scheduled
 * posts are reachable only through the authenticated admin API.
 */
import crypto from "node:crypto";
import { query, tx } from "./db.js";
import { HttpError } from "./http.js";
import { renderMarkdown, readMinutes } from "../shared/markdown.js";
import { validatePost } from "../shared/blog.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_LOOKUP_RE = /^[a-z0-9-]{1,120}$/;

export function assertPostId(id) {
  if (!UUID_RE.test(String(id || ""))) throw new HttpError(404, "not_found", "Post not found.");
}

const PUBLIC_FILTER = "status = 'published' and published_at <= now()";

/* ------------------------------------------------------------------ public */

const CARD_COLUMNS = "slug, title, excerpt, category, author, published_at, updated_at, read_minutes, image_url, image_alt";

export function toCard(r) {
  return {
    slug: r.slug, title: r.title, excerpt: r.excerpt, category: r.category, author: r.author,
    publishedAt: r.published_at, updatedAt: r.updated_at, readMinutes: r.read_minutes,
    imageUrl: r.image_url, imageAlt: r.image_alt || "",
  };
}

export function toArticle(r) {
  return {
    ...toCard(r),
    seoTitle: r.seo_title || "", seoDescription: r.seo_description || "",
    html: r.content_html, headings: r.headings || [], keyPoints: r.key_points || [], faqs: r.faqs || [],
  };
}

export async function listPublished(limit = 200) {
  const { rows } = await query(`select ${CARD_COLUMNS} from public.blog_posts where ${PUBLIC_FILTER} order by published_at desc limit $1`, [limit]);
  return rows.map(toCard);
}

export async function getPublished(slug) {
  if (!SLUG_LOOKUP_RE.test(String(slug || ""))) return null;
  const { rows } = await query(`select * from public.blog_posts where slug = $1 and ${PUBLIC_FILTER}`, [slug]);
  return rows[0] ? toArticle(rows[0]) : null;
}

/* Related posts: same category first, then the most recent others. */
export async function relatedTo(post, n = 2) {
  const { rows } = await query(
    `select ${CARD_COLUMNS} from public.blog_posts
      where ${PUBLIC_FILTER} and slug <> $1
      order by (category = $2) desc, published_at desc limit $3`,
    [post.slug, post.category, n]
  );
  return rows.map(toCard);
}

/* ------------------------------------------------------------------- admin */

const ADMIN_LIST_COLUMNS = `id, slug, title, category, author, status, published_at, created_at, updated_at, image_url, image_alt,
  updated_by_email, (status = 'published' and published_at > now()) as scheduled`;

export function parsePostFilters(q) {
  const s = (v, n) => String(v || "").trim().slice(0, n);
  return {
    q: s(q.q, 100),
    status: ["draft", "published"].includes(q.status) ? q.status : "",
    category: s(q.category, 60),
    sort: ["updated", "created", "published", "title"].includes(q.sort) ? q.sort : "updated",
    page: Math.max(1, Math.min(10_000, parseInt(q.page, 10) || 1)),
    pageSize: Math.max(5, Math.min(100, parseInt(q.pageSize, 10) || 20)),
  };
}

const POST_ORDER = {
  updated: "updated_at desc",
  created: "created_at desc",
  published: "published_at desc nulls last",
  title: "lower(title) asc",
};

export async function listPosts(f) {
  const clauses = [];
  const params = [];
  const p = (v) => { params.push(v); return "$" + params.length; };
  if (f.q) {
    const like = p("%" + f.q.replace(/[\\%_]/g, (c) => "\\" + c) + "%");
    clauses.push(`(title ilike ${like} or slug ilike ${like} or excerpt ilike ${like} or author ilike ${like})`);
  }
  if (f.status) clauses.push(`status = ${p(f.status)}`);
  if (f.category) clauses.push(`category = ${p(f.category)}`);
  const w = clauses.length ? "where " + clauses.join(" and ") : "";
  const offset = (f.page - 1) * f.pageSize;
  const [items, total, cats, counts] = await Promise.all([
    query(`select ${ADMIN_LIST_COLUMNS} from public.blog_posts ${w} order by ${POST_ORDER[f.sort]} limit ${f.pageSize} offset ${offset}`, params),
    query(`select count(*)::int n from public.blog_posts ${w}`, params),
    query("select distinct category from public.blog_posts order by category"),
    query("select status, count(*)::int n from public.blog_posts group by status"),
  ]);
  return {
    items: items.rows, total: total.rows[0].n, page: f.page, pageSize: f.pageSize,
    categories: cats.rows.map((r) => r.category),
    counts: Object.fromEntries(counts.rows.map((r) => [r.status, r.n])),
  };
}

export async function getPost(id) {
  assertPostId(id);
  const { rows } = await query("select * from public.blog_posts where id = $1", [id]);
  if (!rows[0]) throw new HttpError(404, "not_found", "Post not found.");
  return rows[0];
}

/* Editor payload → validated row values (throws 422 with field errors). */
function prepare(input) {
  const { ok, data, errors } = validatePost(input);
  if (!ok) throw new HttpError(422, "validation_failed", "Some fields need attention.", { fields: errors });
  // a date picked in the editor means that day in India
  if (data.publishedAt && /^\d{4}-\d{2}-\d{2}$/.test(data.publishedAt)) data.publishedAt += "T00:00:00+05:30";
  const { html, headings } = renderMarkdown(data.content);
  return { data, html, headings, minutes: readMinutes(data.content) };
}

async function assertSlugFree(c, slug, id = null) {
  const { rows } = await c.query("select id from public.blog_posts where slug = $1 and ($2::uuid is null or id <> $2::uuid)", [slug, id]);
  if (rows[0]) throw new HttpError(409, "slug_taken", "Another post already uses this URL.", { fields: { slug: "Another post already uses this URL slug. Choose a different one." } });
}

function uniqueViolation(err) {
  if (err && err.code === "23505") throw new HttpError(409, "slug_taken", "Another post already uses this URL.", { fields: { slug: "Another post already uses this URL slug. Choose a different one." } });
  throw err;
}

async function logBlog(c, actor, action, details) {
  await c.query(
    "insert into public.audit_log (actor_id, actor_email, action, details) values ($1,$2,$3,$4::jsonb)",
    [actor.id, actor.email, action, JSON.stringify(details)]
  );
}

export async function createPost(input, actor, { publish = false } = {}) {
  const { data, html, headings, minutes } = prepare(input);
  return tx(async (c) => {
    await assertSlugFree(c, data.slug);
    const status = publish ? "published" : "draft";
    const publishedAt = publish ? data.publishedAt || new Date().toISOString() : data.publishedAt;
    const { rows } = await c.query(
      `insert into public.blog_posts
         (slug, title, excerpt, content_md, content_html, headings, key_points, faqs, category, author, status, published_at,
          image_url, image_alt, seo_title, seo_description, read_minutes, created_by_email, updated_by_email)
       values ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8::jsonb,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$18)
       returning *`,
      [data.slug, data.title, data.excerpt, data.content, html, JSON.stringify(headings), JSON.stringify(data.keyPoints), JSON.stringify(data.faqs),
        data.category, data.author, status, publishedAt, data.imageUrl, data.imageAlt || null, data.seoTitle || null, data.seoDescription || null,
        minutes, actor.email]
    ).catch(uniqueViolation);
    await logBlog(c, actor, publish ? "blog_post_published" : "blog_post_created", { post_id: rows[0].id, slug: data.slug });
    return rows[0];
  });
}

/*
 * Saves editor changes. `expectedUpdatedAt` (from when the editor loaded the
 * post) prevents silently overwriting someone else's newer edit.
 */
export async function updatePost(id, input, actor, { expectedUpdatedAt = null, publish = false } = {}) {
  assertPostId(id);
  const { data, html, headings, minutes } = prepare(input);
  return tx(async (c) => {
    const cur = await c.query("select id, status, published_at, updated_at from public.blog_posts where id = $1 for update", [id]);
    const before = cur.rows[0];
    if (!before) throw new HttpError(404, "not_found", "Post not found.");
    if (expectedUpdatedAt && new Date(expectedUpdatedAt).getTime() !== new Date(before.updated_at).getTime()) {
      throw new HttpError(409, "edit_conflict", "This post was changed by someone else after you opened it. Reload to see the latest version, then reapply your changes.");
    }
    if ((before.status === "published" || publish) && actor.role !== "admin") {
      throw new HttpError(403, "insufficient_role", "Only administrators can change or publish live posts.");
    }
    await assertSlugFree(c, data.slug, id);
    const status = publish ? "published" : before.status;
    const publishedAt = data.publishedAt || (status === "published" ? before.published_at || new Date().toISOString() : before.published_at);
    const { rows } = await c.query(
      `update public.blog_posts set
         slug=$2, title=$3, excerpt=$4, content_md=$5, content_html=$6, headings=$7::jsonb, key_points=$8::jsonb, faqs=$9::jsonb,
         category=$10, author=$11, status=$12, published_at=$13, image_url=$14, image_alt=$15, seo_title=$16, seo_description=$17,
         read_minutes=$18, updated_by_email=$19
       where id = $1 returning *`,
      [id, data.slug, data.title, data.excerpt, data.content, html, JSON.stringify(headings), JSON.stringify(data.keyPoints), JSON.stringify(data.faqs),
        data.category, data.author, status, publishedAt, data.imageUrl, data.imageAlt || null, data.seoTitle || null, data.seoDescription || null,
        minutes, actor.email]
    ).catch(uniqueViolation);
    await logBlog(c, actor, publish && before.status !== "published" ? "blog_post_published" : "blog_post_updated", { post_id: id, slug: data.slug });
    return rows[0];
  });
}

export async function setPostStatus(id, status, actor) {
  assertPostId(id);
  if (!["draft", "published"].includes(status)) throw new HttpError(422, "validation_failed", "Choose draft or published.");
  return tx(async (c) => {
    const cur = await c.query("select status, published_at from public.blog_posts where id = $1 for update", [id]);
    if (!cur.rows[0]) throw new HttpError(404, "not_found", "Post not found.");
    const { rows } = await c.query(
      `update public.blog_posts set status = $2,
         published_at = case when $2 = 'published' then coalesce(published_at, now()) else published_at end,
         updated_by_email = $3
       where id = $1 returning *`,
      [id, status, actor.email]
    );
    await logBlog(c, actor, status === "published" ? "blog_post_published" : "blog_post_unpublished", { post_id: id, slug: rows[0].slug });
    return rows[0];
  });
}

export async function deletePost(id, actor) {
  assertPostId(id);
  return tx(async (c) => {
    const { rows } = await c.query("delete from public.blog_posts where id = $1 returning id, slug, title", [id]);
    if (!rows[0]) throw new HttpError(404, "not_found", "Post not found.");
    await logBlog(c, actor, "blog_post_deleted", { post_id: id, slug: rows[0].slug, title: rows[0].title });
    return rows[0];
  });
}

/* ------------------------------------------------------------------- media */

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/* Detects the real file type from its first bytes; the declared type is ignored. */
export function sniffImage(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

export async function saveMedia(buf, originalName, actor) {
  if (!buf || !buf.length) throw new HttpError(422, "empty_file", "Choose an image to upload.");
  if (buf.length > MAX_IMAGE_BYTES) throw new HttpError(413, "file_too_large", "Images must be 2 MB or smaller. Export a smaller JPEG or WebP and try again.");
  const mime = sniffImage(buf);
  if (!mime) throw new HttpError(415, "unsupported_image", "Upload a JPEG, PNG or WebP image.");
  const sha = crypto.createHash("sha256").update(buf).digest("hex");
  const prior = await query("select id, mime_type, byte_size from public.blog_media where sha256 = $1 limit 1", [sha]);
  if (prior.rows[0]) return { ...prior.rows[0], url: "/api/v1/media/" + prior.rows[0].id, reused: true };
  const name = String(originalName || "").replace(/[^\w.\- ]/g, "").slice(0, 200) || null;
  const { rows } = await query(
    `insert into public.blog_media (mime_type, byte_size, data, sha256, original_name, created_by, created_by_email)
     values ($1,$2,$3,$4,$5,$6,$7) returning id, mime_type, byte_size`,
    [mime, buf.length, buf, sha, name, actor.id, actor.email]
  );
  return { ...rows[0], url: "/api/v1/media/" + rows[0].id, reused: false };
}

export async function getMedia(id) {
  if (!UUID_RE.test(String(id || ""))) return null;
  const { rows } = await query("select mime_type, data, sha256 from public.blog_media where id = $1", [id]);
  return rows[0] || null;
}

export async function listMedia(limit = 40) {
  const { rows } = await query("select id, mime_type, byte_size, original_name, created_at from public.blog_media order by created_at desc limit $1", [limit]);
  return rows.map((r) => ({ ...r, url: "/api/v1/media/" + r.id }));
}
