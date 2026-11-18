// Verifies the color tokens against WCAG contrast thresholds. Run: npm run check:contrast
import { readFileSync } from "node:fs";
const css = readFileSync(new URL("../styles/tokens.css", import.meta.url), "utf8");
const t = Object.fromEntries([...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
const lum = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const checks = [
  ["ink", "paper", 4.5], ["ink-2", "paper", 4.5], ["muted", "paper", 4.5], ["muted", "wash", 4.5], ["muted", "cream", 4.5],
  ["blue-700", "paper", 4.5], ["blue-700", "blue-100", 4.5], ["blue-700", "cream", 4.5], ["blue-700", "wash", 4.5], ["paper", "blue-700", 4.5], ["paper", "blue-600", 4.5],
  ["paper", "city-navy", 4.5], ["city-navy", "city-gold", 4.5], ["city-navy", "paper", 4.5], ["line-strong", "paper", 3], ["blue-900", "blue-100", 4.5],
];
for (const f of ["green", "purple", "terracotta", "teal", "amber", "slate", "ochre", "red"]) {
  checks.push([`${f}-ink`, "paper", 7], [`${f}-ink`, `${f}-tint`, 4.5], ["paper", `${f}-ink`, 4.5], [`${f}-accent`, "paper", 3], [`${f}-accent`, `${f}-tint`, 3], ["ink", `${f}-tint`, 4.5], ["muted", `${f}-tint`, 4.5], ["blue-700", `${f}-tint`, 4.5]);
}
let fail = 0;
for (const [fg, bg, min] of checks) {
  const r = ratio(t[fg], t[bg]);
  if (r < min) { fail++; console.log(`FAIL ${fg} on ${bg}: ${r.toFixed(2)} < ${min}`); }
}
console.log(`${checks.length - fail}/${checks.length} token pairs meet their contrast target`);
process.exit(fail ? 1 : 0);
