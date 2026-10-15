import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { watchConsole } from "./util.js";

const ORIGIN = "https://www.360bizhealth.com";
const sitemap = fs.readFileSync("dist/sitemap.xml", "utf8");
const PAGES = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(ORIGIN, "") || "/");

test("sitemap lists every indexable page", () => {
  expect(PAGES.length).toBeGreaterThanOrEqual(17);
  expect(PAGES).toContain("/hrms-software-solutions");
  expect(PAGES).not.toContain("/thank-you");
  expect(PAGES).not.toContain("/admin");
});

for (const path of PAGES) {
  test(`page ${path} renders with correct metadata`, async ({ page, request }) => {
    const problems = watchConsole(page);
    // raw HTML (what crawlers get without JavaScript)
    const raw = await request.get(path);
    expect(raw.status()).toBe(200);
    const html = await raw.text();
    expect(html).toContain(`<link data-bh-head rel="canonical" href="${ORIGIN}${path === "/" ? "/" : path}">`);
    expect(html).toMatch(/<h1[^>]*>/);
    expect(html).toContain('data-prerendered="true"');

    const res = await page.goto(path);
    expect(res.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(ORIGIN + (path === "/" ? "/" : path));
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toMatch(/^index/);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.length).toBe(1);
    const graph = JSON.parse(ld[0])["@graph"];
    expect(graph[0]["@type"]).toBe("Organization");
    // every image has an alt attribute (empty is allowed for decorative images)
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);
    await page.waitForTimeout(150);
    expect(problems, problems.join("\n")).toEqual([]);
  });
}

test("unknown pages and unknown blog slugs return a real 404", async ({ page }) => {
  for (const p of ["/no-such-page", "/blog/no-such-article", "/hrms-software-solutions/extra"]) {
    const res = await page.goto(p);
    expect(res.status(), p).toBe(404);
    await expect(page.locator("h1")).toHaveText("That page doesn’t exist");
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toMatch(/noindex/);
  }
});

test("legacy and trailing-slash URLs redirect to canonical paths", async ({ request }) => {
  const cases = [
    ["/about/", "/about", 308],
    ["/resources/blogs-news/posh-act-2013-employer-guide", "/blog/posh-act-2013-employer-guide", 301],
    ["/privacy", "/privacy-policy", 301],
    ["/terms", "/terms-and-conditions", 301],
    ["/contact.html", "/contact", 308],
  ];
  for (const [from, to, status] of cases) {
    const r = await request.get(from, { maxRedirects: 0 });
    expect(r.status(), from).toBe(status);
    expect(new URL(r.headers()["location"], "http://x").pathname).toBe(to);
  }
});

test("old hash URLs are mapped to real paths", async ({ page }) => {
  await page.goto("/#/about");
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("h1")).toContainText("One partner");
});

test("API routes are not swallowed by the frontend", async ({ request }) => {
  const r = await request.get("/api/v1/health");
  expect(r.headers()["content-type"]).toContain("application/json");
  expect((await r.json()).status).toBe("ok");
  const missing = await request.get("/api/v1/does-not-exist");
  expect(missing.status()).toBe(404);
  expect(missing.headers()["content-type"]).toContain("application/json");
});

test("client-side navigation updates title, canonical and focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page).toHaveTitle(/About 360 Biz Health/);
  expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(ORIGIN + "/about");
  expect(await page.locator('script[type="application/ld+json"]').count()).toBe(1);
  await expect(page.locator("main")).toBeFocused();
});

test("each service page has its own H1, image and FAQ", async ({ page }) => {
  const seen = new Set();
  for (const slug of ["hrms-software-solutions", "payroll-tds-labour-compliance", "business-registration-ipr-certifications", "corporate-retreats-workations"]) {
    await page.goto("/" + slug);
    const h1 = await page.locator("h1").textContent();
    const img = await page.locator(".shero img").first();
    const alt = await img.getAttribute("alt");
    expect(alt.length).toBeGreaterThan(20);
    seen.add(h1 + "|" + (await img.getAttribute("src")));
    await expect(page.locator("#faq details").first()).toBeVisible();
    // breadcrumbs and contact CTA carry the service context
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    const cta = page.locator(".shero").getByRole("link", { name: "Talk to an expert" });
    expect(await cta.getAttribute("href")).toContain("from=" + slug);
  }
  expect(seen.size).toBe(4);
});

test("blog search and category filters work", async ({ page }) => {
  await page.goto("/blog");
  await page.getByLabel("Search guides").fill("gratuity");
  await expect(page.locator(".acard")).toHaveCount(1);
  await expect(page.locator(".acard h2")).toContainText("Full and Final Settlement");
  await expect(page.getByRole("status").filter({ hasText: "found" })).toHaveText("1 guide found");
  await page.getByLabel("Search guides").fill("zzzz-nothing");
  await expect(page.getByText("No guides match that search")).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await page.getByRole("button", { name: "Workplace culture" }).click();
  await expect(page).toHaveURL(/category=Workplace/);
  await expect(page.locator(".acard")).toHaveCount(1);
  await page.locator(".acard a").first().click();
  await expect(page).toHaveURL(/\/blog\/modern-leave-policy-india-2026$/);
  await expect(page.locator("h1")).toContainText("Modern Leave Policy");
});

test("article table of contents links to sections", async ({ page }) => {
  await page.goto("/blog/posh-act-2013-employer-guide");
  const links = page.locator(".toc a");
  expect(await links.count()).toBe(12);
  await links.nth(8).click();
  await expect(page).toHaveURL(/#complaint-procedure-and-timelines$/);
  await expect(page.locator("#complaint-procedure-and-timelines h2")).toBeInViewport();
});
