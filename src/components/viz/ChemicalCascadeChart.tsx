import * as d3 from 'd3';
import { Chart } from './Chart';

interface ChemItem {
  product: string;
  region: string;
  change: number;
  use: string;
}

const DATA: ChemItem[] = [
  { product: 'Butadiene', region: 'South Korea', change: 118, use: 'Tyres, rubber, synthetic materials' },
  { product: 'Propylene', region: 'Europe', change: 78, use: 'Plastics, packaging, textiles' },
  { product: 'Ethylene', region: 'Japan', change: 63, use: 'Polyethylene, PVC, antifreeze' },
  { product: 'Propylene', region: 'United States', change: 64, use: 'Plastics, packaging, textiles' },
  { product: 'Methanol', region: 'Europe', change: 53, use: 'Adhesives, solvents, fuel blends' },
  { product: 'Urea', region: 'Global', change: 28, use: 'Fertilizer — 50% of global crops' },
];

export function ChemicalCascadeChart() {
  const margin = { top: 8, right: 80, bottom: 24, left: 140 };

  return (
    <Chart
      title="Beyond oil: the petrochemical shockwave"
      subtitle="Price surge in key chemical products since the crisis began — the Gulf produces 40% of the world's methanol, 43% of its urea, and 27% of its ammonia"
      source="JP Morgan, Pandora's Bog, March 2026"
      width="wide"
      aspectRatio={0.4}
    >
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const y = d3.scaleBand()
          .domain(DATA.map((d, i) => `${d.product} (${d.region})`))
          .range([0, innerH])
          .padding(0.28);

        const x = d3.scaleLinear()
          .domain([0, 140])
          .range([0, innerW]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid */}
              {[0, 25, 50, 75, 100, 125].map(tick => (
                <line key={tick} x1={x(tick)} x2={x(tick)} y1={0} y2={innerH} stroke="var(--color-rule-light)" strokeDasharray="2 3" />
              ))}

              {DATA.map((d, i) => {
                const key = `${d.product} (${d.region})`;
                const barY = y(key) ?? 0;
                const barH = y.bandwidth();
                const barW = x(d.change);
                const intensity = d.change / 118;
                const color = d.change >= 75 ? 'var(--color-accent)' : d.change >= 50 ? 'var(--color-viz-amber)' : 'var(--color-viz-blue)';

                return (
                  <g key={key}>
                    {/* Background track */}
                    <rect x={0} y={barY} width={innerW} height={barH} fill="var(--color-paper-alt)" rx={2} />
                    {/* Bar */}
                    <rect x={0} y={barY} width={barW} height={barH} fill={color} opacity={0.8} rx={3} />
                    {/* Label */}
                    <text x={-12} y={barY + barH / 2} textAnchor="end" dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-ink-secondary)">
                      {d.product}
                    </text>
                    <text x={-12} y={barY + barH / 2 + 14} textAnchor="end" dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fontWeight={400} fill="var(--color-ink-tertiary)">
                      {d.region}
                    </text>
                    {/* Value */}
                    <text x={barW + 8} y={barY + barH / 2 - 2} dominantBaseline="central" fontSize={15} fontFamily="var(--font-sans)" fontWeight={700} fill={color}>
                      +{d.change}%
                    </text>
                    {/* Use case */}
                    <text x={barW + 8} y={barY + barH / 2 + 14} dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                      {d.use}
                    </text>
                  </g>
                );
              })}

              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />

              {/* Annotation */}
              <text x={0} y={-10} textAnchor="start" fontSize={12} fontFamily="var(--font-sans)" fontWeight={600} letterSpacing="0.06em" fill="var(--color-ink-faint)">
                Price change since crisis began (%)
              </text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
