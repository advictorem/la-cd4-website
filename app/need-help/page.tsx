import { site } from "@/content/site";
import { pageMeta } from "@/lib/metadata";
import { FormPage } from "@/components/FormPage";
import { QuickService } from "@/components/Cards";

export const metadata = pageMeta({ title: "Contact & get help", description: "Contact the Council District 4 office, request assistance with a City service, or find the right City service.", route: "/need-help/" });

export default function NeedHelp() {
  const c = site.contact;
  return (
    <FormPage slug="need-help" heading="Contact & get help"
      before={
        <section aria-labelledby="first" style={{ marginBottom: "var(--s6)" }}>
          <h2 id="first" style={{ fontSize: "var(--step-2)", marginBottom: "var(--s4)" }}>Start with the right service</h2>
          <ul className="quick" role="list">
            <QuickService href={site.myla311.web} label="Report a City issue" hint="MyLA311: potholes, graffiti, pickups" color="teal" icon="phone" />
            <QuickService href="/city-service/emergency-services/" label="Emergency information" hint="For emergencies call 911" color="red" icon="alert" />
          </ul>
          <h2 style={{ fontSize: "var(--step-2)", margin: "var(--s7) 0 var(--s3)" }}>Request assistance from the district office</h2>
        </section>
      }
      aside={
        <section className="panel panel--tint" aria-labelledby="office" style={{ marginBottom: "var(--s5)" }}>
          <h2 id="office">District office</h2>
          <dl className="deflist">
            <div><dt>Phone</dt><dd><a href={c.phoneHref}>{c.phone}</a></dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${c.email}`}>{c.email}</a></dd></div>
            {c.offices.map((o) => <div key={o.name}><dt>{o.name}</dt><dd><address>{o.lines.map((l) => <span key={l} style={{ display: "block" }}>{l}</span>)}</address></dd></div>)}
            <div><dt>Press inquiries</dt><dd><a href={`mailto:${c.pressEmail}`}>{c.pressEmail}</a></dd></div>
          </dl>
          <p className="small muted" style={{ marginTop: "var(--s4)" }}>Details as published on cd4.lacity.gov; to be re-confirmed before launch.</p>
        </section>
      }
    />
  );
}
