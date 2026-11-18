import { test, expect } from "./fixtures";
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
    // Neighborhoods lists its six pages in one column and has no "All" link; its landing page is linked from the home page and breadcrumbs.
    await page.locator("#nav-btn-neighborhoods").click();
    await expect(page.locator("#nav-panel-neighborhoods a")).toHaveCount(6);
    await expect(page.locator("#nav-panel-neighborhoods .site-nav__overview")).toHaveCount(0);
    await expect(page.locator("#nav-panel-neighborhoods .site-nav__group")).toHaveCount(1);
    await page.keyboard.press("Escape");
    for (const id of ["services", "topics", "news", "about", "contact"]) {
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
    const toggle = page.locator(".search-toggle--nav");
    await toggle.focus();
    await page.keyboard.press("Enter");
    const box = page.getByRole("search", { name: "Site search" }).getByRole("searchbox");
    await expect(box).toBeFocused(); // focus moves into the field when the panel opens
    await expect(box).toHaveAttribute("placeholder", "Search services, topics, neighborhoods"); // same prompt as the home hero
    await page.keyboard.press("Escape");
    await expect(page.locator("#site-search-panel")).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await box.fill("library");
    await page.keyboard.press("Enter");
    await expect(page.locator(".results li").first()).toBeVisible();
  });
  test("search button is available on small screens too", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/events/");
    await page.locator(".search-toggle--masthead").click();
    await page.getByRole("search", { name: "Site search" }).getByRole("searchbox").fill("parking");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/search\/\?q=parking/);
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
      // "Contact Our Office" is an approved FAQ category title; other first-person office language is still disallowed.
      const text = (await page.locator("body").innerText()).replace(/councilmember-nithyaraman/g, "").replace(/Contact Our Office/gi, "");
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

test.describe("home page sections", () => {
  test("greeting, actions, and section order", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Welcome to the\s*Council District 4\s*Information Hub/);
    await expect(page.locator(".hero .eyebrow")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Get in Touch With Us" })).toHaveAttribute("href", "/need-help/");
    const report = page.getByRole("link", { name: /Report a City Issue/ });
    await expect(report).toHaveAttribute("href", "https://myla311.lacity.gov/");
    await expect(report.locator("img")).toHaveAttribute("src", /myla311-logo/);
    const h2 = await page.locator("main h2").allTextContents();
    expect(h2.map((t) => t.trim()).filter((t) => t !== "Accessibility options")).toEqual(["Quick Resource Links", "Am I in District 4?", "Topics & Resources", "Explore Your Neighborhood", "Community Updates", "Events", expect.stringContaining("Elections"), "Contact & Stay Connected", "Frequently Asked Questions"]);
  });
  test("topics are a cluster of ten buttons without descriptions", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".pills .pill")).toHaveCount(10);
    await expect(page.locator(".pills p")).toHaveCount(0);
  });
  test("neighborhood tiles have photos and show only the name at 36px", async ({ page }) => {
    await page.goto("/");
    const tiles = page.locator(".tile");
    await expect(tiles).toHaveCount(6);
    await expect(tiles.locator("p")).toHaveCount(0); // names only
    await expect(tiles.locator("h3").first()).toHaveCSS("font-size", "36px");
    for (const img of await tiles.locator("img").all()) { await img.scrollIntoViewIfNeeded(); await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0); }
    await page.goto("/neighborhood/reseda/");
    await expect(page.locator(".page-header--photo")).toHaveCSS("background-image", /reseda-v2\.webp/);
    await expect(page.getByText(/Header photo:/)).toContainText("Supplied by the project owner");
    await page.goto("/neighborhood/hollywood-hollywood-hills/");
    await expect(page.getByText(/Header photo:/)).toContainText("CC0");
    await page.goto("/");
    const a11y = page.getByRole("button", { name: /Accessibility/ }); // icon only: no pill, name kept for assistive tech
    expect((await a11y.boundingBox())!.width).toBeLessThanOrEqual(48);
    await expect(a11y).toHaveCSS("border-top-width", "0px");
  });
  test("community updates list shows four dated items and a See all link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".latest__item")).toHaveCount(4);
    await expect(page.getByRole("link", { name: "See all" })).toHaveAttribute("href", "/news/");
  });
  test("address check opens the City lookup in a small window with the address filled in", async ({ page }) => {
    await page.addInitScript(() => { (window as unknown as { __opened: unknown[] }).__opened = []; window.open = (...a: unknown[]) => { (window as unknown as { __opened: unknown[] }).__opened.push(a); return { focus() {} } as unknown as Window; }; });
    await page.goto("/");
    const form = page.locator(".address-check");
    await form.getByRole("button", { name: "Check" }).click();
    await expect(form.getByRole("alert")).toContainText("Enter a street address"); // empty field: nothing opens
    expect(await page.evaluate(() => (window as unknown as { __opened: unknown[] }).__opened.length)).toBe(0);
    await form.getByLabel("Street address").fill("200 N Spring St, Los Angeles");
    await page.keyboard.press("Enter");
    const opened = await page.evaluate(() => (window as unknown as { __opened: string[][] }).__opened);
    expect(opened).toHaveLength(1);
    expect(opened[0][0]).toBe("https://neighborhoodinfo.lacity.gov/#200%20N%20Spring%20St%2C%20Los%20Angeles");
    expect(opened[0][2]).toMatch(/popup=yes,width=560,height=760/);
    await expect(page).toHaveURL(/\/$/); // still on the home page
    await expect(page.getByRole("link", { name: /View the district map/ })).toHaveCount(0);
    expect(await page.locator("form.address-check").getAttribute("action")).toBeNull(); // nothing is posted to this site
  });
  test("FAQ: three categories on the home page, with a button to the full FAQ page in About", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".faq-cat .section-label")).toHaveText(["Housing", "Safety", "Contact Our Office"]);
    // Category labels use the same style as the "Quick Resource Links" label.
    const style = (sel: string) => page.locator(sel).first().evaluate((e) => { const c = getComputedStyle(e); return [c.fontSize, c.fontWeight, c.textTransform, c.letterSpacing, c.color].join("|"); });
    expect(await style(".faq-cat .section-label")).toBe(await style("#quick-title"));
    const first = page.locator(".faq__item").first();
    await expect(first.locator(".faq__answer")).toBeHidden();
    await first.locator("summary").click();
    await expect(first.locator(".faq__answer")).toBeVisible();
    const homeCount = await page.locator(".faq__item").count();
    await page.getByRole("link", { name: "Read more FAQs" }).click();
    await expect(page).toHaveURL(/\/faq\/$/);
    await expect(page.locator("main h2").filter({ hasText: /^(Housing|Safety|Contact Our Office)$/ })).toHaveCount(3);
    expect(await page.locator(".faq__item").count()).toBeGreaterThan(homeCount);
    await expect(page.locator("#nav-btn-about")).toContainText("current section");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("About CD4");
    await page.locator("#nav-btn-about").click();
    await expect(page.locator("#nav-panel-about").getByRole("link", { name: "Frequently asked questions" })).toHaveAttribute("href", "/faq/");
  });
  test("footer lists every social network with a named, single-color logo", async ({ page }) => {
    await page.goto("/district-4/");
    const links = page.locator(".site-footer__social a");
    await expect(links).toHaveCount(5);
    for (const n of ["Instagram", "Facebook", "X", "TikTok", "Bluesky"]) await expect(page.getByRole("link", { name: `Council District 4 on ${n} (external site)` })).toBeVisible();
    await expect(links.first().locator("svg")).toHaveAttribute("fill", "currentColor");
  });
  test("tiles no longer carry colored edge bars", async ({ page }) => {
    await page.goto("/");
    for (const sel of [".quick__item", ".tile"]) {
      const b = await page.locator(sel).first().evaluate((e) => { const c = getComputedStyle(e); return [c.borderLeftWidth, c.borderTopWidth]; });
      expect(parseFloat(b[0]), sel).toBeLessThanOrEqual(1);
      expect(parseFloat(b[1]), sel).toBeLessThanOrEqual(1);
    }
    await page.goto("/topics-resources/");
    expect(await page.locator(".card--topic").first().evaluate((e) => getComputedStyle(e).borderTopWidth)).toBe("1px");
  });
});

test.describe("weather widget", () => {
  test("shows temperature and air quality, is not a link, and credits the real data source", async ({ page }) => {
    await page.route("**/api/weather/", (r) => r.fulfill({ json: { tempF: 62, condition: "Clear", kind: "clear", isDay: false, aqi: 41, aqiCategory: "Good", source: "AccuWeather" } }));
    await page.goto("/district-4/");
    const w = page.getByRole("group", { name: "Current weather and air quality" });
    await expect(w).toContainText("62°");
    await expect(w).toContainText("AQI 41");
    await expect(w).not.toContainText("Encino");
    await expect(w.locator("a")).toHaveCount(0);
    await expect(page.locator("a.weather")).toHaveCount(0);
    await expect(w.locator(".weather__credit")).toHaveText("Powered by AccuWeather");
    await expect(w.locator("svg").first()).toHaveAttribute("fill", "none"); // line icon
    // The header never claims AccuWeather when another service supplied the reading.
    await page.route("**/api/weather/", (r) => r.fulfill({ json: { tempF: 60, condition: "Cloudy", kind: "cloud", isDay: true, aqi: null, aqiCategory: null, source: "Open-Meteo" } }));
    await page.reload();
    await expect(page.locator(".weather__credit")).toHaveCount(0); // Open-Meteo is credited in the footer only
    await expect(page.locator(".site-footer")).toContainText("Open-Meteo");
  });
  test("renders nothing when the source is unavailable", async ({ page }) => {
    await page.route("**/api/weather/", (r) => r.fulfill({ status: 503, json: { error: "unavailable" } }));
    await page.goto("/district-4/");
    await expect(page.locator(".weather")).toBeEmpty();
  });
  test("live route returns a real reading or an honest 503", async ({ request }) => {
    const res = await request.get("/api/weather/");
    expect([200, 503]).toContain(res.status());
    if (res.status() === 200) { const j = await res.json(); expect(typeof j.tempF).toBe("number"); expect(j.tempF).toBeGreaterThan(-20); expect(j.tempF).toBeLessThan(130); }
  });
});

test.describe("accessibility menu", () => {
  test("options apply, persist across pages, and reset", async ({ page }) => {
    await page.goto("/district-4/");
    const toggle = page.getByRole("button", { name: /Accessibility/ });
    await toggle.click();
    const panel = page.getByRole("group", { name: "Accessibility options" });
    const base = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
    await panel.getByRole("button", { name: "Larger text" }).click();
    expect(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize))).toBeCloseTo(base * 1.25, 1);
    await panel.getByRole("switch", { name: /High contrast/ }).click();
    await panel.getByRole("switch", { name: /Underline links/ }).click();
    await panel.getByRole("switch", { name: /Pause motion/ }).click();
    await expect(panel.getByRole("switch", { name: /High contrast/ })).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
    expect(await page.locator("main a").first().evaluate((a) => getComputedStyle(a).textDecorationLine)).toContain("underline");
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
    await page.goto("/events/"); // preferences carry over
    await expect(page.locator("html")).toHaveAttribute("data-text", "larger");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await page.getByRole("button", { name: /Accessibility/ }).click();
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-text", /.+/);
    await expect(page.locator("html")).not.toHaveAttribute("data-contrast", /.+/);
  });
  test("pause motion stops the hero parallax; otherwise the photo moves slower than the page", async ({ page }) => {
    await page.goto("/");
    const y = () => page.locator(".hero__bg").evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42);
    await page.evaluate(() => window.scrollTo(0, 300));
    await expect.poll(y).toBeGreaterThan(50);
    expect(await y()).toBeLessThan(300); // slower than the scroll itself
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("button", { name: /Accessibility/ }).click();
    await page.getByRole("switch", { name: /Pause motion/ }).click();
    await page.keyboard.press("Escape");
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(200);
    expect(await y()).toBe(0);
  });
});

test.describe("top bar and header tools", () => {
  test("City bar matches the official bar: identity text and two outlined links, nothing else", async ({ page }) => {
    await page.goto("/");
    const bar = page.getByRole("navigation", { name: "City of Los Angeles" });
    await expect(bar).toContainText("An Official Website of the City of Los Angeles");
    await expect(bar.getByRole("link")).toHaveText([/An Official Website/, "City Services", "City Directory"]);
    await expect(bar).not.toContainText(/Sign Up|Windstorm|Language/);
    await expect(bar).toHaveCSS("background-color", "rgb(15, 41, 64)");
    await expect(bar).toHaveCSS("font-size", "12px");
    await expect(bar).toHaveCSS("font-family", /Open Sans/);
    expect((await bar.boundingBox())!.height).toBe(47);
    await expect(bar.getByRole("link", { name: "City Directory" })).toHaveCSS("border-top-color", "rgb(167, 206, 236)");
  });
  test("language menu is an icon beside the accessibility icon and opens next to it", async ({ page }) => {
    await page.goto("/district-4/");
    const lang = page.getByRole("button", { name: "Select language" });
    const a11y = page.getByRole("button", { name: /Accessibility/ });
    const [lb, ab] = [(await lang.boundingBox())!, (await a11y.boundingBox())!];
    expect(lb.width).toBe(44);
    expect(Math.abs(lb.y - ab.y)).toBeLessThan(2);
    expect(ab.x - (lb.x + lb.width)).toBeLessThan(20); // adjacent
    await lang.click();
    const menu = page.locator(".lang__menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link")).toHaveCount(11);
    await expect(menu.getByRole("link", { name: "Español" })).toHaveAttribute("href", /translate\.google\.com\/translate\?sl=en&tl=es&u=/);
    const mb = (await menu.boundingBox())!;
    expect(mb.y).toBeGreaterThanOrEqual(lb.y + lb.height); // drops down from the icon
    expect(Math.abs(mb.x + mb.width - (lb.x + lb.width))).toBeLessThan(2); // aligned to the icon
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(lang).toBeFocused();
  });
  test.describe("with the City widget allowed", () => {
    test.use({ allowCityWidget: true });
    test("the City's own widget replaces the stand-in bar without moving the page", async ({ page }) => {
      await page.goto("/district-4/");
      const loaded = await page.locator('html[data-citynav="loaded"]').waitFor({ timeout: 15_000 }).then(() => true, () => false);
      test.skip(!loaded, "navbar.lacity.org was not reachable from the test environment");
      await expect(page.locator("#citybar-fallback")).toBeHidden();
      await expect(page.locator("#global_navbar_la_4324422")).toContainText("City Directory");
      expect((await page.locator(".site-header").boundingBox())!.y).toBeGreaterThanOrEqual(47);
    });
  });
});

test.describe("sign-up prompt", () => {
  test.use({ allowPrompt: true });
  test("appears about six seconds into a visit, follows the site branding, and stays closed once dismissed", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog");
    await page.waitForTimeout(4500);
    await expect(dialog).toBeHidden(); // not before six seconds
    await expect(dialog).toBeVisible({ timeout: 4000 });
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("Be the first to know");
    await expect(dialog).toContainText("what’s happening in your neighborhood");
    await expect(dialog).toContainText("Council District 4");
    await expect(dialog.locator("img")).toHaveAttribute("src", /la-city-seal/);
    await expect(dialog.locator(".prompt__inner")).toHaveCSS("background-image", /cd4-hills-panorama/);
    // The form inside is the district's existing Indigov sign-up form; this site adds no fields of its own.
    const frame = dialog.locator("iframe");
    await expect(frame).toHaveAttribute("title", "Sign up for updates form");
    await expect(frame).toHaveAttribute("src", /^https:\/\/forms\.indigov\.com\/customers\/councilmember-nithyaraman\/ea1b0b81/);
    await expect(dialog.locator("input, textarea, select")).toHaveCount(0);
    await expect(dialog.getByRole("button", { name: "Close" })).toHaveText("Close"); // visible label beside the X
    await expect(dialog.getByText(/Maybe later|provided by Indigov/)).toHaveCount(0);
    expect(Number(await frame.getAttribute("height"))).toBeGreaterThanOrEqual(520); // room for the form's error messages
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
    await page.reload();
    await page.waitForTimeout(7500);
    await expect(dialog).toBeHidden(); // remembered
  });
  test("Escape closes it; the form is not requested until it opens; it never opens on the sign-up page", async ({ page }) => {
    await page.goto("/events/");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 12_000 });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.evaluate(() => localStorage.removeItem("cd4-signup-prompt"));
    await page.goto("/district-4/");
    await expect(page.locator("dialog iframe")).toHaveCount(0); // nothing loads from Indigov before the prompt opens
    await expect(dialog).toBeVisible({ timeout: 12_000 });
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
    await page.evaluate(() => localStorage.removeItem("cd4-signup-prompt"));
    await page.goto("/sign-up/");
    await page.waitForTimeout(7500);
    await expect(dialog).toBeHidden();
  });
});

test.describe("interior pages", () => {
  test("page headers are dark blue with white text", async ({ page }) => {
    for (const route of ["/city-services/", "/initiative/parks/", "/events/", "/need-help/", "/search/"]) {
      await page.goto(route);
      const h = page.locator(".page-header");
      await expect(h, route).toHaveCSS("background-color", "rgb(4, 24, 74)");
      await expect(h.locator("h1"), route).toHaveCSS("color", "rgb(255, 255, 255)");
    }
  });
  test("topics page starts with the button cluster; neighborhoods page is three columns of photo tiles", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/topics-resources/");
    await expect(page.locator("main .pills .pill")).toHaveCount(10);
    await page.goto("/neighborhoods/");
    const xs = await page.locator(".tile").evaluateAll((ts) => ts.map((t) => Math.round(t.getBoundingClientRect().left)));
    expect(xs).toHaveLength(6);
    expect(new Set(xs).size).toBe(3);
  });
  test("City Clerk section uses the Clerk purple; social icons invert on hover", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".clerk")).toHaveCSS("background-color", "rgb(69, 17, 73)");
    const icon = page.locator(".site-footer__social a").first();
    await icon.scrollIntoViewIfNeeded();
    await icon.hover();
    await expect(icon).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(icon).toHaveCSS("background-color", "rgb(4, 24, 74)");
  });
});

test.describe("layout", () => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    test(`no horizontal overflow or broken images at ${width}px`, async ({ page }) => {
      test.setTimeout(120_000);
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
    const small = await page.evaluate(() => Array.from(document.querySelectorAll(".citybar a, .site-header a, .site-header button")).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.width < 24 || r.height < 24); }).map((e) => e.textContent?.trim()));
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
