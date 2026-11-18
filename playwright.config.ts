import { defineConfig } from "@playwright/test";

// BASE_URL lets the same suite run against the deployed Vercel preview.
const baseURL = process.env.BASE_URL || "http://localhost:3100";
export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/global-setup.ts",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: { baseURL, channel: process.env.PW_CHANNEL || undefined, storageState: process.env.VERCEL_SHARE_URL ? "test-results/.auth.json" : undefined },
  webServer: process.env.BASE_URL ? undefined : { command: "npm run build && PORT=3100 npm run start", url: "http://localhost:3100", reuseExistingServer: true, timeout: 180_000 },
});
