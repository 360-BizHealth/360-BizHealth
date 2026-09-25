import { NAV } from "../data/site.js";
import PageHead from "../components/PageHead.jsx";
import Section from "../components/Section.jsx";
import { TileGrid } from "../components/Tiles.jsx";

export default function NotFound() {
  const links = [...NAV, { label: "Home", to: "/" }, { label: "FAQ", to: "/faq" }].map((n) => ({ title: n.label, to: n.to }));
  return (
    <>
      <PageHead title="That page doesn’t exist"
        lede="The link may be out of date, or the address may have a typo. Everything we publish is reachable from the list below." />
      <Section tight>
        <div className="wrap"><TileGrid items={links} cols={3} /></div>
      </Section>
    </>
  );
}
