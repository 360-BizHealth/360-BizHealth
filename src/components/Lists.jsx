/* Process chips (.flow). tone: teal (default) | gold | red */
export function Flow({ items, tone, vertical = false, style }) {
  const cls = ["flow", tone && "flow--" + tone].filter(Boolean).join(" ");
  return (
    <ul className={cls} style={{ ...(vertical ? { flexDirection: "column" } : {}), ...style }}>
      {items.map((it, i) =>
        Array.isArray(it) ? (
          <li key={i} style={{ display: "block" }}>
            <strong>{it[0]}</strong>
            <span className="muted" style={{ display: "block", fontWeight: 400, fontSize: ".9rem" }}>{it[1]}</span>
          </li>
        ) : (
          <li key={i}>{it}</li>
        )
      )}
    </ul>
  );
}

/* Numbered steps (.steps). items: [[title, detail?], ...] */
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

/* White card with a small sans heading and a bullet list */
export function ListCard({ title, items, listStyle = { fontSize: ".96rem" } }) {
  return (
    <div className="card">
      <h3 style={{ fontFamily: "var(--sans)", fontSize: "1.02rem", fontWeight: 700 }}>{title}</h3>
      <ul style={listStyle}>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}
