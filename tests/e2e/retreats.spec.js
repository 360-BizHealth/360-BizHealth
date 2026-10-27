import { test, expect } from "@playwright/test";
import { dbQuery, watchConsole } from "./util.js";

const URL = "/corporate-retreats-workations";

test("retreats page: one H1, hero image, sections in order, no console errors", async ({ page }) => {
  const problems = watchConsole(page);
  await page.goto(URL);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Corporate Retreats");
  expect((await page.locator(".rt-hero img").getAttribute("alt")).length).toBeGreaterThan(20);
  await expect(page).toHaveTitle(/Corporate Retreats/);
  const order = await page.locator(".rt h2").allTextContents();
  expect(order.slice(0, 6)).toEqual([
    "Bring Your Team Together Beyond the Workplace",
    "Let’s Plan Your Corporate Retreat",
    "Corporate Retreat FAQs",
    "Explore Our Corporate Retreat Packages",
    "Corporate Retreats Designed Around Your Team",
    "Ready to Plan Your Next Corporate Retreat?",
  ]);
  await expect(page.locator(".rt-pkg")).toHaveCount(3);
  await expect(page.locator(".rt-pkg").filter({ hasText: "Request a Quote" })).toHaveCount(3);
  await expect(page.locator("#rt-pkg-title")).toHaveText("Explore Our Corporate Retreat Packages");
  expect(problems).toEqual([]);
});

test("FAQ accordion opens and closes with mouse and keyboard", async ({ page }) => {
  await page.goto(URL);
  const q = page.getByRole("button", { name: "How much does a corporate retreat cost?" });
  const answer = page.getByRole("region", { name: "How much does a corporate retreat cost?" });
  await expect(q).toHaveAttribute("aria-expanded", "false");
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "true");
  await expect(answer).toContainText("customised quotation");
  await q.press("Enter");
  await expect(q).toHaveAttribute("aria-expanded", "false");
  await q.focus();
  await page.keyboard.press("Space");
  await expect(q).toHaveAttribute("aria-expanded", "true");
  expect(await page.getByRole("button", { name: /\?$/ }).count()).toBe(10);
});

test("package buttons scroll to the form and preselect the package, keeping typed answers", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(URL);
  await page.getByLabel("Full name").fill("Asha Rao");
  const offsite = page.locator(".rt-pkg").filter({ hasText: "Corporate Offsite" }).getByRole("button", { name: "Enquire Now" });
  await offsite.click();
  await expect(page.getByLabel("Package preference")).toHaveValue("corporate-offsite");
  await expect(page.locator("#enquiry-form")).toBeInViewport();
  await expect(page.getByLabel("Full name")).toHaveValue("Asha Rao");
  // choosing a package again after changing the dropdown still applies
  await page.getByLabel("Package preference").selectOption("custom");
  await offsite.click();
  await expect(page.getByLabel("Package preference")).toHaveValue("corporate-offsite");
  await page.locator(".rt-pkg").filter({ hasText: "Leadership Retreat" }).getByRole("button", { name: "Enquire Now" }).click();
  await expect(page.getByLabel("Package preference")).toHaveValue("leadership-retreat");
  // hero and final CTAs lead to the form
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("link", { name: "Start Your Enquiry" }).click();
  await expect(page.locator("#enquiry-form")).toBeInViewport();
});

test("empty submit shows field errors and sends nothing", async ({ page }) => {
  const before = (await dbQuery("select count(*)::int n from leads")).rows[0].n;
  await page.goto(URL);
  await page.getByRole("button", { name: "Submit Enquiry" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Please correct" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await expect(page.locator("#r-email-err")).toHaveText("Enter your work email.");
  await expect(page.locator("#r-participants-err")).toHaveText("Select the number of participants.");
  await expect(page.locator("#r-type-err")).toHaveText("Select the type of retreat.");
  await expect(page.locator("#r-duration-err")).toHaveText("Select how long the retreat should be.");
  await page.getByLabel("Work email").fill("not-an-email");
  await page.getByRole("button", { name: "Submit Enquiry" }).click();
  await expect(page.locator("#r-email-err")).toHaveText("Enter a valid email address.");
  expect((await dbQuery("select count(*)::int n from leads")).rows[0].n).toBe(before);
});

test("a valid retreat enquiry is stored with every retreat detail", async ({ page }) => {
  await page.goto(URL);
  await page.locator(".rt-pkg").filter({ hasText: "Team Recharge" }).getByRole("button", { name: "Enquire Now" }).click();
  const email = `asha.${Date.now()}@example.com`;
  await page.getByLabel("Full name").fill("Asha Rao");
  await page.getByLabel("Company name").fill("Rao Analytics");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Phone number").fill("98100 22334");
  await page.getByLabel("Number of participants").selectOption("21-50");
  await page.getByLabel("Type of retreat").selectOption("Team building");
  await page.getByLabel("Retreat duration").selectOption("3-4 days");
  await page.getByLabel("Preferred destination").fill("Hills, within a short flight of Delhi");
  await page.getByLabel("Preferred travel dates").fill("Second half of February");
  await page.getByLabel("Additional requirements").fill("Two vegetarian-only participants.");
  await page.getByLabel(/I agree that 360 Biz Health may contact me/).check();
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: "Submit Enquiry" }).click();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(page.locator(".phead .lede")).toContainText(/BH-[A-Z0-9]{6}/);
  const ref = (await page.locator(".phead .lede").textContent()).match(/BH-[A-Z0-9]{6}/)[0];
  const { rows } = await dbQuery("select * from leads where reference = $1", [ref]);
  expect(rows.length).toBe(1);
  const r = rows[0];
  expect(r.email).toBe(email);
  expect(r.service).toBe("corporate-retreat");
  expect(r.subject).toBe("Corporate retreat: Team building, 21-50 participants");
  for (const line of ["Participants: 21-50", "Type of retreat: Team building", "Duration: 3-4 days", "Package preference: Team Recharge",
    "Preferred destination: Hills, within a short flight of Delhi", "Preferred travel dates: Second half of February", "Two vegetarian-only participants."]) {
    expect(r.message).toContain(line);
  }
  expect(r.source_vertical).toBe("corporate-retreats-workations");
  // structured fields, used by the dashboard's package filter
  expect(r.retreat_package).toBe("team-recharge");
  expect(r.details).toEqual({ participants: "21-50", duration: "3-4 days", retreatType: "Team building", destination: "Hills, within a short flight of Delhi", travelDates: "Second half of February" });
  expect(r.source_page).toBe(URL);
});

test("a server failure is reported, not shown as success", async ({ page }) => {
  await page.goto(URL);
  await page.route("**/api/v1/enquiries", (r) => r.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false, error: { code: "internal_error", message: "Something went wrong on our side. Please try again." } }) }));
  await page.getByLabel("Full name").fill("Asha Rao");
  await page.getByLabel("Company name").fill("Rao Analytics");
  await page.getByLabel("Work email").fill("asha@example.com");
  await page.getByLabel("Phone number").fill("9810022334");
  await page.getByLabel("Number of participants").selectOption("10-20");
  await page.getByLabel("Type of retreat").selectOption("Leadership retreat");
  await page.getByLabel("Retreat duration").selectOption("1-2 days");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: "Submit Enquiry" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Something went wrong" })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(URL + "$"));
});

test("Explore Package opens an accessible dialog; Enquire Now inside it preselects the package", async ({ page }) => {
  await page.goto(URL);
  const btn = page.locator(".rt-pkg").filter({ hasText: "Leadership Retreat" }).getByRole("button", { name: "Explore Package" });
  await btn.click();
  const dlg = page.getByRole("dialog", { name: "Leadership Retreat" });
  await expect(dlg).toBeVisible();
  await expect(dlg).toContainText("Premium accommodation options");
  await expect(dlg).toContainText("Request a Quote");
  await page.keyboard.press("Escape");
  await expect(dlg).toBeHidden();
  await expect(btn).toBeFocused();
  await btn.click();
  await dlg.getByRole("button", { name: "Enquire Now" }).click();
  await expect(dlg).toBeHidden();
  await expect(page.getByLabel("Package preference")).toHaveValue("leadership-retreat");
  await expect(page.locator("#enquiry-form")).toBeInViewport();
});

test("form takes about 42% and the FAQ about 58% on desktop, and they stack on phones", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(URL);
  const f = await page.locator(".rt-ask__form").boundingBox();
  const q = await page.locator(".rt-faq").boundingBox();
  const share = f.width / (f.width + q.width);
  expect(share).toBeGreaterThan(0.39);
  expect(share).toBeLessThan(0.45);
  expect(Math.abs(f.y - q.y)).toBeLessThan(2);
  await page.setViewportSize({ width: 375, height: 800 });
  const f2 = await page.locator(".rt-ask__form").boundingBox();
  const q2 = await page.locator(".rt-faq").boundingBox();
  expect(q2.y).toBeGreaterThan(f2.y + f2.height - 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});
