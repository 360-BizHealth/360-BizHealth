/*
 * Blog content: Markdown → safe HTML.
 *
 * Used by the API when a post is saved (the result is stored and served to
 * visitors) and by the admin editor for its live preview, so both always agree.
 *
 * Safety model (no HTML sanitiser library needed because no author HTML is ever
 * passed through):
 *   - raw HTML in the Markdown is escaped and shown as text;
 *   - links keep only http(s), mailto, same-site paths and #anchors;
 *   - images keep only same-site paths (uploaded media or /blog-images/),
 *     which the site's Content-Security-Policy (img-src 'self') also requires;
 *   - every attribute value is escaped; marked escapes text and code.
 */
import { Marked } from "marked";

export const slugify = (s) => String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

const SAFE_LINK = /^(https?:\/\/[^\s"'<>]+|mailto:[^\s"'<>]+|\/(?!\/)[^\s"'<>]*|#[\w-]+)$/i;
export const SAFE_IMAGE = /^\/(api\/v1\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|blog-images\/[a-z0-9][a-z0-9._-]{0,80}\.(webp|jpe?g|png))$/i;

export function isSafeImageUrl(u) {
  return SAFE_IMAGE.test(String(u || ""));
}

/* Plain text of inline tokens, for heading ids and the table of contents. */
function plain(tokens) {
  return (tokens || []).map((t) => (t.tokens ? plain(t.tokens) : t.type === "text" || t.type === "codespan" ? t.text : t.raw || "")).join("");
}

export function renderMarkdown(md) {
  const headings = [];
  const used = new Map();
  const marked = new Marked({
    gfm: true,
    breaks: false,
    async: false,
    renderer: {
      html(token) {
        return escapeHtml(token.text || token.raw || "");
      },
      heading(token) {
        // One H1 per page (the post title), so content headings start at H2.
        const depth = Math.min(4, Math.max(2, token.depth));
        const text = plain(token.tokens).replace(/\s+/g, " ").trim();
        let id = slugify(text) || "section";
        const n = used.get(id) || 0;
        used.set(id, n + 1);
        if (n) id = `${id}-${n + 1}`;
        if (depth === 2) headings.push({ id, text });
        return `<h${depth} id="${escapeHtml(id)}">${this.parser.parseInline(token.tokens)}</h${depth}>\n`;
      },
      link(token) {
        const inner = this.parser.parseInline(token.tokens);
        const href = String(token.href || "").trim();
        if (!SAFE_LINK.test(href)) return inner;
        const external = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?360bizhealth\.com(\/|$)/i.test(href);
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        const rel = external ? ' rel="noopener noreferrer nofollow" target="_blank"' : "";
        return `<a href="${escapeHtml(href)}"${title}${rel}>${inner}</a>`;
      },
      image(token) {
        const src = String(token.href || "").trim();
        if (!isSafeImageUrl(src)) return escapeHtml(token.text || "");
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(token.text || "")}" loading="lazy" decoding="async">`;
      },
      table(token) {
        // default table markup, wrapped so wide tables scroll inside the article
        let head = "<tr>" + token.header.map((c) => `<th scope="col">${this.parser.parseInline(c.tokens)}</th>`).join("") + "</tr>";
        let body = token.rows.map((r) => "<tr>" + r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("") + "</tr>").join("");
        return `<div class="table-wrap" role="region" aria-label="Table" tabindex="0"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
      },
    },
  });
  const html = marked.parse(String(md || ""));
  return { html, headings };
}

export function plainText(md) {
  return String(md || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function readMinutes(md) {
  const words = plainText(md).split(" ").filter(Boolean).length;
  return Math.max(1, Math.min(120, Math.round(words / 200)));
}
