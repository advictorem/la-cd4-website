import { notFound } from "next/navigation";
import { content } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, ContactActions } from "@/components/Layout";
import { ResourceLinkList, TopicCard } from "@/components/Cards";
import { SmartLink } from "@/components/SmartLink";
import { Icon } from "@/components/Icon";

export const dynamicParams = false;
export const generateStaticParams = () => content.topics().map((t) => ({ slug: t.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const t = content.topic((await params).slug);
  return t ? pageMeta({ title: t.title, description: t.summary, route: t.meta.route }) : {};
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = content.topic((await params).slug);
  if (!t) notFound();
  const related = t.related.map((s) => content.topic(s)!).filter(Boolean);
  return (
    <>
      <PageHeader title={t.title} lede={t.summary} color={t.color} icon={t.icon} eyebrow="Resource guide" crumbs={[{ label: "Topics & Resources", href: "/topics-resources/" }, { label: t.title }]} />
      <div className="container section">
        <div className="split">
          <div data-color={t.color}>
            <section aria-labelledby="covers">
              <h2 id="covers" style={{ fontSize: "var(--step-2)" }}>What you can find here</h2>
              <ul className="checklist" style={{ marginTop: "var(--s4)" }} role="list">
                {t.covers.map((c) => <li key={c}><Icon name="check" size={20} /><span>{c}</span></li>)}
              </ul>
            </section>
            <section aria-labelledby="resources" style={{ marginTop: "var(--s7)" }}>
              <h2 id="resources" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s4)" }}>Services and resources</h2>
              <ResourceLinkList links={t.resources} color={t.color} />
            </section>
            <section aria-labelledby="steps" style={{ marginTop: "var(--s7)" }}>
              <h2 id="steps" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>Steps you can take</h2>
              <ol className="steps" role="list">
                {t.steps.map((s) => <li key={s.title}><div><h3>{s.title}</h3><p>{s.body}</p></div></li>)}
              </ol>
            </section>
          </div>
          <div>
            <section className="panel panel--tint" data-color={t.color} aria-labelledby="agencies">
              <h2 id="agencies">Who is responsible</h2>
              <dl className="deflist">
                {t.agencies.map((a) => (
                  <div key={a.name}><dt><SmartLink href={a.href}>{a.name}</SmartLink></dt><dd>{a.role}</dd></div>
                ))}
              </dl>
            </section>
            <div style={{ marginTop: "var(--s5)" }}><ContactActions /></div>
          </div>
        </div>
        <section aria-labelledby="related" style={{ marginTop: "var(--s8)" }}>
          <h2 id="related" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>Related topics</h2>
          <div className="grid grid--2">{related.map((r) => <TopicCard key={r.slug} topic={r} />)}</div>
        </section>
        <PageFoot meta={t.meta} title={t.title} />
      </div>
    </>
  );
}
