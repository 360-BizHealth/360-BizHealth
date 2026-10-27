/* Business details. Replace the placeholder phone/WhatsApp with owner-verified details before launch.
   Form options, company sizes and lead statuses now live in shared/enquiry.js (used by the API too). */

const ORIGIN = (import.meta.env && import.meta.env.VITE_SITE_URL ? import.meta.env.VITE_SITE_URL : "https://www.360bizhealth.com").replace(/\/+$/, "");

export const BIZ = {
  "name": "360 Biz Health",
  "origin": ORIGIN,
  /* Set to true once a real, verified phone number replaces the placeholder below. */
  "phonePublished": false,
  "phoneDisplay": "+91 00000 00000",
  "phoneHref": "+910000000000",
  "whatsapp": "910000000000",
  "email": "contact@360bizhealth.com",
  "area": "New Delhi / Delhi NCR, India",
  "addressPublished": false,
  "address": {
    "street": "",
    "locality": "New Delhi",
    "region": "Delhi",
    "postal": "",
    "country": "IN"
  }
};

export const HOME_FAQS = [
  [
    "Does 360 Biz Health make its own HRMS software?",
    "No. We work with multiple HRMS software companies as a channel partner. We help assess your requirement, compare suitable partner platforms and then handle selection, implementation, onboarding and support."
  ],
  [
    "Can we use just one service instead of all four?",
    "Yes. Each vertical works on its own. Many clients start with one requirement and add others later."
  ],
  [
    "Who actually delivers payroll and compliance work?",
    "Payroll processing and compliance support are delivered by 360 Biz Health and, where statutory execution calls for a qualified professional, through allied specialists. We confirm the delivery model before onboarding."
  ],
  [
    "Where do you operate?",
    "We are based in New Delhi / Delhi NCR and work with businesses across India. Payroll and compliance work is location-aware because Professional Tax, LWF and labour rules differ by state."
  ],
  [
    "How do we start?",
    "Send us the requirement through the enquiry form or on WhatsApp. The first step is a short call to understand the situation before anything is recommended."
  ]
];
