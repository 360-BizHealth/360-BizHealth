import { Link } from "react-router-dom";

/* A single .tile. `to` turns the heading into a link. */
export function Tile({ title, text, to, style, titleStyle, textStyle }) {
  return (
    <div className="tile" style={style}>
      <h4 style={titleStyle}>
        {to ? <Link to={to} style={{ textDecoration: "none" }}>{title}</Link> : title}
      </h4>
      {text && <p style={textStyle}>{text}</p>}
    </div>
  );
}

/* A grid of tiles. items: [[title, text], ...] or [{ title, text, to }]. cols: 2 | 3 | 4 */
export function TileGrid({ items, cols, style, tileProps }) {
  const cls = ["grid", cols && "g" + cols].filter(Boolean).join(" ");
  return (
    <div className={cls} style={style}>
      {items.map((it, i) => {
        const t = Array.isArray(it) ? { title: it[0], text: it[1] } : it;
        return <Tile key={i} {...tileProps} {...t} />;
      })}
    </div>
  );
}
