import { test, expect } from "@playwright/test";
import { dbQuery, ADMIN, STAFF } from "./util.js";

test.beforeAll(async () => {
  // a few leads to manage
  for (let i = 0; i < 3; i++) {
    await dbQuery(
      `insert into leads (reference, name, email, phone, company, service, message, consent, consent_version, content_hash, status)
       values ($1,$2,$3,'+919811100000',$4,$5,'A message long enough to be valid for testing.', true, 'test', md5($1), 'new')`,
      [`BH-E2E00${i}`, `Seeded Person ${i}`, `seed${i}@example.com`, `Seed Co ${i}`, i === 0 ? "hrms" : "gst"]
    );
  }
});

async function signIn(page, who = ADMIN) {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await page.getByLabel("Email").fill(who.email);
  await page.getByLabel("Password").fill(who.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Leads", exact: true })).toBeVisible();
}

test("admin data is not available without signing in", async ({ page, request }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  expect(await page.locator("text=seed0@example.com").count()).toBe(0);
  const r = await request.get("/api/v1/admin/leads");
  expect(r.status()).toBe(401);
  const html = await (await request.get("/admin")).text();
  expect(html).toContain("noindex");
  expect(html).not.toContain("seed0@example.com");
});

test("wrong password shows an error", async ({ page }) => {
  await page.goto("/admin");
  await page.getByLabel("Email").fill(ADMIN.email);
  await page.getByLabel("Password").fill("not the password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toContainText("email or password is incorrect");
});

test("admin can filter, open a lead, update it, add a note and export", async ({ page }) => {
  await signIn(page);
  await expect(page.locator(".stat").first()).toContainText(/\d+/);
  await expect(page.getByRole("link", { name: "Seeded Person 0" })).toBeVisible();

  await page.getByLabel("Service").selectOption("gst");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/service=gst/);
  await expect(page.getByRole("link", { name: "Seeded Person 0" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Seeded Person 1" })).toBeVisible();

  await page.getByLabel("Search").fill("BH-E2E002");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator(".ltable tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Seeded Person 2" }).click();
  await expect(page).toHaveURL(/\/admin\/leads\/[0-9a-f-]{36}$/);
  await expect(page.getByRole("heading", { name: "Seeded Person 2" })).toBeVisible();

  await page.getByLabel("Status").selectOption("qualified");
  await page.getByLabel("Assigned to").fill("Priya");
  await page.getByLabel("Next follow-up").fill("2026-11-20");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Changes saved.")).toBeVisible();
  await expect(page.locator(".adm__head .pill")).toHaveText("Qualified");
  await expect(page.locator(".activity")).toContainText("status: new → qualified");

  await page.getByLabel("Add a follow-up note").fill("Discussed GST registration for second state.");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.locator(".notes")).toContainText("Discussed GST registration");

  const row = (await dbQuery("select status, assigned_to, next_follow_up::text d from leads where reference = 'BH-E2E002'")).rows[0];
  expect(row).toEqual({ status: "qualified", assigned_to: "Priya", d: "2026-11-20" });

  // refresh keeps the session (cookie) and deep link works
  await page.reload();
  await expect(page.getByRole("heading", { name: "Seeded Person 2" })).toBeVisible();

  await page.getByRole("link", { name: "Back to all leads" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Export CSV" }).click();
  const file = await download;
  const text = await (await file.createReadStream()).toArray().then((c) => Buffer.concat(c).toString("utf8"));
  expect(text).toContain("BH-E2E002");
  expect(text.split("\r\n")[0]).toContain('"Reference"');

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  const after = await page.request.get("/api/v1/admin/leads");
  expect(after.status()).toBe(401);
});

test("staff can manage leads but cannot export", async ({ page }) => {
  await signIn(page, STAFF);
  await expect(page.getByRole("link", { name: "Export CSV" })).toHaveCount(0);
  const r = await page.request.get("/api/v1/admin/leads/export");
  expect(r.status()).toBe(403);
});

test("the dashboard is usable on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await signIn(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
  // table rows collapse into labelled cards
  const label = await page.locator(".ltable td").first().evaluate((td) => getComputedStyle(td, "::before").content);
  expect(label).toContain("Received");
});
