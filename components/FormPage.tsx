import type { ReactNode } from "react";
import { content } from "@/lib/content-adapter";
import { site } from "@/content/site";
import { PageHeader, PageFoot, Notice } from "./Layout";
import { AccessibleEmbed } from "./AccessibleEmbed";
import { ResourceLinkList } from "./Cards";
import { SmartLink, ButtonLink } from "./SmartLink";

const providerName = (platform: string) => platform.split(" (")[0];

/**
 * Template for pages that hand off to an existing official form.
 * The form is never rebuilt here: it is framed from, or linked to, its current platform.
 */
export function FormPage({ slug, heading, crumbLabel, before, aside }: { slug: string; heading?: string; crumbLabel?: string; before?: ReactNode; aside?: ReactNode }) {
  const f = content.form(slug)!;
  const title = heading ?? f.title;
  const state = f.availability?.state;
  return (
    <>
      <PageHeader title={title} lede={f.summary} crumbs={[{ label: "Contact", href: slug === "need-help" ? undefined : "/need-help/" }, ...(slug === "need-help" ? [] : [{ label: crumbLabel ?? f.title }])]} />
      <div className="container section">
        <div className="split">
          <div>
            {f.availability && (
              <div style={{ marginBottom: "var(--s6)" }}>
                <Notice tone={state === "on-hold" ? "amber" : "city"} icon={state === "on-hold" ? "clock" : "info"} title={state === "on-hold" ? "Applications are not open" : state === "moved" ? "Requests now go through MyLA311" : "Open"}>
                  <p>{f.availability.note}</p>
                </Notice>
              </div>
            )}
            {before}
            <div className="prose">{f.body.map((p, i) => <p key={i}>{p}</p>)}</div>

            {f.embed === "iframe" && f.formUrl && (
              <section style={{ marginTop: "var(--s6)" }} aria-label={`${f.title} form`}>
                <AccessibleEmbed title={`${f.title} form`} src={f.formUrl} fallbackUrl={f.formUrl} provider={providerName(f.platform)}
                  privacyNote={`This is the district’s existing official form, hosted by ${providerName(f.platform)}. What you enter is sent to that service and the district office, not stored by this website.${site.isProduction ? "" : " This is a staging preview: the form below is live, so please do not submit test entries."}`} />
              </section>
            )}
            {f.embed === "link-only" && f.formUrl && state !== "on-hold" && (
              <div className="btn-row" style={{ marginTop: "var(--s6)" }}>
                <ButtonLink href={f.formUrl}>{slug === "scheduling-requests" ? "Open the scheduling form" : "Open MyLA311"}</ButtonLink>
                {slug === "transit-traffic-safety-requests" && <a className="btn btn--secondary" href="tel:311">Dial 311</a>}
              </div>
            )}
            {f.embed === "link-only" && f.formUrl && slug === "scheduling-requests" && (
              <p className="small muted" style={{ marginTop: "var(--s3)" }}>The form is hosted by Google Forms and opens on docs.google.com. This website does not collect or store what you enter.</p>
            )}
            {f.alternatives && (
              <section style={{ marginTop: "var(--s7)" }}>
                <h2 style={{ fontSize: "var(--step-2)", marginBottom: "var(--s4)" }}>Other transportation contacts</h2>
                <ResourceLinkList links={f.alternatives} color="teal" />
              </section>
            )}
          </div>
          <div>
            {aside}
            <nav className="panel" aria-label="Other ways to reach the district office">
              <h2>More contact options</h2>
              <ul role="list" className="stack" style={{ ["--flow" as string]: "0.5rem" }}>
                {content.forms().filter((o) => o.slug !== slug).map((o) => <li key={o.slug}><SmartLink href={`/${o.slug}/`}>{o.title}</SmartLink></li>)}
                <li><SmartLink href={site.myla311.web}>MyLA311 service requests</SmartLink></li>
              </ul>
            </nav>
          </div>
        </div>
        <PageFoot meta={f.meta} title={title} />
      </div>
    </>
  );
}
