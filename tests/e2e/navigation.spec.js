import { test, expect } from "@playwright/test";

test("mobile menu opens, traps focus, closes on Escape and navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const burger = page.getByRole("button", { name: "Open menu" });
  await burger.click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  // the same service links as the desktop menu
  for (const name of ["HRMS software solutions", "Payroll, TDS & labour compliance", "Business registration, IPR & certifications", "Corporate retreats & workations", "Blog", "Careers", "FAQ"]) {
    await expect(dialog.getByRole("link", { name, exact: true })).toBeVisible();
  }
  // focus trap: shift-tab from the first element wraps to the last
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "Talk to an expert" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(burger).toBeFocused();

  await burger.click();
  await dialog.getByRole("link", { name: "Corporate retreats & workations" }).click();
  await expect(page).toHaveURL(/corporate-retreats-workations$/);
  await expect(dialog).toBeHidden();
  await expect(page.locator("h1")).toHaveText("Corporate Retreats");
});

test("desktop services menu works with mouse and keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/about");
  const btn = page.getByRole("button", { name: "Services" });
  await btn.focus();
  await page.keyboard.press("Enter");
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(btn).toHaveAttribute("aria-expanded", "false");
  await expect(btn).toBeFocused();
  await btn.hover();
  await page.locator("#services-menu").getByRole("link", { name: /Payroll, TDS/ }).click();
  await expect(page).toHaveURL(/payroll-tds-labour-compliance$/);
  await expect(btn).toHaveClass(/is-active/);
});

test("footer links and skip link work", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  const footer = page.locator("footer");
  for (const name of ["Privacy policy", "Terms & conditions", "Disclaimer"]) {
    const href = await footer.getByRole("link", { name }).getAttribute("href");
    const r = await page.request.get(href);
    expect(r.status(), href).toBe(200);
  }
});

test("no placeholder phone or WhatsApp links are shown", async ({ page }) => {
  for (const p of ["/", "/contact", "/thank-you"]) {
    await page.goto(p);
    expect(await page.locator('a[href^="tel:"], a[href*="wa.me"]').count(), p).toBe(0);
  }
});

test("every internal link on key pages resolves", async ({ page, request }) => {
  const seen = new Set();
  for (const p of ["/", "/about", "/contact", "/blog", "/hrms-software-solutions", "/faq", "/no-such-page"]) {
    await page.goto(p);
    const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    hrefs.forEach((h) => seen.add(h.split("#")[0].split("?")[0] || "/"));
  }
  const bad = [];
  for (const h of seen) {
    const r = await request.get(h);
    if (r.status() !== 200) bad.push(`${h} → ${r.status()}`);
  }
  expect(bad, bad.join("\n")).toEqual([]);
});
