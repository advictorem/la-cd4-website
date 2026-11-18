import { test, expect } from "@playwright/test";
import { requiredRoutes, templates } from "./routes";

test.describe("routes", () => {
  for (const route of requiredRoutes) {
    test(`renders ${route}`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toBeVisible();
      expect((await page.title()).length).toBeGreaterThan(10);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{20,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    });
  }

  test("unknown path returns the designed 404", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("search").first()).toBeVisible();
  });

  test("legacy paths redirect to their neutral replacements", async ({ page }) => {
    await page.goto("/initiatives/");
    await expect(page).toHaveURL(/\/topics-resources\/$/);
    await page.goto("/meet-nithya/");
    await expect(page).toHaveURL(/\/district-4\/$/);
  });
});

test.describe("staging protections", () => {
  test("noindex header, meta and robots.txt", async ({ page, request }) => {
    const res = await page.goto("/");
    expect(res?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \/\s*$/m);
  });
  test("security headers are present", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["content-security-policy"]).toContain("default-src 'self'");
    expect(h["x-content-type-options"]).toBe("nosniff");
  });
});

test.describe("navigation", () => {
  test("six primary sections, each with a landing page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const buttons = nav.locator(".site-nav__btn");
    await expect(buttons).toHaveCount(6);
    await expect(buttons).toHaveText([/City Services/, /Topics & Resources/, /Neighborhoods/, /News & Events/, /About CD4/, /Contact/]);
    for (const id of ["services", "topics", "neighborhoods", "news", "about", "contact"]) {
      await page.locator(`#nav-btn-${id}`).click();
      const overview = page.locator(`#nav-panel-${id} .site-nav__overview`);
      await expect(overview).toBeVisible();
      const href = await overview.getAttribute("href");
      expect((await page.request.get(href!)).status()).toBe(200);
      await page.keyboard.press("Escape");
    }
  });

  test("dropdowns work from the keyboard: open, move, Escape returns focus", async ({ page }) => {
    await page.goto("/district-4/");
    const btn = page.locator("#nav-btn-topics");
    await btn.focus();
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Enter");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#nav-panel-topics")).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.locator("#nav-panel-topics .site-nav__overview")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("#nav-panel-topics a").nth(1)).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("#nav-panel-topics")).toBeHidden();
    await expect(btn).toBeFocused();
    // Tabbing past the navigation closes an open panel.
    await page.locator("#nav-btn-contact").click();
    await expect(page.locator("#nav-panel-contact")).toBeVisible();
    await page.locator("main a").first().focus();
    await expect(page.locator("#nav-panel-contact")).toBeHidden();
  });

  test("skip link is first in the tab order and moves focus to main", async ({ page }) => {
    await page.goto("/topics-resources/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("mobile menu is a real disclosure", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/neighborhoods/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(page.locator("#primary-nav")).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.locator("#nav-btn-neighborhoods").click();
    await page.getByRole("link", { name: "Reseda" }).first().click();
    await expect(page).toHaveURL(/\/neighborhood\/reseda\/$/);
    await expect(page.locator("#primary-nav")).toBeHidden(); // closes after navigation
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });

  test("current section is exposed in the navigation", async ({ page }) => {
    await page.goto("/initiative/parks/");
    await expect(page.locator("#nav-btn-topics")).toContainText("current section");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).locator("[aria-current=page]")).toHaveText("Parks & Recreation");
  });
});

test.describe("search", () => {
  test("finds text that only appears in a page body, with a snippet", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("search", { name: "Search Council District 4" }).getByRole("searchbox").fill("Kawé’nga");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/search\/\?q=/);
    await expect(page.getByRole("status").first()).toContainText("result");
    const first = page.locator(".results li").first();
    await expect(first.getByRole("link")).toHaveText("Studio City & Cahuenga Pass");
    await expect(first.locator("mark").first()).toBeVisible();
  });
  test("ranks the obvious page first for common tasks", async ({ page }) => {
    for (const [q, title] of [["rent increase eviction", "Renter Rights & Assistance"], ["brush clearance", "Public Safety & Preparedness"], ["grant", "Grant requests"], ["governance reform", "City Government & Transparency"], ["solstice hike", "Tom LaBonge Civic Project Solstice Hike"]]) {
      await page.goto(`/search/?q=${encodeURIComponent(q)}`);
      await expect(page.locator(".results li").first().getByRole("link"), q).toHaveText(title);
    }
  });
  test("every result links to a page that exists", async ({ page, request }) => {
    await page.goto("/search/?q=city");
    const hrefs = await page.locator(".results h2 a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    expect(hrefs.length).toBeGreaterThan(5);
    for (const h of hrefs) expect((await request.get(h)).status(), h).toBe(200);
  });
  test("no-results state is announced and offers next steps", async ({ page }) => {
    await page.goto("/search/?q=zzzzqqq");
    await expect(page.getByRole("status").first()).toHaveText(/No results for/);
    await expect(page.getByRole("heading", { name: "Try a different search" })).toBeVisible();
  });
  test("header search works from an inner page", async ({ page }) => {
    await page.goto("/district-4/");
    await page.getByRole("search", { name: "Site search" }).getByRole("searchbox").fill("library");
    await page.keyboard.press("Enter");
    await expect(page.locator(".results li").first()).toBeVisible();
  });
});

test.describe("forms keep their existing platforms", () => {
  test("this site posts no form data anywhere except its own search", async ({ page }) => {
    for (const route of ["/need-help/", "/sign-up/", "/grant-requests/", "/transit-traffic-safety-requests/", "/scheduling-requests/"]) {
      await page.goto(route);
      const actions = await page.locator("form").evaluateAll((fs) => fs.map((f) => f.getAttribute("action")));
      expect(actions.every((a) => a === "/search/"), route).toBe(true);
      await expect(page.locator("main input:not([type=search]), main textarea, main select")).toHaveCount(0);
    }
  });
  test("assistance form is framed from Indigov only on request, with a titled iframe and fallback link", async ({ page }) => {
    await page.goto("/need-help/");
    await expect(page.locator("iframe")).toHaveCount(0); // nothing third-party loads until asked
    const fallback = page.getByRole("link", { name: /Open on Indigov/ });
    await expect(fallback).toHaveAttribute("href", /^https:\/\/forms\.indigov\.com\/customers\/councilmember-nithyaraman\/7d242ff2/);
    await page.getByRole("button", { name: "Load the form on this page" }).click();
    const frame = page.locator("iframe");
    await expect(frame).toHaveAttribute("title", "Request assistance form");
    await expect(frame).toHaveAttribute("src", /^https:\/\/forms\.indigov\.com\//);
  });
  test("grant page states the program is on hold and offers no application", async ({ page }) => {
    await page.goto("/grant-requests/");
    await expect(page.getByText("Applications are not open")).toBeVisible();
    await expect(page.locator("main").getByRole("link", { name: /apply/i })).toHaveCount(0);
  });
  test("scheduling and traffic pages hand off to the original endpoints", async ({ page }) => {
    await page.goto("/scheduling-requests/");
    await expect(page.getByRole("link", { name: /Open the scheduling form/ })).toHaveAttribute("href", /docs\.google\.com\/forms\/d\/e\/1FAIpQLSfh8udXoy8vyqGAseAacWXOW76hDEVASX1DKCYQhYRe0YPCXQ/);
    await page.goto("/transit-traffic-safety-requests/");
    await expect(page.locator("main").getByRole("link", { name: /Open MyLA311/ }).first()).toHaveAttribute("href", "https://myla311.lacity.gov/");
  });
});

test.describe("events", () => {
  test("list is the default; calendar is available; empty dates are not interactive", async ({ page }) => {
    await page.goto("/events/");
    await expect(page.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Past events" })).toBeVisible();
    await page.getByRole("button", { name: "Calendar" }).click();
    const cal = page.locator(".cal");
    await expect(cal.getByRole("table")).toBeVisible();
    // Only cells with events contain links; no buttons inside the grid.
    await expect(cal.locator("td button")).toHaveCount(0);
    const cells = await cal.locator("td:not([data-out])").count();
    const linked = await cal.locator("td:has(a)").count();
    expect(linked).toBeLessThan(cells);
    await expect(cal.getByRole("status")).toContainText(/listed for/);
    await cal.getByRole("button", { name: /Previous/ }).click();
    await expect(cal.getByRole("status")).toContainText(/listed for/);
  });
  test("every listed event comes from the captured source data", async ({ page }) => {
    await page.goto("/events/");
    const links = page.locator(".event-list h3 a");
    expect(await links.count()).toBeGreaterThan(0);
    await links.first().click();
    await expect(page.getByRole("link", { name: /View original listing/ })).toHaveAttribute("href", /^https:\/\/cd4\.lacity\.gov\/event\//);
  });
});

test.describe("content rules", () => {
  test("no former-officeholder branding or first-person office language outside the archive", async ({ page }) => {
    test.setTimeout(180_000);
    const archive = ["/press-releases/", "/newsletters/", "/news/"];
    for (const route of requiredRoutes.filter((r) => !archive.includes(r) && !r.startsWith("/search"))) {
      await page.goto(route);
      const text = (await page.locator("body").innerText()).replace(/councilmember-nithyaraman/g, "");
      expect(text, route).not.toMatch(/\bRaman\b|\bNithya\b|\bmy office\b|\bour office\b|\bI look forward\b/i);
    }
  });
  test("representation notice is off by default", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".rep-notice")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/vacan/i);
  });
  test("share control copies the current URL and announces it", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/initiative/parks/");
    await page.getByRole("button", { name: "Copy link" }).click();
    await expect(page.locator(".share__status")).toHaveText("Link copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/initiative\/parks\/$/);
    await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute("href", /^mailto:\?subject=/);
  });
});

test.describe("layout", () => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    test(`no horizontal overflow or broken images at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of templates) {
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${route} @ ${width}`).toBeLessThanOrEqual(0);
        const broken = await page.evaluate(async () => {
          const imgs = Array.from(document.images);
          imgs.forEach((i) => (i.loading = "eager"));
          await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
          return imgs.filter((i) => i.naturalWidth === 0).map((i) => i.src);
        });
        expect(broken, `${route} @ ${width}`).toEqual([]);
      }
    });
  }
  test("reflows at 400% zoom equivalent (320 CSS px wide, 256 high) without two-dimensional scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    for (const route of ["/", "/initiative/renters-rights/", "/events/", "/need-help/"]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(320);
    }
  });
  test("touch targets in the header are at least 24px (WCAG 2.2 AA) and primary controls 44px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/district-4/");
    const small = await page.evaluate(() => Array.from(document.querySelectorAll(".city-bar a, .city-bar button, .site-header a, .site-header button")).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.width < 24 || r.height < 24); }).map((e) => e.textContent?.trim()));
    expect(small).toEqual([]);
    const menu = await page.getByRole("button", { name: "Menu" }).boundingBox();
    expect(menu!.height).toBeGreaterThanOrEqual(44);
  });
  test("reduced motion removes transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const d = await page.locator(".btn").first().evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration));
    expect(d).toBeLessThan(0.001);
  });
});

test("internal links: every link on every required page resolves", async ({ page, request }) => {
  test.setTimeout(240_000);
  const seen = new Map<string, string>();
  for (const route of requiredRoutes) {
    await page.goto(route);
    for (const h of await page.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) if (!seen.has(h)) seen.set(h, route);
  }
  const bad: string[] = [];
  for (const [href, from] of seen) {
    const [path, hash] = href.split("#");
    const res = await request.get(path || "/");
    if (res.status() !== 200) { bad.push(`${href} (from ${from}) -> ${res.status()}`); continue; }
    if (hash && !(await res.text()).includes(`id="${hash}"`)) bad.push(`${href} (from ${from}) -> missing #${hash}`);
  }
  expect(bad).toEqual([]);
  expect(seen.size).toBeGreaterThan(60);
});
