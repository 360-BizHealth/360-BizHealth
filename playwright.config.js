import fs from "node:fs";
import { defineConfig, devices } from "@playwright/test";

/* End-to-end tests run against the production build (npm run build) served by
   scripts/serve.mjs, with a throwaway PostgreSQL and stubbed Supabase Auth/Resend
   started in tests/e2e/global-setup.js. */
const localChromium = "/opt/pw-browsers/chromium";
const launchOptions = fs.existsSync(localChromium) ? { executablePath: localChromium } : {};

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.js",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4317",
    trace: "off",
    launchOptions,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], launchOptions } }],
});
