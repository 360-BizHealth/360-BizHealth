import { Fragment } from "react";
import { Link } from "react-router-dom";

/* items: [[label, to?], ...]. Home is always first. */
export default function Breadcrumbs({ items, className = "crumbs" }) {
  return (
    <nav className={className} aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map(([label, to], i) => (
        <Fragment key={i}>
          {" "}<span aria-hidden="true">/</span>{" "}
          {to ? <Link to={to}>{label}</Link> : <span>{label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}
