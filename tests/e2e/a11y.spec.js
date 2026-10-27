import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/about", "/hrms-software-solutions", "/payroll-tds-labour-compliance", "/business-registration-ipr-certifications",
  "/corporate-retreats-workations", "/blog", "/blog/posh-act-2013-employer-guide", "/contact", "/careers", "/faq", "/resources", "/no-such-page", "/admin"];

for (const width of [1366, 375]) {
  test(`automated WCAG 2.2 AA checks (axe) at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const problems = [];
    for (const p of PAGES) {
      await page.goto(p);
      await page.waitForLoadState("networkidle");
      // reveal animations finished, so colours are measured at full opacity
      await page.addStyleTag({ content: ".rv{opacity:1!important;transform:none!important;transition:none!important}" });
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      for (const v of r.violations) problems.push(`${p}: [${v.impact}] ${v.id} – ${v.help} (${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")})`);
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
}
