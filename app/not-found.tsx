import type { Metadata } from "next";
import { PageHeader } from "@/components/Layout";
import { SiteSearch } from "@/components/SiteSearch";
import { QuickService } from "@/components/Cards";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" lede="The page may have moved, or the address may be mistyped. Search the site or choose a starting point below." crumbs={[{ label: "Page not found" }]}>
        <div style={{ marginTop: "var(--s5)" }}><SiteSearch id="nf-search" variant="hero" /></div>
      </PageHeader>
      <div className="container section">
        <h2 className="visually-hidden">Starting points</h2>
        <ul className="quick" role="list">
          <QuickService href="/" label="Home" hint="Council District 4 home page" color="city" icon="home" />
          <QuickService href="/city-services/" label="City Services" hint="Find a service or make a request" color="teal" icon="phone" />
          <QuickService href="/topics-resources/" label="Topics & Resources" hint="Guides to City programs" color="slate" icon="document" />
          <QuickService href="/neighborhoods/" label="Neighborhoods" hint="Local contacts and resources" color="green" icon="map" />
          <QuickService href="/need-help/" label="Contact & get help" hint="Reach the district office" color="city" icon="mail" />
          <QuickService href={site.myla311.web} label="MyLA311" hint="Report a City issue" color="teal" icon="external" />
        </ul>
      </div>
    </>
  );
}
