/*
 * Blog CMS endpoints (authenticated). Roles:
 *   staff — create drafts, edit drafts, upload images, preview;
 *   admin — everything, including publishing, unpublishing, editing live posts and deleting.
 */
import { handler, readJson, readBuffer, send, queryOf, HttpError } from "../http.js";
import { requireAdmin } from "../auth.js";
import {
  parsePostFilters, listPosts, getPost, createPost, updatePost, setPostStatus, deletePost,
  saveMedia, listMedia, MAX_IMAGE_BYTES,
} from "../blog.js";

const idOf = (req) => queryOf(req).id;

/* GET /api/v1/admin/posts · POST /api/v1/admin/posts */
export const collection = handler({
  async GET(req, res) {
    await requireAdmin(req, res);
    return send(res, 200, { ok: true, ...(await listPosts(parsePostFilters(queryOf(req)))) });
  },
  async POST(req, res) {
    const admin = await requireAdmin(req, res, { write: true });
    const body = await readJson(req);
    const publish = body.publish === true;
    if (publish && admin.role !== "admin") throw new HttpError(403, "insufficient_role", "Only administrators can publish posts. Save it as a draft instead.");
    const post = await createPost(body.post, admin, { publish });
    return send(res, 201, { ok: true, post });
  },
});

/* GET | PUT | DELETE /api/v1/admin/posts/:id */
export const item = handler({
  async GET(req, res) {
    await requireAdmin(req, res);
    return send(res, 200, { ok: true, post: await getPost(idOf(req)) });
  },
  async PUT(req, res) {
    const admin = await requireAdmin(req, res, { write: true });
    const body = await readJson(req);
    const post = await updatePost(idOf(req), body.post, admin, { expectedUpdatedAt: body.expectedUpdatedAt || null, publish: body.publish === true });
    return send(res, 200, { ok: true, post });
  },
  async DELETE(req, res) {
    const admin = await requireAdmin(req, res, { write: true, role: "admin" });
    const deleted = await deletePost(idOf(req), admin);
    return send(res, 200, { ok: true, deleted });
  },
});

/* POST /api/v1/admin/posts/:id/status { status: "published" | "draft" } (admins only) */
export const status = handler({
  async POST(req, res) {
    const admin = await requireAdmin(req, res, { write: true, role: "admin" });
    const body = await readJson(req);
    return send(res, 200, { ok: true, post: await setPostStatus(idOf(req), body.status, admin) });
  },
});

/*
 * POST /api/v1/admin/media — raw image bytes (application/octet-stream or image/*),
 * file name in X-File-Name. The type is detected from the bytes, not trusted from the client.
 * GET  /api/v1/admin/media — recent uploads for the image picker.
 */
export const media = handler({
  async GET(req, res) {
    await requireAdmin(req, res);
    return send(res, 200, { ok: true, items: await listMedia() });
  },
  async POST(req, res) {
    const admin = await requireAdmin(req, res, { write: true });
    const type = String(req.headers["content-type"] || "").toLowerCase();
    if (!/^(application\/octet-stream|image\/(jpeg|png|webp))/.test(type)) {
      throw new HttpError(415, "unsupported_image", "Upload a JPEG, PNG or WebP image.");
    }
    const buf = await readBuffer(req, MAX_IMAGE_BYTES);
    let name = "";
    try { name = decodeURIComponent(String(req.headers["x-file-name"] || "")); } catch { name = ""; }
    const saved = await saveMedia(buf, name, admin);
    return send(res, saved.reused ? 200 : 201, { ok: true, media: saved });
  },
});
