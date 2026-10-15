import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { api } from "../../lib/api.js";
import BrandLogo from "../../components/BrandLogo.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import LeadDetail from "./LeadDetail.jsx";
import "../../styles/admin.css";

const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

/*
 * Lead dashboard. The page itself is public JavaScript; every piece of data comes
 * from /api/v1/admin/*, which verifies the session cookie and the admin_users
 * record on each request. Nothing here grants access by itself.
 */
export default function AdminApp() {
  const [state, setState] = useState({ phase: "loading", user: null, error: "" });

  const check = useCallback(async () => {
    try {
      const r = await api("/api/v1/admin/session");
      setState({ phase: "ready", user: r.user, error: "" });
    } catch (err) {
      if (err.status === 401) setState({ phase: "signed_out", user: null, error: "" });
      else if (err.status === 403) setState({ phase: "signed_out", user: null, error: err.message });
      else setState({ phase: "error", user: null, error: err.message });
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  const signOut = async () => {
    try { await api("/api/v1/admin/session", { method: "DELETE" }); } catch { /* cookies are cleared server-side when possible */ }
    setState({ phase: "signed_out", user: null, error: "" });
  };

  /* any 401 from a data call drops back to the sign-in screen */
  const onAuthError = useCallback((err) => {
    if (err && err.status === 401) setState({ phase: "signed_out", user: null, error: "Your session has ended. Please sign in again." });
  }, []);

  return (
    <div className="adm">
      <a className="skip" href="#adm-main">Skip to main content</a>
      <header className="adm__bar">
        <div className="adm__wrap adm__bar-in">
          <Link to="/admin" className="brand" aria-label="Lead dashboard home"><BrandLogo height={38} alt="" /></Link>
          <span className="adm__title">Lead dashboard</span>
          {state.user && (
            <div className="adm__user">
              <span className="adm__who">{state.user.email} <span className="adm__role">{state.user.role}</span></span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={signOut}>Sign out</button>
            </div>
          )}
        </div>
      </header>
      <main id="adm-main" className="adm__wrap adm__main" tabIndex={-1}>
        {state.phase === "loading" && <p role="status" className="adm__loading"><span className="spinner" aria-hidden="true" /> Checking your session…</p>}
        {state.phase === "error" && (
          <div className="card adm__narrow" role="alert">
            <h1 className="adm__h1">The dashboard is unavailable</h1>
            <p>{state.error}</p>
            <button type="button" className="btn btn--green" onClick={check}>Try again</button>
          </div>
        )}
        {state.phase === "signed_out" && <Login notice={state.error} onSignedIn={(user) => setState({ phase: "ready", user, error: "" })} />}
        {state.phase === "ready" && (
          <AdminCtx.Provider value={{ user: state.user, onAuthError }}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="leads/:id" element={<LeadDetail />} />
              <Route path="*" element={<div className="card"><h1 className="adm__h1">Not found</h1><p><Link to="/admin">Back to the lead list</Link></p></div>} />
            </Routes>
          </AdminCtx.Provider>
        )}
      </main>
    </div>
  );
}
