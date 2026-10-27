/* Section spacing wrapper. tone: undefined | "tint" | "white" */
export default function Section({ tight = false, tone, id, labelledBy, className, children }) {
  const cls = [tight ? "sec--tight" : "sec", tone && "sec--" + tone, className].filter(Boolean).join(" ");
  return <section className={cls} id={id} aria-labelledby={labelledBy}>{children}</section>;
}

export function Eyebrow({ children, onDark = false }) {
  return <p className={"eyebrow" + (onDark ? " eyebrow--ondark" : "")}>{children}</p>;
}
