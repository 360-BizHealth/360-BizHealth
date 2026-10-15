/*
 * Optimised site images (WebP, two widths each). Originals are kept in
 * /assets-source and are not bundled. Dimensions are the large variant's,
 * used for width/height attributes to prevent layout shift.
 */
import hrmsMapLg from "../assets/images/hrms-platform-map-lg.webp";
import hrmsMapSm from "../assets/images/hrms-platform-map-sm.webp";
import hrTechLg from "../assets/images/hr-technology-lg.webp";
import hrTechSm from "../assets/images/hr-technology-sm.webp";
import hrmsMobileLg from "../assets/images/hrms-mobile-dashboard-lg.webp";
import hrmsMobileSm from "../assets/images/hrms-mobile-dashboard-sm.webp";
import payrollChatLg from "../assets/images/payroll-chat-lg.webp";
import payrollChatSm from "../assets/images/payroll-chat-sm.webp";
import tdsLabourLg from "../assets/images/tds-labour-lg.webp";
import tdsLabourSm from "../assets/images/tds-labour-sm.webp";
import deadlinesLg from "../assets/images/compliance-deadlines-lg.webp";
import deadlinesSm from "../assets/images/compliance-deadlines-sm.webp";
import recordsLg from "../assets/images/statutory-records-lg.webp";
import recordsSm from "../assets/images/statutory-records-sm.webp";
import taxationLg from "../assets/images/financial-taxation-lg.webp";
import taxationSm from "../assets/images/financial-taxation-sm.webp";
import companyRegLg from "../assets/images/company-registration-lg.webp";
import companyRegSm from "../assets/images/company-registration-sm.webp";
import trademarkLg from "../assets/images/trademark-protection-lg.webp";
import trademarkSm from "../assets/images/trademark-protection-sm.webp";
import checklistLg from "../assets/images/compliance-checklist-lg.webp";
import checklistSm from "../assets/images/compliance-checklist-sm.webp";
import retreatLg from "../assets/images/team-retreat-lg.webp";
import retreatSm from "../assets/images/team-retreat-sm.webp";

const img = (lg, sm, w, h, alt) => ({ lg, sm, w, h, alt, srcSet: `${sm} 640w, ${lg} ${w}w` });

export const IMAGES = {
  hrmsMap: img(hrmsMapLg, hrmsMapSm, 1200, 800,
    "Illustration of an HRMS hub connecting employee data, payroll, statutory compliance, tax, attendance and other HR modules"),
  hrTech: img(hrTechLg, hrTechSm, 1024, 640,
    "HR software dashboard showing a profile overview, attendance and analytics charts"),
  hrmsMobile: img(hrmsMobileLg, hrmsMobileSm, 1024, 1536,
    "Mobile HRMS app screens with employee self-service, pending tasks and a payroll summary"),
  payrollChat: img(payrollChatLg, payrollChatSm, 1200, 1217,
    "Phone showing an employee asking the payroll support team about salary credit, with a reply confirming the pay date"),
  tdsLabour: img(tdsLabourLg, tdsLabourSm, 1024, 1024,
    "Flat illustration of a TDS document, a gavel and compliance paperwork"),
  deadlines: img(deadlinesLg, deadlinesSm, 1200, 1165,
    "A professional at a laptop with reminders for PF, ESIC, LWF and labour-law deadlines and audit-ready records"),
  records: img(recordsLg, recordsSm, 1024, 640,
    "Filing cabinet with organised records beside the scales of justice, representing statutory documentation"),
  taxation: img(taxationLg, taxationSm, 1024, 640,
    "Calculator with stacks of coins and a rising bar chart, representing salary and tax computation"),
  companyReg: img(companyRegLg, companyRegSm, 1024, 1024,
    "Company and LLP registration certificates with a GST tag, a pen and a briefcase"),
  trademark: img(trademarkLg, trademarkSm, 1024, 1024,
    "A trademark symbol beside a shield, representing brand protection"),
  checklist: img(checklistLg, checklistSm, 1024, 1024,
    "A statutory compliance checklist with ticked items, a calculator and a shield"),
  retreat: img(retreatLg, retreatSm, 1024, 1024,
    "A team working on laptops around an outdoor table at a tropical workation venue"),
};
