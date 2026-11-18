# Accessibility report

Target: WCAG 2.2 AA as the quality bar; at minimum WCAG 2.1 AA, the technical standard under the ADA Title II web rule.
**This report is evidence of testing, not a certification.** Passing automated checks does not establish ADA compliance. Final review and sign-off belong to the City.

## How it was built

- One `<main>`, one `<h1>` per page, ordered headings, labeled landmarks (City toolbar, Primary, Breadcrumb, search, footer).
- Skip link is the first focusable element and moves focus into `<main>`.
- Navigation uses disclosure buttons (`aria-expanded`, `aria-controls`), not ARIA menus: Tab moves, Enter/Space toggles, Escape closes and returns focus, leaving the nav closes it. Same markup becomes an accordion on small screens.
- Focus indicator: 3px outline with a contrasting halo on every interactive element; gold on dark surfaces.
- Color: token pairs are checked by script (`npm run check:contrast`); color is never the only signal.
- Events: chronological list is the default and always available; in the calendar, empty days are plain text and only days with events contain links; month changes are announced.
- Search results, no-results, copy-link, embed loading and calendar month status use polite live regions.
- External links have a visible icon and "(external site)" text for screen readers; links do not force new tabs.
- Third-party forms and the map load only on request, in titled iframes, with a direct link as the fallback.
- `prefers-reduced-motion` removes transitions; `forced-colors` keeps borders and current-state indicators; text reflows at 320 CSS px.
- `lang="en"` on the document; language-menu entries carry their own `lang`.

## Accessibility options menu

The header has an Accessibility button with text size, high contrast, underline links, readable spacing and pause motion. It is part of this site's own code. The Mayor's site uses the third-party UserWay overlay for a similar purpose; an overlay was not added here because it loads an outside script and does not replace accessible markup. The menu supplements, and does not replace, browser and operating-system settings, which the site also honors.

## Test results

Run on 2026-11-17 with Chrome via Playwright, first against the local production build (`next start`) and then against the deployed Vercel build (same results). Re-run with `npm test`.

| Check | Scope | Result |
| --- | --- | --- |
| axe-core (WCAG 2.0/2.1/2.2 A + AA and best-practice rules) | 20 page templates × desktop (1280) and mobile (375), plus open navigation panel, calendar view and language menu: 44 scans | 0 violations |
| Keyboard journeys (scripted) | Skip link; open/traverse/Escape a dropdown with focus return; focus-out closes panel; mobile menu open, navigate, Escape | Pass |
| Reflow | 20 templates at 320, 375, 768, 1024, 1440, 1920 px; and 320 × 256 px (1280 px at 400% zoom) | No horizontal scrolling |
| Target size | Header and toolbar controls at 375 px | All ≥ 24 px; primary controls ≥ 44 px |
| Reduced motion | `prefers-reduced-motion: reduce` | Transitions removed |
| Token contrast | 80 foreground/background pairs | All meet 4.5:1 text / 3:1 graphics (topic ink ≥ 7:1 on white) |
| Lighthouse (mobile emulation, local) | Home, a topic guide, Events | Accessibility 100, Best Practices 100, Performance 88–91; SEO flags only the intentional noindex |
| Images | All templates, all widths | No broken images; decorative marks have empty alt, logos are named |
| End-to-end total | `tests/site.spec.ts` + `tests/a11y.spec.ts` | 148 tests, 148 passed (after the revision 5 changes) |

## Not tested here (needs people and devices)

- **Screen readers.** No VoiceOver, NVDA, JAWS or TalkBack session was possible in the build environment. Names, roles and states were checked through the accessibility tree and axe only. A manual pass with VoiceOver + Safari and NVDA + Firefox/Chrome is required.
- **Real mobile devices and browser zoom/text-only zoom** (tested by viewport emulation only).
- **Windows High Contrast** (styles are written for `forced-colors`, not verified on Windows).
- **Voice control and switch access.**
- **Cognitive/plain-language review** of the rewritten copy.

## Known issues and limits

| Issue | Impact | Owner / next step |
| --- | --- | --- |
| Embedded Indigov forms (assistance, sign-up) and the Google Form were not audited | Unknown conformance inside the frames | Vendor/City: obtain conformance reports; test separately. This site only supplies the iframe title and fallback link |
| Google My Maps embed is not fully keyboard or screen-reader accessible | Map content is not available to all users | Text alternative provided (address lookup link, neighborhood list). Consider a City GIS map |
| "Select Language" hands off to Google Translate | Translated pages are outside this site's control; does not work on protected preview URLs | City decision on translation approach |
| White text over photographs (home hero, neighborhood headers, tiles) | Automated tools cannot measure contrast over images. A navy gradient sits behind all such text | Check by eye on real devices; adjust gradient if a replacement photo is lighter |
| Address lookup opens in a small window | Pop-up blockers may stop it; the link then opens normally in a new tab. The link text says it opens a small window | City may prefer a same-tab link |
| Timed sign-up prompt | A modal that opens on its own interrupts reading and screen-reader use (WCAG 2.2.4 Interruptions is AAA, so this is not an AA failure). It is a native dialog, closes with Escape, returns focus, waits while the visitor is typing, and appears once per 30 days | City decision whether to keep it; `signupPrompt.enabled` turns it off |
| City navbar widget | Loaded from navbar.lacity.org; its markup and contrast are ITA's and are not covered by this site's automated scans (tests block it and check the stand-in bar) | ITA |
| Calendar on small screens shows event markers without visible titles | Sighted users must open the day link or use the list (default view) to read titles; link names remain complete for assistive tech | Acceptable as list is primary; revisit with user testing |
| Archive and past-event text is shown as originally published | May include capitalised headlines or wording that is not plain language | Editorial decision during migration |
| PDF and third-party documents linked from pages | Not remediated or checked | Owning agencies |

## City review still required

Independent accessibility review, assistive-technology testing, an accessibility statement with a feedback contact for this site, and confirmation of any City-specific standards beyond WCAG.
