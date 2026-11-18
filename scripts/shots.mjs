// Usage: node scripts/shots.mjs <baseUrl> <outDir> [path ...]  — captures full-page desktop (1440) + mobile (375) PNG screenshots.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const [base, out, ...paths] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });
for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 375, height: 812 }]]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: name === "mobile" ? 2 : 1 });
  const page = await ctx.newPage();
  if (process.env.VERCEL_SHARE_URL) await page.goto(process.env.VERCEL_SHARE_URL, { waitUntil: "networkidle" }); // authorize a protected preview
  for (const p of paths.length ? paths : ["/"]) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    // Scroll through the page so lazy-loaded images are present in the capture.
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await page.waitForLoadState("networkidle");
    const file = `${out}/${name}-${p.replace(/\W+/g, "_").replace(/^_|_$/g, "") || "home"}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
  await ctx.close();
}
await browser.close();
