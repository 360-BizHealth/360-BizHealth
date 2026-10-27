import { Link } from "react-router-dom";

/* A single tile. `to` makes the whole tile a link; `n` shows a small index number. */
export function Tile({ title, text, to, n, as: H = "h3", className = "" }) {
  return (
    <div className={["tile", to && "tile--link", n && "tile--num", className].filter(Boolean).join(" ")}>
      {n && <span className="tile__n" aria-hidden="true">{String(n).padStart(2, "0")}</span>}
      <H>{to ? <Link to={to}>{title}</Link> : title}</H>
      {text && <p>{text}</p>}
    </div>
  );
}

/* A grid of tiles. items: [[title, text], ...] or [{ title, text, to }]. cols: 2 | 3 | 4 */
export function TileGrid({ items, cols, numbered = false, headingLevel = "h3", style, className = "" }) {
  const cls = ["grid", cols && "g" + cols, className].filter(Boolean).join(" ");
  return (
    <div className={cls} style={style}>
      {items.map((it, i) => {
        const t = Array.isArray(it) ? { title: it[0], text: it[1] } : it;
        return <Tile key={i} as={headingLevel} n={numbered ? i + 1 : undefined} {...t} />;
      })}
    </div>
  );
}
