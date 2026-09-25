import { RESOURCES } from "../data/resources.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section from "../components/Section.jsx";
import FaqList from "../components/FaqList.jsx";
import CtaBand from "../components/CtaBand.jsx";

export default function Resources() {
  return (
    <>
      <PageHead crumbs={[["Resources"]]} title="Resources"
        lede="Short, practical notes from work we do every month — written for the person who has to make the decision." />
      <Section tight>
        <Reveal className="wrap" style={{ maxWidth: 820 }}>
          <FaqList items={RESOURCES} />
        </Reveal>
      </Section>
      <CtaBand
        title="Have a question these notes don't answer?"
        text="Send it across. If it is something we handle, we will tell you how we would approach it. If it is not, we will say that too."
        waMsg="Hi 360 Biz Health, I have a question about a business requirement."
      />
    </>
  );
}
