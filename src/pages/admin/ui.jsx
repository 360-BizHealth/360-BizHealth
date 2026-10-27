import { forwardRef } from "react";
/* Small shared pieces for dashboard pages. */
import { LEAD_STATUS_LABELS, SERVICE_LABELS, RETREAT_PACKAGE_LABELS } from "../../../shared/enquiry.js";

export const fmtDateTime = (d) => (d ? new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" }) : "—");
export const istToday = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
export const istDaysAgo = (n) => new Date(Date.now() + 5.5 * 3600e3 - n * 86400e3).toISOString().slice(0, 10);
export const serviceLabel = (s) => SERVICE_LABELS[s] || s;
export const packageLabel = (p) => RETREAT_PACKAGE_LABELS[p] || p;

export function StatusPill({ status }) {
  return <span className={"pill pill--" + status}>{LEAD_STATUS_LABELS[status] || status}</span>;
}

export function PostStatus({ post }) {
  if (post.status === "published" && post.scheduled) return <span className="pill pill--scheduled">Scheduled</span>;
  return <span className={"pill pill--" + (post.status === "published" ? "published" : "draft")}>{post.status === "published" ? "Published" : "Draft"}</span>;
}

export const Msg = forwardRef(function Msg({ msg, ...rest }, ref) {
  return (
    <div ref={ref} className={"alert" + (msg.kind === "error" ? " alert--error" : msg.kind === "ok" ? " alert--ok" : "")} role={msg.kind === "error" ? "alert" : "status"} {...rest}>
      {msg.text}
    </div>
  );
});

export function Loading({ label }) {
  return <p role="status" className="adm__loading"><span className="spinner" aria-hidden="true" /> {label}</p>;
}

export function ErrorCard({ title, error, onRetry }) {
  return (
    <div className="panel-card" role="alert">
      <h2 className="adm__h2">{title}</h2>
      <p className="muted">{error}</p>
      {onRetry && <button type="button" className="btn btn--ghost btn--sm" onClick={onRetry}>Try again</button>}
    </div>
  );
}
