# City CMS migration notes

This repository is a staging front end. It does not connect to, read from, or write to the production CMS, and no such access is assumed.

## What production runs today

WordPress with a custom theme (`/wp-content/themes/nithya-raman/`), WP Rocket, Gravity Forms with reCAPTCHA, Embedly, Google Tag Manager. Pretty permalinks with trailing slashes. Custom post types appear to exist for initiatives (`/initiative/…`), neighborhoods (`/neighborhood/…`), city services (`/city-service/…`), events (`/event/…`), newsletters (`/newsletter/…`) and press releases (`/press-releases/…`). The REST API was not inspected beyond confirming there is no public events endpoint.

## Two ways to ship this design

**A. New WordPress theme on the existing install (lowest risk to URLs and forms).**
Port `styles/` and the component markup into a block or classic theme. Keep existing post types and slugs so every permalink survives. The Indigov iframes and Gravity Forms stay exactly where they are. Search uses WordPress search or an approved plugin.

**B. Headless: keep WordPress as the CMS, serve this Next.js app.**
Implement `ContentAdapter` (`lib/content-adapter.ts`) against the WordPress REST API or WPGraphQL. Each content type in `content/types.ts` maps to a post type with custom fields; `ContentMeta` maps to post meta (`source_url`, `verified_at`, `content_owner`, `review_status`). Requires City IT to approve hosting, an API exposure policy, cache invalidation (on-publish revalidation), and preview.

Either way, templates here only read through the adapter, so content can move without rewriting pages.

## Permalinks

All routes in the brief are preserved (see `docs/content-audit.md`). Redirects currently defined in `next.config.ts` are temporary (307) and need approval before they become permanent:
`/initiatives/` → `/topics-resources/`; `/meet-nithya/`, `/team/`, `/job-openings/` → `/district-4/`; `/the-latest/`, `/press-kit/` → `/news/`; `/press-releases/annual-reports/` → `/press-releases/`; `/certificate-requests/` → `/need-help/`.

Individual archive URLs (`/press-releases/{slug}/`, `/newsletter/{slug}/`) are not recreated on staging; the archive index links to the originals. In production they should stay where they are, under the archive banner.

## What can be imported

| Content | Import path |
| --- | --- |
| Topic guides, city services, neighborhoods, community updates | New copy from `content/*.ts` replaces the body of the existing posts (same slugs), after editorial approval |
| Events | Existing event posts stay; the list/calendar templates read date, time, location fields |
| Press releases, newsletters | Stay as-is; add the archive banner template and remove them from the home page |
| Media | Officeholder photography is not used. Official marks are in `public/brand/` |

## Approvals needed from City IT (ITA)

1. Hosting model (A or B) and, for B, where the Node app runs. Vercel is used only for this preview.
2. The City toolbar variant (see `docs/design-system.md#city-toolbar`).
3. Content Security Policy for production, including the form and map providers.
4. Whether Google Tag Manager or any analytics continue; this build ships none.
5. Indigov account/URL changes during the representation transition, and who receives submissions.
6. Search solution and indexing of archived material.
7. Translation approach (the live site's widget vs. the link-out used here).
