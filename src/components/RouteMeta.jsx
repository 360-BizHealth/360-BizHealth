import { useEffect } from "react";
import { applyMeta, applyPageSchema } from "../lib/seo.js";
import { track } from "../lib/analytics.js";

/* Wraps a page: sets title/meta/canonical, page JSON-LD, and fires page_view. */
export default function RouteMeta({ route, children }) {
  useEffect(() => {
    const path = route.metaPath || route.path;
    applyMeta(route, path);
    applyPageSchema(route, route.path);
    if (route.path === "/thank-you") track("thank_you_view", {});
    track("page_view", { page_path: window.location.pathname });
  }, [route]);
  return children;
}
