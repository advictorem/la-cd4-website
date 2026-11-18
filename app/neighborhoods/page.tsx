import Image from "next/image";
import { content } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot } from "@/components/Layout";
import { NeighborhoodCard } from "@/components/Cards";
import { AddressCheck } from "@/components/AddressCheck";

export const metadata = pageMeta({ title: "Neighborhoods", description: "Local resources for the six neighborhood areas of Council District 4.", route: "/neighborhoods/" });

export default function NeighborhoodsPage() {
  const all = content.neighborhoods();
  return (
    <>
      <PageHeader title="Neighborhoods" lede="Council District 4 reaches from the San Fernando Valley across the Santa Monica Mountains to central Los Angeles. Choose an area for local contacts and resources." crumbs={[{ label: "Neighborhoods" }]} />
      <div className="container section">
        <div className="grid grid--3">{all.map((n) => <NeighborhoodCard key={n.slug} n={n} level="h2" />)}</div>
        <section className="panel" style={{ marginTop: "var(--s7)", display: "grid", gap: "var(--s5) var(--s7)", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))", alignItems: "center" }} aria-labelledby="in-district">
          <Image src="/brand/cd4-map.svg" alt="Outline map of Council District 4." width={420} height={225} unoptimized />
          <div>
            <h2 id="in-district" style={{ fontFamily: "var(--font-serif)", fontSize: "var(--step-2)" }}>Not sure you live in District 4?</h2>
            <p style={{ marginTop: "var(--s3)" }}>Some neighborhoods, including Reseda, Van Nuys, and Silver Lake, are split between Council Districts. Look up your address to confirm.</p>
            <AddressCheck />
          </div>
        </section>
        <PageFoot title="Neighborhoods" />
      </div>
    </>
  );
}
