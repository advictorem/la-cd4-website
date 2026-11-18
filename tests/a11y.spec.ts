import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import { templates } from "./routes";

// axe-core against every page template, desktop and mobile, including open menus.
// Automated checks cover only part of WCAG; see docs/accessibility.md for the manual checks.
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const [label, viewport] of [["desktop", { width: 1280, height: 900 }], ["mobile", { width: 375, height: 812 }]] as const) {
  test.describe(`axe ${label}`, () => {
    test.use({ viewport });
    for (const route of templates) {
      test(route, async ({ page }) => {
        await page.goto(route);
        const results = await new AxeBuilder({ page }).withTags(tags).analyze();
        expect(results.violations.map((v) => `${v.impact}: ${v.id} — ${v.nodes.length} node(s): ${v.nodes[0]?.html.slice(0, 120)}`)).toEqual([]);
      });
    }
    test("open navigation panel", async ({ page }) => {
      await page.goto("/");
      if (label === "mobile") await page.getByRole("button", { name: "Menu" }).click();
      await page.locator("#nav-btn-topics").click();
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(results.violations.map((v) => `${v.impact}: ${v.id} — ${v.nodes[0]?.html.slice(0, 120)}`)).toEqual([]);
    });
    test("accessibility menu open, with high contrast on", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /Accessibility/ }).click();
      await page.getByRole("switch", { name: /High contrast/ }).click();
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(results.violations.map((v) => `${v.impact}: ${v.id} — ${v.nodes[0]?.html.slice(0, 120)}`)).toEqual([]);
    });
    test.describe("sign-up prompt", () => {
      test.use({ allowPrompt: true });
      test("open dialog", async ({ page }) => {
        await page.goto("/district-4/");
        await expect(page.getByRole("dialog")).toBeVisible({ timeout: 20_000 });
        // The framed Indigov form is the vendor's document and is excluded here; it needs its own review (docs/accessibility.md).
        const results = await new AxeBuilder({ page }).withTags(tags).exclude("dialog iframe").analyze();
        expect(results.violations.map((v) => `${v.impact}: ${v.id} — ${v.nodes[0]?.html.slice(0, 120)}`)).toEqual([]);
      });
    });
    test("calendar view and language menu", async ({ page }) => {
      await page.goto("/events/");
      await page.getByRole("button", { name: "Calendar" }).click();
      await page.getByRole("button", { name: "Select language" }).click();
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(results.violations.map((v) => `${v.impact}: ${v.id} — ${v.nodes[0]?.html.slice(0, 120)}`)).toEqual([]);
    });
  });
}
