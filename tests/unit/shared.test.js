import { describe, it, expect } from "vitest";
import { validateEnquiry, normalizePhone, normalizeEmail, isValidEmail, cleanSource } from "../../shared/enquiry.js";
import { cell, toCsv } from "../../server/csv.js";
import { buildLeadEmail } from "../../server/email.js";
import { parseFilters, parsePatch, newReference } from "../../server/leads.js";

describe("phone normalisation", () => {
  it.each([
    ["9876543210", "+919876543210"],
    ["098765 43210", "+919876543210"],
    ["+91 98765-43210", "+919876543210"],
    ["91 9876543210", "+919876543210"],
    ["(011) 2345 6789", "+911123456789"],
    ["+44 20 7946 0958", "+442079460958"],
    ["0044 20 7946 0958", "+442079460958"],
  ])("%s → %s", (input, out) => expect(normalizePhone(input)).toBe(out));

  it.each(["12345", "+91 98765", "phone me", "98765432101234567890", "+91 1234567890123"])("rejects %s", (input) => {
    expect(normalizePhone(input)).toBeNull();
  });
});

describe("email", () => {
  it("lower-cases only the domain", () => expect(normalizeEmail("  Ravi.K@Example.CO.IN ")).toBe("Ravi.K@example.co.in"));
  it.each(["a@b.co", "first.last+tag@company.in"])("accepts %s", (e) => expect(isValidEmail(e)).toBe(true));
  it.each(["plain", "a@b", "a..b@c.com", ".a@b.com", "a@-b.com", "a@b.c"])("rejects %s", (e) => expect(isValidEmail(e)).toBe(false));
});

describe("validateEnquiry", () => {
  const ok = { name: "Neha Gupta", company: "Gupta & Sons", email: "neha@gupta.in", phone: "9811122233", service: "hrms", message: "We need help choosing an HRMS for 80 people.", consent: true };

  it("accepts a complete enquiry and trims whitespace", () => {
    const r = validateEnquiry({ ...ok, name: "  Neha   Gupta ", city: " Noida " });
    expect(r.ok).toBe(true);
    expect(r.data.name).toBe("Neha Gupta");
    expect(r.data.city).toBe("Noida");
  });
  it("requires consent as a real boolean", () => {
    expect(validateEnquiry({ ...ok, consent: "true" }).errors.consent).toBeTruthy();
  });
  it("rejects services outside the scope (e.g. website development)", () => {
    expect(validateEnquiry({ ...ok, service: "website-development" }).errors.service).toBeTruthy();
  });
  it("accepts an optional subject and caps its length", () => {
    expect(validateEnquiry(ok).data.subject).toBe("");
    expect(validateEnquiry({ ...ok, subject: "s".repeat(151) }).errors.subject).toMatch(/under 150/);
  });
  it("enforces length limits", () => {
    expect(validateEnquiry({ ...ok, message: "x".repeat(4001) }).errors.message).toMatch(/under 4000/);
    expect(validateEnquiry({ ...ok, company: "A" }).errors.company).toBeTruthy();
  });
  it("rejects link-stuffed messages and URL names", () => {
    expect(validateEnquiry({ ...ok, message: "see http://a.com http://b.com http://c.com http://d.com now" }).errors.message).toBeTruthy();
    expect(validateEnquiry({ ...ok, name: "www.spam.com" }).errors.name).toBeTruthy();
  });
  it("strips control characters", () => {
    expect(validateEnquiry({ ...ok, company: "Acme\u0000\u0007 Ltd" }).data.company).toBe("Acme Ltd");
  });
  it("tolerates garbage input without throwing", () => {
    expect(validateEnquiry(null).ok).toBe(false);
    expect(validateEnquiry({ name: { $ne: 1 }, email: ["x"] }).ok).toBe(false);
  });
});

describe("cleanSource", () => {
  it("keeps only known UTM keys and safe values", () => {
    const s = cleanSource({ page: "javascript:alert(1)", vertical: "../../etc", utm: { utm_source: "x".repeat(500), other: "y" } });
    expect(s.page).toBe("");
    expect(s.vertical).toBe("");
    expect(s.utm).toEqual({ utm_source: "x".repeat(200) });
  });
});

describe("CSV export", () => {
  it.each(["=SUM(A1)", "+1", "-1", "@cmd", "\tx"])("neutralises formula-like cell %s", (v) => {
    expect(cell(v).startsWith(`"'`)).toBe(true);
  });
  it("quotes and escapes", () => expect(cell('He said "hi"')).toBe('"He said ""hi"""'));
  it("adds a BOM and a header row", () => {
    const csv = toCsv([{ reference: "BH-AAAAAA", created_at: new Date("2026-01-01T00:00:00Z"), status: "new", service: "hrms" }]);
    expect(csv.startsWith("﻿\"Reference\"")).toBe(true);
    expect(csv).toContain('"New"');
    expect(csv).toContain('"HRMS software"');
  });
});

describe("lead helpers", () => {
  it("generates unambiguous references", () => {
    for (let i = 0; i < 200; i++) expect(newReference()).toMatch(/^BH-[A-HJ-NP-Z2-9]{6}$/);
  });
  it("clamps filters to safe values", () => {
    const f = parseFilters({ status: "x", service: "drop table", from: "2026-13-99x", pageSize: "100000", page: "-3", sort: "id; drop" });
    expect(f).toMatchObject({ status: "", service: "", from: "", pageSize: 100, page: 1, sort: "newest" });
  });
  it("whitelists patch fields", () => {
    const p = parsePatch({ status: "qualified", assignedTo: " Ravi ", email: "hacker@x.com", reference: "BH-XXXX" });
    expect(p).toEqual({ status: "qualified", assigned_to: "Ravi" });
  });
  it("builds a plain-text and HTML notification", () => {
    const m = buildLeadEmail({ id: "1", reference: "BH-ABCDEF", name: "A", company: "B", email: "a@b.co", phone: "+911234567890", service: "gst", message: "<img src=x onerror=alert(1)>", created_at: new Date().toISOString() });
    expect(m.subject).toContain("GST");
    expect(m.html).not.toContain("<img src=x");
    expect(m.text).toContain("<img src=x"); // plain text is not HTML
  });
});
