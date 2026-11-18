import type { ArchiveItem } from "@/content/types";
import { archiveNote } from "@/content/events";
import { formatDate } from "@/lib/content-adapter";
import { PageHeader, PageFoot, EmptyState } from "./Layout";
import { SmartLink } from "./SmartLink";

export function ArchivePage({ title, lede, items, liveUrl }: { title: string; lede: string; items: ArchiveItem[]; liveUrl: string }) {
  const years = [...new Set(items.map((i) => i.date.slice(0, 4)))];
  return (
    <>
      <PageHeader title={title} lede={lede} color="slate" icon="document" eyebrow="Archive" crumbs={[{ label: "News & Events", href: "/news/" }, { label: title }]} />
      <div className="container section">
        <div className="archive-banner">
          <p><strong>Historical record.</strong> {archiveNote.attribution}</p>
          <p className="small" style={{ marginTop: "0.5rem" }}>{archiveNote.scope} <SmartLink href={liveUrl}>View the complete list on cd4.lacity.gov</SmartLink></p>
        </div>
        {items.length === 0 && <div style={{ marginTop: "var(--s6)" }}><EmptyState title="No archived items are available"><p>The archive could not be loaded. The original items remain on cd4.lacity.gov.</p></EmptyState></div>}
        {years.map((y) => (
          <section key={y} style={{ marginTop: "var(--s7)" }}>
            <h2 style={{ fontSize: "var(--step-2)", marginBottom: "var(--s3)" }}>{y}</h2>
            <ul className="archive" role="list">
              {items.filter((i) => i.date.startsWith(y)).map((i) => (
                <li key={i.url}>
                  <time dateTime={i.date}>{formatDate(i.date)}</time>
                  <span><SmartLink href={i.url}>{i.title}</SmartLink>{i.tags && <span className="small muted"> · {i.tags}</span>}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <PageFoot title={title} />
      </div>
    </>
  );
}
