/* .sec (standard spacing) or .sec--tight */
export default function Section({ tight = false, id, children }) {
  return <section className={tight ? "sec--tight" : "sec"} id={id}>{children}</section>;
}

export function Eyebrow({ children, onDark = false }) {
  return <p className="eyebrow" style={onDark ? { color: "rgba(255,255,255,.7)" } : undefined}>{children}</p>;
}
