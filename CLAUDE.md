# Explainer

A world-class visual explainer website — publishing editorially serious, visually rich stories about important developments. The benchmark is NYT interactive stories, The Guardian visual explainers, and Visual Capitalist.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build static site
npm run preview      # Preview production build
npm run deploy       # Build + deploy to Cloudflare Pages

# Editorial pipeline (requires ANTHROPIC_API_KEY in .env)
npm run editorial research "topic"
npm run editorial outline --from research-output.json
npm run editorial draft --slug article-slug --from outline.json
npm run editorial viz-spec --slug article-slug
npm run editorial review --slug article-slug
npm run editorial data-prep --slug article-slug --source data.csv
```

## Architecture

- **Framework**: Astro 5 (static output) + MDX for articles
- **Viz islands**: React components hydrated via `client:visible`
- **Styling**: Tailwind CSS v4 (CSS-first, config in global.css `@theme`)
- **Charts**: D3.js (math) + React (DOM) — no d3-selection
- **Quick charts**: Observable Plot via PlotChart wrapper
- **Maps**: Mapbox GL JS (requires MAPBOX_TOKEN)
- **Scrollytelling**: GSAP ScrollTrigger
- **Editorial pipeline**: Commander CLI + @anthropic-ai/sdk
- **Deploy**: Cloudflare Pages

## File Structure

```
src/
  styles/global.css              # Design tokens, typography, layout, prose styles
  layouts/
    BaseLayout.astro             # HTML shell, fonts, meta
    ArticleLayout.astro          # Article chrome: hero, progress bar, footer
  pages/
    index.astro                  # Landing page
    explainers/[...slug].astro   # Dynamic article route
  content/
    config.ts                    # Collection schema
    explainers/{slug}/           # One directory per article
      index.mdx                  # Article content
      data/*.json                # Chart-ready data files
      images/                    # Article images
  components/
    viz/                         # React visualization islands
      Chart.tsx                  # Shared wrapper (responsive, titles, source)
      BarChart.tsx               # D3 bar chart
      LineChart.tsx              # D3 time series
      AreaChart.tsx              # D3 stacked area
      PlotChart.tsx              # Observable Plot wrapper
      MapView.tsx                # Mapbox GL wrapper
    editorial/                   # Pure Astro, zero JS
      StatCard.astro             # Big number + label
      StatRow.astro              # Grid of stat cards
      PullQuote.astro            # Styled pull quote
      Callout.astro              # Insight/warning/context box
      KeyInsight.astro           # Highlighted takeaway
      Timeline.astro             # Vertical timeline
      DataSource.astro           # Source attribution
    scrollytelling/
      ScrollySection.tsx         # Fixed visual + scrolling text steps
    layout/
      Breakout.astro             # 960px breakout from prose
      FullBleed.astro            # Edge-to-edge container
      TwoColumn.astro            # Side-by-side
scripts/editorial/               # LLM pipeline CLI
```

## Design System

### Typography
- **Body/headlines**: Source Serif 4 (variable, 200-900)
- **UI/data labels**: Inter (variable)
- **Code**: JetBrains Mono

### Layout Widths
- `--measure: 680px` — prose column
- `--measure-wide: 960px` — charts, breakouts
- `--measure-full: 1200px` — immersive sections

### Colors
- Editorial: `ink`, `ink-secondary`, `ink-tertiary`, `paper`, `paper-warm`, `paper-alt`, `rule`, `rule-light`, `accent`
- Data viz (colorblind-safe): `viz-blue`, `viz-red`, `viz-green`, `viz-amber`, `viz-violet`, `viz-cyan`, `viz-slate`

## Content Authoring

### MDX article frontmatter
```yaml
title: Article Title
subtitle: Optional subtitle
description: SEO description
author: Editorial
publishedAt: 2026-03-24
category: geopolitics  # geopolitics|economics|climate|technology|health|energy|trade|demographics
tags: [oil, iran, hormuz]
featured: true
readingTime: 12
status: published  # draft|review|published
```

### Using components in MDX
```mdx
import { BarChart } from '@/components/viz/BarChart';
import StatRow from '@/components/editorial/StatRow.astro';
import StatCard from '@/components/editorial/StatCard.astro';
import Callout from '@/components/editorial/Callout.astro';

<StatRow>
  <StatCard value="20%" label="of global oil" />
  <StatCard value="$85B" label="annual trade value" change="+12%" changeDirection="up" />
</StatRow>

<BarChart
  client:visible
  data={[{ label: "Saudi Arabia", value: 7.2 }, { label: "Iraq", value: 3.5 }]}
  title="Daily oil transit (million barrels)"
  source="EIA, 2025"
  horizontal
/>

<Callout type="insight" title="Second-order effect">
  When fertilizer feedstock costs rise, food prices follow within 3-6 months.
</Callout>
```

## Editorial Principles

1. **Second and third-order effects** — don't stop at the obvious
2. **Concrete, not abstract** — connect to fuel bills, food prices, real vulnerability
3. **Visuals earn their place** — every chart must drive home, clarify, or strengthen a point
4. **Text-visual rhythm** — the reader should feel carried through a story
5. **Clarity over cleverness** — beautifully written but never at the expense of understanding

## Editorial Quality Standards

These standards were codified after a deep audit of source material usage, storytelling quality, and writing patterns across the project. They apply to ALL explainers.

### Research Process
- Read every primary source PDF cover to cover before writing. Do NOT rely solely on the research brief.
- For each source, extract: (a) the single most surprising fact, (b) the best direct quote, (c) any data that could power a new visualization, (d) any insight that contradicts or complicates the simple narrative.
- The research brief is a starting point, not the ceiling. The article should contain facts that could ONLY come from having read the primary sources.
- Maintain a "kill list" of facts that are interesting but don't advance the story. Nothing should be missed from ignorance.

### Writing Quality — What to AVOID
These are detected AI writing patterns that must be actively prevented:

1. **"Not X, it is Y" inversion** — Use at most once per 3,000 words. This is AI's favorite rhetorical move and readers detect it.
   - BAD: "The Strait of Hormuz is not merely an oil chokepoint. It is a commodity superhighway."
   - GOOD: "People call it an oil chokepoint. That understates it badly."

2. **Symmetrical tricolons** — Three parallel phrases with identical structure.
   - BAD: "the food security, energy supply, and fiscal stability of dozens of nations"
   - GOOD: Vary the rhythm. Real writing is asymmetric.

3. **Meta-narration** — Do not announce insights; show them.
   - BAD: "This is the connection most people miss."
   - GOOD: Just make the connection and let the reader feel it.

4. **Cascade repetition** — Do not restate the same structural framework (oil→shipping→gas→fertilizer→food) more than once. State it powerfully once; subsequent sections add new layers.

5. **Summary conclusions** — Do not end by restating the introduction. End with a new fact, a scene, a person, or a forward-looking question.

6. **Category lists instead of scenes** — "subsistence farmers, urban poor, children" is a list of categories. Pick ONE and make it vivid with specific detail.

7. **Paired-sentence symmetry** — "The precedent is long. The threat is specific." Two sentences with identical rhythm feel generated. Vary sentence length and cadence.

8. **Policy-paper register** — "translates into a specific, measurable reduction in human welfare" belongs in a UN report. Write: "means people go hungry."

9. **"X, not Y" formulas** — "It is a gesture, not a solution" / "It is a stopgap, not a fix." One per article max. Replace with sentences that explain WHY.

10. **Repeating data across sections** — If you stated "43% of global urea" in section 2, do not restate it in section 5. Trust the reader's memory. Add new information instead.

11. **Movie-trailer voiceovers** — "This is the story of how X happened" is a trailer prompt, not journalism. Just tell the story.

12. **Filler summary sentences** — "A single corridor of water, and nearly everything it touches has become more expensive." If the preceding sentences already made the point, cut the summary. Trust the reader.

13. **Redundant setup before detail blocks** — "This is a country that has mined these waters..." followed immediately by a Factoid that contains the same history in detail. If a Factoid/Callout delivers the information, cut the preceding summary sentence.

14. **One-word aphorisms** — "Geography is destiny." These read as AI-generated punchlines. Integrate the insight into the preceding sentence instead: "...Europe and Asia import it — and right now, they are competing for what is left."

15. **Meta-narration in headings** — "The petrochemical shock nobody is talking about" announces the insight. Just say "The petrochemical shock" and let the content surprise the reader.

16. **"Painful irony" / "And there is..."** — "And there is a painful irony in the spare capacity numbers." This announces the irony rather than letting the reader feel it. Just state the fact and let the irony land on its own.

### Writing Quality — What to DO
- Write like a journalist who spent a month on the story, not like a briefing document
- Use named expert sources and direct quotes when available (e.g., "Sanam Vakil of Chatham House" not "analysts say")
- Be concrete before being abstract: "Qatar's Ras Laffan plant lost 2 of its 14 LNG trains — 17% of output, gone for 3-5 years" beats "LNG infrastructure suffered significant damage"
- Every section must advance the story. If it could be removed without the reader noticing, cut it.
- The story must answer: What happened? How bad? Who is affected? Why can't it be fixed? What happens next?
- Front-load human impact, return to it throughout, end with it

### Source Material Coverage (Hormuz-specific)
The following source documents exist in `/Hormuz/` and have been read cover to cover:

- **Goldman Sachs "Top of Mind" Issue 147 (report.pdf)**: Expert interviews (Vakil/Chatham House, Dennis Ross, VP Admiral Donegan), convoy analysis (max 20% flow restoration), GDP impact rules of thumb (10% oil = -0.1% GDP, +0.2pp inflation), GCC revenue losses ($700M/day, $15B+ total), war duration analysis, US political dynamics (no public support, midterms), three oil price scenarios ($71/$93/$110 Q4), production scarring (40% below normal 4yrs later), geopolitical risk index at all-time high, energy intensity declining
- **JP Morgan "Pandora's Bog" (pandoras-bog-amv.pdf)**: Petrochemical cascade (methanol +50%, propylene +78% EU, ethylene +63% JP, butadiene +118% KR), Gulf = 43% global urea/44% sulfur/27% ammonia, Qatar LNG damage (2/14 trains, 17% output, 3-5yr repair), desalination vulnerability (Kuwait 90%, Saudi 70%, Oman 86%), helium +100% (Qatar=34% global), oil sensitivity heat map by country, munitions depletion data, oil futures curves, historical price spike comparison, WTI at 40-year record, critical minerals consumed in first 96 hours
- **ABN AMRO Oil Market Monitor (ABN_AMRO...pdf, 25 March 2026)**: Most recent source. Brent touched $120, now ~$100. 16 mbpd crude halted. Global inventories 2.58B bbl. China reserves 1.3B bbl. IEA releasing 412M bbl. Market deficit 3-5 mbpd even after all measures. Brent forecast: Q2 $100, Q3 $85, Q4 $80
- **Ember energy security report**: "Asia's Ukraine moment" framing, 3/4 of world pop in net fossil importers, $1.7T import bill, every $10/bbl = $160B more, EV displacement 1.7M b/d (70% of Iran exports), solar grew 600 TWh in 2025, 2022 precedent (Europe outbid developing nations, Bangladesh/Pakistan/India LNG imports fell 13-17%)
- **ING report (16 March 2026)**: Three-scenario Brent forecasts (worst case $140), OPEC spare capacity trapped behind strait, US production response 6+ months, "demand destruction" as only LNG solution
- **Congressional Research Service R45281 (11 March 2026)**: Iran's capabilities (mines, missiles, fast boats), Iran mined <10 mines so far, CENTCOM destroyed 17+ Iranian ships, selective closure policy, US DFC $20B insurance program, Chababar port waiver for India until April 26
- **Centre for European Reform (20 March 2026)**: Russia biggest winner (higher revenue, fertilizer substitution, propaganda), Iran casualties (1,444 killed, 18,551 injured by March 17), Iraq production cut to 1.4M b/d, US war costs $11.3B in 6 days, Ukraine loses Patriot interceptors, Europe as loser
- **UNCTAD report (10 March 2026)**: 18-page slide deck with all key charts (transit collapse, commodity flows, oil/gas prices, freight costs, marine fuel, fertilizer types, fertilizer vulnerability by country, borrowing costs). All CSV data files extracted and stored in `Hormuz/data/`
- **EIA World Oil Transit Chokepoints**: Comprehensive chokepoint comparison data, Cape of Good Hope bypass flows, pipeline capacities, historical flow data

### Citation Standards
- Every specific data point must be attributable to a named source
- Use inline parenthetical citations: "(Goldman Sachs, March 2026)" or "(UNCTAD, based on Clarksons Research)"
- Direct quotes must name the speaker and their affiliation
- When multiple sources give different figures for the same metric, use the most recent or cross-reference
- Key data points that should always be cited: oil prices, transit numbers, GDP impacts, casualty figures, reserve levels, production figures
- Do NOT cite vague "analysts say" — always name the institution or person

### Visual Storytelling Standards
- Every chart must have a clear editorial point — not just "here is the data" but "here is what the data means"
- Historical context strengthens almost every chart. If data goes back decades, use the full range.
- Prefer charts that reveal mechanisms (gas leads fertilizer by N months) over charts that display current states
- When countries are affected differently, show the differentiation rather than aggregating
- Use the source PDFs' own charts as design inspiration
- Each chart should have at least one annotation that tells the reader what to notice

### Design Standards
- **No dark sections.** Warm paper palette only (paper, paper-warm, paper-alt, paper-cream, paper-rose).
- **Typography-first design.** Fraunces with SOFT axis (display), Source Serif 4 (body), Inter (UI), JetBrains Mono (data).
- **Push Fraunces variable axes.** Use `font-variation-settings: 'SOFT' 50, 'WONK' 0, 'opsz' 72` for display, `'SOFT' 30` for h2/h3. SOFT gives warmth and character; opsz optimises for size. This is what makes the typography feel distinctive, not generic.
- **Source Serif 4 for body text.** Weight 360, line-height 1.8. Source Serif has beautiful thick-thin stroke contrast. Newsreader was too characterless — never use it as primary body font.
- **Headlines command the page.** Fraunces at weight 500 for h2s, weight 250–300 for large display numbers. Always use accent rule above h2s (32px wide, 2.5px thick, 0.6 opacity).
- **Charts need presence.** Titles at 1.75rem minimum with Fraunces SOFT 30. Source line with top border separator. Editorial annotations on every chart.
- **SVG illustration opacity.** NEVER use opacity below 0.2 for visible elements. Bars: 0.25–0.4. Strokes: 0.3–0.5. Labels: 0.5–0.8. Faint/ghost elements feel unfinished, not elegant.
- **Maps use MapLibre GL** with Stadia Alidade Smooth tiles. Labels must be legible (minimum 0.625rem / 11px).
- **Spacious layout.** Generous whitespace. Section dividers at my-28. Tinted sections at 6.5rem padding. Prose measure at 640px. The page should feel unhurried.
- **Scrollytelling** for dramatic narrative moments (ScrollySection + GSAP ScrollTrigger).
- **No cliched illustrations.** If using SVG illustrations, they must be refined editorial silhouettes, not clip art.
- **Drop caps in Fraunces.** The drop cap on the opening paragraph uses Fraunces with SOFT 50 and opsz 72 — not the body serif. This creates a distinctive editorial moment.
- **Color temperature.** Slightly richer, warmer tones than pure grays. Ink at #111 not #0f0f0f. Accent at #b8232a. Data viz colors slightly deeper than standard.
