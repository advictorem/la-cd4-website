import type { ReactNode } from "react";
import Image from "next/image";
import { neighborhoodPhotos } from "@/content/images";
import type { Topic, Neighborhood, HotTopic, ResourceLink, ColorFamily, IconName, Place } from "@/content/types";
import { formatDate } from "@/lib/content-adapter";
import { Icon } from "./Icon";
import { SmartLink, isExternal } from "./SmartLink";

export function TopicCard({ topic, level = "h3" }: { topic: Topic; level?: "h2" | "h3" }) {
  const H = level;
  return (
    <article className="card card--topic" data-color={topic.color}>
      <div className="card__head">
        <span className="card__icon"><Icon name={topic.icon} size={22} /></span>
        <H style={{ fontSize: "var(--step-1)", fontFamily: "var(--font-sans)", fontWeight: 700, letterSpacing: 0, lineHeight: 1.3 }}>
          <SmartLink className="card__link" href={`/initiative/${topic.slug}/`}>{topic.title}</SmartLink>
        </H>
      </div>
      <p>{topic.summary}</p>
    </article>
  );
}

/** Photo tile: the whole tile is one link; the image zooms slightly on hover and focus. */
export function NeighborhoodCard({ n }: { n: Neighborhood }) {
  const photo = neighborhoodPhotos[n.slug];
  return (
    <article className="tile">
      {photo && <Image className="tile__img" src={photo.src} alt="" fill sizes="(min-width: 62rem) 33vw, (min-width: 40rem) 50vw, 100vw" />}
      <div className="tile__body">
        <h3><SmartLink className="tile__link" href={`/neighborhood/${n.slug}/`}>{n.title}</SmartLink></h3>
        <p>{n.blurb}</p>
      </div>
    </article>
  );
}

/** "Latest"-style list of community updates: rule, category, title, date. */
export function LatestList({ items }: { items: HotTopic[] }) {
  return (
    <ul className="latest" role="list">
      {items.map((h) => (
        <li key={h.slug} className="latest__item">
          <p className="latest__cat">{h.kicker}</p>
          <h3><SmartLink href={`/${h.slug}/`}>{h.title}</SmartLink></h3>
          <p className="latest__date"><span className="visually-hidden">Source information dated </span><time dateTime={h.sourceUpdated}>{formatDate(h.sourceUpdated, { year: "numeric", month: "short" })}</time></p>
        </li>
      ))}
    </ul>
  );
}

/** Cluster of topic buttons (no descriptions). Each keeps its icon so color is never the only cue. */
export function TopicPills({ topics }: { topics: Topic[] }) {
  return (
    <ul className="pills" role="list">
      {topics.map((t) => (
        <li key={t.slug}>
          <SmartLink className="pill" href={`/initiative/${t.slug}/`} data-color={t.color}>
            <Icon name={t.icon} size={18} />{t.title}
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

export function QuickService({ href, label, hint, color, icon }: { href: string; label: string; hint: string; color: ColorFamily; icon: IconName }) {
  return (
    <li>
      <SmartLink className="quick__item" href={href} data-color={color} showIcon={false}>
        <span className="quick__icon"><Icon name={icon} size={22} /></span>
        <span><span className="quick__label">{label}</span><span className="quick__hint">{hint}</span></span>
        <Icon name={isExternal(href) ? "external" : "arrow"} size={18} className="quick__arrow" />
      </SmartLink>
    </li>
  );
}

export function ResourceLinkList({ links, color }: { links: ResourceLink[]; color?: ColorFamily }) {
  return (
    <ul className="resources" role="list" data-color={color}>
      {links.map((l) => (
        <li key={l.href + l.label}>
          <SmartLink href={l.href} showIcon={false}>
            <span className="resources__label">{l.label}</span>
            {l.description && <span className="resources__desc">{l.description}</span>}
            {l.agency && <span className="resources__agency">{l.agency}</span>}
            <Icon name={isExternal(l.href) ? "external" : "arrow"} size={18} className="resources__icon" />
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

export function PlaceList({ heading, icon, places }: { heading: string; icon: IconName; places: Place[] }) {
  if (!places.length) return null;
  return (
    <section>
      <h3><Icon name={icon} size={20} />{heading}</h3>
      <ul className="places" role="list">
        {places.map((p) => (
          <li key={p.name}>
            <span className="places__name">{p.href ? <SmartLink href={p.href}>{p.name}</SmartLink> : p.name}</span>
            {p.address && <span className="places__detail">{p.address}</span>}
            {p.phone && <span className="places__detail"><a href={`tel:+1${p.phone.replace(/\D/g, "")}`}>{p.phone}</a></span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SectionHead({ title, intro, action, id }: { title: string; intro?: string; action?: ReactNode; id?: string }) {
  return (
    <div className="section-head">
      <div>
        <h2 id={id}>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {action}
    </div>
  );
}
