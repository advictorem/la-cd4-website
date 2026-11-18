import { notFound } from "next/navigation";
import { content } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, Report311 } from "@/components/Layout";
import { PlaceList, LatestList, TopicCard } from "@/components/Cards";
import { SmartLink } from "@/components/SmartLink";
import { neighborhoodPhotos, resourcePhotos } from "@/content/images";

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
        {/* The right column stays in view while the left column scrolls, and releases at Related topics. */}
        <div className="split split--sticky">
          <div>
            <section aria-labelledby="local">
              <h2 id="local" style={{ fontSize: "var(--step-3)", marginBottom: "var(--s5)" }}>Local Resources</h2>
              <div className="dir">
                <PlaceList heading="Neighborhood Councils & Community Groups" image={resourcePhotos.councils.src} places={n.councils} />
                <PlaceList heading="Libraries, Markets & Post Offices" image={resourcePhotos.civic.src} places={n.civic} />
                <PlaceList heading="Police & Fire Stations" image={resourcePhotos.safety.src} places={n.safety} />
                <PlaceList heading="Parks & Recreation" image={resourcePhotos.parks.src} places={n.recreation} />
              </div>
              <p className="small muted" style={{ marginTop: "var(--s5)" }}>Listings are carried over from the current CD4 website and are being re-confirmed. For emergencies call 911; do not rely on station phone numbers.</p>
            </section>
            {projects.length > 0 && (
              <section aria-labelledby="projects" style={{ marginTop: "var(--s8)" }}>
                <h2 id="projects" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>Projects and Updates in This Area</h2>
                <LatestList items={projects} />
              </section>
            )}
          </div>
          <div className="sticky-col">
            <Report311 />
            <nav className="panel" aria-label="Other neighborhoods" style={{ marginTop: "var(--s5)" }}>
              <h2>Other Neighborhoods</h2>
              <ul role="list" className="stack" style={{ ["--flow" as string]: "0.5rem" }}>
                {others.map((o) => <li key={o.slug}><SmartLink href={`/neighborhood/${o.slug}/`}>{o.title}</SmartLink></li>)}
              </ul>
            </nav>
          </div>
        </div>

        <section aria-labelledby="topics" style={{ marginTop: "var(--s8)" }}>
          <h2 id="topics" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>Related Topics</h2>
          <div className="grid grid--3">{topics.map((t) => <TopicCard key={t.slug} topic={t} filled />)}</div>
        </section>
        <PageFoot title={n.title} shareOnly />
      </div>
    </>
  );
}
