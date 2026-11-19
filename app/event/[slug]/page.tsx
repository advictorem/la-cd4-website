import Image from "next/image";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { eventFallbackPhoto } from "@/content/images";
import { content, formatDate, todayLA } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, Notice } from "@/components/Layout";
import { SmartLink, ButtonLink } from "@/components/SmartLink";

export const dynamicParams = false;
export const revalidate = 3600;
export const generateStaticParams = () => content.events().map((e) => ({ slug: e.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const e = content.event((await params).slug);
  return e ? pageMeta({ title: e.title, description: `${formatDate(e.date)}${e.location ? ` · ${e.location}` : ""}`, route: `/event/${e.slug}/` }) : {};
}

/** "Thursday, November 12 6:00PM – 8:30PM" -> "6:00 PM – 8:30 PM" (the date has its own cell). */
function shortTime(t: string) {
  return t
    .replace(/^[A-Z][a-z]+day,\s+[A-Z][a-z]+\s+\d{1,2}(?:,\s*\d{4})?\s*/, "")
    .replace(/(\d)\s?(am|pm)\b/gi, (_, d: string, m: string) => `${d} ${m.toUpperCase()}`)
    .trim();
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = content.event((await params).slug);
  if (!e) notFound();
  const past = e.date < todayLA();
  const time = e.timeText ? shortTime(e.timeText) : "";
  return (
    <>
      <PageHeader title={e.title} eyebrow={past ? "Past event" : "Event"} crumbs={[{ label: "News & Events", href: "/news/" }, { label: "Events", href: "/events/" }, { label: e.title }]} />
      <div className="container section">
        <div className="split">
          <div>
            <div className="event-photo"><Image src={e.image ?? eventFallbackPhoto.src} alt="" fill priority sizes="(min-width: 62rem) 60vw, 100vw" /></div>
            {past && <div style={{ marginTop: "var(--s5)" }}><Notice tone="slate" icon="clock" title="This event has taken place"><p>It is kept here as a record. Details are shown as originally published.</p></Notice></div>}
            <div className="event-card">
              <dl className="event-facts">
                <div><dt><Icon name="calendar" size={18} />Date</dt><dd><time dateTime={e.date}>{formatDate(e.date, { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</time></dd></div>
                <div><dt><Icon name="clock" size={18} />Time</dt><dd>{time || "To be announced"}</dd></div>
                <div><dt><Icon name="pin" size={18} />Location</dt><dd>{e.location ?? "To be announced"}</dd></div>
              </dl>
              <div className="event-card__rsvp">
                {past
                  ? <><button type="button" className="btn" disabled>RSVP closed</button><p>This event has ended, so registration is closed.</p></>
                  : <><ButtonLink href={e.rsvpUrl ?? e.sourceUrl}>RSVP</ButtonLink><p>{e.rsvpUrl ? "Registration is handled by the event organizer." : "Registration details are on the original listing."}</p></>}
              </div>
            </div>
            {e.summary && <div className="prose" style={{ marginTop: "var(--s6)" }}><h2 style={{ fontSize: "var(--step-2)" }}>About this event</h2><p>{e.summary}</p></div>}
            {e.links.length > 0 && (
              <ul role="list" className="stack" style={{ marginTop: "var(--s5)" }}>
                {e.links.map((l) => <li key={l.href}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}
              </ul>
            )}
          </div>
          <aside className="panel" aria-label="Source">
            <h2>Source</h2>
            <p>Event details were published on the Council District 4 website.</p>
            <div className="btn-row" style={{ marginTop: "var(--s4)" }}><ButtonLink href={e.sourceUrl} variant="secondary" small>View original listing</ButtonLink></div>
            <p style={{ marginTop: "var(--s4)" }}><SmartLink href="/events/">All events</SmartLink></p>
          </aside>
        </div>
        <PageFoot title={e.title} />
      </div>
    </>
  );
}
