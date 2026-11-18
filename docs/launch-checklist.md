# Launch checklist

Nothing below has been done on production. Items marked **City** need a named City approver.

## Before any wider sharing of staging
- [ ] Confirm Vercel Deployment Protection is on for the project (previews require sign-in).
- [ ] Confirm the staging banner and `X-Robots-Tag: noindex` are present on the deployed URL.

## Editorial (City)
- [ ] Approve neutral copy for 10 topic guides, 3 service pages, 6 neighborhoods, 5 community updates, About, Contact.
- [ ] Legal/policy review of rights and eligibility language (Renter Rights, Immigrant Rights, Housing).
- [ ] Re-confirm every phone number and address on neighborhood pages.
- [ ] Re-confirm office phone, email, addresses and press contact immediately before launch.
- [ ] Decide the fate of `/meet-nithya/`, `/team/`, `/job-openings/`, `/press-kit/`, annual reports, `/certificate-requests/`.
- [ ] Decide whether the 2020–2026 archive stays public and searchable.
- [ ] Confirm the "Windstorm & Fire Updates" toolbar label and destination are current.
- [ ] Representation notice: enable only with City Clerk wording, URL and date.
- [ ] Grant program status: update `content/forms.ts` if the hold changes.
- [ ] Set each record's `status` to `verified` and update `verifiedAt` as it is approved.

## Brand and components (City)
- [x] City global bar now uses the City's official widget by default.
- [ ] Permission to use the LA City logo, seal, City Clerk logo and MyLA311 mark as placed.
- [ ] Confirm the district outline graphic may be reused, or supply an approved map.

## Data and imagery added in revision 2
- [ ] Confirm usage rights for the home hero panorama (`public/images/cd4-hills-panorama.webp`).
- [ ] Confirm source, license and credit wording for the five supplied neighborhood photos (`/photo-credits/`); several look like stock, listing or magazine images that need a license.
- [ ] Confirm the Los Feliz & Silver Lake photo shows the right place (it appears to be Echo Park Lake, which is outside the district).
- [ ] Replace the Encino photo with a higher-resolution file (current one is 612 px wide).
- [ ] Weather/air-quality source: Open-Meteo's free tier is for non-commercial use with attribution. Confirm that fits City use, buy their plan, or switch to National Weather Service + AirNow (AirNow needs a free API key).
- [ ] AccuWeather: obtain an API key and confirm their attribution/logo terms, then set `ACCUWEATHER_API_KEY` in Vercel. Until then the readout is credited to Open-Meteo, which is where the numbers come from. The AccuWeather code path has not been exercised with a real key.
- [ ] Google Places: create a key restricted to the site's domains and the Places API, set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, and test address suggestions. Not yet tested with a real key. Review Google's terms and privacy impact first.
- [ ] Confirm the City's address lookup will keep accepting an address in the URL fragment (observed behavior, not a documented interface).
- [ ] Accessibility menu: confirm with the City's accessibility reviewer that a built-in options panel is preferred to the UserWay widget used on mayor.lacity.gov.
- [ ] Confirm the social accounts listed in the footer will continue after the representation transition.
- [ ] Editorial approval of the home-page FAQ answers.

## Revision 5 (top bar, prompt)
- [ ] Indigov: to show only name and email with a yellow button in the sign-up prompt, create or edit that form in Indigov (fields, required marks, single step, button color), then put its URL in `content/site.ts → signupPrompt.formUrl`. Today's form asks first name, last name, email (required) and phone, over three steps, with a blue button.
- [ ] City approval of a timed sign-up prompt on an official site, and of its wording.
- [ ] ITA confirmation that loading the City navbar widget after page load (with the stand-in bar) is acceptable.

## Forms
- [ ] Confirm the Indigov forms (assistance, sign-up) will keep their URLs, or supply the new ones.
- [ ] Confirm who receives submissions during and after the transition.
- [ ] Vendor accessibility conformance reports for Indigov and Google Forms.
- [ ] One supervised end-to-end submission per form, by City staff, on the production embed.

## Accessibility (City)
- [ ] City accessibility review against WCAG 2.1 AA (Title II) with assistive technology; see `docs/accessibility.md` for what was and was not tested.
- [ ] Review the embedded third-party forms and map separately.
- [ ] Publish or link an accessibility statement and feedback contact for this site.

## Technical
- [ ] Choose migration path A or B (`docs/CITY-CMS-MIGRATION.md`).
- [ ] Connect events and archive to the live data source; remove `content/data/live-scrape.json`.
- [ ] Make approved redirects permanent (308).
- [ ] Production CSP, HSTS preload decision, security review.
- [ ] Set `NEXT_PUBLIC_SITE_ENV=production` and `NEXT_PUBLIC_SITE_URL` **only** with written City authorization; verify `robots.txt` and `sitemap.xml`.
- [ ] DNS / domain changes are out of scope for this repository and require separate authorization.
- [ ] Re-run `npm run check`, `npm test`, `npm run check:links`, and Lighthouse on the production candidate.
