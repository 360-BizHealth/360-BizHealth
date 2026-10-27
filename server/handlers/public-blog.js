/*
 * Public, read-only blog endpoints. They only ever return published posts.
 * Short shared caching keeps the database load low while edits still appear
 * within about a minute.
 */
import { handler, send, queryOf, HttpError } from "../http.js";
import { listPublished, getPublished, relatedTo, getMedia } from "../blog.js";

export const PUBLIC_CACHE = "public, max-age=0, s-maxage=30, stale-while-revalidate=60";

/* GET /api/v1/posts */
export const list = handler({
  async GET(req, res) {
    return send(res, 200, { ok: true, posts: await listPublished() }, { "Cache-Control": PUBLIC_CACHE });
  },
});

/* GET /api/v1/posts/:slug */
export const one = handler({
  async GET(req, res) {
    const post = await getPublished(queryOf(req).slug);
    if (!post) throw new HttpError(404, "not_found", "Article not found.");
    return send(res, 200, { ok: true, post, related: await relatedTo(post) }, { "Cache-Control": PUBLIC_CACHE });
  },
});

/* GET /api/v1/media/:id — an uploaded image. Content never changes for an id. */
export const media = handler({
  async GET(req, res) {
    const m = await getMedia(queryOf(req).id);
    if (!m) throw new HttpError(404, "not_found", "Image not found.");
    return send(res, 200, m.data, {
      "Content-Type": m.mime_type,
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${m.sha256.slice(0, 32)}"`,
      "Content-Security-Policy": "default-src 'none'; sandbox",
    });
  },
});
