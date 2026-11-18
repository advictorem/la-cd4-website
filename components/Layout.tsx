import type { ReactNode } from "react";
import Image from "next/image";
import type { ColorFamily, IconName, ContentMeta } from "@/content/types";
import { site } from "@/content/site";
import { formatDate } from "@/lib/content-adapter";
import { Icon } from "./Icon";
import { SmartLink, ButtonLink } from "./SmartLink";
import { ShareControl } from "./ShareControl";

export interface Crumb { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><SmartLink href="/">Home</SmartLink></li>
        {items.map((c, i) => (
          <li key={i}>{c.href ? <SmartLink href={c.href}>{c.label}</SmartLink> : <span aria-current="page">{c.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, lede, crumbs, color, icon, eyebrow, image, children }: { title: string; lede?: string; crumbs: Crumb[]; color?: ColorFamily; icon?: IconName; eyebrow?: string; image?: string; children?: ReactNode }) {
  return (
    <div className={`page-header on-dark${color ? "" : " page-header--plain"}${image ? " page-header--photo" : ""}`} data-color={color}
      style={image ? { backgroundImage: `linear-gradient(90deg, rgb(4 24 74 / 0.88) 0%, rgb(4 24 74 / 0.7) 55%, rgb(4 24 74 / 0.35) 100%), url(${image})` } : undefined}>
      <div className="container page-header__inner">
        <Breadcrumbs items={crumbs} />
        <div className="page-header__title">
          {icon && <span className="page-header__icon"><Icon name={icon} size={28} /></span>}
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
            {lede && <p className="lede">{lede}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Alert / notice. tone picks a color family; an icon and a text heading always accompany the color. */
export function Notice({ title, tone = "city", icon = "info", children, role }: { title?: string; tone?: ColorFamily; icon?: IconName; children: ReactNode; role?: "status" | "alert" | "note" }) {
  return (
    <div className="notice" data-color={tone} role={role}>
      <Icon name={icon} size={22} />
      <div>
        {title && <p className="notice__title">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {children}
      {actions && <div className="btn-row">{actions}</div>}
    </div>
  );
}

/** Page footer strip: review date, source, share. */
/** shareOnly: no review line, share control centered (neighborhood pages). */
export function PageFoot({ meta, title, shareOnly }: { meta?: ContentMeta; title: string; shareOnly?: boolean }) {
  if (shareOnly) return <div className="page-foot page-foot--center"><ShareControl title={title} /></div>;
  return (
    <div className="page-foot">
      <p className="meta-line">
        {meta ? (
          <>
            <span>Last reviewed <time dateTime={meta.verifiedAt}>{formatDate(meta.verifiedAt)}</time></span>
            <span>Content owner: {meta.contentOwner}</span>
          </>
        ) : (
          <span>Last reviewed <time dateTime={site.lastContentReview}>{formatDate(site.lastContentReview)}</time></span>
        )}
      </p>
      <ShareControl title={title} />
    </div>
  );
}

/** Get Help / 311 actions used at the end of resource pages. */
export function ContactActions({ heading = "Need help with a City service?" }: { heading?: string }) {
  return (
    <aside className="panel panel--navy on-dark" aria-label="Get help">
      <h2>{heading}</h2>
      <p>Most requests start with MyLA311. If you are not sure which agency to contact, or a request has stalled, the district office can help.</p>
      <div className="btn-row" style={{ marginTop: "1rem" }}>
        <ButtonLink href={site.myla311.web}>Open MyLA311</ButtonLink>
      </div>
      <p style={{ marginTop: "1rem" }}><SmartLink href="/need-help/">Contact the district office</SmartLink></p>
      <p className="small" style={{ marginTop: "0.5rem", color: "#c9d1e6" }}>{site.myla311.phoneLabel}</p>
    </aside>
  );
}

/** MyLA311 call to action in the MyLA311 blue, with the official logo (neighborhood pages). */
export function Report311({ heading = "Report a problem in this area" }: { heading?: string }) {
  const c = site.contact;
  return (
    <aside className="report311" aria-label="Report a problem">
      <Image src="/brand/myla311-logo.png" alt="MyLA311" width={87} height={80} />
      <h2>{heading}</h2>
      <p>Request City services such as pothole repair, graffiti removal, and bulky-item pickup.</p>
      <SmartLink href={site.myla311.web} className="btn report311__btn">Open MyLA311</SmartLink>
      <p className="report311__or"><span>or</span> <SmartLink href="/need-help/">Contact the district office</SmartLink> directly at <a href={c.phoneHref}>{c.phone}</a></p>
    </aside>
  );
}

/** Optional factual notice. Renders nothing unless enabled in content/site.ts with verified City Clerk wording. */
export function RepresentationNotice() {
  const n = site.representationNotice;
  if (!n.enabled || !n.body || !n.href) return null;
  return (
    <div className="container" style={{ paddingBlock: "1rem" }}>
      <div className="rep-notice" role="note" aria-label={n.heading}>
        <Image src="/brand/city-clerk-logo.svg" alt="Office of the City Clerk" width={112} height={48} unoptimized />
        <div style={{ flex: "1 1 20rem" }}>
          <p><strong>{n.heading}.</strong> {n.body}</p>
          <p className="small muted">Source: {n.source}{n.verifiedAt ? `, verified ${formatDate(n.verifiedAt)}` : ""}</p>
        </div>
        <ButtonLink href={n.href} variant="secondary" small>{n.linkLabel}</ButtonLink>
      </div>
    </div>
  );
}

export function StagingBanner() {
  if (site.isProduction) return null;
  return (
    <div className="staging-banner" role="region" aria-label="Staging notice">
      <div className="container"><strong>Staging preview.</strong> This is a design review build, not the official Council District 4 website. For City services visit <a href={site.liveOrigin}>cd4.lacity.gov</a>.</div>
    </div>
  );
}
