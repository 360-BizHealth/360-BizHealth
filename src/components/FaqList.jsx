/* Accordion built on <details>. items: [[question, answer], ...].
   For richer answers pass `items` as [{ title, body: [para, ...] }]. */
export default function FaqList({ items }) {
  return (
    <div className="faq">
      {items.map((item, i) => {
        const q = Array.isArray(item) ? item[0] : item.title;
        const body = Array.isArray(item) ? [item[1]] : item.body;
        return (
          <details key={i}>
            <summary>{q}</summary>
            <div>{body.map((p, j) => <p key={j}>{p}</p>)}</div>
          </details>
        );
      })}
    </div>
  );
}
