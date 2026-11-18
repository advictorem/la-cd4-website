import { defineConfig } from "@playwright/test";

// BASE_URL lets the same suite run against the deployed Vercel preview.
const baseURL = process.env.BASE_URL || "http://localhost:3100";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: { baseURL, channel: process.env.PW_CHANNEL || undefined, extraHTTPHeaders: process.env.VERCEL_BYPASS ? { "x-vercel-protection-bypass": process.env.VERCEL_BYPASS } : undefined },
  webServer: process.env.BASE_URL ? undefined : { command: "npm run build && PORT=3100 npm run start", url: "http://localhost:3100", reuseExistingServer: true, timeout: 180_000 },
});
