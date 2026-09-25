import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RouteMeta from "./components/RouteMeta.jsx";
import { ROUTES, NOT_FOUND_ROUTE } from "./routes.jsx";
import { applyStaticSchema } from "./lib/seo.js";
import { utmData } from "./lib/leads.js";

export default function App() {
  useEffect(() => {
    applyStaticSchema();
    utmData(); /* capture campaign parameters on landing */
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        {ROUTES.map((r) => (
          <Route key={r.path} path={r.path} element={<RouteMeta route={r}>{r.element}</RouteMeta>} />
        ))}
        <Route path="*" element={<RouteMeta route={NOT_FOUND_ROUTE}>{NOT_FOUND_ROUTE.element}</RouteMeta>} />
      </Route>
    </Routes>
  );
}
