import Image from "next/image";
import Link from "next/link";
import { content, splitEvents, todayLA } from "@/lib/content-adapter";
import { site } from "@/content/site";
import { primaryNav } from "@/content/navigation";
import { SiteSearch } from "@/components/SiteSearch";
import { ButtonLink, SmartLink } from "@/components/SmartLink";
import { Icon } from "@/components/Icon";
import { TopicCard, NeighborhoodCard, UpdateCard, QuickService, SectionHead } from "@/components/Cards";
import { EventList } from "@/components/Events";
import { EmptyState, RepresentationNotice } from "@/components/Layout";

export const revalidate = 3600; // re-evaluate "upcoming" hourly

export default function HomePage() {
  // Topic cards follow the navigation grouping so each row reads as one subject area.
  const order = primaryNav.find((s) => s.id === "topics")!.groups.flatMap((g) => g.links.map((l) => l.href.split("/")[2]));
  const topics = order.map((slug) => content.topic(slug)!).filter(Boolean);
  const { upcoming } = splitEvents(content.events(), todayLA());
  const updates = content.hotTopics();
  const c = site.contact;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div>
            <p className="eyebrow" style={{ color: "var(--muted)" }}>City of Los Angeles</p>
            <h1 id="hero-title">Council District 4</h1>
            <p className="lede">Find City services, neighborhood information, and resources for your community.</p>
            <SiteSearch id="hero-search" variant="hero" />
            <div className="btn-row">
              <ButtonLink href="/need-help/">Get Help</ButtonLink>
              <ButtonLink href={site.myla311.web} variant="secondary">Report a City Issue</ButtonLink>
            </div>
          </div>
          <figure className="hero__map">
            <Link href="/district-4/#map" aria-label="About the district and its map">
              <Image src="/brand/cd4-map.svg" alt="Outline map of Council District 4, which runs from Reseda and Encino in the San Fernando Valley east to Los Feliz and Silver Lake." width={560} height={300} unoptimized priority />
            </Link>
            <figcaption>The district spans the San Fernando Valley, the Hollywood Hills, and central Los Angeles. <SmartLink href={site.districtMap.lookupUrl}>Check your address</SmartLink></figcaption>
          </figure>
        </div>
      </section>

      <RepresentationNotice />

      <section className="section section--tight" aria-labelledby="quick-title">
        <div className="container">
          <h2 id="quick-title" className="visually-hidden">Quick services</h2>
          <ul className="quick" role="list">
            <QuickService href="/need-help/" label="Request assistance" hint="Ask the district office for help" color="city" icon="mail" />
            <QuickService href={site.myla311.web} label="MyLA311" hint="Report an issue or request a service" color="teal" icon="phone" />
            <QuickService href="/city-service/emergency-services/" label="Emergency information" hint="Alerts, preparedness, recovery" color="red" icon="alert" />
            <QuickService href="/initiative/renters-rights/" label="Housing & renter help" hint="Tenant protections and legal help" color="terracotta" icon="key" />
            <QuickService href="/transit-traffic-safety-requests/" label="Street & traffic requests" hint="Signs, signals, parking, repairs" color="teal" icon="bus" />
            <QuickService href="/city-service/for-businesses/" label="Business resources" hint="Permits, taxes, free advising" color="ochre" icon="store" />
          </ul>
        </div>
      </section>

      <section className="section section--wash" aria-labelledby="topics-title">
        <div className="container">
          <SectionHead id="topics-title" title="Topics & Resources" intro="Plain-language guides to City programs, with links to the agencies that run them."
            action={<SmartLink className="arrow-link" href="/topics-resources/">All topics <Icon name="arrow" size={16} /></SmartLink>} />
          <div className="grid grid--4 grid--topics">
            {topics.map((t) => <TopicCard key={t.slug} topic={t} />)}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="hoods-title">
        <div className="container">
          <SectionHead id="hoods-title" title="Explore Your Neighborhood" intro="Neighborhood Councils, libraries, parks, and public safety contacts for each part of the district."
            action={<SmartLink className="arrow-link" href="/neighborhoods/">All neighborhoods <Icon name="arrow" size={16} /></SmartLink>} />
          <div className="grid grid--3">
            {content.neighborhoods().map((n) => <NeighborhoodCard key={n.slug} n={n} />)}
          </div>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="updates-title">
        <div className="container">
          <SectionHead id="updates-title" title="Community Updates" intro="Background and official sources on projects and issues affecting the district."
            action={<SmartLink className="arrow-link" href="/news/">News & events <Icon name="arrow" size={16} /></SmartLink>} />
          <div className="updates">
            {updates.map((h, i) => <UpdateCard key={h.slug} h={h} feature={i < 2} />)}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="events-title">
        <div className="container">
          <SectionHead id="events-title" title="Events"
            action={<SmartLink className="arrow-link" href="/events/">Events calendar and past events <Icon name="arrow" size={16} /></SmartLink>} />
          {upcoming.length ? <EventList events={upcoming.slice(0, 4)} /> : (
            <EmptyState title="No upcoming events are listed"
              actions={<><ButtonLink href="/events/" variant="secondary">View past events</ButtonLink><ButtonLink href="/sign-up/" variant="quiet">Sign up for updates</ButtonLink></>}>
              <p>The district has not published any future events. New events appear here when they are announced.</p>
            </EmptyState>
          )}
        </div>
      </section>

      <section className="section section--wash section--tight" aria-labelledby="clerk-title">
        <div className="container">
          <div className="clerk">
            <a href="https://clerk.lacity.gov/"><Image src="/brand/city-clerk-logo.svg" alt="Office of the City Clerk" width={200} height={86} unoptimized loading="eager" /></a>
            <div>
              <h2 id="clerk-title">{site.cityClerk.heading}</h2>
              <p style={{ marginTop: "0.5rem", maxWidth: "62ch" }}>{site.cityClerk.body}</p>
              <ul role="list">
                {site.cityClerk.links.map((l) => <li key={l.href}><SmartLink href={l.href}>{l.label}</SmartLink></li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-band on-dark" aria-labelledby="contact-title">
        <div className="container">
          <div className="contact-cols">
            <div>
              <h2 id="contact-title">Contact & Stay Connected</h2>
              <p className="muted" style={{ marginTop: "0.75rem", maxWidth: "40ch" }}>Reach the district office, or subscribe to email updates about services, events, and your neighborhood.</p>
              <div className="btn-row" style={{ marginTop: "1.5rem" }}>
                <ButtonLink href="/need-help/">Contact the office</ButtonLink>
                <ButtonLink href="/sign-up/" variant="secondary">Sign up for updates</ButtonLink>
              </div>
            </div>
            <div>
              <h3>District office</h3>
              <ul role="list">
                <li><a href={c.phoneHref}>{c.phone}</a></li>
                <li><a href={`mailto:${c.email}`}>{c.email}</a></li>
                <li><SmartLink href="/scheduling-requests/">Scheduling requests</SmartLink></li>
                <li><SmartLink href="/grant-requests/">Grant requests</SmartLink></li>
              </ul>
            </div>
            <div>
              <h3>City services</h3>
              <ul role="list">
                <li><SmartLink href={site.myla311.web}>MyLA311 service requests</SmartLink></li>
                <li><a href="tel:311">Dial 311</a></li>
                <li><SmartLink href="https://lacity.gov/directory">City Directory</SmartLink></li>
                <li><SmartLink href="https://emergency.lacity.gov/alerts/notifyla">NotifyLA emergency alerts</SmartLink></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
