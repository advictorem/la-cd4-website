import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Staging and previews: block everything. Production (only with City authorization): allow and publish the sitemap.
  if (!site.isProduction) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/search/"] }], sitemap: `${site.url}/sitemap.xml` };
}
