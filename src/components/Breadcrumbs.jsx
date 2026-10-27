import { Link } from "react-router-dom";

/* items: [[label, to?], ...]. Home is always first; the last item is the current page. */
export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/">Home</Link></li>
        {items.map(([label, to], i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {to && !last ? <Link to={to}>{label}</Link> : <span aria-current={last ? "page" : undefined}>{label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
