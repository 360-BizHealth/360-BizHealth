import { Link } from "react-router-dom";
import { TextLink } from "./Button.jsx";

/* Home page service card */
export default function PillarCard({ index, slug, title, problem, answer, points }) {
  return (
    <article className="card pillar">
      <div className="pillar__idx">0{index}</div>
      <h3><Link to={"/" + slug}>{title}</Link></h3>
      <p className="pillar__prob">{problem}</p>
      <p>{answer}</p>
      <ul>{points.map((x, i) => <li key={i}>{x}</li>)}</ul>
      <TextLink to={"/" + slug} ev="service_card_cta">Explore {title.toLowerCase()}</TextLink>
    </article>
  );
}
