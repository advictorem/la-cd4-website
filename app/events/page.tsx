import { content, splitEvents, todayLA } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot } from "@/components/Layout";
import { EventsBrowser, EventList } from "@/components/Events";
import { SmartLink } from "@/components/SmartLink";

export const revalidate = 3600;
export const metadata = pageMeta({ title: "Events", description: "Upcoming and past community events in Council District 4.", route: "/events/" });

export default function EventsPage() {
  const today = todayLA();
  const { upcoming, past } = splitEvents(content.events(), today);
  return (
    <>
      <PageHeader title="Events" lede="Community events published by the district. Every listing links to its original source." crumbs={[{ label: "News & Events", href: "/news/" }, { label: "Events" }]} />
      <div className="container section">
        <EventsBrowser upcoming={upcoming} past={past} today={today} />
        <section aria-labelledby="past" style={{ marginTop: "var(--s8)" }}>
          <h2 id="past" style={{ marginBottom: "var(--s3)" }}>Past events</h2>
          <p className="muted" style={{ marginBottom: "var(--s5)", maxWidth: "60ch" }}>Events that have already taken place, most recent first. Listed as published on <SmartLink href="https://cd4.lacity.gov/events/">cd4.lacity.gov</SmartLink>.</p>
          <EventList events={past} past />
        </section>
        <PageFoot title="Events" />
      </div>
    </>
  );
}
