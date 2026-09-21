import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/seo/site";

/** Auto-generated from the route registry in lib/seo/site.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority
  }));
}
