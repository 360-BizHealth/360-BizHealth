/* Front-end lead store. The lead is queued in this browser so the flow is testable.
   In production, replace saveLead() with a POST to your API (server-side validation,
   rate limiting, CAPTCHA, database write). */

const LEADS_KEY = "360bh_leads";
const SOURCE_KEY = "360bh_src";

export function utmData() {
  const q = new URLSearchParams(window.location.search);
  let store = {};
  try { store = JSON.parse(sessionStorage.getItem(SOURCE_KEY) || "{}"); } catch (e) { store = {}; }
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach((k) => {
    if (q.get(k)) store[k] = q.get(k);
  });
  if (!store.referrer) store.referrer = document.referrer || "direct";
  if (!store.landing) store.landing = window.location.href;
  try { sessionStorage.setItem(SOURCE_KEY, JSON.stringify(store)); } catch (e) { /* storage unavailable */ }
  return store;
}

export function readLeads() {
  try { return JSON.parse(localStorage.getItem(LEADS_KEY) || "[]"); } catch (e) { return []; }
}

export function writeLeads(leads) {
  try { localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); } catch (e) { /* storage unavailable */ }
}

export function saveLead(lead) {
  const all = readLeads();
  all.unshift(lead);
  writeLeads(all.slice(0, 500));
}

export function leadsToCsv(leads) {
  const cols = ["id", "createdAt", "name", "company", "email", "phone", "city", "size", "service", "currentHrms", "status", "owner", "nextFollowUp", "notes", "message"];
  const rows = [cols.join(",")].concat(
    leads.map((l) => cols.map((c) => '"' + String(l[c] == null ? "" : l[c]).replace(/"/g, '""') + '"').join(","))
  );
  return rows.join("\n");
}
