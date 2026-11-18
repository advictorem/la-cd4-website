import { content, splitEvents, todayLA, formatDate } from "@/lib/content-adapter";
import { archiveNote } from "@/content/events";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, EmptyState } from "@/components/Layout";
import { LatestList, SectionHead } from "@/components/Cards";
import { EventList } from "@/components/Events";
import { SmartLink, ButtonLink } from "@/components/SmartLink";
import { Icon } from "@/components/Icon";

export const revalidate = 3600;
export const metadata = pageMeta({ title: "News & Events", description: "Events, community updates, and the archive of earlier press releases and newsletters.", route: "/news/" });

export default function NewsPage() {
  const { upcoming } = splitEvents(content.events(), todayLA());
  const pr = content.pressReleases().slice(0, 4);
  const nl = content.newsletters().slice(0, 4);
  return (
    <>
      <PageHeader title="News & Events" lede="Community updates, upcoming events, and the public archive of earlier announcements." crumbs={[{ label: "News & Events" }]} />
      <div className="container section">
        <section aria-labelledby="community-updates">
          <SectionHead id="community-updates" title="Community updates" intro="Neutral background on projects and issues in the district, with links to the responsible agencies." />
          <LatestList items={[...content.hotTopics()].sort((a, b) => b.sourceUpdated.localeCompare(a.sourceUpdated))} />
        </section>

        <section aria-labelledby="events" style={{ marginTop: "var(--s8)" }}>
          <SectionHead id="events" title="Events" action={<SmartLink className="arrow-link" href="/events/">Events calendar and past events <Icon name="arrow" size={16} /></SmartLink>} />
          {upcoming.length ? <EventList events={upcoming.slice(0, 5)} /> : (
            <EmptyState title="No upcoming events are listed" actions={<ButtonLink href="/events/" variant="secondary">View past events</ButtonLink>}>
              <p>The district has not published any future events. New events appear here when they are announced.</p>
            </EmptyState>
          )}
        </section>

        <section aria-labelledby="announcements" style={{ marginTop: "var(--s8)" }}>
          <SectionHead id="announcements" title="Announcements" />
          <EmptyState title="No current announcements" actions={<ButtonLink href="/sign-up/" variant="secondary">Sign up for updates</ButtonLink>}>
            <p>Official District 4 announcements will be published here. For citywide news, see <SmartLink href="https://lacity.gov/">LACity.gov</SmartLink>; for emergencies, see the City’s <SmartLink href="https://emergency.lacity.gov/updates">emergency updates</SmartLink>.</p>
          </EmptyState>
        </section>

        <section aria-labelledby="archive" style={{ marginTop: "var(--s8)" }}>
          <SectionHead id="archive" title="Archive, 2020–2026" />
          <div className="archive-banner"><p><strong>Historical record.</strong> {archiveNote.attribution}</p></div>
          <div className="split split--even" style={{ marginTop: "var(--s6)" }}>
            {[{ t: "Press releases and statements", items: pr, href: "/press-releases/" }, { t: "Newsletters", items: nl, href: "/newsletters/" }].map((col) => (
              <div key={col.t}>
                <h3>{col.t}</h3>
                <ul className="archive" role="list" style={{ marginTop: "var(--s3)" }}>
                  {col.items.map((i) => <li key={i.url} style={{ gridTemplateColumns: "1fr" }}><time dateTime={i.date}>{formatDate(i.date)}</time><SmartLink href={i.url}>{i.title}</SmartLink></li>)}
                </ul>
                <p style={{ marginTop: "var(--s4)" }}><SmartLink className="arrow-link" href={col.href}>All archived {col.t.toLowerCase().split(" ")[0] === "press" ? "press releases" : "newsletters"} <Icon name="arrow" size={16} /></SmartLink></p>
              </div>
            ))}
          </div>
        </section>
        <PageFoot title="News & Events" />
      </div>
    </>
  );
}
