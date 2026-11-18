// External link check. Crawls the running site (BASE_URL, default http://localhost:3100) via its sitemap,
// collects every external href, and requests each one with curl (so proxy settings are honored).
// Writes docs/link-check.json and prints a summary. 403/405/429 from an agency site usually means
// "blocks automated requests", not "broken" — those are listed separately for a manual check.
import { execFile } from "node:child_process";
import { writeFileSync } from "node:fs";

const base = process.env.BASE_URL || "http://localhost:3100";
const get = async (u) => (await fetch(u)).text();
const routes = [...(await get(`${base}/sitemap.xml`)).matchAll(/<loc>[^<]*?\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);
const found = new Map();
for (const r of routes) {
  const html = await get(base + r);
  for (const m of html.matchAll(/<a\b[^>]*?href="(https?:\/\/[^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, "&");
    if (url.startsWith("https://translate.google.com/")) continue;
    if (!found.has(url)) found.set(url, r);
  }
}
const check = (url) => new Promise((resolve) => {
  execFile("curl", ["-sS", "-L", "-o", "/dev/null", "-w", "%{http_code}", "--connect-timeout", "8", "--max-time", "20", "-A", "Mozilla/5.0 (link check; la-cd4-website)", url], { encoding: "utf8" },
    (_err, stdout) => resolve(Number((stdout || "").trim()) || 0));
});
const queue = [...found];
const results = [];
await Promise.all(Array.from({ length: 12 }, async () => {
  for (let item; (item = queue.shift()); ) results.push({ url: item[0], from: item[1], status: await check(item[0]) });
}));
const ok = results.filter((r) => r.status >= 200 && r.status < 400);
const blocked = results.filter((r) => [401, 403, 405, 406, 429, 503].includes(r.status));
const broken = results.filter((r) => !ok.includes(r) && !blocked.includes(r));
writeFileSync("docs/link-check.json", JSON.stringify({ checkedAt: new Date().toISOString(), total: results.length, ok: ok.length, blocked, broken }, null, 2));
console.log(`external links: ${results.length} checked, ${ok.length} ok, ${blocked.length} blocked automated request, ${broken.length} broken/unreachable`);
for (const r of broken) console.log("BROKEN", r.status, r.url, "from", r.from);
for (const r of blocked) console.log("BLOCKED", r.status, r.url);
process.exit(broken.length ? 1 : 0);
