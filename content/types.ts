/**
 * Content model for the Council District 4 site.
 * Content lives in typed data files (this folder) and is read only through
 * lib/content-adapter.ts, so it can later be served from the City CMS instead.
 */
export type ReviewStatus = "verified" | "pending-review" | "archived";

/** Provenance carried by every content record. */
export interface ContentMeta {
  /** Public route on this site, with trailing slash. */
  route: string;
  /** Primary source the copy/links were taken from. */
  sourceUrl: string;
  /** ISO date the source was last checked. */
  verifiedAt: string;
  /** Team or agency responsible for keeping the record accurate. */
  contentOwner: string;
  status: ReviewStatus;
}

export type ColorFamily =
  | "city" | "green" | "purple" | "terracotta" | "teal" | "amber" | "slate" | "ochre" | "red";

export type IconName =
  | "leaf" | "building" | "hands" | "chart" | "home" | "tree" | "shield" | "key" | "store" | "bus"
  | "phone" | "alert" | "people" | "briefcase" | "mail" | "calendar" | "map" | "search" | "external"
  | "arrow" | "chevron" | "menu" | "close" | "link" | "check" | "info" | "document" | "clock" | "pin" | "globe" | "list" | "grid";

export interface ResourceLink {
  label: string;
  href: string;
  description?: string;
  /** Agency that owns the destination. */
  agency?: string;
}

export interface Topic {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  color: ColorFamily;
  icon: IconName;
  /** "What you can find here" bullets. */
  covers: string[];
  resources: ResourceLink[];
  steps: { title: string; body: string }[];
  agencies: { name: string; role: string; href: string }[];
  related: string[];
  /** Title used on the live site before the neutral rewrite (for redirects/search synonyms). */
  formerTitle: string;
  meta: ContentMeta;
}

export interface Place {
  name: string;
  address?: string;
  phone?: string;
  href?: string;
}

export interface Neighborhood {
  slug: string;
  title: string;
  areas: string[];
  region: "San Fernando Valley" | "Hollywood Hills & Central LA";
  /** One short sentence for tiles; keep all six about the same length. */
  blurb: string;
  overview: string[];
  councils: Place[];
  civic: Place[];
  safety: Place[];
  recreation: Place[];
  projects: string[]; // hot-topic slugs
  relatedTopics: string[];
  meta: ContentMeta;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  summary: string;
  color: ColorFamily;
  icon: IconName;
  intro: string[];
  groups: { heading: string; links: ResourceLink[] }[];
  meta: ContentMeta;
}

export interface HotTopic {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  color: ColorFamily;
  icon: IconName;
  /** ISO date of the most recent dated information found in the source. */
  sourceUpdated: string;
  /** Shown as a notice when the source content is time-sensitive and may be stale. */
  timeliness?: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[]; links?: ResourceLink[] }[];
  sources: ResourceLink[];
  relatedTopics: string[];
  neighborhoods: string[];
  meta: ContentMeta;
}

export type EmbedKind = "iframe" | "link-only";

export interface FormHandoff {
  slug: string;
  title: string;
  summary: string;
  /** Platform that hosts the form today. */
  platform: string;
  /** How the live site includes it. */
  liveMethod: string;
  embed: EmbedKind;
  /** Exact existing endpoint. Never replaced. */
  formUrl?: string;
  /** Live page that hosts the form (authoritative fallback). */
  livePageUrl: string;
  availability?: { state: "open" | "on-hold" | "moved"; note: string };
  body: string[];
  alternatives?: ResourceLink[];
  meta: ContentMeta;
}

export interface EventRecord {
  slug: string;
  title: string;
  /** ISO date (local, America/Los_Angeles). */
  date: string;
  timeText?: string;
  location?: string;
  summary?: string;
  links: ResourceLink[];
  sourceUrl: string;
  /** Header image from the live event listing; absent when the listing only had a plain color strip or an officeholder-branded flyer. */
  image?: string;
  /** Registration link from the live listing. Only offered while the event is upcoming. */
  rsvpUrl?: string;
}

export interface ArchiveItem {
  title: string;
  date: string;
  url: string;
  tags?: string;
  kind: "press-release" | "newsletter" | "update";
}
