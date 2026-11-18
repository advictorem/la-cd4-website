import { test as base, expect } from "@playwright/test";

/**
 * Shared test setup.
 * - The timed sign-up prompt is suppressed unless a test opts in (allowPrompt), so it cannot cover the page mid-test.
 * - The City's navbar widget (navbar.lacity.org) is blocked unless a test opts in (allowCityWidget), so the suite
 *   does not depend on a third-party host; the site's stand-in bar is what gets tested.
 */
export const test = base.extend<{ allowPrompt: boolean; allowCityWidget: boolean }>({
  allowPrompt: [false, { option: true }],
  allowCityWidget: [false, { option: true }],
  page: async ({ page, allowPrompt, allowCityWidget }, run) => {
    if (!allowPrompt) await page.addInitScript(() => { try { localStorage.setItem("cd4-signup-prompt", String(Date.now())); } catch { /* ignore */ } });
    if (!allowCityWidget) await page.route("https://navbar.lacity.org/**", (r) => r.abort());
    await run(page);
  },
});
export { expect };
