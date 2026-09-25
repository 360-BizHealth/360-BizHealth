import { HOME_FAQS } from "../data/site.js";
import { SERVICES, SERVICE_SLUGS } from "../data/services.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section from "../components/Section.jsx";
import FaqList from "../components/FaqList.jsx";
import CtaBand from "../components/CtaBand.jsx";

const GROUPS = [["General", HOME_FAQS], ...SERVICE_SLUGS.map((k) => [SERVICES[k].nav, SERVICES[k].faqs])];

export default function Faq() {
  return (
    <>
      <PageHead crumbs={[["FAQ"]]} title="Frequently asked questions"
        lede="HRMS selection and implementation, payroll outsourcing, statutory compliance, business setup, trademarks, ISO and corporate retreats." />
      {GROUPS.map(([heading, faqs]) => (
        <Section tight key={heading}>
          <Reveal className="wrap" style={{ maxWidth: 820 }}>
            <h2 style={{ fontSize: "1.5rem" }}>{heading}</h2>
            <FaqList items={faqs} />
          </Reveal>
        </Section>
      ))}
      <CtaBand
        title="Still deciding where to start?"
        text="Describe the situation in a few lines and we will point you to the right first step."
        waMsg="Hi 360 Biz Health, I have a question from your FAQ page."
      />
    </>
  );
}
