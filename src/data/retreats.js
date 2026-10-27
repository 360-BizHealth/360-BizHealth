/*
 * Corporate Retreats landing page content (/corporate-retreats-workations).
 * Form options here are what the enquiry form offers; the selected values are
 * written into the stored enquiry (subject and message) by RetreatEnquiryForm.
 * No prices, availability or destinations are promised: packages are
 * "Request a quote" until verified pricing exists.
 */
import { IMAGES } from "./images.js";
import { RETREAT_PARTICIPANTS, RETREAT_DURATIONS, RETREAT_TYPES as TYPES, RETREAT_PACKAGES, RETREAT_PACKAGE_LABELS } from "../../shared/enquiry.js";

/* Option lists are shared with the API, which validates them again on submit. */
export const PARTICIPANT_OPTIONS = RETREAT_PARTICIPANTS;
export const DURATION_OPTIONS = RETREAT_DURATIONS;
export const RETREAT_TYPES = TYPES;

export const PACKAGES = [
  {
    id: "team-recharge",
    name: "Team Recharge",
    image: IMAGES.retreatCoastalCove,
    tag: "Relax and reconnect",
    text: "A refreshing corporate getaway focused on relaxation, team bonding, and memorable shared experiences.",
    highlights: ["Accommodation options", "Group dining arrangements", "Team-building activities", "Leisure experiences"],
    suits: "Teams that need time to rest and reconnect after a demanding period, or a reward trip that brings people closer.",
  },
  {
    id: "corporate-offsite",
    name: "Corporate Offsite",
    image: IMAGES.retreatSnowValley,
    tag: "Sessions and team time",
    text: "A balanced retreat combining productive team sessions with engaging group activities and time to unwind.",
    highlights: ["Meeting space options", "Accommodation and meals", "Team activities", "Itinerary planning"],
    suits: "Teams that want workshops, planning or review sessions alongside shared activities, away from daily interruptions.",
  },
  {
    id: "leadership-retreat",
    name: "Leadership Retreat",
    image: IMAGES.retreatMountainDusk,
    tag: "Strategy and focus",
    text: "A tailored experience designed for leadership teams, strategic conversations, and focused collaboration.",
    highlights: ["Premium accommodation options", "Meeting arrangements", "Curated group experiences", "Customised planning"],
    suits: "Founders and leadership groups meeting for strategy, annual planning or focused discussion in a quieter setting.",
  },
];

/* How planning works for every package (from the retreat service's planning scope). */
export const PLANNING_STEPS = [
  "A brief on your objective, group size, dates and budget",
  "Destination options with season and travel notes",
  "Accommodation, venue and meeting space coordination",
  "A costed plan for you to review before anything is booked",
  "On-ground coordination during the retreat",
];

/* Package preference options in the form: the three packages plus a custom route. */
export const PACKAGE_OPTIONS = RETREAT_PACKAGES;
export const PACKAGE_LABELS = RETREAT_PACKAGE_LABELS;

export const RETREAT_FAQS = [
  [
    "What is included in a corporate retreat package?",
    "Inclusions depend on the package and destination you choose. A retreat can cover accommodation, group meals, meeting or session space, local transportation, team-building activities and curated experiences. We confirm exactly what is included in your proposal before anything is booked.",
  ],
  [
    "Can corporate retreats be customised for our company?",
    "Yes. Destinations, activities, schedules and experiences are planned around your objectives, your team's preferences and your budget, whether the focus is rest, collaboration or strategy.",
  ],
  [
    "Which destinations are available for corporate retreats?",
    "Destinations are shortlisted against your requirements, travel dates, group size, season and budget. Tell us where you have in mind, or ask us for options, and we will confirm what is available for your dates before you commit.",
  ],
  [
    "Can you organise retreats for large teams?",
    "Yes. Group arrangements are planned around your team size and what each destination and venue can accommodate. Larger groups usually need more lead time and venues with enough capacity.",
  ],
  [
    "Do you provide team-building activities?",
    "Yes. We arrange activities suited to your group that encourage teamwork, communication, collaboration and leadership, chosen for your team rather than taken from a fixed list.",
  ],
  [
    "How much does a corporate retreat cost?",
    "Cost depends on the destination, group size, duration, accommodation, transportation and activities. Share your details through the enquiry form and we will prepare a customised quotation. If you have a per-person budget, include it and we will show what it can cover.",
  ],
  [
    "Can we organise leadership retreats and corporate offsites?",
    "Yes. Arrangements can be tailored for leadership meetings, annual offsites, strategy sessions and employee engagement programmes, with meeting space and schedules planned around your agenda.",
  ],
  [
    "How far in advance should we book?",
    "It is advisable to plan early, particularly for larger groups and popular travel periods. Availability depends on the destination and your dates, so the earlier you share them, the more options stay open.",
  ],
  [
    "Can dietary and special accommodation requirements be arranged?",
    "Yes. Dietary, accessibility and other requirements are discussed during planning and confirmed according to what the selected accommodation and service providers can support.",
  ],
  [
    "How can we receive a customised corporate retreat proposal?",
    "Complete the enquiry form on this page with your company details, approximate group size, preferred destination and dates. We will get in touch to understand your requirements and discuss a suitable proposal.",
  ],
];

export const INTRO_POINTS = [
  ["Time to unwind", "Space away from daily routines, so people arrive back refreshed."],
  ["Team building", "Shared activities that build trust across teams and levels."],
  ["Focused collaboration", "Sessions for planning and ideas, without office interruptions."],
  ["Memorable destinations", "A setting chosen for your team, season and objective."],
];

export const WHY = [
  { icon: "compass", title: "Customised experiences", text: "Destination, schedule and activities planned around your objectives and budget." },
  { icon: "people", title: "Team-building opportunities", text: "Activities chosen for your group to strengthen communication and trust." },
  { icon: "plan", title: "Thoughtful retreat planning", text: "Travel, stay, sessions and dietary needs captured early, with a costed plan before you commit." },
  { icon: "scale", title: "Flexible group arrangements", text: "From small leadership groups to full-company meets, arranged to fit your team." },
];
