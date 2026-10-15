/*
 * Presentation and SEO configuration for the four service pages. The service copy
 * itself stays in services.js; this file decides how each page is laid out, which
 * images it uses and which optional sections it shows. Section order is per page,
 * so the four pages do not share one fixed template.
 */
import { IMAGES } from "./images.js";

export const SERVICE_DETAILS = {
  "hrms-software-solutions": {
    theme: "platform",
    eyebrow: "HRMS software solutions",
    introHeading: "An HRMS decision starts with the requirement, not the demo",
    hero: { image: IMAGES.hrmsMap, layout: "split" },
    sectionImage: IMAGES.hrmsMobile,
    /* Who-does-what, taken from the delivery clarification on this page */
    roles: {
      title: "Two roles, stated plainly",
      ours: {
        label: "360 Biz Health",
        items: ["Requirement assessment", "Platform selection and comparison", "Channel and commercial coordination", "Implementation and configuration", "Data migration and admin training", "Onboarding and ongoing support"],
      },
      theirs: {
        label: "The HRMS provider you select",
        items: ["The software itself", "Platform hosting", "Product roadmap", "Platform service levels"],
      },
    },
    sections: ["intro", "roles", "provide", "timeline", "capabilities", "fit", "included", "faq", "cta", "related"],
  },

  "payroll-tds-labour-compliance": {
    theme: "calendar",
    eyebrow: "Payroll, TDS & labour compliance",
    introHeading: "Payroll is repetitive, deadline-bound and unforgiving",
    hero: { image: IMAGES.payrollChat, layout: "split" },
    sectionImage: IMAGES.deadlines,
    cycleNotes: {
      Inputs: "Attendance, joiners, exits and revisions to a fixed cut-off",
      Payroll: "Processing and a reviewed salary register",
      TDS: "Computation on verified declarations",
      "Statutory compliance": "PF, ESIC, PT and LWF on their own calendar",
      Reports: "Registers, MIS and a compliance summary",
      Support: "Employee queries and audit support",
    },
    sections: ["intro", "cycle", "provide", "statutory", "included", "fit", "clarify", "faq", "cta", "related"],
  },

  "business-registration-ipr-certifications": {
    theme: "sequence",
    eyebrow: "Business registration, IPR & certifications",
    introHeading: "Setting up is rarely one task",
    hero: { image: IMAGES.companyReg, layout: "split" },
    sectionImage: IMAGES.checklist,
    /* Maps each step of "The usual sequence" to the services delivered at that step (indexes into `provide`) */
    stages: [
      { step: "Business registration", provide: [0] },
      { step: "GST / MSME", provide: [1, 2] },
      { step: "Trademark / IPR", provide: [3, 4, 5, 6] },
      { step: "ISO / certifications", provide: [7, 8] },
    ],
    sections: ["intro", "stages", "documents", "fit", "included", "clarify", "faq", "cta", "related"],
  },

  "corporate-retreats-workations": {
    theme: "experience",
    eyebrow: "Corporate retreats & workations",
    introHeading: "Time away should have an objective and a plan",
    hero: { image: IMAGES.retreat, layout: "photo" },
    sections: ["intro", "formats", "provide", "planning", "fit", "included", "clarify", "faq", "cta", "related"],
  },
};
