import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { dbQuery, ADMIN, STAFF, watchConsole } from "./util.js";

/* Sign in once per role and reuse the session: the login endpoint is rate-limited
   per account (6 attempts / 15 min), exactly as in production. */
const sessions = {};
test.beforeAll(async ({ browser }) => {
  for (const [key, who] of [["admin", ADMIN], ["staff", STAFF]]) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/admin");
    await page.getByLabel("Email").fill(who.email);
    await page.getByLabel("Password").fill(who.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
    sessions[key] = await ctx.storageState();
    await ctx.close();
  }
});

async function adminPage(browser, who = "admin") {
  const page = await (await browser.newContext({ storageState: sessions[who] })).newPage();
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  return page;
}

test("a contact-form enquiry appears in Admin → Leads and can be opened and managed", async ({ page, browser }) => {
  const email = `meera.${Date.now()}@example.com`;
  await page.goto("/contact");
  await page.getByLabel("Full name").fill("Meera Iyer");
  await page.getByLabel("Company name").fill("Iyer Fintech");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Phone").first().fill("98201 55667");
  await page.getByLabel("Service required").selectOption("hrms");
  await page.getByLabel("Message").fill("We have 140 employees across Mumbai and Pune and want an HRMS shortlist.");
  await page.getByLabel(/I agree that 360 Biz Health/).check();
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page).toHaveURL(/\/thank-you$/);
  await expect(page.locator(".phead .lede")).toContainText(/BH-[A-Z0-9]{6}/);
  const ref = (await page.locator(".phead .lede").textContent()).match(/BH-[A-Z0-9]{6}/)[0];

  const admin = await adminPage(browser);
  await expect(admin.locator(".kpis")).toBeVisible();
  await admin.getByRole("link", { name: "Meera Iyer" }).first().click(); // recent leads on the dashboard
  await expect(admin.getByRole("heading", { name: "Meera Iyer" })).toBeVisible();
  await expect(admin.getByText(ref)).toBeVisible();
  await expect(admin.getByText(email)).toBeVisible();

  await admin.goto("/admin/leads");
  await admin.getByLabel("Search").fill(ref);
  await admin.getByRole("button", { name: "Apply filters" }).click();
  await expect(admin.locator(".ltable tbody tr")).toHaveCount(1);
  // the new lead is counted in the Enquiries (new) view
  await admin.getByRole("navigation", { name: "Dashboard navigation" }).getByRole("link", { name: /Enquiries/ }).click();
  await expect(admin.getByRole("heading", { name: "Enquiries", exact: true })).toBeVisible();
  await expect(admin.getByRole("link", { name: "Meera Iyer" })).toBeVisible();
});

test("a corporate retreat enquiry shows its package and details in the lead view", async ({ page, browser }) => {
  await page.goto("/corporate-retreats-workations");
  await page.locator(".rt-pkg").filter({ hasText: "Corporate Offsite" }).getByRole("button", { name: "Enquire Now" }).click();
  const email = `rohan.${Date.now()}@example.com`;
  await page.getByLabel("Full name").fill("Rohan Kapoor");
  await page.getByLabel("Company name").fill("Kapoor Logistics");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Phone number").fill("98110 44556");
  await page.getByLabel("Number of participants").selectOption("51-100");
  await page.getByLabel("Type of retreat").selectOption("Corporate offsite");
  await page.getByLabel("Retreat duration").selectOption("3-4 days");
  await page.getByLabel(/I agree that 360 Biz Health/).check();
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: "Submit Enquiry" }).click();
  await expect(page).toHaveURL(/\/thank-you$/);

  const admin = await adminPage(browser);
  await admin.goto("/admin/leads?package=corporate-offsite");
  await admin.getByRole("link", { name: "Rohan Kapoor" }).first().click();
  const details = admin.locator("section", { hasText: "Corporate retreat details" }).first();
  await expect(details).toContainText("Corporate Offsite");
  await expect(details).toContainText("51-100");
  await expect(details).toContainText("3-4 days");
  await admin.goto("/admin/retreats");
  await expect(admin.locator(".pkgcard").filter({ hasText: "Corporate Offsite" })).toContainText(/[1-9]\d* enquir/);
});

test("blog CMS: draft is private, publish goes live on /blog, edits show, unpublish and delete remove it", async ({ browser, request }) => {
  const page = await adminPage(browser);
  const problems = watchConsole(page);
  const slug = `offsite-checklist-${Date.now()}`;
  await page.getByRole("navigation", { name: "Dashboard navigation" }).getByRole("link", { name: "Blog Management" }).click();
  await page.getByRole("link", { name: "Add New Blog" }).click();
  await page.getByLabel("Title", { exact: true }).fill("Offsite checklist for HR teams");
  await page.getByLabel("URL slug").fill(slug);
  await page.getByLabel("Short excerpt").fill("A practical checklist for planning a corporate offsite that delivers results.");
  await page.locator("#p-content").fill("## Start with the objective\n\nDecide what the offsite must achieve.\n\n- Morning sessions\n- Afternoon activities\n\n<script>window.__pwned = 1</script>\n");
  await page.getByLabel("Category").fill("Corporate retreats");
  await page.locator("label.upload input[type=file]").setInputFiles(path.resolve("public/blog-images/hr-technology-lg.webp"));
  await expect(page.locator(".featimg img")).toHaveAttribute("src", /^\/api\/v1\/media\/[0-9a-f-]{36}$/);
  await page.getByLabel(/Image alt text/).fill("An HR dashboard on a laptop screen");
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByText("Draft saved")).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/blog\/[0-9a-f-]{36}$/);

  // drafts are not public
  expect((await request.get("/blog/" + slug)).status()).toBe(404);
  expect(await (await request.get("/blog")).text()).not.toContain(slug);

  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("Published. The post is now live")).toBeVisible();

  // server-rendered public page (what crawlers and a direct visit get)
  const raw = await request.get("/blog/" + slug);
  expect(raw.status()).toBe(200);
  const html = await raw.text();
  expect(html).toContain("Offsite checklist for HR teams");
  expect(html).toContain('<h2 id="start-with-the-objective">');
  expect(html).toContain(`rel="canonical" href="https://www.360bizhealth.com/blog/${slug}"`);
  expect(html).toContain('"@type":"BlogPosting"');
  expect(html).not.toContain("<script>window.__pwned");
  expect(await (await request.get("/blog")).text()).toContain(`/blog/${slug}`);
  expect(await (await request.get("/sitemap.xml")).text()).toContain(`/blog/${slug}</loc>`);

  const pub = await page.context().newPage();
  await pub.goto("/blog/" + slug);
  await expect(pub.locator("h1")).toHaveText("Offsite checklist for HR teams");
  await expect(pub.locator(".prose-article img").first()).toHaveJSProperty("complete", true);
  expect(await pub.evaluate(() => window.__pwned)).toBeUndefined();
  await pub.goto("/blog");
  await expect(pub.getByRole("link", { name: "Offsite checklist for HR teams" })).toBeVisible();

  // edit the live post
  await page.getByLabel("Title", { exact: true }).fill("Offsite checklist for HR and leadership teams");
  await page.getByRole("button", { name: "Update live post" }).click();
  await expect(page.getByText("Changes saved and live")).toBeVisible();
  await expect.poll(async () => (await (await request.get("/blog/" + slug)).text()).includes("Offsite checklist for HR and leadership teams")).toBe(true);

  // unpublish
  await page.getByRole("button", { name: "Unpublish" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Unpublish" }).click();
  await expect(page.getByText("Unpublished.")).toBeVisible();
  expect((await request.get("/blog/" + slug)).status()).toBe(404);
  expect((await request.get(`/api/v1/posts/${slug}`)).status()).toBe(404);

  // delete
  await page.getByRole("button", { name: "Delete post" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete post" }).click();
  await expect(page).toHaveURL(/\/admin\/blog$/);
  expect((await dbQuery("select count(*)::int n from blog_posts where slug = $1", [slug])).rows[0].n).toBe(0);
  expect(problems.filter((p) => !/status of (401|404)/.test(p))).toEqual([]);
});

test("existing article URLs still work after the move to the database, and client-side navigation loads posts", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer").getByRole("link", { name: "Blog" }).click();
  await expect(page.locator(".acard").first()).toBeVisible();
  await page.goto("/blog/posh-act-2013-employer-guide#what-is-the-posh-act-2013");
  await expect(page.locator("h1")).toContainText("POSH Act 2013");
  await expect(page.locator("#what-is-the-posh-act-2013")).toBeVisible();
  await expect(page.locator("#faq details")).toHaveCount(await page.locator("#faq details").count());
  expect(await page.locator("#faq details").count()).toBeGreaterThanOrEqual(3);
});

test("staff can draft but not publish; the editor says so", async ({ browser }) => {
  const page = await adminPage(browser, "staff");
  await page.goto("/admin/blog/new");
  await expect(page.getByRole("button", { name: "Save draft" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Publish" })).toHaveCount(0);
  await expect(page.getByText("an administrator publishes it")).toBeVisible();
});

test("admin screens have no automated accessibility violations", async ({ browser }) => {
  const page = await adminPage(browser);
  const problems = [];
  for (const p of ["/admin", "/admin/leads", "/admin/blog", "/admin/blog/new", "/admin/retreats", "/admin/users"]) {
    await page.goto(p);
    await page.waitForLoadState("networkidle");
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    for (const v of r.violations) problems.push(`${p}: ${v.id} (${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")})`);
  }
  expect(problems, problems.join("\n")).toEqual([]);
});
