import * as d3 from 'd3';
import { Chart } from './Chart';

interface DesalinationItem {
  country: string;
  share: number;
  tier: 'high' | 'mid' | 'low';
}

const DATA: DesalinationItem[] = [
  { country: 'Kuwait', share: 90, tier: 'high' },
  { country: 'Oman', share: 86, tier: 'high' },
  { country: 'Israel', share: 75, tier: 'high' },
  { country: 'Saudi Arabia', share: 70, tier: 'mid' },
  { country: 'Bahrain', share: 60, tier: 'mid' },
  { country: 'Qatar', share: 50, tier: 'mid' },
  { country: 'UAE', share: 42, tier: 'low' },
  { country: 'Iran', share: 2, tier: 'low' },
];

const TIER_COLORS: Record<string, string> = {
  high: 'var(--color-accent)',
  mid: 'var(--color-viz-amber)',
  low: 'var(--color-viz-slate)',
};

export function DesalinationChart() {
  const margin = { top: 8, right: 60, bottom: 40, left: 130 };

  return (
    <Chart
      title="When energy fails, water fails"
      subtitle="Share of freshwater supply from desalination plants powered by oil and gas"
      source="Global Water Intelligence, MENA Desalination Reports, 2026"
      width="wide"
      aspectRatio={0.4}
    >
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const y = d3.scaleBand()
          .domain(DATA.map(d => d.country))
          .range([0, innerH])
          .padding(0.3);

        const x = d3.scaleLinear()
          .domain([0, 100])
          .range([0, innerW]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(tick => (
                <line key={tick} x1={x(tick)} x2={x(tick)} y1={0} y2={innerH} stroke="var(--color-rule-light)" strokeDasharray="2 3" />
              ))}

              {/* Bars */}
              {DATA.map((d) => {
                const barY = y(d.country) ?? 0;
                const barH = y.bandwidth();
                const color = TIER_COLORS[d.tier];

                return (
                  <g key={d.country}>
                    <rect
                      x={0} y={barY} width={x(d.share)} height={barH}
                      fill={color}
                      opacity={0.85}
                      rx={2}
                    />
                    <text
                      x={-12} y={barY + barH / 2}
                      textAnchor="end" dominantBaseline="central"
                      fontSize={13} fontFamily="var(--font-sans)"
                      fontWeight={d.tier === 'high' ? 700 : 400}
                      fill={d.tier === 'high' ? 'var(--color-accent)' : 'var(--color-ink-secondary)'}
                    >
                      {d.country}
                    </text>
                    <text
                      x={x(d.share) + 8} y={barY + barH / 2}
                      dominantBaseline="central"
                      fontSize={14} fontFamily="var(--font-sans)" fontWeight={700}
                      fill={color}
                    >
                      {d.share}%
                    </text>
                  </g>
                );
              })}

              {/* X axis */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
              {[0, 25, 50, 75, 100].map(tick => (
                <text
                  key={tick} x={x(tick)} y={innerH + 20}
                  textAnchor="middle" fontSize={11}
                  fontFamily="var(--font-mono)"
                  fill="var(--color-ink-tertiary)"
                >
                  {tick}%
                </text>
              ))}

              {/* Annotation */}
              <text
                x={innerW / 2} y={innerH + 36}
                textAnchor="middle" fontSize={12}
                fontFamily="var(--font-sans)" fontStyle="italic"
                fill="var(--color-ink-tertiary)"
              >
                Desalination plants run on oil and gas. When energy supply is disrupted, drinking water is at risk.
              </text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
