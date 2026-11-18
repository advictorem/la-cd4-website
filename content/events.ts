import type { EventRecord, ArchiveItem } from "./types";
import scrape from "./data/live-scrape.json";

/**
 * Event and archive data captured from cd4.lacity.gov on 2026-11-17
 * (scripts/README in docs/content-audit.md describes the capture).
 * The live site has no public events API, so this file is the staging data source.
 * Nothing is added by hand: if the live site lists no upcoming events, neither do we.
 */
interface RawEvent { title: string; date: string | null; url: string; slug: string; time: string | null; location: string | null; summary: string | null; links: { url: string; label: string }[] }
interface RawItem { title: string; date: string | null; url: string; tags: string }

const tidy = (s: string) => s.replace(/\s+/g, " ").trim();

export const events: EventRecord[] = (scrape.events as RawEvent[])
  .filter((e) => e.date)
  .map((e) => ({
    slug: e.slug,
    title: tidy(e.title.replace(/\*/g, "")),
    date: e.date as string,
    timeText: e.time ?? undefined,
    location: e.location ?? undefined,
    summary: e.summary ? tidy(e.summary.split(/\s(?:DATE|WHEN)\s?:/)[0]) : undefined,
    links: e.links.filter((l) => l.label.length > 3 && !/^here$/i.test(l.label)).map((l) => ({ label: l.label, href: l.url })),
    sourceUrl: e.url,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

const sentence = (t: string) => {
  const s = tidy(t);
  // Many archived headlines are in capitals; display them in sentence case without changing the words.
  if (s === s.toUpperCase() && /[A-Z]{4}/.test(s)) return s.charAt(0) + s.slice(1).toLowerCase().replace(/\b(los angeles|raman|council district 4|cd4|lahsa|hud|usa|paraguay|ladot|lapd|lafd|city council|city of los angeles|hollywood|griffith park|silver lake|sherman oaks|studio city|reseda|encino|california|councilmember|yaroslavsky|autry|june|july|january|february|march|april|august|september|october|november|december)\b/g, (m) => m.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/^(Cd4|Lahsa|Hud|Usa|Ladot|Lapd|Lafd)$/, (x) => x.toUpperCase()));
  return s;
};

const toItems = (rows: RawItem[], kind: ArchiveItem["kind"]): ArchiveItem[] =>
  rows.filter((r) => r.date).map((r) => ({ title: sentence(r.title), date: r.date as string, url: r.url, tags: r.tags || undefined, kind }));

export const pressReleases = toItems(scrape.pressReleases as RawItem[], "press-release");
export const newsletters = toItems(scrape.newsletters as RawItem[], "newsletter");

export const archiveNote = {
  capturedAt: "2026-11-17",
  attribution: "Published by the office of the Councilmember for District 4 during the 2020–2026 term. These items record that office's statements at the time. They are kept for the public record and are not current District 4 positions.",
  scope: "This staging index lists the most recent items from the live site's first listing page. The complete archive remains at the original addresses and will be imported during CMS migration.",
};
