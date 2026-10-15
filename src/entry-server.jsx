/* Build-time renderer used by scripts/prerender.mjs (vite build --ssr). */
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import { ROUTES, ADMIN_META, NOT_FOUND_META, LEGACY_REDIRECTS } from "./routes.jsx";
import { buildHead, renderHeadHtml } from "./lib/seo.js";
import { BIZ } from "./data/site.js";

export function render(url) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}

export function headFor(meta) {
  return renderHeadHtml(buildHead(meta));
}

export { ROUTES, ADMIN_META, NOT_FOUND_META, LEGACY_REDIRECTS, BIZ };
