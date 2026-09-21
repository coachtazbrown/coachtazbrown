import type { Metadata } from "next";

/**
 * Central SEO configuration.
 *
 * Everything SEO-related (canonical URLs, sitemap host, robots, Open Graph,
 * JSON-LD) is derived from the values here, so a single deployment can serve
 * any domain just by setting NEXT_PUBLIC_SITE_URL. That is what makes the
 * on-page SEO "automated": add a page, call pageMetadata(), and it ships with
 * a correct canonical, Open Graph, Twitter card, and robots directives.
 */

const RAW_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://galacticstudio.app";

/** Canonical origin with any trailing slash stripped. */
export const SITE_URL = RAW_URL.replace(/\/+$/, "");

export const SITE = {
  name: "Galactic Studio by Taz",
  shortName: "Galactic Studio",
  url: SITE_URL,
  // Kept ≤160 chars so it works as a meta description / SERP snippet as-is.
  description:
    "Give one topic; get a faceless, fact-checked YouTube video and a 16:9 LinkedIn short — researched, RAG-grounded, captioned, and voiced. Plus coaching by Taz.",
  locale: "en_US",
  /** Twitter/X handle, used for the twitter:creator card. */
  twitter: "@coachtazbrown",
  author: "Taz Brown"
} as const;

/**
 * The route registry. The sitemap and the in-repo audit both read from this,
 * so a new public page is announced to search engines the moment it's added
 * here — no separate sitemap edit required.
 */
export type SiteRoute = {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

export const ROUTES: SiteRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/studio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/training", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/method", changeFrequency: "monthly", priority: 0.6 }
];

type PageMetaInput = {
  /** Plain page title — the layout template appends the brand suffix. */
  title?: string;
  /** Use when a page needs its own full title with no brand suffix. */
  titleAbsolute?: string;
  description?: string;
  /** Route path, e.g. "/studio". Drives the canonical URL. */
  path?: string;
  /** Keep the page out of the index (private/app pages). */
  noindex?: boolean;
  keywords?: string[];
};

/**
 * Build a complete, search-engine-ready Metadata object for a page.
 * One call produces canonical URL, Open Graph, Twitter card, and robots
 * directives — so every page is optimized by default.
 */
export function pageMetadata({
  title,
  titleAbsolute,
  description,
  path = "/",
  noindex,
  keywords
}: PageMetaInput = {}): Metadata {
  const canonical = path === "/" ? "/" : path.replace(/\/+$/, "");
  const desc = description ?? SITE.description;
  const ogTitle = titleAbsolute ?? title ?? SITE.name;

  // Only set `title` when this page actually provides one. Returning
  // `title: undefined` would override the layout's default title with nothing.
  const titleField: Metadata["title"] | undefined = titleAbsolute
    ? { absolute: titleAbsolute }
    : title ?? undefined;

  return {
    ...(titleField !== undefined ? { title: titleField } : {}),
    description: desc,
    keywords,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1
        },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: ogTitle,
      description: desc,
      url: canonical,
      locale: SITE.locale
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
      creator: SITE.twitter
    }
  };
}

/** Organization structured data — helps search engines build a brand entity. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    founder: { "@type": "Person", name: SITE.author },
    sameAs: ["https://www.youtube.com/@coachtazbrown", "https://www.linkedin.com/in/coachtazbrown"]
  };
}

/** WebSite structured data with a sitelinks search box hint. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en-US"
  };
}
