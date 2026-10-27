/* Process chips. items: ["Step", ...] or [["Title", "detail"], ...]. tone: undefined | "orange" */
export function Flow({ items, tone, vertical = false, style, label }) {
  const cls = ["flow", tone && "flow--" + tone, vertical && "flow--col"].filter(Boolean).join(" ");
  return (
    <ol className={cls} style={style} aria-label={label}>
      {items.map((it, i) =>
        Array.isArray(it) ? <li key={i}>{it[0]}<span>{it[1]}</span></li> : <li key={i}>{it}</li>
      )}
    </ol>
  );
}

/* Numbered steps. items: [[title, detail?], ...] */
export function Steps({ items }) {
  return (
    <ol className="steps">
      {items.map(([title, detail], i) => (
        <li key={i}>
          <strong>{title}</strong>
          {detail && <span>{detail}</span>}
        </li>
      ))}
    </ol>
  );
}

/* White card with a heading and a bullet list */
export function ListCard({ title, items, check = false }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <ul className={check ? "checklist" : "dotlist"}>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}

export function Checklist({ items, cols = 1 }) {
  return <ul className={"checklist" + (cols === 2 ? " checklist--2" : "")}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
}
