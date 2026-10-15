/* Accordion built on <details>. items: [[question, answer], ...] or
   [{ title, body: [para, ...] }] or [{ question, answer }]. */
export default function FaqList({ items, idPrefix }) {
  return (
    <div className="faq">
      {items.map((item, i) => {
        const q = Array.isArray(item) ? item[0] : item.title || item.question;
        const body = Array.isArray(item) ? [item[1]] : item.body || [item.answer];
        return (
          <details key={i} id={idPrefix ? `${idPrefix}-${i + 1}` : undefined}>
            <summary>{q}</summary>
            <div>{body.map((p, j) => <p key={j}>{p}</p>)}</div>
          </details>
        );
      })}
    </div>
  );
}
