import { heroPhoto, neighborhoodPhotos } from "@/content/images";
import { content } from "@/lib/content-adapter";
import { pageMeta } from "@/lib/metadata";
import { PageHeader } from "@/components/Layout";
import { SmartLink } from "@/components/SmartLink";

export const metadata = pageMeta({ title: "Photo credits", description: "Sources and licenses for the photographs used on the Council District 4 website.", route: "/photo-credits/" });

export default function PhotoCredits() {
  return (
    <>
      <PageHeader title="Photo credits" lede="Sources and licenses for the photographs used on this site." crumbs={[{ label: "Photo credits" }]} />
      <div className="container section">
        <ul className="archive" role="list">
          <li><span className="muted">Home page</span><span><strong>{heroPhoto.title}</strong><br />{heroPhoto.artist}. {heroPhoto.license}.</span></li>
          {content.neighborhoods().map((n) => {
            const p = neighborhoodPhotos[n.slug];
            return p ? (
              <li key={n.slug}>
                <span className="muted">{n.title}</span>
                <span>
                  <strong>{p.source ? <SmartLink href={p.source}>{p.title}</SmartLink> : p.title}</strong><br />
                  {p.source
                    ? <>By {p.artist}, via Wikimedia Commons. Licensed {p.licenseUrl ? <SmartLink href={p.licenseUrl}>{p.license}</SmartLink> : p.license}. Cropped and resized.</>
                    : <>{p.artist}. {p.license}. Cropped and resized.</>}
                </span>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </>
  );
}
