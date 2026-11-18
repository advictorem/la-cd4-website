# Content audit and inventory

Audit date: 2026-11-17. Source: public pages of https://cd4.lacity.gov/ (read-only), the prototype zip, and agency websites.
Every content record carries `route`, `sourceUrl`, `verifiedAt`, `contentOwner`, and `status` (`content/types.ts → ContentMeta`).

**Nothing on this site is marked `verified`.** All records are `pending-review`: the facts were taken from the live site or the named agency on the audit date, but the City has not yet approved the wording. Archive items are `archived`.

## What the live site is

- WordPress (custom theme `nithya-raman`), WP Rocket caching, Gravity Forms + reCAPTCHA scripts, Google Tag Manager (`G-54651BDNKV`).
- Site title and navigation are built around the current officeholder (Meet Nithya, Team CD4, Initiatives, press kit).
- No public events feed or API was found; events appear to be a custom post type rendered by the theme.

## Route inventory

| Live route | Staging route | Treatment |
| --- | --- | --- |
| `/` | `/` | Rebuilt. Welcome letter, officeholder carousel and slogans removed |
| `/city-services/`, `/city-service/{for-residents,for-businesses,emergency-services}/` | same | Links kept and regrouped by task. Dropped: a pandemic-era COVID-19 SafePass link, a malformed water-conservation link, a pothole link that pointed to LA County, links to the retired `councildistrict4.lacity.gov` host, session-specific MyLA311 deep links (replaced with the MyLA311 home page) |
| `/initiatives/` | `/topics-resources/` (307 from `/initiatives/`) | New neutral landing page |
| `/initiative/{10 slugs}/` | same slugs | Rewritten as resource guides with new titles. Position statements, accomplishments and motions are not carried into the guides; they remain on the live pages and in the press archive |
| `/district-4/` | same | Geography kept; references to the officeholder removed |
| `/neighborhood/{6 slugs}/` | same | Overviews edited for neutrality; civic listings kept. Listings of other elected officials removed (several were out of date) |
| `/need-help/`, `/sign-up/`, `/grant-requests/`, `/transit-traffic-safety-requests/`, `/scheduling-requests/` | same | Form handoffs (below) |
| 5 "Hot Topics" pages | same slugs | Rewritten as dated, sourced information pages |
| `/events/`, `/event/{slug}/` | same | 18 events captured with dates, times, locations, source links |
| `/press-releases/`, `/newsletters/` | same | Labeled historical archive linking to the originals |
| `/the-latest/`, `/press-kit/`, `/press-releases/annual-reports/` | 307 → `/news/` or `/press-releases/` | Folded into the archive |
| `/meet-nithya/`, `/team/`, `/job-openings/` | 307 → `/district-4/` | Officeholder biography and staff pages are not part of the neutral site. **Decision needed:** archive them or retire them |
| `/certificate-requests/` | 307 → `/need-help/` | The live page's cards already point to `/need-help/`. **Decision needed:** keep a certificate request path? |
| — | `/news/`, `/neighborhoods/`, `/search/`, `/site-map/` | New |

## Forms

| Page | Platform today | How the live page includes it | Staging behavior |
| --- | --- | --- | --- |
| `/need-help/` | Indigov, `forms.indigov.com/customers/councilmember-nithyaraman/7d242ff2-…` | iframe | Same iframe, loaded only when the visitor chooses; direct link always shown |
| `/sign-up/` | Indigov, `…/ea1b0b81-…` | lazy-loaded iframe | Same |
| `/scheduling-requests/` | Google Forms | link | Link to the same form |
| `/transit-traffic-safety-requests/` | MyLA311 (the district's own form was retired) | links | Link to MyLA311; the live page's other phone/email contacts kept |
| `/grant-requests/` | none; program "on hold until further notice" | notice | States the hold. No application link |

No test submission was made to any of these systems. The Indigov customer path contains the current officeholder's name; the vendor account will presumably be renamed or replaced during transition, which changes these URLs (`content/forms.ts`).

Observed on the Metro contact line of the live traffic page: the phone number is missing a digit. It was left out here; the Metro email is kept.

## Time-sensitive content that was not carried over

- **Wildfire recovery:** the live page lists deadlines, relief funds and temporary recovery centers from January–March 2025. None are repeated; the staging page links to the agencies' current pages and says why.
- **Immigrant rights:** kept as general know-your-rights information with a not-legal-advice notice; the opening statement on federal policy was removed.
- **Hollywood Hills tourism:** first-person plans replaced with a factual background and links to each Council file.
- **Forest Lawn Drive:** project description, speeds, classification and outreach totals kept as reported; advocacy language and the long meeting log removed.
- **Emergency toolbar link:** "Windstorm & Fire Updates" still points to `emergency.lacity.gov/updates`, as on the live site. Confirm the label is still current.

## Events and archive data

`content/data/live-scrape.json` is a one-time capture (2026-11-17) of the first listing page of events, press releases, newsletters and "the latest", plus each event's detail page. On that date the live site listed **no upcoming events**, so the staging site shows an empty state. Past-event descriptions are shown as originally published, including five that name the officeholder as host; they are labeled as past events.

## District representation

`representationNotice` is disabled. News reports from November 2026 say the District 4 Councilmember was elected Mayor and is due to take office on December 14, 2026, and that the City Council has not decided how the seat will be filled. As of the audit, no City Clerk vacancy notice was found to cite, so the site makes no statement. When the Clerk publishes one, set `enabled`, `body`, `href` and `verifiedAt` in `content/site.ts`.

## Office details

Phone, email and the two office addresses are as published on `/need-help/` today. They must be re-confirmed immediately before launch, since staffing and offices may change with representation.

## External links

`npm run check:links` checks every external URL on the site; the latest run is in `docs/link-check.json` and summarized in `docs/accessibility.md#test-results`.

## Revision 2 additions (2026-11-17)

- **FAQ** (`content/faqs.ts`): nine questions. Each answer restates content already on the site and links to that page; no new facts were introduced.
- **Neighborhood blurbs:** one short sentence per area for tiles and page headers (69–74 characters each).
- **Address lookup** moved from `neighborhoodinfo.lacity.org` to `neighborhoodinfo.lacity.gov` (the old host redirects).
- **Weather:** live readings for Encino (34.159, −118.501) from Open-Meteo; nothing is shown if the source fails. AccuWeather is linked, not used as a data source, because it has no keyless feed and its pages may not be scraped.
- **Photos:** see `/photo-credits/`.
