import Image from "next/image";
import { content } from "@/lib/content-adapter";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/metadata";
import { PageHeader, PageFoot } from "@/components/Layout";
import { SmartLink, ButtonLink } from "@/components/SmartLink";
import { Icon } from "@/components/Icon";
import { QuickService } from "@/components/Cards";

export const metadata = pageMeta({ title: "City Services", description: "Services for residents and businesses, emergency services, and MyLA311 service requests.", route: "/city-services/" });

export default function CityServices() {
  const cats = content.serviceCategories();
  return (
    <>
      <PageHeader title="City Services" lede="Find the right City service, make a request, or get help when a request stalls." crumbs={[{ label: "City Services" }]} />
      <div className="container section">
        <div className="grid grid--3">
          {cats.map((c) => (
            <article key={c.slug} className="card card--topic" data-color={c.color}>
              <div className="card__head">
                <span className="card__icon"><Icon name={c.icon} size={22} /></span>
                <h2 style={{ fontSize: "var(--step-2)" }}><SmartLink className="card__link" href={`/city-service/${c.slug}/`}>{c.title}</SmartLink></h2>
              </div>
              <p>{c.summary}</p>
              <span className="card__foot">{c.groups.reduce((n, g) => n + g.links.length, 0)} services and links <Icon name="arrow" size={16} /></span>
            </article>
          ))}
        </div>

        <section className="panel" style={{ marginTop: "var(--s7)", padding: "clamp(1.5rem, 4vw, 2.5rem)" }} aria-labelledby="myla311">
          <div className="mark311">
            <Image src="/brand/myla311-logo.png" alt="MyLA311" width={61} height={56} />
            <h2 id="myla311" style={{ fontFamily: "var(--font-serif)", fontSize: "var(--step-3)", margin: 0 }}>Service requests</h2>
          </div>
          <div className="split" style={{ marginTop: "var(--s5)" }}>
            <div className="prose">
              <p>MyLA311 is the City of Los Angeles service-request system. It takes requests on behalf of City departments and connects you with the right department when you need a specialist.</p>
              <p>Common requests include bulky-item pickup, graffiti removal, illegal dumping, pothole and streetlight repair, and transportation service requests.</p>
              <div className="btn-row">
                <ButtonLink href={site.myla311.web}>Open MyLA311</ButtonLink>
                <a className="btn btn--secondary" href="tel:311">Dial 311</a>
              </div>
            </div>
            <dl className="deflist">
              <div><dt>Phone</dt><dd><a href="tel:311">311</a> or <a href="tel:+12134733231">(213) 473-3231</a></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${site.myla311.email}`}>{site.myla311.email}</a></dd></div>
              <div><dt>Mobile app</dt><dd>Search “MyLA311” in the App Store or Google Play.</dd></div>
            </dl>
          </div>
        </section>

        <section style={{ marginTop: "var(--s7)" }} aria-labelledby="follow-up">
          <h2 id="follow-up">When a request needs follow-up</h2>
          <p className="lede" style={{ marginTop: "var(--s3)" }}>If a City service request has not been completed in a reasonable time, contact the district office with your service request number.</p>
          <ul className="quick" role="list" style={{ marginTop: "var(--s5)" }}>
            <QuickService href="/need-help/" label="Request assistance" hint="Ask the district office to follow up" color="city" icon="mail" />
            <QuickService href="/transit-traffic-safety-requests/" label="Street & traffic requests" hint="How transportation requests work" color="teal" icon="bus" />
            <QuickService href="/topics-resources/" label="Topics & Resources" hint="Guides to programs and agencies" color="slate" icon="document" />
          </ul>
        </section>
        <PageFoot title="City Services" />
      </div>
    </>
  );
}
