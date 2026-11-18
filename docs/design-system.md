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
| ShareControl | `ShareControl.tsx` | copy success / failure announced via `role="status"` |
| ContactActions, RepresentationNotice, StagingBanner, EmptyState, PageFoot | `Layout.tsx` | RepresentationNotice renders nothing unless configured; `.skeleton` loading state in `app/loading.tsx` |
| Footer | `Footer.tsx` | — |

Focus is always a 3px navy outline with a white halo (gold on dark surfaces). Forced-colors mode keeps borders and current-state indicators.

## Home page patterns (revision 2)

| Pattern | Notes |
| --- | --- |
| Photo hero with parallax | `HeroParallax` shifts a taller photo layer at 35% of scroll speed, so the image scrolls more slowly than the content. A navy gradient keeps white text readable. No movement under reduced motion or when "Pause motion" is on. |
| Header weather + air quality | `WeatherWidget` reads `/api/weather` (server route, cached 15 min). Line icons, not a link. The small grey credit names the service that supplied the reading: "Powered by AccuWeather" when `ACCUWEATHER_API_KEY` is set, otherwise "Weather data by Open-Meteo". |
| Global search | Search button at the end of the navigation row (beside Menu on small screens) opens one field under the header on every page; same prompt as the hero field. Escape closes and returns focus. |
| Quick Resource Links | Six task tiles, no colored edge bars. |
| District Checker | "Am I in District 4?" with the district outline map and an address field (`AddressCheck`). "Check" opens the City's lookup in a small window with the address in the URL fragment, which the lookup reads and searches. Google Places suggestions appear when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set. Nothing typed is sent to this site. |
| Interior page headers | Dark blue (`--city-navy`) with white text on every interior page; topic pages keep their color in the icon block. |
| Accessibility menu | First-party options in the header: text size, high contrast, underline links, readable spacing, pause motion, reset. Stored in the browser; no third-party overlay script. |
| City Clerk band | Uses the Clerk's purple `#451149`, taken from the official logo, with the logo on a white panel. |
| Topic buttons | Ten outlined pill buttons, icon + title, no descriptions. |
| Neighborhood photo tiles | Photo, gradient, title and one short sentence; image zooms on hover/focus (not under reduced motion). The same photo is the header background of each neighborhood page. |
| Community Updates | "Latest"-style list: rule, category, title, date. Four most recent on the home page. |
| FAQ | Native `<details>` accordion at the bottom of the home page. |
| Footer social row | Single-color brand glyphs (Simple Icons, CC0) with text names for assistive technology. |

Colored top and left edge bars were removed from all tiles and cards. Topic color now appears only in icons, tints and page headers.

## Photography

Credits and licenses are in `content/images.ts` and published at `/photo-credits/`. The home hero panorama and five neighborhood photos (Encino, Los Feliz & Silver Lake, Reseda, Sherman Oaks & Van Nuys, Studio City) were supplied by the project owner; their sources and usage rights still need to be confirmed. The Hollywood photo is from Wikimedia Commons (CC0). The Encino file is only 612 px wide and is soft when used as a page header.

## City toolbar

The supplied screenshot shows the toolbar on the current CD4 site: seal, LOS ANGELES, Sign Up for Updates, Windstorm & Fire Updates, 311 City Services, LA City Directory, Select Language. That bar is built into the CD4 WordPress theme; it is **not** what `navbar.lacity.org/global_nav.js` renders today.

The City-maintained widget (v4.0) renders "An Official Website of the City of Los Angeles", City Services, and City Directory, at 47px, injected with `document.write`. It has no Sign Up, emergency, or language items.

| Mode | What you get | Trade-off |
| --- | --- | --- |
| `reference` (default on staging) | Matches the screenshot. 47px tall, official seal artwork from the City widget, same destinations as the live site | Maintained by CD4, not ITA. Needs ITA sign-off as a permitted variant |
| `official` | Loads the City widget unmodified (via `components/OfficialNavbarLoader.tsx`, which runs it after hydration because the widget relies on `document.write` and `DOMContentLoaded`); Sign Up, Windstorm & Fire Updates, and Select Language move to a slim CD4 utility row beneath it; 311 and Directory are not repeated | Does not match the screenshot; adds a request to navbar.lacity.org and Google Fonts (the widget loads Open Sans) |

A production proposal should use `official` unless ITA approves the reference variant. Switch with `NEXT_PUBLIC_CITY_NAVBAR`.

"Select Language" opens the current page in Google Translate's page-translation service rather than loading the translate script. It only works on publicly reachable URLs, so on a protected preview it will show Google's error page.

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
