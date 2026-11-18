import { notFound } from "next/navigation";
import { content, formatDate } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, ContactActions, Notice } from "@/components/Layout";
import { ResourceLinkList, TopicCard } from "@/components/Cards";
import { SmartLink } from "@/components/SmartLink";

// Community update ("Hot Topic") pages keep their existing root-level URLs.
export const dynamicParams = false;
export const generateStaticParams = () => content.hotTopics().map((h) => ({ slug: h.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const h = content.hotTopic((await params).slug);
  return h ? pageMeta({ title: h.title, description: h.summary, route: h.meta.route }) : {};
}

export default async function HotTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const h = content.hotTopic((await params).slug);
  if (!h) notFound();
  const topics = h.relatedTopics.map((s) => content.topic(s)!).filter(Boolean);
  const hoods = h.neighborhoods.map((s) => content.neighborhood(s)!).filter(Boolean);
  return (
    <>
      <PageHeader title={h.title} lede={h.summary} color={h.color} icon={h.icon} eyebrow={h.kicker} crumbs={[{ label: "News & Events", href: "/news/" }, { label: h.title }]}>
        <p className="meta-line" style={{ marginTop: "var(--s4)" }}>
          <span>Source information dated <time dateTime={h.sourceUpdated}>{formatDate(h.sourceUpdated, { year: "numeric", month: "long" })}</time></span>
          <span>Page reviewed <time dateTime={h.meta.verifiedAt}>{formatDate(h.meta.verifiedAt)}</time></span>
        </p>
      </PageHeader>
      <div className="container section">
        <div className="split">
          <div data-color={h.color}>
            {h.timeliness && <Notice tone="amber" icon="clock" title="Check dates before you rely on this page"><p>{h.timeliness}</p></Notice>}
            {h.sections.map((s) => (
              <section key={s.heading} style={{ marginTop: "var(--s7)" }}>
                <h2 style={{ fontSize: "var(--step-2)", marginBottom: "var(--s4)" }}>{s.heading}</h2>
                <div className="prose">
                  {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                  {s.bullets && <ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
                </div>
                {s.links && <div style={{ marginTop: "var(--s4)" }}><ResourceLinkList links={s.links} color={h.color} /></div>}
              </section>
            ))}
          </div>
          <div>
            <section className="panel" aria-labelledby="sources">
              <h2 id="sources">Sources</h2>
              <ul role="list" className="stack" style={{ ["--flow" as string]: "0.5rem" }}>
                {h.sources.map((s) => <li key={s.href}><SmartLink href={s.href}>{s.label}</SmartLink></li>)}
              </ul>
            </section>
            {hoods.length > 0 && (
              <nav className="panel" aria-label="Neighborhoods affected">
                <h2>Neighborhoods</h2>
                <ul role="list" className="stack" style={{ ["--flow" as string]: "0.5rem" }}>
                  {hoods.map((n) => <li key={n.slug}><SmartLink href={`/neighborhood/${n.slug}/`}>{n.title}</SmartLink></li>)}
                </ul>
              </nav>
            )}
            <div style={{ marginTop: "var(--s5)" }}><ContactActions /></div>
          </div>
        </div>
        <section aria-labelledby="related" style={{ marginTop: "var(--s8)" }}>
          <h2 id="related" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>Related topics</h2>
          <div className="grid grid--3">{topics.map((t) => <TopicCard key={t.slug} topic={t} />)}</div>
        </section>
        <PageFoot meta={h.meta} title={h.title} />
      </div>
    </>
  );
}
