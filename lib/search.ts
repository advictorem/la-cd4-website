/**
 * Full-text search over the real page inventory.
 * The index is built from the same content records the page templates render,
 * so every indexed page exists and every result snippet is text from that page.
 */
import { content, formatDate } from "./content-adapter";
import { site } from "@/content/site";
import type { ResourceLink } from "@/content/types";

export interface SearchDoc { url: string; title: string; section: string; description: string; body: string; keywords: string }
export interface SearchHit { url: string; title: string; section: string; snippet: string; score: number }

const links = (l: ResourceLink[] = []) => l.map((x) => `${x.label}. ${x.description ?? ""} ${x.agency ?? ""}`).join(" ");

let cache: SearchDoc[] | null = null;

export function buildIndex(): SearchDoc[] {
  if (cache) return cache;
  const docs: SearchDoc[] = [];
  const add = (d: SearchDoc) => docs.push({ ...d, body: d.body.replace(/\s+/g, " ").trim() });

  add({ url: "/", title: "Council District 4", section: "Home", description: site.description, keywords: "home cd4 district 4",
    body: `${site.description} Get help. Report a City issue. Request assistance, MyLA311, emergency information, housing and renter help, street and traffic requests, sign up for updates.` });
  add({ url: "/city-services/", title: "City Services", section: "City Services", description: "Services for residents and businesses, emergency services, and MyLA311.", keywords: "311 services report request",
    body: `MyLA311 connects you to City services. ${site.myla311.phoneLabel}. ${content.serviceCategories().map((c) => `${c.title}: ${c.summary}`).join(" ")}` });
  add({ url: "/topics-resources/", title: "Topics & Resources", section: "Topics & Resources", description: "Ten resource guides to City programs and the agencies that run them.", keywords: "initiatives topics resources",
    body: content.topics().map((t) => `${t.title}: ${t.summary}`).join(" ") });
  add({ url: "/neighborhoods/", title: "Neighborhoods", section: "Neighborhoods", description: "Local resources for the six neighborhood areas of Council District 4.", keywords: "neighborhood areas map",
    body: content.neighborhoods().map((n) => `${n.title}. ${n.overview[0]}`).join(" ") });
  add({ url: "/news/", title: "News & Events", section: "News & Events", description: "Events, community updates, and the archive of earlier press releases and newsletters.", keywords: "news updates hot topics latest",
    body: content.hotTopics().map((h) => `${h.title}: ${h.summary}`).join(" ") });
  add({ url: "/events/", title: "Events", section: "News & Events", description: "Upcoming and past community events in Council District 4.", keywords: "calendar events",
    body: content.events().map((e) => `${e.title} ${formatDate(e.date)}`).join(". ") });
  add({ url: "/district-4/", title: "About Council District 4", section: "About CD4", description: "Geography of the district and how the district office serves residents.", keywords: "about map boundaries redistricting bridge district",
    body: "Council District 4 extends from the San Fernando Valley across the Santa Monica Mountains to central Los Angeles. Silver Lake, Los Feliz, Hollywood Hills, Studio City, Sherman Oaks, Van Nuys, Encino, Reseda. Hollywood Bowl, Ford Theatre, Griffith Observatory, Hollywood Sign, Ventura Boulevard, Hillhurst Avenue. District boundaries adopted December 2021, effective January 1, 2022. Office of the City Clerk." });
  add({ url: "/press-releases/", title: "Press release archive (2020–2026)", section: "Archive", description: "Historical press releases and statements, with original dates.", keywords: "archive press statements",
    body: content.pressReleases().map((p) => p.title).join(". ") });
  add({ url: "/newsletters/", title: "Newsletter archive (2020–2026)", section: "Archive", description: "Historical district newsletters, with original dates.", keywords: "archive newsletter",
    body: content.newsletters().map((p) => p.title).join(". ") });

  for (const c of content.serviceCategories())
    add({ url: `/city-service/${c.slug}/`, title: c.title, section: "City Services", description: c.summary, keywords: "",
      body: `${c.intro.join(" ")} ${c.groups.map((g) => `${g.heading}: ${links(g.links)}`).join(" ")}` });
  for (const t of content.topics())
    add({ url: `/initiative/${t.slug}/`, title: t.title, section: "Topics & Resources", description: t.summary, keywords: `${t.formerTitle} ${t.shortTitle}`,
      body: `${t.covers.join(". ")}. ${links(t.resources)} ${t.steps.map((s) => `${s.title}. ${s.body}`).join(" ")} ${t.agencies.map((a) => `${a.name}: ${a.role}`).join(". ")}` });
  for (const n of content.neighborhoods())
    add({ url: `/neighborhood/${n.slug}/`, title: n.title, section: "Neighborhoods", description: n.overview[0], keywords: n.areas.join(" "),
      body: `${n.overview.join(" ")} ${[...n.councils, ...n.civic, ...n.safety, ...n.recreation].map((p) => `${p.name} ${p.address ?? ""} ${p.phone ?? ""}`).join(". ")}` });
  for (const h of content.hotTopics())
    add({ url: `/${h.slug}/`, title: h.title, section: "Community updates", description: h.summary, keywords: h.kicker,
      body: h.sections.map((s) => `${s.heading}. ${(s.paragraphs ?? []).join(" ")} ${(s.bullets ?? []).join(". ")} ${links(s.links)}`).join(" ") });
  for (const f of content.forms())
    add({ url: `/${f.slug}/`, title: f.slug === "need-help" ? "Contact & get help" : f.title, section: "Contact", description: f.summary, keywords: "contact form email phone office",
      body: `${f.body.join(" ")} ${f.availability?.note ?? ""} ${links(f.alternatives)} ${f.slug === "need-help" ? `${site.contact.phone} ${site.contact.email} ${site.contact.offices.map((o) => `${o.name} ${o.lines.join(" ")}`).join(" ")}` : ""}` });
  for (const e of content.events())
    add({ url: `/event/${e.slug}/`, title: e.title, section: "Events", description: `${formatDate(e.date)}${e.location ? ` · ${e.location}` : ""}`, keywords: "event",
      body: `${e.summary ?? ""} ${e.timeText ?? ""} ${e.location ?? ""}` });
  cache = docs;
  return docs;
}

const STOP = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "for", "on", "my", "is", "how", "do", "i", "can", "with", "at"]);
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, " ");
export const tokenize = (q: string) => norm(q).split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t)).slice(0, 8);

/** Occurrences of needle at the start of a word ("grant" matches "grants", not "immigrant"). */
function count(hay: string, needle: string) { let n = 0, i = 0; while ((i = hay.indexOf(needle, i)) !== -1) { if (i === 0 || !/[a-z0-9]/.test(hay[i - 1])) n++; i += needle.length; } return n; }

function snippet(doc: SearchDoc, terms: string[]): string {
  const text = doc.body || doc.description;
  const lower = norm(text);
  let pos = -1;
  for (const t of terms) { const m = new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).exec(lower); if (m) { pos = m.index + m[1].length; break; } }
  if (pos === -1) return doc.description;
  const start = Math.max(0, text.lastIndexOf(" ", Math.max(0, pos - 70)) + 1);
  const end = Math.min(text.length, pos + 150);
  return `${start > 0 ? "… " : ""}${text.slice(start, end).trim()}${end < text.length ? " …" : ""}`;
}

export function search(query: string, limit = 30): SearchHit[] {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  for (const d of buildIndex()) {
    const title = norm(d.title), desc = norm(d.description), body = norm(d.body), kw = norm(d.keywords);
    let score = 0, matched = 0;
    for (const t of terms) {
      const stem = t.length > 4 ? t.replace(/(ing|es|s)$/, "") : t;
      const s = count(title, stem) * 12 + count(kw, stem) * 8 + count(desc, stem) * 4 + Math.min(count(body, stem), 6) * 1.5;
      if (s > 0) matched++;
      score += s;
    }
    if (matched === 0) continue;
    if (matched === terms.length) score *= 2; // all terms present
    if (title.includes(norm(query).trim())) score += 20;
    hits.push({ url: d.url, title: d.title, section: d.section, snippet: snippet(d, terms.map((t) => (t.length > 4 ? t.replace(/(ing|es|s)$/, "") : t))), score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
