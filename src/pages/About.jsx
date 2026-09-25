import { SERVICES, SERVICE_SLUGS } from "../data/services.js";
import PageHead from "../components/PageHead.jsx";
import Reveal from "../components/Reveal.jsx";
import Section, { Eyebrow } from "../components/Section.jsx";
import CtaBand from "../components/CtaBand.jsx";
import { TileGrid } from "../components/Tiles.jsx";
import { ListCard, Steps } from "../components/Lists.jsx";

const SOLVE = [
  "Choosing HR technology without a structured requirement",
  "Implementations that stop after the invoice",
  "Payroll and statutory work depending on one person",
  "Registrations done out of sequence",
  "Brand names used before anyone checks them",
  "Corporate travel planned without an objective or a coordinator",
];

const ROLES = [
  ["360 Biz Health", "Requirement assessment, recommendation, coordination, implementation management, payroll outsourcing and ongoing support."],
  ["HRMS technology partners", "The software itself — built, hosted, maintained and supported by the HRMS provider you select. We work with several as a channel partner."],
  ["Allied service partners", "Specialists who execute statutory, registration, IPR, certification and travel work where a qualified or licensed provider is required."],
];

const HOW = [
  ["Tell us what you need"], ["We understand the requirement"], ["We identify the appropriate solution or service"],
  ["We coordinate implementation or delivery"], ["We remain available for ongoing support"],
];

const VALUES = [
  ["Say what is true", "No invented credentials, no borrowed logos, no numbers we cannot stand behind."],
  ["Name the owner", "Every task in an engagement has a person attached to it, on our side or yours."],
  ["Explain the trade-off", "Every option has a cost. We would rather tell you before you sign than after."],
  ["Stay after go-live", "The support window is part of the work, not an upsell."],
  ["Keep data quiet", "Payroll and employee data is handled on a need-to-know basis under confidentiality terms."],
  ["Scope honestly", "If something is outside what we do well, we say so."],
];

export default function About() {
  return (
    <>
      <PageHead crumbs={[["About us"]]} title="One partner. Multiple business needs."
        lede="360 Biz Health is a multi-service business solutions company for startups, SMEs, MSMEs and enterprises in India." />

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2>Businesses should not have to coordinate a different provider for every operational requirement</h2>
            <p>A founder choosing an HR system, a finance head moving payroll out, an operations lead registering a second entity and an HR manager planning the annual meet are usually dealing with four different vendors, four different timelines and four different people who do not speak to each other.</p>
            <p>360 Biz Health exists to collapse that. We coordinate essential business requirements through one point of contact, delivering directly where we can and through a network of technology and specialised service partners where that produces a better result.</p>
          </div>
          <ListCard title="What we solve" items={SOLVE} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Four service pillars</Eyebrow>
          <h2>What we do</h2>
          <TileGrid
            items={SERVICE_SLUGS.map((k) => ({ title: SERVICES[k].nav, text: SERVICES[k].kicker, to: "/" + k }))}
            cols={4}
            style={{ marginTop: "1.4rem" }}
          />
        </Reveal>
      </Section>

      <Section>
        <div className="wrap">
          <Reveal className="panel">
            <div className="split">
              <div>
                <Eyebrow onDark>Partner ecosystem</Eyebrow>
                <h2>Three distinct roles, stated plainly</h2>
                <p>We think clients deserve to know exactly who is doing what, and where our commercial relationships sit.</p>
              </div>
              <TileGrid
                items={ROLES}
                style={{ gap: ".8rem" }}
                tileProps={{
                  style: { background: "rgba(255,255,255,.06)", borderColor: "rgba(255,255,255,.14)" },
                  titleStyle: { color: "#fff" },
                  textStyle: { color: "rgba(255,255,255,.72)" },
                }}
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tight>
        <Reveal className="wrap split">
          <div>
            <Eyebrow>How we work</Eyebrow>
            <h2>Assessment before recommendation</h2>
            <p>Every engagement starts with a conversation about the requirement, not a product demo. We then say what we would do, what it will involve, and who will deliver each part.</p>
            <p>Because channel relationships exist with HRMS providers, we give you the comparison alongside the recommendation, so you can judge the reasoning yourself.</p>
          </div>
          <Steps items={HOW} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Values</Eyebrow>
          <h2>What we hold ourselves to</h2>
          <TileGrid items={VALUES} cols={3} style={{ marginTop: "1.4rem" }} />
        </Reveal>
      </Section>

      <Section tight>
        <Reveal className="wrap">
          <Eyebrow>Who we serve</Eyebrow>
          <h2>Startups, SMEs, MSMEs, growing multi-location companies and enterprises</h2>
          <p className="lede">We work with founders, HR heads, finance and admin teams and operations leaders &mdash; usually at the point where a process that worked at 20 people stops working at 80.</p>
        </Reveal>
      </Section>

      <CtaBand
        title="Start with one requirement"
        text="You do not need a full engagement to talk to us. Tell us the single thing that is currently taking the most time, and we will tell you what we would do about it."
        waMsg="Hi 360 Biz Health, I'd like to know more about how you work."
      />
    </>
  );
}
