import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { ROUTES, ADMIN_META, NOT_FOUND_META, NOT_FOUND_ELEMENT, LEGACY_REDIRECTS } from "./routes.jsx";
import { buildHead, applyHead } from "./lib/seo.js";
import { captureAttribution } from "./lib/attribution.js";
import { track } from "./lib/analytics.js";
import BlogArticleRoute from "./pages/BlogArticle.jsx";

/* The lead dashboard is split into its own bundle so public pages never download it. */
const AdminApp = lazy(() => import("./pages/admin/AdminApp.jsx"));

/* Sets <head> for the page and records a page view. */
function Page({ meta, children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    applyHead(buildHead(meta));
    track("page_view", { page_path: pathname });
    if (meta.path === "/thank-you") track("thank_you_view", {});
  }, [meta, pathname]);
  return children;
}

function LegacyRedirect({ to }) {
  const params = useParams();
  const target = to.replace(/:(\w+)/g, (_, k) => encodeURIComponent(params[k] || ""));
  return <Navigate to={target} replace />;
}

export default function App() {
  useEffect(() => { captureAttribution(); }, []);

  return (
    <Routes>
      <Route path="/admin/*" element={<Page meta={ADMIN_META}><Suspense fallback={<p style={{ padding: "2rem" }}>Loading the dashboard…</p>}><AdminApp /></Suspense></Page>} />
      <Route element={<Layout />}>
        {/* dynamic (database-backed) pages set their own <head> once their data is known */}
        {ROUTES.map((r) => <Route key={r.path} path={r.path} element={r.meta.dynamic ? r.element : <Page meta={r.meta}>{r.element}</Page>} />)}
        <Route path="/blog/:slug" element={<BlogArticleRoute />} />
        {LEGACY_REDIRECTS.map((r) => <Route key={r.from} path={r.from} element={<LegacyRedirect to={r.to} />} />)}
        <Route path="*" element={<Page meta={NOT_FOUND_META}>{NOT_FOUND_ELEMENT}</Page>} />
      </Route>
    </Routes>
  );
}
