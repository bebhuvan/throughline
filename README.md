# Throughline

Visual stories that trace the consequences of the developments that matter most.

Throughline publishes data-driven, editorially serious long-form stories. Each one connects a geopolitical, economic, or environmental development to its second and third-order consequences — the chain of effects that eventually reaches fuel bills, food prices, and daily life.

Every story is a single scrollable experience combining narrative text, interactive charts, maps, and illustrations.

## Stack

- **Astro 5** — static site generation with MDX content
- **React** — interactive visualization islands, hydrated on scroll via `client:visible`
- **D3.js** — chart math and scales (no d3-selection; React handles the DOM)
- **Observable Plot** — quick exploratory charts
- **MapLibre GL** — interactive maps with Stadia Alidade Smooth tiles
- **GSAP ScrollTrigger** — scrollytelling sections
- **Tailwind CSS v4** — styling via CSS-first configuration
- **Cloudflare Workers** — edge deployment with asset serving

## Typography

- **Display:** Fraunces (variable, SOFT + WONK axes for warmth)
- **Body:** Source Serif 4 (variable, weight 360)
- **UI/Labels:** Inter (variable)
- **Data:** JetBrains Mono (variable, tabular numerals)

## Getting started

```bash
npm install
npm run dev          # http://localhost:4321
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build static site
npm run preview      # Preview production build
npm run deploy       # Build + deploy to Cloudflare Workers
```

## Writing a story

Each story lives in `src/content/explainers/{slug}/` with:

```
index.mdx            # Article content (MDX)
data/*.json           # Chart-ready data files
images/               # Article-specific images
```

Frontmatter schema:

```yaml
title: Article Title
subtitle: Optional subtitle
description: SEO description
author: Editorial
publishedAt: 2026-03-24
category: geopolitics  # geopolitics|economics|climate|technology|health|energy|trade|demographics
tags: [oil, iran, hormuz]
readingTime: 12
status: published      # draft|review|published
```

Stories support all components from `src/components/viz/` (charts, maps, illustrations) and `src/components/editorial/` (stat cards, callouts, pull quotes, timelines).

## Editorial pipeline

An LLM-assisted research and drafting pipeline is available for story development:

```bash
npm run editorial research "topic"
npm run editorial outline --from research-output.json
npm run editorial draft --slug article-slug --from outline.json
npm run editorial viz-spec --slug article-slug
npm run editorial review --slug article-slug
```

Requires `ANTHROPIC_API_KEY` in `.env`.

## License

Content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). You are free to share and adapt the content with attribution.

Code is MIT licensed.
