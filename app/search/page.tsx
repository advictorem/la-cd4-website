import type { Metadata } from "next";
import { search, tokenize, buildIndex } from "@/lib/search";
import { PageHeader } from "@/components/Layout";
import { SiteSearch } from "@/components/SiteSearch";
import { SmartLink } from "@/components/SmartLink";
import { Fragment } from "react";

export const metadata: Metadata = { title: "Search", description: "Search the Council District 4 website.", robots: { index: false, follow: true }, alternates: { canonical: "/search/" } };

function highlight(text: string, terms: string[]) {
  if (!terms.length) return text;
  const stems = terms.map((t) => (t.length > 4 ? t.replace(/(ing|es|s)$/, "") : t)).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(?<![A-Za-z0-9])((?:${stems.join("|")})[A-Za-z0-9]*)`, "ig");
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>));
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").slice(0, 120).trim();
  const terms = tokenize(q);
  const hits = q ? search(q) : [];
  const total = buildIndex().length;

  return (
    <>
      <PageHeader title="Search" crumbs={[{ label: "Search" }]}>
        <div style={{ marginTop: "var(--s5)" }}><SiteSearch id="results-search" variant="hero" defaultValue={q} /></div>
      </PageHeader>
      <div className="container section">
        <p role="status" aria-live="polite" style={{ fontWeight: 700, fontSize: "var(--step-1)" }}>
          {!q ? `Search ${total} pages on this site.` : hits.length ? `${hits.length} result${hits.length === 1 ? "" : "s"} for “${q}”` : `No results for “${q}”`}
        </p>
        {q && hits.length === 0 && (
          <div className="empty" style={{ marginTop: "var(--s5)" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--step-1)", letterSpacing: 0 }}>Try a different search</h2>
            <ul style={{ marginTop: "var(--s3)", paddingLeft: "1.25rem" }}>
              <li>Check the spelling, or use fewer or more general words</li>
              <li>Search for the service you need, such as “bulky item” or “parking”</li>
              <li>Browse <SmartLink href="/city-services/">City Services</SmartLink>, <SmartLink href="/topics-resources/">Topics & Resources</SmartLink>, or <SmartLink href="/neighborhoods/">Neighborhoods</SmartLink></li>
            </ul>
            <p>For City services not covered on this site, search <SmartLink href="https://lacity.gov/">LACity.gov</SmartLink> or dial 311.</p>
          </div>
        )}
        {hits.length > 0 && (
          <ol className="results" role="list">
            {hits.map((h) => (
              <li key={h.url}>
                <p className="eyebrow" style={{ color: "var(--muted)" }}>{h.section}</p>
                <h2><SmartLink href={h.url}>{h.title}</SmartLink></h2>
                <p>{highlight(h.snippet, terms)}</p>
                <p className="results__url">{h.url}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
