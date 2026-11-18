import Image from "next/image";
import { content } from "@/lib/content-adapter";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot, ContactActions } from "@/components/Layout";
import { NeighborhoodCard } from "@/components/Cards";
import { AccessibleEmbed } from "@/components/AccessibleEmbed";
import { SmartLink } from "@/components/SmartLink";
import { PopupLink } from "@/components/PopupLink";

export const metadata = pageMeta({ title: "About Council District 4", description: "The geography of Council District 4 and how the district office serves residents.", route: "/district-4/" });
const meta = { route: "/district-4/", sourceUrl: "https://cd4.lacity.gov/district-4/", verifiedAt: "2026-11-17", contentOwner: "Council District 4 office", status: "pending-review" as const };

export default function DistrictPage() {
  return (
    <>
      <PageHeader title="About Council District 4" lede="One of fifteen Los Angeles City Council districts, reaching from the San Fernando Valley across the Santa Monica Mountains to central Los Angeles." crumbs={[{ label: "About CD4" }]} />
      <div className="container section">
        <div className="split">
          <div>
            <div className="prose">
              <h2 style={{ marginTop: 0 }}>Geography</h2>
              <p>Council District 4 includes Encino, Sherman Oaks, and Studio City, the Hollywood Hills, Los Feliz, and parts of Reseda, Van Nuys, and Silver Lake. It is the only Council district that spans both sides of the Santa Monica Mountains, connecting Valley and hillside communities.</p>
              <p>The district is home to the Hollywood Bowl, the Ford Theatre, Griffith Observatory, the Hollywood Sign, and the business districts along Ventura Boulevard and Hillhurst Avenue.</p>
              <h2>District boundaries</h2>
              <p>The City redraws Council district boundaries once every ten years. The current map was adopted by the City Council in December 2021 and took effect on January 1, 2022.</p>
            </div>
            <figure style={{ margin: "var(--s6) 0 0" }}>
              <Image src="/brand/cd4-map.svg" alt="Outline map of Council District 4, running from Reseda and Encino in the west to Los Feliz and Silver Lake in the east." width={640} height={343} unoptimized />
              <figcaption className="small muted" style={{ marginTop: "var(--s2)" }}>Illustrative outline from the current CD4 website. Use the interactive map or address lookup for exact boundaries.</figcaption>
            </figure>
            <section id="map" style={{ marginTop: "var(--s7)", scrollMarginTop: "1rem" }} aria-labelledby="map-h">
              <h2 id="map-h" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s4)" }}>Interactive district map</h2>
              <AccessibleEmbed title="Council District 4 map" src={site.districtMap.embedUrl} fallbackUrl={site.districtMap.viewerUrl} provider="Google Maps" height={480}
                loadLabel="Load the map on this page" privacyNote="The map is hosted by Google My Maps. Loading it sends a request to Google. To confirm which district an address is in, use the City’s address lookup." />
              <div className="btn-row" style={{ marginTop: "var(--s4)" }}><PopupLink className="btn btn--secondary" href={site.districtMap.lookupUrl}>Check my address</PopupLink></div>
            </section>
            <section id="how-the-office-helps" className="prose" style={{ marginTop: "var(--s7)", scrollMarginTop: "1rem" }}>
              <h2 style={{ marginTop: 0 }}>How the district office helps</h2>
              <p>Each Council district has an office that helps residents and businesses work with City departments. The District 4 office can:</p>
              <ul>
                <li>Help you find the City department responsible for an issue</li>
                <li>Follow up on a MyLA311 service request that has not been completed</li>
                <li>Share information about City programs, projects, and public meetings in the district</li>
              </ul>
              <p>City departments, not the district office, deliver most services. Start with <SmartLink href={site.myla311.web}>MyLA311</SmartLink> for service requests.</p>
              <h2>Representation and elections</h2>
              <p>Each Council district is represented by one member of the Los Angeles City Council. The Office of the City Clerk administers City elections and publishes official information about Council membership, meetings, and votes.</p>
              <p><SmartLink href="https://clerk.lacity.gov/">Office of the City Clerk</SmartLink></p>
            </section>
          </div>
          <div><ContactActions /></div>
        </div>
        <section aria-labelledby="hoods" style={{ marginTop: "var(--s8)" }}>
          <h2 id="hoods" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>Neighborhoods</h2>
          <div className="grid grid--3">{content.neighborhoods().map((n) => <NeighborhoodCard key={n.slug} n={n} />)}</div>
        </section>
        <PageFoot meta={meta} title="About Council District 4" />
      </div>
    </>
  );
}
