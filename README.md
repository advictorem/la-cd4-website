# Council District 4 website — staging build

A neutral, service-first website for City of Los Angeles Council District 4, built for stakeholder review.
**This is not the official site.** The live site at https://cd4.lacity.gov/ is untouched; nothing here writes to its CMS, DNS, forms, or any City system.

- Stack: Next.js 16 (App Router), React 19, TypeScript, plain CSS with design tokens. No analytics, trackers, or cookie banners.
- Hosting: Vercel preview (non-production) deployments only. Every non-production build is `noindex` and shows a staging banner.

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run check          # lint + typecheck + token contrast + production build
npx playwright install chromium   # once (or set PW_CHANNEL=chrome to use an installed Chrome)
npm test               # end-to-end + axe accessibility suites (builds and starts the site on :3100)
npm run check:links    # external link check against the running site
BASE_URL=https://<preview>.vercel.app npm test   # run the same suites against a deployment
```

Environment variables are documented in `.env.example`. None are secrets.

| Variable | Default | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_ENV` | `staging` | Anything but `production` keeps noindex headers/meta, `robots.txt` disallow, and the staging banner. |
| `NEXT_PUBLIC_SITE_URL` | `https://cd4.lacity.gov` | Origin used for canonical URLs and the sitemap. |
| `NEXT_PUBLIC_CITY_NAVBAR` | `official` | `official` = City widget from navbar.lacity.org with a matching stand-in bar; `static` = stand-in bar only. |
| `ACCUWEATHER_API_KEY` | unset | Server-side. When set, weather conditions come from AccuWeather and are credited to it. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | unset | Enables Google Places address suggestions in the District Checker. |

## Branches and Vercel

- `staging` — working branch. Every push creates a Vercel **preview** deployment (non-production).
- `main` — Vercel treats this as the project's production branch, so a push to `main` lands in the project's "production" slot (`la-cd4-website.vercel.app`). That slot is still protected by Vercel Authentication, `noindex`, and bannered as staging, and no custom domain is attached. Merge to `main` deliberately.
- To test a protected deployment: `BASE_URL=https://<deployment> VERCEL_SHARE_URL='<share link from Vercel>' npm test`.

## File map

```
app/                     Routes (App Router). One file per template, not per page.
  page.tsx               Home
  city-services/         City Services landing        city-service/[slug]/   3 category pages
  topics-resources/      Topics landing               initiative/[slug]/     10 resource guides (existing slugs)
  neighborhoods/         Neighborhoods landing        neighborhood/[slug]/   6 neighborhood pages (existing slugs)
  news/ events/ event/[slug]/ press-releases/ newsletters/
  district-4/            About CD4
  need-help/ sign-up/ grant-requests/ transit-traffic-safety-requests/ scheduling-requests/   form handoffs
  [slug]/                5 community-update ("Hot Topic") pages at their existing root URLs
  search/ site-map/ not-found.tsx error.tsx loading.tsx robots.ts sitemap.ts
components/              Reusable UI (CityBar, SiteHeader, SiteSearch, Layout, Cards, Events, AccessibleEmbed, ShareControl, FormPage, ArchivePage, Footer, Icon, SmartLink)
content/                 All copy and data, typed (types.ts). site.ts holds admin-editable configuration.
lib/content-adapter.ts   The only module templates read content through (swap for a CMS adapter later)
lib/search.ts            Full-text index + ranking built from the same content records
styles/                  tokens.css (design tokens), base.css, components.css
tests/                   Playwright: site.spec.ts (journeys, routes, layout), a11y.spec.ts (axe-core)
scripts/                 check-contrast, check-links, shots (screenshots)
docs/                    Design system, content audit, accessibility report, CMS migration, launch checklist
public/brand/            Official marks, unmodified (see docs/design-system.md#official-marks)
```

## Key user journeys

1. **Report a problem** — Home → "Report a City Issue" or the MyLA311 quick action → myla311.lacity.gov.
2. **Get help from the district office** — "Get Help" → `/need-help/` → the existing Indigov form, framed on request or opened directly.
3. **Find a program** — Topics & Resources → a guide → the responsible agency's page.
4. **Find something local** — Neighborhoods → a neighborhood → councils, libraries, stations, parks, and area projects.
5. **Search** — any page → `/search/?q=…` (server-rendered full-text results with snippets; works without JavaScript).
6. **Check on events** — Events → list (default) or calendar; past events are kept with links to their original listings.

## Rules this build follows

- Forms stay on their existing platforms and endpoints. This site has no data-collecting form of its own except search.
- No invented facts: no fictional events, grant openings, emergency notices, or representation claims. Empty states say so.
- The district representation notice is off (`content/site.ts → representationNotice`) until the City Clerk publishes wording to cite.
- Former-administration material lives only in the labeled archive, with original dates.

See `docs/launch-checklist.md` for what must happen before any production use.
