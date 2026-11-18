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
- [ ] ITA decision on the City toolbar variant; switch to `official` unless the reference variant is approved.
- [ ] Permission to use the LA City logo, seal, City Clerk logo and MyLA311 mark as placed.
- [ ] Confirm the district outline graphic may be reused, or supply an approved map.

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
