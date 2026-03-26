import * as d3 from 'd3';
import { Chart } from './Chart';

interface Scenario {
  label: string;
  duration: string;
  oilQ2: number;
  oilQ3: number;
  oilQ4: number;
  gdpDrag: number;
  severity: 'base' | 'extended' | 'severe';
}

const SCENARIOS: Scenario[] = [
  { label: 'One quarter', duration: 'Apr–Jun 2026', oilQ2: 98, oilQ3: 68, oilQ4: 67, gdpDrag: -0.2, severity: 'base' },
  { label: 'Two quarters', duration: 'Apr–Sep 2026', oilQ2: 98, oilQ3: 115, oilQ4: 76, gdpDrag: -0.3, severity: 'extended' },
  { label: 'Three quarters', duration: 'Apr–Dec 2026', oilQ2: 98, oilQ3: 115, oilQ4: 132, gdpDrag: -1.3, severity: 'severe' },
];

const COLORS = {
  base: 'var(--color-viz-blue)',
  extended: 'var(--color-viz-amber)',
  severe: 'var(--color-accent)',
};

export function GDPScenariosChart() {
  const margin = { top: 32, right: 24, bottom: 72, left: 72 };

  return (
    <Chart
      title="What if it stays closed?"
      subtitle="Oil price and GDP impact by duration of Strait closure — Federal Reserve Bank of Dallas scenarios, March 2026"
      source="Federal Reserve Bank of Dallas, March 2026"
      width="wide"
      aspectRatio={0.52}
    >
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;
        const quarters = ['Q2 2026', 'Q3 2026', 'Q4 2026'];
        const barGroupWidth = innerW / 3;
        const barWidth = Math.min(barGroupWidth * 0.22, 36);

        const x = d3.scaleBand()
          .domain(quarters)
          .range([0, innerW])
          .padding(0.25);

        const y = d3.scaleLinear()
          .domain([0, 150])
          .range([innerH, 0]);

        const preWarPrice = 72.6;

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {[0, 50, 100, 150].map(tick => (
                <g key={tick}>
                  <line x1={0} x2={innerW} y1={y(tick)} y2={y(tick)} stroke="var(--color-rule-light)" />
                  <text x={-10} y={y(tick)} textAnchor="end" dominantBaseline="central" fontSize={12} fill="var(--color-ink-tertiary)" fontFamily="var(--font-sans)">
                    ${tick}
                  </text>
                </g>
              ))}

              {/* Pre-war reference line */}
              <line x1={0} x2={innerW} y1={y(preWarPrice)} y2={y(preWarPrice)} stroke="var(--color-ink-faint)" strokeWidth={1} strokeDasharray="6 4" opacity={0.4} />
              <text x={innerW + 4} y={y(preWarPrice)} dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-faint)">
                Pre-war $73
              </text>

              {/* Quarter groups */}
              {quarters.map((q, qi) => {
                const groupX = (x(q) ?? 0) + x.bandwidth() / 2;
                const prices = [SCENARIOS[0][`oilQ${qi + 2}` as keyof Scenario] as number, SCENARIOS[1][`oilQ${qi + 2}` as keyof Scenario] as number, SCENARIOS[2][`oilQ${qi + 2}` as keyof Scenario] as number];

                return (
                  <g key={q}>
                    {/* Quarter label */}
                    <text x={groupX} y={innerH + 24} textAnchor="middle" fontSize={13} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-ink-secondary)">
                      {q}
                    </text>

                    {/* Three bars per quarter */}
                    {SCENARIOS.map((scenario, si) => {
                      const price = prices[si];
                      const barX = groupX + (si - 1) * (barWidth + 4) - barWidth / 2;
                      const barY = y(price);
                      const barH = innerH - barY;

                      return (
                        <g key={scenario.label}>
                          <rect
                            x={barX}
                            y={barY}
                            width={barWidth}
                            height={barH}
                            fill={COLORS[scenario.severity]}
                            opacity={0.75}
                            rx={2}
                          />
                          <text
                            x={barX + barWidth / 2}
                            y={barY - 8}
                            textAnchor="middle"
                            fontSize={12}
                            fontFamily="var(--font-sans)"
                            fontWeight={700}
                            fill={COLORS[scenario.severity]}
                          >
                            ${price}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Axis */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />

              {/* Y axis label */}
              <text x={-10} y={-14} textAnchor="end" fontSize={12} fontFamily="var(--font-sans)" fontWeight={500} fill="var(--color-ink-tertiary)">
                Brent crude ($/bbl)
              </text>

              {/* $132 annotation — placed top-right, away from bars */}
              <g transform={`translate(${innerW}, ${y(150) + 4})`}>
                <text textAnchor="end" fontSize={12} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-accent)" opacity={0.8}>
                  9-month closure → $132/bbl
                </text>
                <text y={14} textAnchor="end" fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-accent)" opacity={0.5}>
                  Near record highs. Global recession.
                </text>
              </g>

              {/* Legend — spaced proportionally to chart width */}
              <g transform={`translate(0, ${innerH + 44})`}>
                {SCENARIOS.map((s, i) => {
                  const spacing = Math.min(innerW / 3, 220);
                  return (
                    <g key={s.label} transform={`translate(${i * spacing}, 0)`}>
                      <rect width={10} height={10} rx={2} fill={COLORS[s.severity]} opacity={0.75} />
                      <text x={16} y={9} fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                        {s.label} ({s.gdpDrag}pp GDP)
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
