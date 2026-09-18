import hrmsOperationsDashboard from "@/assets/hrms-operations-dashboard.png";
import payrollDashboard from "@/assets/payroll-dashboard.png";
import complianceDashboard from "@/assets/compliance-dashboard.png";
import unified from "@/assets/unified.png";
import realtimeClaims from "@/assets/realtime-claims.png";
import seamlessHrms from "@/assets/seamless-hrms.png";

const CDN = "https://cdn.prod.website-files.com/6145f7146a1337faae24d53f";

export const heroImageUrl = `${CDN}/68a4787a0319cb6ac84f3eae_HomePage_Image.webp`;

export const navItems = [
  { label: "Platform", items: ["Overview", "Employer Experience", "Mobile app for Employees"] },
  {
    label: "Employee Benefits",
    items: [
      "Group Health Insurance",
      "Group Personal Accident Insurance",
      "Group Term Life Insurance",
      "Super Top-up Insurance",
      "Corporate Wellness Packages",
      "Pazcard Employee Benefits",
    ],
  },
  {
    label: "Business Insurance",
    items: [
      "Directors & Officers Liability",
      "Crime Insurance",
      "Professional Indemnity Insurance",
      "Fire Insurance",
      "Office Insurance Package",
    ],
  },
  { label: "Resources", items: ["Reports", "Guides", "Blogs", "HR Kit"] },
];

export const heroRotatingWords = [
  "End-to-End HRMS",
  "Payroll & Salary Processing",
  "TDS & Labour Compliance",
  "IPR & Certifications",
  "Corporate Retreats & Workation",
];

export const heroStats = [
  { value: "95%", label: "HR processing time saved" },
  { value: "Zero", label: "Compliance penalties" },
  { value: "500+", label: "Businesses supported" },
];

export const clientLogos = [
  { name: "Wint", src: `${CDN}/6968e4d834bfe55c23905cab_1-02.webp` },
  { name: "Mamaearth", src: `${CDN}/6491875dd366a419f0de91bf_mamaearth-2.svg` },
  { name: "Mindtickle", src: `${CDN}/6491875d70e6f03c6d5579cc_mindtickle-2.svg` },
  { name: "mCaffeine", src: `${CDN}/6968e4d8de2b74f7d911bf7a_1-04.webp` },
  {
    name: "Cashfree Payments",
    src: `${CDN}/685bcb06bbcdf1c54d8db5d1_Cashfree%20Payments_id0CRKW3YO_1.webp`,
  },
  { name: "Emergent", src: `${CDN}/69ba52387abadabe93a431b4_emergent-logo-new.svg` },
  { name: "greytHR", src: `${CDN}/6968e4d8f4ad312c1315f15e_1-06.webp` },
  { name: "Navi", src: `${CDN}/6968e4d88b04c4e03cd4de01_1-05.webp` },
  { name: "Keya", src: `${CDN}/6968e4d8ad57fc2fc4ca427b_1-03.webp` },
  { name: "Tredence", src: `${CDN}/685bcc89619c61dd622939ce_Tredence_Logo.webp` },
  {
    name: "Darwinbox",
    src: `${CDN}/6a05b5c5e4d7bf5e1656107d_d3ac22f6a81e2460586b0518254e6fe9_Darwinbox%20Horizontal%20Logo_White.webp`,
  },
];

export type Offering = { title: string; description: string; icon: string };

export const offerings: Record<string, Offering[]> = {
  "HR & Payroll": [
    {
      title: "End-to-End HRMS",
      description: "Manage attendance, leave, payroll, expenses, and performance in one place.",
      icon: `${CDN}/648fe9baa96e5e16f4793220_GHI%20icon.svg`,
    },
    {
      title: "Attendance & Leave Management",
      description: "Track attendance and leave in real time with simple, reliable workflows.",
      icon: `${CDN}/648ff8f5dc6153f840e6f400_GPA%20icon.svg`,
    },
    {
      title: "Payroll & Salary Processing",
      description: "Automate payroll processing and deliver accurate salary slips on time.",
      icon: `${CDN}/648ff96e6e41759fe44774ba_GTL%20icon.svg`,
    },
    {
      title: "Expense & Performance Management",
      description: "Bring reimbursements, timesheets, appraisals, and performance insights together.",
      icon: `${CDN}/648ff96e9513baa9534ee6c1_Health%20super-topup%20icon.svg`,
    },
  ],
  "Compliance & Tax": [
    {
      title: "Payroll, TDS & Labour Compliance",
      description: "Stay up to date with payroll, taxation, and labour law requirements.",
      icon: `${CDN}/6490018f35d6666c4a8800fa_Tele%20doctor%20consultations%20(2).svg`,
    },
    {
      title: "PF, ESIC & LWF Filing",
      description: "Get dependable registration, filing, and statutory compliance support.",
      icon: `${CDN}/6490018ff75399278bbeab92_Health%20Check-ups.svg`,
    },
    {
      title: "TDS Returns & Form 16",
      description: "Simplify TDS returns, Form 16, and employee tax documentation.",
      icon: `${CDN}/6490019004af85ab6bfeb3fd_Fitness%20Plans%20(2).svg`,
    },
    {
      title: "Tax Planning & Financial Advisory",
      description: "Make informed financial decisions with proactive taxation and advisory support.",
      icon: `${CDN}/648ffb5b47139e4ad7363fdd_Telecom%20wallet.svg`,
    },
  ],
  "Business Services": [
    {
      title: "IPR & Certifications",
      description: "Protect your ideas, brand, and business with end-to-end registration support.",
      icon: `${CDN}/648ffb5c04af85ab6bf90e4c_Meal%20wallet.svg`,
    },
    {
      title: "Trademark & Copyright Registration",
      description: "Build stronger brand protection with guided trademark and copyright registration.",
      icon: `${CDN}/648ffb5c7a5a9e037e2df2bf_Fuel%20wallet.svg`,
    },
    {
      title: "Company Registration & Licensing",
      description: "Get practical support for company setup, registrations, and business licences.",
      icon: `${CDN}/648ffb5c78f750da0d5e3f68_Multi%20benefits%20wallet.svg`,
    },
    {
      title: "Corporate Retreats & Workation",
      description: "Plan memorable team offsites, retreats, and workations from start to finish.",
      icon: `${CDN}/648ff96e9513baa9534ee6c1_Health%20super-topup%20icon.svg`,
    },
  ],
};

export const whySlides = [
  {
    title: "Handpick the employee benefits you want",
    description: "Handpick the ideal perks for your team with a catalogue of choices.",
    image: `${CDN}/6859358eeb4f357690137a78_slide-wellness-webP.webp`,
  },
  {
    title: "Benefits that never go wasted.",
    description:
      "The benefits are easily accessible for your team to explore, enjoy, and make the most of.",
    image: `${CDN}/6859358de0103deb61397e4d_slide-app-screem-webP.webp`,
  },
  {
    title: "Save hours with digital benefits management",
    description:
      "No more sheets or emails. Manage employee benefits digitally, saving hours every month.",
    image: `${CDN}/6859358d91381ad4a721a4ab_slide-dashboard-webP.webp`,
  },
  {
    title: "Compassionate, efficient claims assistance",
    description: "Stress-free claims support, handled with care and empathy.",
    image: `${CDN}/6859358ee6dc76f068225321_slide-agent-webP.webp`,
  },
];

export const employeeFeatures = [
  {
    title: "HR operations in one place",
    description:
      "Manage employee records, attendance, leave, expenses, and performance without disconnected spreadsheets.",
    bullets: ["Centralised employee data", "Automated workflows", "Real-time team visibility"],
    image: hrmsOperationsDashboard,
  },
  {
    title: "Payroll that stays accurate and on time",
    description:
      "Process salaries, tax deductions, payslips, and full & final settlements with confidence.",
    bullets: ["Salary processing support", "TDS and Form 16 readiness"],
    image: payrollDashboard,
  },
  {
    title: "Stay ready for every compliance deadline",
    description: "Keep PF, ESIC, LWF, labour law, registrations, and recurring filings organised.",
    bullets: ["Fewer missed deadlines", "Audit-ready records"],
    image: complianceDashboard,
  },
];

export const hrFeatures = [
  {
    title: "Unified Group Health & Employee Benefits Portal",
    description:
      "Streamline Group Health Insurance (GHI), Group Term Life (GTL), GPA, and corporate wellness programs in a single, intuitive employer dashboard.",
    bullets: [
      "Customized health coverage for teams of 5 to 500+",
      "Cashless hospitalization across 10,000+ network hospitals",
      "Zero-touch digital employee additions & deletions",
    ],
    image: unified,
  },
  {
    title: "Real-Time Claims Analytics & Employee Health Insights",
    description:
      "Get transparent, live visibility into claim settlement status, policy utilization trends, and employee wellness engagement metrics.",
    bullets: [
      "24/7 dedicated cashless & reimbursement claim support",
      "Transparent claims ratio (ICR) tracking for renewal savings",
      "Instant OPD, tele-consultation & health checkup reports",
    ],
    image: realtimeClaims,
  },
  {
    title: "Seamless HRMS, Payroll & Statutory Compliance Sync",
    description:
      "Eliminate manual data entry. Automatically sync employee lifecycle updates, salary structures, PF/ESIC deductions, and tax declarations with zero error.",
    bullets: [
      "Automated employee onboarding & policy endorsement sync",
      "Integrated payroll, TDS, and statutory deduction reports",
      "Audit-ready compliance documentation & zero penalty risk",
    ],
    image: seamlessHrms,
  },
];

export const satisfactionStats = [
  { value: "70+", label: "NPS score for claims and support" },
  { value: "9.2/10", label: "Rating for overall customer satisfaction" },
  { value: "1ST", label: "Awarded as the best brand in insurance" },
];

export const certifications = [
  { name: "AICPA SOC 2", src: `${CDN}/640eb11bd1a77e4e0499d919_AICPA.webp` },
  { name: "ISO 27001", src: `${CDN}/641014152823f6f59f2eaa94_ISO%2027001%20certified.svg` },
  { name: "ISNP", src: `${CDN}/6492a0361371d99bc9b1cb1d_ISNP-white.svg` },
];

export const newsLogos = [
  { name: "YourStory", src: `${CDN}/6492a54c1371d99bc9b76b59_yourstory.png` },
  { name: "Inc42", src: `${CDN}/6492a54bc475e74ad6eface5_Inc42.webp` },
  { name: "Entrepreneur India", src: `${CDN}/6492a54be0346cedcf0abcbf_Entrepreneur.png` },
  { name: "TechCrunch", src: `${CDN}/6492a54d16eed3fa15d63c58_TechCrunch.webp` },
];

export const testimonials = [
  {
    quote:
      "Best pricing along with an easy-to-use platform made managing team insurance much easier for startups like us.",
    name: "Aquibur Rahman",
    role: "CEO, Mailmodo",
    avatar: `${CDN}/68593306c2c2984847884e60_test-Nikunj-webP.webp`,
  },
  {
    quote:
      "The attention to detail and response time of 360 Biz Health has made us their customer for life.",
    name: "Supriya Paul",
    role: "CEO, Josh Talks",
    avatar: `${CDN}/68593306fad464defbcd2d13_test-Supriya-webP.webp`,
  },
  {
    quote:
      "GMC + wellness plan is of great help to my team during these tough times. We are surely a happy client. Great job guys!",
    name: "Nikunj Verma",
    role: "CEO, Cutshort",
    avatar: `${CDN}/6859330659b96a5d85d9cc75_test-Aquib-webP.webp`,
  },
];

export const userStories = [
  {
    name: "Ishan Saxena",
    role: "Chief Happiness Officer | Unofficial Therapist",
    avatar: `${CDN}/6859314bd7d62ef91202930b_customer-IS-webP.webp`,
    text: "As an organization that prioritizes the well-being of our employees, we believe that the same is paramount to their success and overall happiness. CashKaro.com & EarnKaro recently organized an Annual Comprehensive Health Camp for all employees, with thorough health check-ups, vital measurements and personalized consultations.",
  },
  {
    name: "Onkar Ghone",
    role: "360 Biz Health member",
    avatar: `${CDN}/6859314bbd543e80ea606e99_customer-OG-WebP.webp`,
    text: "Exceptional claim reimbursement experience ever. I was impressed with their dedication and commitment to ensuring that my application was processed as quickly as possible. Mr. Prem Gupta went the extra mile to help me get my claim reimbursement.",
  },
];

export const faqs = [
  {
    q: "How is 360 Biz Health different from traditional group insurance?",
    a: "360 Biz Health combines insurance, wellness, tax benefits, and support in one unified platform with a digital-first UX.",
  },
  {
    q: "Why should companies choose 360 Biz Health for group health insurance and wellness solutions?",
    a: "360 Biz Health offers tailored group health insurance plans with features like day-one coverage, mental health consultations, and telemedicine. Their integrated platform helps HR teams manage employee well-being programs efficiently and improve workforce engagement.",
  },
  {
    q: "Does 360 Biz Health provide technical and claim support for group health insurance?",
    a: "360 Biz Health offers 24/7 customer support. If you face any difficulty or need support, we have 24x7 human-assisted chat support on WhatsApp/email (support@360bizhealth.com) and on calls (+91-8037834753).",
  },
  {
    q: "How to buy/renew my group health insurance with 360 Biz Health?",
    a: "Write to us at marketing@360bizhealth.com or submit your work email and mobile number on our site. Our health insurance consultants will contact you and help you with the renewal process.",
  },
  {
    q: "How does 360 Biz Health make claiming insurance easier?",
    a: "360 Biz Health offers 24/7 human support, easy digital submissions, and hands-on guidance so employees can confidently file their claims and get timely reimbursement.",
  },
];

export const footerColumns = [
  {
    title: "Platform",
    links: ["Overview", "Employer Experience", "Mobile app for Employees"],
  },
  {
    title: "Company",
    links: [
      "360 Biz Health Reviews",
      "Contact Us",
      "About Us",
      "Careers",
      "Get Help",
      "Terms & Conditions",
      "Privacy Policy",
    ],
  },
  {
    title: "Products",
    links: [
      "Group Health Insurance",
      "Group Personal Accident Insurance",
      "Group Term Life Insurance",
      "Super Top-up Insurance",
      "Keyman Insurance",
      "Flexible Insurance and Benefits",
      "Corporate Wellness Packages",
      "Pazcard Employee Benefits",
    ],
  },
  {
    title: "Resources",
    links: [
      "State of employee insurance 2.0 in India",
      "Employee health & wellness report",
      "Guide to group health insurance",
      "Salary hike calculator",
      "HRA exemption calculator",
      "Gratuity calculator",
      "HR glossary",
    ],
  },
];
