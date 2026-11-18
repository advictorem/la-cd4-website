import { notFound } from "next/navigation";
import { content } from "@/lib/content-adapter";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, ContactActions } from "@/components/Layout";
import { PlaceList, QuickService, LatestList, TopicCard } from "@/components/Cards";
import { SmartLink } from "@/components/SmartLink";
import { neighborhoodPhotos } from "@/content/images";

export const dynamicParams = false;
export const generateStaticParams = () => content.neighborhoods().map((n) => ({ slug: n.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const n = content.neighborhood((await params).slug);
  return n ? pageMeta({ title: n.title, description: n.overview[0], route: n.meta.route }) : {};
}

export default async function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const n = content.neighborhood((await params).slug);
  if (!n) notFound();
  const projects = n.projects.map((s) => content.hotTopic(s)!).filter(Boolean);
  const topics = n.relatedTopics.map((s) => content.topic(s)!).filter(Boolean);
  const others = content.neighborhoods().filter((o) => o.slug !== n.slug);
  const photo = neighborhoodPhotos[n.slug];
  return (
    <>
      <PageHeader title={n.title} eyebrow={n.region} lede={n.blurb} image={photo?.src} crumbs={[{ label: "Neighborhoods", href: "/neighborhoods/" }, { label: n.title }]} />
      <div className="container section">
        <section aria-labelledby="about" className="prose" style={{ marginBottom: "var(--s7)" }}>
          <h2 id="about" style={{ fontSize: "var(--step-2)", marginTop: 0 }}>About {n.title}</h2>
          {n.overview.map((p, i) => <p key={i}>{p}</p>)}
        </section>
        <section aria-labelledby="quick">
          <h2 id="quick" className="visually-hidden">Quick actions</h2>
          <ul className="quick" role="list">
            <QuickService href={site.myla311.web} label="Report an issue" hint="MyLA311 service requests" color="teal" icon="phone" />
            <QuickService href="/need-help/" label="Request assistance" hint="Contact the district office" color="city" icon="mail" />
            <QuickService href="/district-4/#map" label="District map" hint="See the district boundaries" color="slate" icon="map" />
          </ul>
        </section>

        <div className="split" style={{ marginTop: "var(--s7)" }}>
          <section aria-labelledby="local">
            <h2 id="local" style={{ fontSize: "var(--step-3)", marginBottom: "var(--s5)" }}>Local resources</h2>
            <div className="dir">
              <PlaceList heading="Neighborhood Councils & community groups" icon="people" places={n.councils} />
              <PlaceList heading="Libraries, markets & post offices" icon="building" places={n.civic} />
              <PlaceList heading="Police & fire stations" icon="shield" places={n.safety} />
              <PlaceList heading="Parks & recreation" icon="tree" places={n.recreation} />
            </div>
            <p className="small muted" style={{ marginTop: "var(--s5)" }}>Listings are carried over from the current CD4 website and are being re-confirmed. For emergencies call 911; do not rely on station phone numbers.</p>
          </section>
          <div>
            <ContactActions heading="Report a problem in this area" />
            <nav className="panel" aria-label="Other neighborhoods" style={{ marginTop: "var(--s5)" }}>
              <h2>Other neighborhoods</h2>
              <ul role="list" className="stack" style={{ ["--flow" as string]: "0.5rem" }}>
                {others.map((o) => <li key={o.slug}><SmartLink href={`/neighborhood/${o.slug}/`}>{o.title}</SmartLink></li>)}
              </ul>
            </nav>
          </div>
        </div>

        {projects.length > 0 && (
          <section aria-labelledby="projects" style={{ marginTop: "var(--s8)" }}>
            <h2 id="projects" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>Projects and updates in this area</h2>
            <LatestList items={projects} />
          </section>
        )}
        <section aria-labelledby="topics" style={{ marginTop: "var(--s8)" }}>
          <h2 id="topics" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>Related topics</h2>
          <div className="grid grid--3">{topics.map((t) => <TopicCard key={t.slug} topic={t} />)}</div>
        </section>
        {photo && (
          <p className="small muted" style={{ marginTop: "var(--s7)" }}>Header photo: {photo.source ? <SmartLink href={photo.source}>{photo.title}</SmartLink> : photo.title} by {photo.artist}, {photo.licenseUrl ? <SmartLink href={photo.licenseUrl}>{photo.license}</SmartLink> : photo.license}, via Wikimedia Commons (cropped).</p>
        )}
        <PageFoot meta={n.meta} title={n.title} />
      </div>
    </>
  );
}
