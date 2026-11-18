import { content } from "@/lib/content-adapter";
import { primaryNav } from "@/content/navigation";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot } from "@/components/Layout";
import { TopicCard, TopicPills } from "@/components/Cards";

export const metadata = pageMeta({ title: "Topics & Resources", description: "Ten plain-language guides to City programs, with links to the agencies that run them.", route: "/topics-resources/" });

export default function TopicsPage() {
  const groups = primaryNav.find((s) => s.id === "topics")!.groups;
  return (
    <>
      <PageHeader title="Topics & Resources" lede="Plain-language guides to City programs. Each guide explains what you can find, the steps to take, and which agency is responsible." crumbs={[{ label: "Topics & Resources" }]} />
      <div className="container section">
        <nav aria-label="Jump to a topic" className="section--centered" style={{ marginBottom: "var(--s8)" }}>
          <h2 className="section-label">Jump to a topic</h2>
          <TopicPills topics={groups.flatMap((g) => g.links.map((l) => content.topic(l.href.split("/")[2])!)).filter(Boolean)} />
        </nav>
        {groups.map((g, i) => (
          <section key={g.heading} style={{ marginTop: i ? "var(--s7)" : 0 }}>
            <h2 style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>{g.heading}</h2>
            <div className="grid grid--2">
              {g.links.map((l) => { const t = content.topic(l.href.split("/")[2]); return t ? <TopicCard key={t.slug} topic={t} /> : null; })}
            </div>
          </section>
        ))}
        <PageFoot title="Topics & Resources" />
      </div>
    </>
  );
}
