import { SERVICES, SERVICE_SLUGS } from "./data/services.js";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Resources from "./pages/Resources.jsx";
import Blog from "./pages/Blog.jsx";
import Careers from "./pages/Careers.jsx";
import Faq from "./pages/Faq.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import Admin from "./pages/Admin.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import NotFound from "./pages/NotFound.jsx";

/* Every route with its page metadata. `crumbs` feed the BreadcrumbList schema. */
export const ROUTES = [
  { path: "/", element: <Home />, title: "360 Biz Health | HRMS, Payroll, Compliance & Business Solutions",
    desc: "360 Biz Health helps startups, SMEs, MSMEs and enterprises with HRMS software selection and implementation, payroll and TDS, labour compliance, business registration, IPR and corporate retreats.", crumbs: [] },
  { path: "/about", element: <About />, title: "About 360 Biz Health | Business Solutions Partner",
    desc: "360 Biz Health is a multi-service business solutions company coordinating HR technology, payroll, compliance, business setup and corporate experiences through one point of contact.", crumbs: [["About us", "/about"]] },
  { path: "/contact", element: <Contact />, title: "Contact 360 Biz Health | HRMS, Payroll & Business Services",
    desc: "Talk to 360 Biz Health about HRMS selection, payroll outsourcing, statutory compliance, business registration, trademark and ISO support, or a corporate retreat.", crumbs: [["Contact", "/contact"]] },
  { path: "/blog", element: <Blog />, title: "Blog & Practical Guides | 360 Biz Health",
    desc: "Practical frameworks, articles and operational guides on HRMS, payroll compliance, business setup and corporate offsites.", crumbs: [["Blog", "/blog"]] },
  { path: "/careers", element: <Careers />, title: "Careers at 360 Biz Health | Join Our Team",
    desc: "Explore job opportunities at 360 Biz Health across HR technology, payroll operations, client advisory and corporate experiences.", crumbs: [["Careers", "/careers"]] },
  { path: "/resources", element: <Resources />, title: "Resources | Practical Notes on HR, Payroll & Compliance | 360 Biz Health",
    desc: "Short practical notes on choosing an HRMS, running a payroll calendar, operating across states, trademark basics and planning a workation.", crumbs: [["Resources", "/resources"]] },
  { path: "/faq", element: <Faq />, title: "FAQ | HRMS, Payroll, Compliance, Setup & Retreats | 360 Biz Health",
    desc: "Answers on HRMS selection and implementation, payroll outsourcing, PF, ESIC, PT and LWF, labour compliance, business registration, trademark, ISO and corporate retreats.", crumbs: [["FAQ", "/faq"]] },
  { path: "/thank-you", element: <ThankYou />, title: "Thank you | 360 Biz Health", desc: "Your enquiry has been sent to 360 Biz Health.", noindex: true, crumbs: [["Thank you", "/thank-you"]] },
  { path: "/privacy-policy", element: <Privacy />, title: "Privacy Policy | 360 Biz Health", desc: "How 360 Biz Health collects, uses, shares and protects the information you provide.", crumbs: [["Privacy policy", "/privacy-policy"]] },
  { path: "/terms-and-conditions", element: <Terms />, title: "Terms & Conditions | 360 Biz Health", desc: "The terms on which the 360 Biz Health website and services are provided.", crumbs: [["Terms & conditions", "/terms-and-conditions"]] },
  { path: "/disclaimer", element: <Disclaimer />, title: "Disclaimer | 360 Biz Health", desc: "What the 360 Biz Health website is, and what it is not.", crumbs: [["Disclaimer", "/disclaimer"]] },
  { path: "/admin", element: <Admin />, title: "Lead dashboard | 360 Biz Health", desc: "Internal lead management preview.", noindex: true, crumbs: [["Lead dashboard", "/admin"]] },
  ...SERVICE_SLUGS.map((slug) => ({
    path: "/" + slug,
    element: <ServicePage slug={slug} />,
    title: SERVICES[slug].title,
    desc: SERVICES[slug].desc,
    crumbs: [["Services"], [SERVICES[slug].nav, "/" + slug]],
    service: slug,
  })),
];

export const NOT_FOUND_ROUTE = {
  path: "*", metaPath: "/404", element: <NotFound />, title: "Page not found | 360 Biz Health",
  desc: "The page you are looking for does not exist.", noindex: true, crumbs: [["Not found"]],
};
