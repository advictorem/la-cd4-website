# Design system

Tokens live in `styles/tokens.css`; component styles in `styles/components.css`. `npm run check:contrast` verifies the token pairs below.

## Where the colors come from

| Token | Value | Source |
| --- | --- | --- |
| `--city-navy` | `#04184a` | Sampled from the supplied City toolbar screenshot |
| `--city-gold` | `#ffc24b` | "Sign Up for Updates" pill in the same screenshot |
| `--blue-700` | `#24418f` | Blue used across the live cd4.lacity.gov theme |
| `--coral` | `#e66948` | Most-used accent on the live theme. 3.3:1 on white, so decorative only |
| `--ink-2` | `#313131` | Live theme body text |
| `--cream` | `#faf8f0` | Live theme cream `#fafae1`, desaturated for large surfaces |
| ochre / purple / teal / green accents | see tokens | Live theme gold `#b48e3a` and the hues of the theme's district map (`#603fb0`, `#4195a5`, `#88b153`), darkened to meet contrast |

Navy and blue are reserved for institutional navigation and primary actions and never used as a topic color.

## Topic color families

Each family has three roles: `-ink` (text and icons; ≥ 7:1 on white, ≥ 4.5:1 on its tint), `-accent` (borders and rules; ≥ 3:1), `-tint` (surfaces).
Components read them through `data-color="…"` → `--c-ink / --c-accent / --c-tint`.

| Family | Used for | Ink | Accent | Tint |
| --- | --- | --- | --- | --- |
| green | Environment, Parks, river project | `#1c5a37` | `#3d8a50` | `#e9f4ea` |
| purple | Homelessness services and data, immigrant resources | `#4a2982` | `#603fb0` | `#f0ebfa` |
| terracotta | Housing, Renter rights | `#93361a` | `#cb5230` | `#fceee8` |
| teal | Transportation, residents, MyLA311 | `#0b575f` | `#177f89` | `#e3f3f4` |
| amber | Public safety, time-sensitive notices | `#744600` | `#b06a00` | `#fdf2d9` |
| slate | City government, archive | `#354458` | `#5b6d85` | `#edf0f4` |
| ochre | Small business | `#6d4f0d` | `#a27818` | `#f8f1de` |
| red | Emergency only | `#981b1b` | `#c42e2e` | `#fdebeb` |

Color never carries meaning alone: every colored element also has a text label and an icon. Paired topics that share a family (for example Housing and Renter Rights) are told apart by title and icon.

## Type, space, shape

- Headings: Source Serif 4 (variable, self-hosted). Body and UI: Public Sans (variable, self-hosted). No font requests leave the site.
- Scale: `--step--1` 14px, `--step-0` 17px, `--step-1` 20px, then fluid `--step-2…4` (clamp).
- Spacing: 4px base (`--s1…--s9`); page gutter `clamp(1rem, 4vw, 2.5rem)`; content width 76rem; text measure 68ch.
- Radii 4px / 8px; pills only in the City toolbar and chips. One elevation, used for menus.
- Motion: 160ms color/transform transitions only; all removed under `prefers-reduced-motion`.

## Components and states

| Component | File | States |
| --- | --- | --- |
| OfficialCityBar | `CityBar.tsx`, `LanguageMenu.tsx` | link hover (underline) / focus (gold outline on navy); language disclosure open/closed; labels collapse to pills below 1152px and 768px |
| SiteHeader + PrimaryNav | `SiteHeader.tsx` | button default / hover / expanded / current section; panel open/closed; mobile "Menu" disclosure |
| SiteSearch | `SiteSearch.tsx` | default / focus; results, no-results and no-query states on `/search/` |
| Button / ButtonLink | `SmartLink.tsx`, `.btn` | primary, secondary, quiet × default / hover / active / focus / disabled (`disabled` or `aria-disabled`) / loading (`aria-busy`) |
| Breadcrumbs, PageHeader | `Layout.tsx` | current page marked with `aria-current` |
| Alert (Notice) | `Layout.tsx` | tones: city, amber (time-sensitive), red (emergency), slate (historical) — always with icon and heading |
| ServiceCard (QuickService) | `Cards.tsx` | default / hover (tint) / focus; internal vs external arrow |
| TopicCard, NeighborhoodCard, UpdateCard | `Cards.tsx` | whole card is one link target; hover and focus outline in the card's accent |
| ResourceLinkList | `Cards.tsx` | row hover / focus; description and owning agency |
| EventList / Calendar | `Events.tsx` | list and calendar views (`aria-pressed`); empty month; today; past events; "Today" disabled when current |
| AccessibleEmbed | `AccessibleEmbed.tsx` | idle (nothing loaded) → loading (announced) → ready; permanent fallback link |
| ShareControl | `ShareControl.tsx` | "Share This Page" with two icon buttons (Copy link, Email), each with a hidden text name; copy success / failure announced via `role="status"`. Centered on neighborhood pages (`PageFoot shareOnly`). |
| ContactActions, RepresentationNotice, StagingBanner, EmptyState, PageFoot | `Layout.tsx` | RepresentationNotice renders nothing unless configured; `.skeleton` loading state in `app/loading.tsx` |
| Footer | `Footer.tsx` | — |

Focus is always a 3px navy outline with a white halo (gold on dark surfaces). Forced-colors mode keeps borders and current-state indicators.

## Home page patterns (revision 2)

| Pattern | Notes |
| --- | --- |
| Photo hero with parallax | `HeroParallax` shifts a taller photo layer at 35% of scroll speed, so the image scrolls more slowly than the content. A navy gradient keeps white text readable. No movement under reduced motion or when "Pause motion" is on. |
| Header weather + air quality | `WeatherWidget` reads `/api/weather` (server route, cached 15 min). Line icons, not a link. A small grey "Powered by AccuWeather" credit appears under it only when `ACCUWEATHER_API_KEY` is set and AccuWeather supplied the reading. Open-Meteo is credited in the footer. |
| Global search | Search button at the end of the navigation row (beside Menu on small screens) opens one field under the header on every page; same prompt as the hero field. Escape closes and returns focus. |
| Quick Resource Links | Six task tiles, no colored edge bars. |
| District Checker | "Am I in District 4?" with the district outline map and an address field (`AddressCheck`). "Check" opens the City's lookup in a small window with the address in the URL fragment, which the lookup reads and searches. Google Places suggestions appear when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set. Nothing typed is sent to this site. |
| Interior page headers | Dark blue (`--city-navy`) with white text on every interior page; topic pages keep their color in the icon block. |
| Accessibility menu | First-party options in the header: text size, high contrast, underline links, readable spacing, pause motion, reset. Stored in the browser; no third-party overlay script. |
| City Clerk band | Uses the Clerk's purple `#451149`, taken from the official logo, with the logo on a white panel. |
| Topic buttons | Ten outlined pill buttons, icon + title, no descriptions. |
| Neighborhood photo tiles | Photo, gradient, title and one short sentence; image zooms on hover/focus (not under reduced motion). The same photo is the header background of each neighborhood page. |
| Community Updates | "Latest"-style list: rule, category, title, date. Four most recent on the home page. |
| FAQ | Native `<details>` accordions. The home page shows one centered column with two questions under each of three category labels (Housing, Safety, Contact Our Office; same small uppercase label style as "Quick Resource Links") and a "Read more FAQs" button; the full list is at `/faq/`, under About CD4. |
| Footer social row | Single-color brand glyphs (Simple Icons, CC0) with text names for assistive technology. |

Colored top and left edge bars were removed from all tiles and cards. Topic color now appears only in icons, tints and page headers.

## Photography

Credits and licenses are in `content/images.ts` and published at `/photo-credits/`. The home hero panorama and five neighborhood photos (Encino, Los Feliz & Silver Lake, Reseda, Sherman Oaks & Van Nuys, Studio City) were supplied by the project owner; their sources and usage rights still need to be confirmed. The Hollywood photo is from Wikimedia Commons (CC0). The Encino file is only 612 px wide and is soft when used as a page header.

## City global bar

The top bar is the City's own widget, the same one used on councildistrict5.lacity.gov: "An Official Website of the City of Los Angeles", City Services, City Directory. It is loaded from `navbar.lacity.org/global_nav.js` (v4.0) by `components/OfficialNavbarLoader.tsx`, which runs the unmodified script after hydration because the widget relies on `document.write` and `DOMContentLoaded`.

`components/CityBar.tsx` also renders a stand-in bar with the widget's measurements (47px, `#0f2940`, Open Sans 12px, links outlined 1px `#A7CEEC` with 6px corners). It is what visitors see until the widget arrives, or if it cannot load, and it is hidden once the widget is in the page, so nothing shifts. Set `NEXT_PUBLIC_CITY_NAVBAR=static` to use only the stand-in and request nothing from navbar.lacity.org.

The earlier CD4 toolbar items were removed from the bar: Sign Up for Updates (now the timed prompt, the Contact menu and the contact band), Windstorm & Fire Updates (Emergency information is in Quick Resource Links and City Services), and Select Language (now an icon in the header).

## Header tools

Right side of the masthead: weather and air quality, a language icon, an accessibility icon; then Search at the end of the navigation row. The language icon is a thin-outline glyph drawn for this site (not a stock asset); its list opens directly under the icon and hands the page to Google Translate. Translation links only work on publicly reachable URLs, so they fail on a protected preview.

## Sign-up prompt

`components/SignupPrompt.tsx`, configured in `content/site.ts → signupPrompt`. A native modal `<dialog>` opens six seconds into a visit: hero photo darkened with navy, City seal and "Council District 4" at top center, a "Close" button, heading, one sentence, and the district's existing Indigov sign-up form in a frame tall enough to keep its button visible when validation messages appear. Once closed it stays away for 30 days (stored in the browser). It is not shown on `/sign-up/`, and it waits if the visitor is typing or has a menu open. The form's fields, steps and button color belong to Indigov and cannot be changed from this site.

## Official marks

Stored in `public/brand/`, byte-for-byte as downloaded on 2026-11-17, never recolored or redrawn:

| File | Source |
| --- | --- |
| `la-city-logo.svg` | https://lacity.gov/sites/g/files/wph2451/themes/site/logo.svg |
| `city-clerk-logo.svg` | https://clerk.lacity.gov/sites/g/files/wph1491/files/202409_CityClerk_WebLogo_v2_200x86.svg |
| `myla311-logo.png` | https://myla311.lacity.gov/resource/1794516044000/LA_Theme/img/MyLA311Logo_Blue.png |
| `la-city-seal.svg` | Seal SVG embedded in https://navbar.lacity.org/global_nav.js v4.0 |
| `cd4-map.svg` | District outline from the live CD4 theme (`/wp-content/themes/nithya-raman/images/CD4-map.svg`) |

Use of each mark needs City approval (see the launch checklist).

## Neighborhood page template

| Part | Rule |
|---|---|
| Order | Header photo, then Local Resources straight away (no "About" text), Projects and Updates, Related Topics, Share This Page. No review line or photo credit on the page; credits are on `/photo-credits/`. |
| Local Resources | Four `PlaceList` blocks in a 2 x 2 grid (one column on phones). Each has a 16:9 stock photo above a Title Case heading; no icons. The photos are decorative (`alt=""`) and are the same on every neighborhood page (`resourcePhotos` in `content/images.ts`). |
| MyLA311 box (`Report311`; also used by `ContactActions` on service, topic, update, About and FAQ pages, which add a district office link) | Light blue panel in the MyLA311 logo blue (`#00609a` button, `#e3f1f9` background) with the official logo, unaltered. Large heading, full-width "Open MyLA311" button, then "Or contact MyLA311 by dialing 311 or (213) 473-3231". Logo shown at 78 x 72. |
| Sticky column | From 62rem up, the MyLA311 box and Other Neighborhoods stay 16px from the top while the left column scrolls, and release where Related Topics begins. Not sticky on smaller screens. |
| Projects and Updates | Featured band: light wash background, 36px heading with a pin icon in a navy circle. Each update is a white row with a month / year calendar tile (`LatestList calendar`); the date is the most recent dated information in the source, so no day is shown. |
| Related Topics | `TopicCard filled`: card filled with the topic tint, white icon box, no border; the accent outline appears only on hover and keyboard focus. |

## Phone-only patterns (up to 40rem)

| Pattern | Rule |
|---|---|
| Search buttons | Icon only in the hero and the search panel; the word "Search" stays as the accessible name. |
| Bottom action bar (`MobileActions`) | Fixed to the bottom of the screen on every page: "Contact District Office" (to `/need-help/`) and the MyLA311 logo with "Report a City Issue" (MyLA311, new tab), side by side, 52px tall. The page has bottom padding and `scroll-padding-bottom` so the bar never covers the footer or a focused control. Hidden in print and on larger screens. |
| Topics (`TopicPills`) | Full-width list rows instead of the pill cluster. On the home page the first five show, with a "Show all 10 topics" disclosure button (`aria-expanded`). A select menu was not used because selects that navigate on change are hard to use with a keyboard and screen reader. |


## Event detail page

| Part | Rule |
|---|---|
| Featured image | 16:9 at the top of the page. Taken from the header image of the event's listing on the current CD4 site (`content/data/event-extras.json`). Listings that only had a plain color strip, or only a flyer carrying an officeholder's name, use the home page photo instead. Decorative (`alt=""`); all facts are in the card. |
| Facts card | One bordered container: Date, Time, Location in three cells with divider lines (stacked rows on phones). Date is abbreviated ("Thu, Nov 12, 2026"); the time cell drops the repeated date. Missing values read "To be announced". |
| RSVP | Upcoming events: "RSVP" button to the organizer's registration link, or to the original listing when none was captured. Past events: a disabled "RSVP closed" button, so nobody is sent to an expired sign-up form. |
