import { chromium, type FullConfig } from "@playwright/test";

/**
 * When testing a protected Vercel deployment, open its share link once and save the session
 * so every test (and API request) is authorized. Set VERCEL_SHARE_URL to the link from
 * Vercel → Deployment → Share; it is never committed.
 */
export default async function globalSetup(config: FullConfig) {
  const share = process.env.VERCEL_SHARE_URL;
  if (!share) return;
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
  const page = await browser.newPage();
  await page.goto(share, { waitUntil: "networkidle" });
  await page.context().storageState({ path: "test-results/.auth.json" });
  await browser.close();
  void config;
}
