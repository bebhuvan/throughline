/**
 * Pipeline Bypass — clean bar chart comparison.
 * Shows the three bypass pipelines vs. total strait flow.
 * Stronger visual emphasis on the gap.
 */

import { Chart } from './Chart';

export function PipelineBypassIllustration() {
  return (
    <Chart
      title="The three pipelines that bypass Hormuz — and the gap they can't fill"
      subtitle="Usable bypass capacity vs. normal strait flow, million barrels per day"
      source="Bloomberg, IEA, Kpler, Goldman Sachs GIR, EIA"
      aspectRatio={0.45}
    >
      {({ width }) => {
        const h = Math.min(width * 0.45, 380);
        const barX = 130;
        const maxBarW = 640;
        const maxVal = 20.9;
        const scale = maxBarW / maxVal;
        const barH = 40;
        const gap = 20;

        return (
          <svg viewBox="0 0 960 380" width={width} height={h} className="select-none">
            {/* Total strait flow — full width reference bar */}
            <g transform="translate(0, 40)">
              <text x={barX - 10} y={barH / 2 + 5} textAnchor="end" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600" fill="var(--color-ink)" opacity={0.7}>Strait flow</text>
              <rect x={barX} y="0" width={maxVal * scale} height={barH} rx="5" fill="var(--color-ink)" opacity={0.12} stroke="var(--color-ink)" strokeWidth="1.5" strokeOpacity={0.18} />
              <text x={barX + maxVal * scale + 12} y={barH / 2 + 5} fontSize="16" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--color-ink)" opacity={0.7}>20.9M b/d</text>
            </g>

            {/* Saudi East-West */}
            <g transform={`translate(0, ${40 + barH + gap * 2})`}>
              <text x={barX - 10} y={barH / 2 + 5} textAnchor="end" fontSize="13" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">Saudi E-W</text>
              <rect x={barX} y="0" width={5 * scale} height={barH} rx="5" fill="var(--color-viz-blue)" opacity={0.35} stroke="var(--color-viz-blue)" strokeWidth="1.5" strokeOpacity={0.45} />
              <text x={barX + 5 * scale + 12} y={barH / 2 + 1} fontSize="14" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--color-viz-blue)">3-5M b/d spare</text>
              <text x={barX + 5 * scale + 12} y={barH / 2 + 17} fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">Abqaiq to Yanbu (Red Sea)</text>
            </g>

            {/* UAE ADCOP */}
            <g transform={`translate(0, ${40 + barH * 2 + gap * 3})`}>
              <text x={barX - 10} y={barH / 2 + 5} textAnchor="end" fontSize="13" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">UAE ADCOP</text>
              <rect x={barX} y="0" width={Math.max(0.4 * scale, 16)} height={barH} rx="5" fill="var(--color-viz-amber)" opacity={0.35} stroke="var(--color-viz-amber)" strokeWidth="1.5" strokeOpacity={0.45} />
              <text x={barX + 0.4 * scale + 22} y={barH / 2 + 1} fontSize="14" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--color-viz-amber)">0.4M b/d spare</text>
              <text x={barX + 0.4 * scale + 22} y={barH / 2 + 17} fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">Habshan to Fujairah</text>
            </g>

            {/* Iran Goreh-Jask */}
            <g transform={`translate(0, ${40 + barH * 3 + gap * 4})`}>
              <text x={barX - 10} y={barH / 2 + 5} textAnchor="end" fontSize="13" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">Iran G-J</text>
              <rect x={barX} y="0" width={Math.max(0.3 * scale, 14)} height={barH} rx="5" fill="var(--color-viz-slate)" opacity={0.3} stroke="var(--color-viz-slate)" strokeWidth="1.5" strokeOpacity={0.4} />
              <text x={barX + 0.3 * scale + 22} y={barH / 2 + 1} fontSize="14" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--color-viz-slate)">0.3M b/d</text>
              <text x={barX + 0.3 * scale + 22} y={barH / 2 + 17} fontSize="11" fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">Goreh to Jask (new, small)</text>
            </g>

            {/* THE GAP — prominent callout */}
            <g transform={`translate(0, ${40 + barH * 4 + gap * 6})`}>
              <rect x={barX - 12} y="-10" width={maxBarW + 120} height={56} rx="8" fill="var(--color-accent)" opacity={0.06} stroke="var(--color-accent)" strokeWidth="1.5" strokeOpacity={0.2} />
              <text x={barX} y="12" fontSize="14" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">Total bypass:</text>
              <text x={barX + 125} y="12" fontSize="16" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--color-viz-blue)">~5M b/d</text>
              <text x={barX + 250} y="12" fontSize="14" fontFamily="var(--font-sans)" fontWeight="500" fill="var(--color-ink-secondary)">The gap:</text>
              <text x={barX + 340} y="12" fontSize="18" fontFamily="var(--font-mono)" fontWeight="800" fill="var(--color-accent)">~16M b/d — no backup</text>
              <text x={barX} y="36" fontSize="12" fontFamily="var(--font-sans)" fill="var(--color-ink-faint)">OPEC has 4.4M b/d spare capacity, but 75% of it sits behind the closed strait</text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
