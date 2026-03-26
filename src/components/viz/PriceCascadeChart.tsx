import * as d3 from 'd3';
import { Chart } from './Chart';

interface CascadeItem {
  label: string;
  value: number;
  detail: string;
  color: string;
}

const DATA: CascadeItem[] = [
  { label: 'War risk insurance', value: 300, detail: '$250K → $1M/voyage', color: 'var(--color-viz-red)' },
  { label: 'Marine fuel (HSFO)', value: 100, detail: '$437 → $874/tonne', color: 'var(--color-viz-amber)' },
  { label: 'Marine fuel (VLSFO)', value: 99, detail: '$513 → $1,020/tonne', color: 'var(--color-viz-amber)' },
  { label: 'European gas (TTF)', value: 74, detail: '€32 → €56/MWh', color: 'var(--color-viz-blue)' },
  { label: 'Clean tanker index', value: 72, detail: 'BCTI: 906 → 1,562', color: 'var(--color-viz-cyan)' },
  { label: 'Dirty tanker index', value: 54, detail: 'BDTI: 1,991 → 3,069', color: 'var(--color-viz-cyan)' },
  { label: 'Brent crude oil', value: 52, detail: '$72 → $110/barrel', color: 'var(--color-ink)' },
  { label: 'Urea fertilizer', value: 20, detail: '$392 → $472/tonne', color: 'var(--color-viz-green)' },
];

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function PriceCascadeChart({
  title = 'The price cascade',
  subtitle = 'Percentage increase from pre-crisis baseline, Feb 27 → Mar 18, 2026',
  source = 'UNCTAD; ING Research; LSEG Data & Analytics',
}: Props) {
  const margin = { top: 8, right: 60, bottom: 24, left: 160 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} width="wide" aspectRatio={0.48}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const y = d3.scaleBand()
          .domain(DATA.map(d => d.label))
          .range([0, innerH])
          .padding(0.28);

        const x = d3.scaleLinear()
          .domain([0, 350])
          .range([0, innerW]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid */}
              {[0, 100, 200, 300].map(tick => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={0} y2={innerH} stroke="var(--color-rule-light)" />
                  <text x={x(tick)} y={innerH + 16} textAnchor="middle" fontSize={12} fill="var(--color-ink-faint)" fontFamily="var(--font-sans)">
                    {tick === 0 ? '' : `+${tick}%`}
                  </text>
                </g>
              ))}

              {DATA.map((d) => {
                const barY = y(d.label) ?? 0;
                const barH = y.bandwidth();
                const barW = x(d.value);

                return (
                  <g key={d.label}>
                    {/* Bar background */}
                    <rect x={0} y={barY} width={innerW} height={barH} fill="var(--color-paper-alt)" rx={2} />
                    {/* Bar */}
                    <rect x={0} y={barY} width={barW} height={barH} fill={d.color} rx={3} opacity={0.85} />
                    {/* Label */}
                    <text x={-12} y={barY + barH / 2 - 1} textAnchor="end" dominantBaseline="central" fontSize={13} fontFamily="var(--font-sans)" fontWeight={500} fill="var(--color-ink-secondary)">
                      {d.label}
                    </text>
                    {/* Value */}
                    <text x={barW + 8} y={barY + barH / 2 - 4} dominantBaseline="central" fontSize={15} fontFamily="var(--font-sans)" fontWeight={700} fill={d.color}>
                      +{d.value}%
                    </text>
                    {/* Detail */}
                    <text x={barW + 8} y={barY + barH / 2 + 11} dominantBaseline="central" fontSize={12} fontFamily="var(--font-mono)" fontWeight={500} fill="var(--color-ink-tertiary)">
                      {d.detail}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
