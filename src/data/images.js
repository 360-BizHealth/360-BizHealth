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

/* Corporate retreats page photography */
import retreatAlpineLakeLg from "../assets/images/retreat-alpine-lake-lg.webp";
import retreatAlpineLakeSm from "../assets/images/retreat-alpine-lake-sm.webp";
import retreatSnowValleyLg from "../assets/images/retreat-snow-valley-lg.webp";
import retreatSnowValleySm from "../assets/images/retreat-snow-valley-sm.webp";
import retreatWorkationLg from "../assets/images/retreat-workation-lg.webp";
import retreatWorkationSm from "../assets/images/retreat-workation-sm.webp";
import retreatHighPlateauLg from "../assets/images/retreat-high-plateau-lg.webp";
import retreatHighPlateauSm from "../assets/images/retreat-high-plateau-sm.webp";
import retreatMountainDuskLg from "../assets/images/retreat-mountain-dusk-lg.webp";
import retreatMountainDuskSm from "../assets/images/retreat-mountain-dusk-sm.webp";
import retreatDesertArchLg from "../assets/images/retreat-desert-arch-lg.webp";
import retreatDesertArchSm from "../assets/images/retreat-desert-arch-sm.webp";
import retreatCoastalCoveLg from "../assets/images/retreat-coastal-cove-lg.webp";
import retreatCoastalCoveSm from "../assets/images/retreat-coastal-cove-sm.webp";
import retreatAlpineLakeXl from "../assets/images/retreat-alpine-lake-xl.webp";

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
  retreatAlpineLake: img(retreatAlpineLakeLg, retreatAlpineLakeSm, 1200, 800,
    "A still turquoise alpine lake reflecting a dense pine forest and jagged limestone peaks under a bright summer sky"),
  retreatSnowValley: img(retreatSnowValleyLg, retreatSnowValleySm, 1200, 800,
    "Snow-covered mountain valley with tall pines and a small group of visitors gathered at tables beneath colourful umbrellas"),
  retreatWorkation: img(retreatWorkationLg, retreatWorkationSm, 1200, 807,
    "A professional working on a laptop outdoors in a sunny mountain town square, with snow on the ground and pine trees behind"),
  retreatHighPlateau: img(retreatHighPlateauLg, retreatHighPlateauSm, 1200, 652,
    "A herd of goats grazing on golden grassland beside a frozen stream, with snow-dusted mountains behind"),
  retreatMountainDusk: img(retreatMountainDuskLg, retreatMountainDuskSm, 1200, 800,
    "Layered mountain ridges in silhouette against an orange and violet sky at dusk"),
  retreatDesertArch: img(retreatDesertArchLg, retreatDesertArchSm, 1200, 675,
    "A natural red sandstone arch rising from a wide desert valley under a deep blue sky"),
  retreatCoastalCove: img(retreatCoastalCoveLg, retreatCoastalCoveSm, 1200, 900,
    "A secluded white-sand cove enclosed by limestone cliffs, with bright blue water and a single boat at anchor"),
};

/* Wide variant for the full-bleed retreats hero */
IMAGES.retreatAlpineLake.xl = retreatAlpineLakeXl;
IMAGES.retreatAlpineLake.srcSet += `, ${retreatAlpineLakeXl} 1920w`;
