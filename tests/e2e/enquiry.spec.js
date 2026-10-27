import { test, expect } from "@playwright/test";
import { dbQuery } from "./util.js";

async function fill(page, over = {}) {
  const v = { name: "Karan Mehta", company: "Mehta Logistics", email: `karan.${Date.now()}@example.com`, phone: "98100 12345", message: "We have 65 staff across Delhi and Pune and need payroll and PF/ESIC handled.", ...over };
  await page.getByLabel("Full name").fill(v.name);
  await page.getByLabel("Company name").fill(v.company);
  await page.getByLabel("Work email").fill(v.email);
  await page.getByLabel("Phone").fill(v.phone);
  await page.getByLabel("Message").fill(v.message);
  return v;
}

test("shows accessible validation errors and focuses the first invalid field", async ({ page }) => {
  const before = (await dbQuery("select count(*)::int n from leads")).rows[0].n;
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Please correct" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#f-email-err")).toHaveText("Enter your work email.");
  await expect(page.locator("#f-consent-err")).toHaveText("Please confirm you agree to be contacted.");
  // nothing was sent to the server
  const n = await dbQuery("select count(*)::int n from leads");
  expect(n.rows[0].n).toBe(before);
});

test("a valid enquiry is stored and the visitor gets a real reference", async ({ page }) => {
  await page.goto("/payroll-tds-labour-compliance");
  await page.locator(".shero").getByRole("link", { name: "Talk to an expert" }).click();
  await expect(page).toHaveURL(/\/contact\?service=payroll&from=payroll-tds-labour-compliance/);
  await expect(page.getByLabel("Service required")).toHaveValue("payroll");
  const v = await fill(page);
  await page.getByLabel("Company size").selectOption("51-200");
  await page.getByLabel("Subject").fill("Payroll handover");
  await page.getByLabel(/I agree that 360 Biz Health may contact me/).check();
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page).toHaveURL(/\/thank-you$/);
  const lede = await page.locator(".phead .lede").textContent();
  const ref = lede.match(/BH-[A-Z0-9]{6}/)[0];

  const { rows } = await dbQuery("select * from leads where reference = $1", [ref]);
  expect(rows.length).toBe(1);
  expect(rows[0].email).toBe(v.email);
  expect(rows[0].phone).toBe("+919810012345");
  expect(rows[0].service).toBe("payroll");
  expect(rows[0].company_size).toBe("51-200");
  expect(rows[0].subject).toBe("Payroll handover");
  expect(rows[0].source_vertical).toBe("payroll-tds-labour-compliance");
  expect(rows[0].source_page).toBe("/contact");
  expect(rows[0].notification_status).toBe("sent");
});

test("server errors are shown and never turned into a fake success", async ({ page }) => {
  await page.goto("/contact");
  await page.route("**/api/v1/enquiries", (r) => r.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false, error: { code: "internal_error", message: "Something went wrong on our side. Please try again." } }) }));
  await fill(page);
  await page.getByLabel("Service required").selectOption("hrms");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Something went wrong" })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("contact@360bizhealth.com");
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeEnabled();
});

test("network failure is reported", async ({ page }) => {
  await page.goto("/contact");
  await page.route("**/api/v1/enquiries", (r) => r.abort("failed"));
  await fill(page);
  await page.getByLabel("Service required").selectOption("gst");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "could not reach the server" })).toBeVisible();
  await expect(page).toHaveURL(/\/contact$/);
});

test("server-side field errors are mapped back onto the form", async ({ page }) => {
  await page.goto("/contact");
  await page.route("**/api/v1/enquiries", (r) => r.fulfill({ status: 422, contentType: "application/json", body: JSON.stringify({ ok: false, error: { code: "validation_failed", message: "Please correct the highlighted fields.", fields: { email: "This email domain does not accept mail." } } }) }));
  await fill(page);
  await page.getByLabel("Service required").selectOption("iso");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("#f-email-err")).toHaveText("This email domain does not accept mail.");
  await expect(page.getByLabel("Work email")).toBeFocused();
});
