import * as d3 from 'd3';
import { Chart } from './Chart';

interface Chokepoint {
  name: string;
  flow: number;
  highlight?: boolean;
}

const DATA: Chokepoint[] = [
  { name: 'Strait of Malacca', flow: 23.7 },
  { name: 'Strait of Hormuz', flow: 20.9, highlight: true },
  { name: 'Cape of Good Hope', flow: 6.0 },
  { name: 'Suez Canal + SUMED', flow: 4.9 },
  { name: 'Danish Straits', flow: 4.9 },
  { name: 'Turkish Straits', flow: 3.7 },
  { name: 'Bab el-Mandeb', flow: 3.5 },
  { name: 'Panama Canal', flow: 2.3 },
];

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function ChokePointsChart({
  title = 'The chokepoints that rule the world',
  subtitle = 'Daily oil flow through global maritime chokepoints (million barrels/day, 1H 2025)',
  source = 'U.S. Energy Information Administration, March 2026',
}: Props) {
  const margin = { top: 8, right: 72, bottom: 24, left: 150 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} width="wide" aspectRatio={0.45}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const y = d3.scaleBand()
          .domain(DATA.map(d => d.name))
          .range([0, innerH])
          .padding(0.3);

        const x = d3.scaleLinear()
          .domain([0, 28])
          .range([0, innerW]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid */}
              {[0, 5, 10, 15, 20, 25].map(tick => (
                <line key={tick} x1={x(tick)} x2={x(tick)} y1={0} y2={innerH} stroke="var(--color-rule-light)" strokeDasharray={tick === 0 ? 'none' : '2 3'} />
              ))}

              {DATA.map((d) => {
                const barY = y(d.name) ?? 0;
                const barH = y.bandwidth();

                return (
                  <g key={d.name}>
                    {/* Highlight row background */}
                    {d.highlight && (
                      <rect x={-margin.left} y={barY - 4} width={w} height={barH + 8} fill="var(--color-accent-muted)" rx={3} />
                    )}
                    {/* Bar */}
                    <rect
                      x={0} y={barY} width={x(d.flow)} height={barH}
                      fill={d.highlight ? 'var(--color-accent)' : 'var(--color-ink)'}
                      opacity={d.highlight ? 0.9 : 0.25}
                      rx={2}
                    />
                    {/* Label */}
                    <text
                      x={-12} y={barY + barH / 2}
                      textAnchor="end" dominantBaseline="central"
                      fontSize={13} fontFamily="var(--font-sans)"
                      fontWeight={d.highlight ? 700 : 400}
                      fill={d.highlight ? 'var(--color-accent)' : 'var(--color-ink-secondary)'}
                    >
                      {d.name}
                    </text>
                    {/* Value */}
                    <text
                      x={x(d.flow) + 8} y={barY + barH / 2}
                      dominantBaseline="central"
                      fontSize={14} fontFamily="var(--font-sans)"
                      fontWeight={d.highlight ? 700 : 500}
                      fill={d.highlight ? 'var(--color-accent)' : 'var(--color-ink-tertiary)'}
                    >
                      {d.flow.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Hormuz annotation */}
              <text x={x(20.9) + 8} y={(y('Strait of Hormuz') ?? 0) + y.bandwidth() + 16} fontSize={12} fontFamily="var(--font-sans)" fontWeight={500} fill="var(--color-accent)">3.5× more oil than the Suez Canal</text>

              {/* Bottom axis */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
