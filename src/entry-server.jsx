/* Build-time renderer used by scripts/prerender.mjs (vite build --ssr). */
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import { ROUTES, ADMIN_META, NOT_FOUND_META, LEGACY_REDIRECTS } from "./routes.jsx";
import { buildHead, renderHeadHtml } from "./lib/seo.js";
import { BIZ } from "./data/site.js";
import { InitialDataContext, BLOG_INDEX_META, articleMeta, blogIndexMeta } from "./lib/blog.js";

/* `data` is the database content for server-rendered blog pages (see server/handlers/blog-page.js). */
export function render(url, data = null) {
  return renderToString(
    <React.StrictMode>
      <InitialDataContext.Provider value={{ current: data }}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </InitialDataContext.Provider>
    </React.StrictMode>
  );
}

export function headFor(meta) {
  return renderHeadHtml(buildHead(meta));
}

export { ROUTES, ADMIN_META, NOT_FOUND_META, LEGACY_REDIRECTS, BIZ, BLOG_INDEX_META, articleMeta, blogIndexMeta };
