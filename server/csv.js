/*
 * CSV export with protection against spreadsheet formula injection: any cell
 * beginning with = + - @ (or a tab/carriage return) is prefixed with a single
 * quote so Excel / Sheets treat it as text.
 */
import { SERVICE_LABELS, LEAD_STATUS_LABELS } from "../shared/enquiry.js";

const COLUMNS = [
  ["reference", "Reference"],
  ["created_at", "Received (IST)"],
  ["status", "Status"],
  ["name", "Name"],
  ["company", "Company"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["service", "Service"],
  ["company_size", "Company size"],
  ["city", "City"],
  ["current_hrms", "Current HRMS"],
  ["subject", "Subject"],
  ["message", "Message"],
  ["retreat_package", "Retreat package"],
  ["retreat_participants", "Retreat participants"],
  ["retreat_duration", "Retreat duration"],
  ["retreat_type", "Retreat type"],
  ["retreat_destination", "Preferred destination"],
  ["retreat_travel_dates", "Preferred travel dates"],
  ["assigned_to", "Assigned to"],
  ["next_follow_up", "Next follow-up"],
  ["last_contacted_at", "Last contacted (IST)"],
  ["source_page", "Source page"],
  ["utm_source", "UTM source"],
  ["utm_campaign", "UTM campaign"],
  ["notification_status", "Notification"],
];

const ist = (d) => (d ? new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }) : "");

export function cell(v) {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

export function toCsv(rows) {
  const lines = [COLUMNS.map(([, h]) => cell(h)).join(",")];
  for (const r of rows) {
    const vals = COLUMNS.map(([k]) => {
      let v = r[k];
      if (k === "created_at" || k === "last_contacted_at") v = ist(v);
      else if (k === "next_follow_up" && v instanceof Date) v = v.toISOString().slice(0, 10);
      else if (k === "service") v = SERVICE_LABELS[v] || v;
      else if (k === "status") v = LEAD_STATUS_LABELS[v] || v;
      return cell(v);
    });
    lines.push(vals.join(","));
  }
  // BOM so Excel opens UTF-8 (₹, names in Indian scripts) correctly
  return "﻿" + lines.join("\r\n") + "\r\n";
}
