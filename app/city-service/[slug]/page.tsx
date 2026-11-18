import { notFound } from "next/navigation";
import { content } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, ContactActions, Notice } from "@/components/Layout";
import { ResourceLinkList } from "@/components/Cards";
import { SmartLink } from "@/components/SmartLink";

export const dynamicParams = false;
export const generateStaticParams = () => content.serviceCategories().map((c) => ({ slug: c.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = content.serviceCategory((await params).slug);
  return c ? pageMeta({ title: c.title, description: c.summary, route: c.meta.route }) : {};
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = content.serviceCategory((await params).slug);
  if (!c) notFound();
  const others = content.serviceCategories().filter((o) => o.slug !== c.slug);
  return (
    <>
      <PageHeader title={c.title} lede={c.summary} color={c.color} icon={c.icon} eyebrow="City Services" crumbs={[{ label: "City Services", href: "/city-services/" }, { label: c.title }]} />
      <div className="container section">
        <div className="split">
          <div data-color={c.color}>
            {c.slug === "emergency-services" && (
              <div style={{ marginBottom: "var(--s6)" }}>
                <Notice tone="red" icon="alert" title="In an emergency, call 911"><p>This page is not updated in real time. For current incidents, check the City’s emergency updates.</p></Notice>
              </div>
            )}
            <div className="prose">{c.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
            {c.groups.map((g) => (
              <section key={g.heading} style={{ marginTop: "var(--s7)" }}>
                <h2 style={{ fontSize: "var(--step-2)", marginBottom: "var(--s4)" }}>{g.heading}</h2>
                <ResourceLinkList links={g.links} color={c.color} />
              </section>
            ))}
          </div>
          <div>
            <ContactActions />
            <nav className="panel" aria-label="Other City Services pages" style={{ marginTop: "var(--s5)" }}>
              <h2>More City Services</h2>
              <ul role="list" className="stack" style={{ ["--flow" as string]: "0.5rem" }}>
                {others.map((o) => <li key={o.slug}><SmartLink href={`/city-service/${o.slug}/`}>{o.title}</SmartLink></li>)}
                <li><SmartLink href="/city-services/">All City Services</SmartLink></li>
              </ul>
            </nav>
          </div>
        </div>
        <PageFoot meta={c.meta} title={c.title} />
      </div>
    </>
  );
}
