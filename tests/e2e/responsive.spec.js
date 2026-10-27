import { test, expect } from "@playwright/test";

const WIDTHS = [320, 375, 414, 768, 1024, 1366, 1440, 1920];
const PAGES = ["/", "/about", "/hrms-software-solutions", "/payroll-tds-labour-compliance", "/business-registration-ipr-certifications",
  "/corporate-retreats-workations", "/blog", "/blog/full-final-settlement-india-2026", "/contact", "/careers", "/faq", "/resources", "/privacy-policy", "/thank-you", "/no-such-page", "/admin"];

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const offenders = [];
    for (const p of PAGES) {
      await page.goto(p);
      await page.waitForLoadState("networkidle");
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll("body *")]
          .filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.right > vw + 1 && getComputedStyle(el).position !== "fixed" && !el.closest(".table-wrap, .ltable-wrap, .hp, .skip, .sr-only"); })
          .slice(0, 3)
          .map((el) => el.tagName + "." + el.className);
        return { overflow: document.documentElement.scrollWidth - vw, wide };
      });
      if (r.overflow > 0 || r.wide.length) offenders.push(`${p}: overflow ${r.overflow}px ${r.wide.join(", ")}`);
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });
}

test("touch targets in the mobile header and bar are at least 44px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  for (const sel of [".burger", ".mbar .btn"]) {
    const boxes = await page.locator(sel).evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    for (const h of boxes) expect(h, sel).toBeGreaterThanOrEqual(44);
  }
});

test("reduced motion shows content without animation", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/about");
  const hidden = await page.locator(".rv").evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length);
  expect(hidden).toBe(0);
  await ctx.close();
});

test("content keeps a side gutter on small phones", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  const bad = [];
  for (const p of PAGES.filter((x) => x !== "/admin")) {
    await page.goto(p);
    const { left, right } = await page.locator("h1").first().evaluate((h) => { const b = h.getBoundingClientRect(); return { left: b.left, right: window.innerWidth - b.right }; });
    if (left < 12 || right < 0) bad.push(`${p}: h1 left ${left}px`);
  }
  expect(bad, bad.join("\n")).toEqual([]);
});
