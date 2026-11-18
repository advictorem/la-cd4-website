import { notFound } from "next/navigation";
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

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = content.event((await params).slug);
  if (!e) notFound();
  const past = e.date < todayLA();
  return (
    <>
      <PageHeader title={e.title} eyebrow={past ? "Past event" : "Event"} crumbs={[{ label: "News & Events", href: "/news/" }, { label: "Events", href: "/events/" }, { label: e.title }]} />
      <div className="container section">
        <div className="split">
          <div>
            {past && <Notice tone="slate" icon="clock" title="This event has taken place"><p>It is kept here as a record. Details are shown as originally published.</p></Notice>}
            <dl className="deflist" style={{ marginTop: past ? "var(--s6)" : 0 }}>
              <div><dt>Date</dt><dd><time dateTime={e.date}>{formatDate(e.date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</time></dd></div>
              {e.timeText && <div><dt>Time</dt><dd>{e.timeText}</dd></div>}
              {e.location && <div><dt>Location</dt><dd>{e.location}</dd></div>}
            </dl>
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
