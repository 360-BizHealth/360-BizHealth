import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { api } from "../../lib/api.js";
import BrandLogo from "../../components/BrandLogo.jsx";
import Login from "./Login.jsx";
import Overview from "./Overview.jsx";
import Leads from "./Leads.jsx";
import LeadDetail from "./LeadDetail.jsx";
import BlogList from "./BlogList.jsx";
import BlogEditor from "./BlogEditor.jsx";
import BlogPreview from "./BlogPreview.jsx";
import RetreatsAdmin from "./RetreatsAdmin.jsx";
import Users from "./Users.jsx";
import Icon from "./Icon.jsx";
import "../../styles/admin.css";

const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

/* Pages call this to set the breadcrumb shown in the top bar. */
export function useCrumbs(crumbs) {
  const { setCrumbs } = useAdmin();
  const key = JSON.stringify(crumbs);
  useEffect(() => { setCrumbs(crumbs); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
}

function readCollapsed() {
  try { return window.localStorage.getItem("bh_admin_sidebar") === "collapsed"; } catch { return false; }
}

function Sidebar({ user, open, collapsed, onClose, newCount }) {
  const { pathname, search } = useLocation();
  const inbox = pathname === "/admin/leads" && new URLSearchParams(search).get("status") === "new";
  const items = [
    { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
    { to: "/admin/leads", label: "Leads", icon: "leads", active: pathname.startsWith("/admin/leads") && !inbox },
    { to: "/admin/leads?status=new", label: "Enquiries", icon: "inbox", active: inbox, badge: newCount, hint: "New, not yet contacted" },
    { to: "/admin/blog", label: "Blog Management", icon: "blog" },
    { to: "/admin/retreats", label: "Retreat Packages", icon: "retreat" },
    ...(user.role === "admin" ? [{ to: "/admin/users", label: "Users & Access", icon: "users" }] : []),
  ];
  return (
    <aside className={"sb" + (open ? " is-open" : "") + (collapsed ? " is-collapsed" : "")} id="adm-sidebar">
      <div className="sb__brand">
        <Link to="/admin" className="sb__logo" aria-label="360 Biz Health dashboard home" onClick={onClose}>
          <BrandLogo reverse height={36} alt="" />
        </Link>
        <span className="sb__product">CRM</span>
        <button type="button" className="sb__close" onClick={onClose} aria-label="Close menu"><Icon name="close" /></button>
      </div>
      <nav className="sb__nav" aria-label="Dashboard navigation">
        <ul>
          {items.map((it) => (
            <li key={it.label}>
              <NavLink
                to={it.to}
                end={it.end}
                onClick={onClose}
                title={collapsed ? it.label : undefined}
                className={({ isActive }) => "sb__link" + ((it.active !== undefined ? it.active : isActive) ? " is-active" : "")}
                aria-current={it.active === undefined ? "page" : it.active ? "page" : false}
              >
                <Icon name={it.icon} />
                <span className="sb__label">{it.label}</span>
                {it.badge > 0 && <span className="sb__badge" aria-label={`${it.badge} ${it.hint || ""}`}>{it.badge}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sb__foot">
        <a className="sb__link sb__link--muted" href="/" target="_blank" rel="noopener noreferrer">
          <Icon name="external" /><span className="sb__label">View website<span className="sr-only"> (opens in a new tab)</span></span>
        </a>
      </div>
    </aside>
  );
}

/*
 * CRM shell. The page itself is public JavaScript; every piece of data comes
 * from /api/v1/admin/*, which verifies the session cookie and the admin_users
 * record on each request. Nothing here grants access by itself.
 */
export default function AdminApp() {
  const [state, setState] = useState({ phase: "loading", user: null, error: "" });
  const [crumbs, setCrumbs] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [newCount, setNewCount] = useState(0);
  const menuBtn = useRef(null);
  const { pathname, search } = useLocation();

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

  /* unread-enquiry badge, refreshed on navigation and when the tab regains focus */
  const refreshCount = useCallback(() => {
    api("/api/v1/admin/stats").then((r) => setNewCount(r.stats.byStatus.new || 0)).catch(() => {});
  }, []);
  useEffect(() => { if (state.phase === "ready") refreshCount(); }, [state.phase, pathname, search, refreshCount]);
  useEffect(() => {
    const onFocus = () => { if (state.phase === "ready") refreshCount(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [state.phase, refreshCount]);

  useEffect(() => { setDrawer(false); }, [pathname]);
  useEffect(() => {
    if (!drawer) return undefined;
    const key = (e) => { if (e.key === "Escape") { setDrawer(false); menuBtn.current && menuBtn.current.focus(); } };
    document.addEventListener("keydown", key);
    const first = document.querySelector("#adm-sidebar .sb__link");
    if (first) first.focus();
    return () => document.removeEventListener("keydown", key);
  }, [drawer]);

  const toggleCollapsed = () => setCollapsed((c) => {
    try { window.localStorage.setItem("bh_admin_sidebar", c ? "expanded" : "collapsed"); } catch { /* per-viewer convenience only */ }
    return !c;
  });

  const signOut = async () => {
    try { await api("/api/v1/admin/session", { method: "DELETE" }); } catch { /* cookies are cleared server-side when possible */ }
    setState({ phase: "signed_out", user: null, error: "" });
  };

  /* any 401 from a data call drops back to the sign-in screen */
  const onAuthError = useCallback((err) => {
    if (err && err.status === 401) setState({ phase: "signed_out", user: null, error: "Your session has ended. Please sign in again." });
  }, []);

  if (state.phase !== "ready") {
    return (
      <div className="adm adm--plain">
        <main id="adm-main" className="adm__center" tabIndex={-1}>
          <div className="adm__brandline"><BrandLogo height={44} alt="360 Biz Health" /></div>
          {state.phase === "loading" && <p role="status" className="adm__loading"><span className="spinner" aria-hidden="true" /> Checking your session…</p>}
          {state.phase === "error" && (
            <div className="panel-card adm__narrow" role="alert">
              <h1 className="adm__h1">The dashboard is unavailable</h1>
              <p>{state.error}</p>
              <button type="button" className="btn btn--green" onClick={check}>Try again</button>
            </div>
          )}
          {state.phase === "signed_out" && <Login notice={state.error} onSignedIn={(user) => setState({ phase: "ready", user, error: "" })} />}
        </main>
      </div>
    );
  }

  return (
    <AdminCtx.Provider value={{ user: state.user, onAuthError, setCrumbs, refreshCount }}>
      <div className={"adm" + (collapsed ? " adm--collapsed" : "")}>
        <a className="skip" href="#adm-main">Skip to main content</a>
        <Sidebar user={state.user} open={drawer} collapsed={collapsed} onClose={() => setDrawer(false)} newCount={newCount} />
        {drawer && <div className="sb__scrim" onClick={() => setDrawer(false)} aria-hidden="true" />}
        <div className="adm__body">
          <header className="tb">
            <button ref={menuBtn} type="button" className="tb__menu" onClick={() => setDrawer(true)} aria-expanded={drawer ? "true" : "false"} aria-controls="adm-sidebar" aria-label="Open menu">
              <Icon name="menu" />
            </button>
            <button type="button" className="tb__collapse" onClick={toggleCollapsed} aria-pressed={collapsed ? "true" : "false"} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <Icon name={collapsed ? "expand" : "collapse"} />
            </button>
            <nav className="tb__crumbs" aria-label="Breadcrumb">
              <ol>
                {crumbs.map(([label, to], i) => (
                  <li key={i}>{to && i < crumbs.length - 1 ? <Link to={to}>{label}</Link> : <span aria-current={i === crumbs.length - 1 ? "page" : undefined}>{label}</span>}</li>
                ))}
              </ol>
            </nav>
            <div className="tb__user">
              <span className="tb__avatar" aria-hidden="true">{state.user.email.slice(0, 1).toUpperCase()}</span>
              <span className="tb__who"><span className="tb__email">{state.user.email}</span><span className="tb__role">{state.user.role === "admin" ? "Administrator" : "Staff"}</span></span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={signOut}>Sign out</button>
            </div>
          </header>
          <main id="adm-main" className="adm__main" tabIndex={-1}>
            <Routes>
              <Route index element={<Overview />} />
              <Route path="leads" element={<Leads />} />
              <Route path="leads/:id" element={<LeadDetail />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/new" element={<BlogEditor />} />
              <Route path="blog/:id" element={<BlogEditor />} />
              <Route path="blog/:id/preview" element={<BlogPreview />} />
              <Route path="retreats" element={<RetreatsAdmin />} />
              <Route path="users" element={<Users />} />
              <Route path="*" element={<div className="panel-card"><h1 className="adm__h1">Page not found</h1><p><Link to="/admin">Back to the dashboard</Link></p></div>} />
            </Routes>
          </main>
        </div>
      </div>
    </AdminCtx.Provider>
  );
}
