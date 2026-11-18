import Image from "next/image";
import { content } from "@/lib/content-adapter";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot } from "@/components/Layout";
import { NeighborhoodCard } from "@/components/Cards";
import { SmartLink, ButtonLink } from "@/components/SmartLink";

export const metadata = pageMeta({ title: "Neighborhoods", description: "Local resources for the six neighborhood areas of Council District 4.", route: "/neighborhoods/" });

export default function NeighborhoodsPage() {
  const all = content.neighborhoods();
  const regions = ["San Fernando Valley", "Hollywood Hills & Central LA"] as const;
  return (
    <>
      <PageHeader title="Neighborhoods" lede="Council District 4 reaches from the San Fernando Valley across the Santa Monica Mountains to central Los Angeles. Choose an area for local contacts and resources." crumbs={[{ label: "Neighborhoods" }]} />
      <div className="container section">
        {regions.map((r, i) => (
          <section key={r} style={{ marginTop: i ? "var(--s7)" : 0 }}>
            <h2 style={{ fontSize: "var(--step-2)", marginBottom: "var(--s5)" }}>{r}</h2>
            <div className="grid grid--2">{all.filter((n) => n.region === r).map((n) => <NeighborhoodCard key={n.slug} n={n} />)}</div>
          </section>
        ))}
        <section className="panel" style={{ marginTop: "var(--s7)", display: "grid", gap: "var(--s5) var(--s7)", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))", alignItems: "center" }} aria-labelledby="in-district">
          <Image src="/brand/cd4-map.svg" alt="Outline map of Council District 4." width={420} height={225} unoptimized />
          <div>
            <h2 id="in-district" style={{ fontFamily: "var(--font-serif)", fontSize: "var(--step-2)" }}>Not sure you live in District 4?</h2>
            <p style={{ marginTop: "var(--s3)" }}>Some neighborhoods, including Reseda, Van Nuys, and Silver Lake, are split between Council Districts. Look up your address to confirm.</p>
            <div className="btn-row" style={{ marginTop: "var(--s4)" }}>
              <ButtonLink href={site.districtMap.lookupUrl}>Find your Council District</ButtonLink>
              <ButtonLink href="/district-4/#map" variant="secondary">District map</ButtonLink>
            </div>
            <p className="small muted" style={{ marginTop: "var(--s3)" }}>Lookup provided by the City of Los Angeles at <SmartLink href={site.districtMap.lookupUrl}>neighborhoodinfo.lacity.org</SmartLink>.</p>
          </div>
        </section>
        <PageFoot title="Neighborhoods" />
      </div>
    </>
  );
}
