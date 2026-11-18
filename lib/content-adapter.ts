/**
 * Content adapter.
 *
 * Templates import content ONLY from this module. Today it reads the typed files in /content.
 * To move to the City CMS (WordPress REST, or another approved source), implement the same
 * ContentAdapter interface against that source and swap the export at the bottom of the file.
 * No production CMS API is assumed or called here.
 */
import { topics } from "@/content/topics";
import { neighborhoods } from "@/content/neighborhoods";
import { serviceCategories } from "@/content/services";
import { hotTopics } from "@/content/hot-topics";
import { forms } from "@/content/forms";
import { events, pressReleases, newsletters } from "@/content/events";
import type { Topic, Neighborhood, ServiceCategory, HotTopic, FormHandoff, EventRecord, ArchiveItem } from "@/content/types";

export interface ContentAdapter {
  topics(): Topic[];
  topic(slug: string): Topic | undefined;
  neighborhoods(): Neighborhood[];
  neighborhood(slug: string): Neighborhood | undefined;
  serviceCategories(): ServiceCategory[];
  serviceCategory(slug: string): ServiceCategory | undefined;
  hotTopics(): HotTopic[];
  hotTopic(slug: string): HotTopic | undefined;
  forms(): FormHandoff[];
  form(slug: string): FormHandoff | undefined;
  events(): EventRecord[];
  event(slug: string): EventRecord | undefined;
  pressReleases(): ArchiveItem[];
  newsletters(): ArchiveItem[];
}

const by = <T extends { slug: string }>(list: T[]) => (slug: string) => list.find((i) => i.slug === slug);

export const staticContent: ContentAdapter = {
  topics: () => topics, topic: by(topics),
  neighborhoods: () => neighborhoods, neighborhood: by(neighborhoods),
  serviceCategories: () => serviceCategories, serviceCategory: by(serviceCategories),
  hotTopics: () => hotTopics, hotTopic: by(hotTopics),
  forms: () => forms, form: by(forms),
  events: () => events, event: by(events),
  pressReleases: () => pressReleases, newsletters: () => newsletters,
};

export const content: ContentAdapter = staticContent;

/** Today's date in Los Angeles as YYYY-MM-DD. */
export function todayLA(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function splitEvents(list: EventRecord[], today = todayLA()) {
  const upcoming = list.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = list.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}
