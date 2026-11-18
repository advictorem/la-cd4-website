import { content } from "@/lib/content-adapter";
import { primaryNav } from "@/content/navigation";
import { pageMeta } from "@/lib/metadata";
import { PageHeader } from "@/components/Layout";
import { SmartLink } from "@/components/SmartLink";

export const metadata = pageMeta({ title: "Site map", description: "Every page on the Council District 4 website.", route: "/site-map/" });

export default function SiteMapPage() {
  return (
    <>
      <PageHeader title="Site map" lede="Every page on this site, by section." crumbs={[{ label: "Site map" }]} />
      <div className="container section">
        <div className="grid grid--3">
          {primaryNav.map((s) => (
            <section key={s.id}>
              <h2 style={{ fontSize: "var(--step-2)" }}><SmartLink href={s.href}>{s.label}</SmartLink></h2>
              <ul role="list" className="stack" style={{ marginTop: "var(--s3)", ["--flow" as string]: "0.4rem" }}>
                {s.groups.flatMap((g) => g.links).filter((l) => !l.href.includes("#")).map((l) => <li key={l.href}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}
              </ul>
            </section>
          ))}
          <section>
            <h2 style={{ fontSize: "var(--step-2)" }}>Events</h2>
            <ul role="list" className="stack" style={{ marginTop: "var(--s3)", ["--flow" as string]: "0.4rem" }}>
              {content.events().map((e) => <li key={e.slug}><SmartLink href={`/event/${e.slug}/`}>{e.title}</SmartLink></li>)}
            </ul>
          </section>
          <section>
            <h2 style={{ fontSize: "var(--step-2)" }}>Utilities</h2>
            <ul role="list" className="stack" style={{ marginTop: "var(--s3)", ["--flow" as string]: "0.4rem" }}>
              <li><SmartLink href="/">Home</SmartLink></li>
              <li><SmartLink href="/search/">Search</SmartLink></li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
