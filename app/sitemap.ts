import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { buildIndex } from "@/lib/search";

export default function sitemap(): MetadataRoute.Sitemap {
  // Same inventory as the search index, so the two cannot drift apart.
  return [...buildIndex().map((d) => d.url), "/need-help/", "/site-map/"]
    .filter((u, i, a) => a.indexOf(u) === i)
    .map((u) => ({ url: `${site.url}${u}`, lastModified: site.lastContentReview }));
}
