# SEO automation

Two layers keep the sites optimized without manual work.

## 1. On-page SEO (this codebase)

The site this repo deploys is optimized automatically. Everything is derived
from one config — [`lib/seo/site.ts`](../lib/seo/site.ts):

- **`app/sitemap.ts`** / **`app/robots.ts`** — generated from the `ROUTES`
  registry. Add a public page to `ROUTES` and it's in the sitemap.
- **`app/manifest.ts`**, **`app/icon.tsx`**, **`app/opengraph-image.tsx`** —
  PWA manifest, favicon, and a 1200×630 Open Graph / Twitter card image, all
  generated at build time (no binary assets to maintain).
- **`pageMetadata()`** — one call per page emits the title, meta description,
  **canonical URL**, Open Graph, Twitter card, and robots directives.
- **JSON-LD** `Organization` + `WebSite` structured data is injected site-wide
  in `app/layout.tsx`.

### One codebase, any domain

The canonical host, sitemap, `robots.txt`, and Open Graph URLs all follow the
`NEXT_PUBLIC_SITE_URL` environment variable (default
`https://galacticstudio.app`). Set it per Vercel project so the same code serves
the right SEO for `tazbrownstrategies.com`, `notheater.app`, etc.:

```
NEXT_PUBLIC_SITE_URL=https://tazbrownstrategies.com
```

## 2. Off-page SEO monitoring (all live sites)

[`audit.mjs`](./audit.mjs) crawls the pages in
[`sites.config.json`](./sites.config.json) and scores each one (0–100) against
an on-page SEO checklist: title, meta description, canonical, indexability,
Open Graph, Twitter card, JSON-LD, a single `<h1>`, image `alt` coverage,
content depth, plus site-level `robots.txt` and `sitemap.xml`.

It's **dependency-free** (pure Node — no install) so it runs anywhere.

```bash
npm run seo:audit            # write a report; never fails the run
node seo/audit.mjs --strict  # exit non-zero if any page is below the threshold
```

Reports land in `seo/reports/` (`seo-report-<date>.md` + `latest.json`).

### Scheduled automation

[`.github/workflows/seo-audit.yml`](../.github/workflows/seo-audit.yml) runs the
audit **every Monday**, on demand (`workflow_dispatch`, with an optional strict
gate), and whenever the config or auditor changes. It uploads the report as an
artifact and commits it back to `seo/reports/`, so the latest SEO health is
always in the repo. GitHub's runners have the outbound network access the dev
sandbox blocks, so that's where the live crawl happens.

### Editing the target list

Edit [`sites.config.json`](./sites.config.json):

```json
{
  "thresholds": { "minScore": 70 },
  "sites": [
    { "name": "Taz Brown Strategies", "baseUrl": "https://tazbrownstrategies.com", "pages": ["/", "/method", "/pricing", "/training"] }
  ]
}
```

> **Note:** `flowproof.strategies.com` is listed exactly as provided. It didn't
> resolve during setup — if it's meant to be `flowproofstrategies.com` (or a
> different host), fix `baseUrl` here and the audit will pick it up.
