import type { Metadata } from "next";
import { site } from "@/content/site";

/** Per-page metadata. Canonical points at the future production path; staging stays noindex. */
export function pageMeta({ title, description, route }: { title: string; description: string; route: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: route },
    openGraph: { title: `${title} | ${site.name}`, description, url: route, siteName: `${site.name}, ${site.owner}`, type: "website", locale: "en_US" },
  };
}
