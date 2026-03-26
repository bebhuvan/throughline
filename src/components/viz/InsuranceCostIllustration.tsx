/**
 * Insurance Cost Stack — What it costs to cross the strait
 * Vertical stacked bars: Before vs After, proportional to actual costs.
 * The "After" column should visually tower over "Before."
 */

import { Chart } from './Chart';

const BEFORE = [
  { label: 'Charter', value: '$80K/day', amount: 80, color: 'var(--color-viz-blue)' },
  { label: 'Fuel', value: '$87K', amount: 87, color: 'var(--color-viz-amber)' },
  { label: 'Insurance', value: '$250K', amount: 250, color: 'var(--color-viz-slate)' },
];

const AFTER = [
  { label: 'Charter', value: '$486K/day', amount: 486, color: 'var(--color-viz-red)', multiplier: '6×' },
  { label: 'Fuel', value: '$175K', amount: 175, color: 'var(--color-viz-amber)', multiplier: '2×' },
  { label: 'Insurance', value: '$1,000K+', amount: 1000, color: 'var(--color-accent)', multiplier: '4×' },
  { label: 'Crew hazard', value: '$120K+', amount: 120, color: 'var(--color-viz-violet)', multiplier: 'new' },
];

function StackedBar({ x, barWidth, items, baseline, scale, side, labelSide }: {
  x: number; barWidth: number; items: typeof AFTER; baseline: number; scale: number; side: 'before' | 'after'; labelSide: 'left' | 'right';
}) {
  let y = baseline;
  const isAfter = side === 'after';

  // Pre-compute all segment positions
  const segments = items.map((item) => {
    const h = Math.max(item.amount * scale, 20);
    y -= h;
    return { ...item, y, h };
  });

  return (
    <g>
      {segments.map((item, i) => {
        const textFits = item.h > 36;
        const labelX = labelSide === 'right' ? x + barWidth + 12 : x - 12;
        const anchor = labelSide === 'right' ? 'start' : 'end';

        return (
          <g key={i}>
            <rect
              x={x} y={item.y} width={barWidth} height={item.h} rx="3"
              fill={item.color} opacity={isAfter ? 0.35 : 0.22}
              stroke={item.color} strokeWidth="1.5" strokeOpacity={isAfter ? 0.5 : 0.35}
            />
            {textFits ? (
              <>
                <text
                  x={x + barWidth / 2} y={item.y + item.h / 2 - 5}
                  textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)"
                  fontWeight="500" fill={item.color} opacity={0.85}
                >
                  {item.label}{(item as any).multiplier ? ` (${(item as any).multiplier})` : ''}
                </text>
                <text
                  x={x + barWidth / 2} y={item.y + item.h / 2 + 13}
                  textAnchor="middle" fontSize="14" fontFamily="var(--font-mono)"
                  fontWeight="700" fill={item.color}
                >
                  {item.value}
                </text>
              </>
            ) : (
              <>
                {/* Connector tick */}
                <line
                  x1={labelSide === 'right' ? x + barWidth : x}
                  y1={item.y + item.h / 2}
                  x2={labelX - (labelSide === 'right' ? 4 : -4)}
                  y2={item.y + item.h / 2}
                  stroke={item.color} strokeWidth="1" opacity={0.3}
                />
                <text
                  x={labelX} y={item.y + item.h / 2 - 1}
                  textAnchor={anchor} fontSize="11" fontFamily="var(--font-sans)"
                  fontWeight="600" fill={item.color} opacity={0.85}
                >
                  {item.label} — {item.value}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

export function InsuranceCostIllustration() {
  return (
    <Chart
      title="What it costs to cross — before and after"
      subtitle="Total cost of a single VLCC tanker voyage through the Strait of Hormuz"
      source="Clarksons, Lloyd's List, Marine Insight, UNCTAD"
      aspectRatio={0.52}
    >
      {({ width }) => {
        const vw = 960;
        const vh = 500;
        const h = Math.min(width * 0.52, vh);
        const baseline = 430;
        const barWidth = 200;
        const beforeX = 120;
        const afterX = 560;

        // Scale: max stack height should be about 320px for the After column
        // After total: 486 + 175 + 1000 + 120 = 1781
        const scale = 300 / 1781;

        const beforeTotal = BEFORE.reduce((s, d) => s + d.amount, 0);
        const afterTotal = AFTER.reduce((s, d) => s + d.amount, 0);
        const beforeHeight = beforeTotal * scale;
        const afterHeight = afterTotal * scale;

        return (
          <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} className="select-none">
            {/* Baseline */}
            <line x1="80" y1={baseline} x2="880" y2={baseline} stroke="var(--color-rule)" strokeWidth="1" opacity={0.4} />

            {/* ── BEFORE column ── */}
            <text
              x={beforeX + barWidth / 2} y="38"
              textAnchor="middle" fontSize="15" fontFamily="var(--font-sans)"
              fontWeight="600" fill="var(--color-ink)" opacity={0.55}
            >
              Before (Feb 27)
            </text>

            <StackedBar
              x={beforeX} barWidth={barWidth} items={BEFORE}
              baseline={baseline} scale={scale} side="before" labelSide="left"
            />

            {/* Before total */}
            <text
              x={beforeX + barWidth / 2} y={baseline - beforeHeight - 28}
              textAnchor="middle" fontSize="28" fontFamily="var(--font-display)"
              fontWeight="400" fill="var(--color-ink)" opacity={0.7}
            >
              ~$1.2M
            </text>
            <text
              x={beforeX + barWidth / 2} y={baseline - beforeHeight - 10}
              textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)"
              fill="var(--color-ink-tertiary)"
            >
              per voyage
            </text>

            {/* ── AFTER column ── */}
            <text
              x={afterX + barWidth / 2} y="38"
              textAnchor="middle" fontSize="15" fontFamily="var(--font-sans)"
              fontWeight="700" fill="var(--color-accent)"
            >
              After (Mar 7)
            </text>

            <StackedBar
              x={afterX} barWidth={barWidth} items={AFTER}
              baseline={baseline} scale={scale} side="after" labelSide="right"
            />

            {/* After total */}
            <text
              x={afterX + barWidth / 2} y={baseline - afterHeight - 28}
              textAnchor="middle" fontSize="32" fontFamily="var(--font-display)"
              fontWeight="500" fill="var(--color-accent)"
            >
              ~$4.5M+
            </text>
            <text
              x={afterX + barWidth / 2} y={baseline - afterHeight - 10}
              textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)"
              fill="var(--color-ink-tertiary)"
            >
              per voyage
            </text>

            {/* ── Multiplier badge ── */}
            <g transform={`translate(${afterX + barWidth + 28}, ${baseline - afterHeight / 2})`}>
              <rect x="-32" y="-20" width="64" height="40" rx="20" fill="var(--color-accent)" opacity={0.08} stroke="var(--color-accent)" strokeWidth="1.5" strokeOpacity={0.25} />
              <text x="0" y="1" textAnchor="middle" fontSize="18" fontFamily="var(--font-display)" fontWeight="500" fill="var(--color-accent)" style={{ fontVariationSettings: "'SOFT' 30, 'WONK' 0, 'opsz' 24" }}>
                3.7×
              </text>
            </g>

            {/* ── Connecting arrow ── */}
            <g>
              <line
                x1={beforeX + barWidth + 12} y1={baseline - beforeHeight / 2}
                x2={afterX - 12} y2={baseline - afterHeight / 2}
                stroke="var(--color-accent)" strokeWidth="1.5" strokeOpacity={0.3}
                strokeDasharray="6 4"
              />
              <polygon
                points={`${afterX - 12},${baseline - afterHeight / 2 - 5} ${afterX - 2},${baseline - afterHeight / 2} ${afterX - 12},${baseline - afterHeight / 2 + 5}`}
                fill="var(--color-accent)" opacity={0.35}
              />
            </g>

            {/* ── Annotation ── */}
            <text
              x={(beforeX + barWidth + afterX) / 2} y={baseline - afterHeight / 2 - 14}
              textAnchor="middle" fontSize="13" fontFamily="var(--font-sans)"
              fontWeight="600" fill="var(--color-accent)" opacity={0.55}
            >
              In 8 days
            </text>

            {/* ── Footnote ── */}
            <text
              x={vw / 2} y={baseline + 35}
              textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)"
              fill="var(--color-ink-faint)"
            >
              Based on a single VLCC voyage (2M barrels). Major insurers cancelled Gulf war risk cover entirely.
            </text>

            {/* ── Visual annotation: insurance drove most of the increase ── */}
            <g transform={`translate(${afterX + barWidth + 18}, ${baseline - 200})`}>
              <line x1="0" y1="0" x2="30" y2="-20" stroke="var(--color-accent)" strokeWidth="1" strokeOpacity={0.4} />
              <text x="34" y="-24" fontSize="12" fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-accent)" opacity={0.7}>
                Insurance alone
              </text>
              <text x="34" y="-10" fontSize="12" fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-accent)" opacity={0.7}>
                went from $250K to $1M+
              </text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
