import * as d3 from 'd3';
import { Chart } from './Chart';

interface LNGItem {
  country: string;
  value: number;
  isAsia: boolean;
}

const DATA: LNGItem[] = [
  { country: 'Taiwan', value: 24, isAsia: true },
  { country: 'Japan', value: 20, isAsia: true },
  { country: 'Kuwait', value: 18, isAsia: true },
  { country: 'South Korea', value: 17, isAsia: true },
  { country: 'Pakistan', value: 10, isAsia: false },
  { country: 'Spain', value: 9, isAsia: false },
  { country: 'Belgium', value: 9, isAsia: false },
  { country: 'Thailand', value: 8, isAsia: false },
  { country: 'France', value: 7, isAsia: false },
  { country: 'Italy', value: 6, isAsia: false },
];

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function LNGExposureChart({
  title = 'Built on gas that flows through one strait',
  subtitle = 'LNG imports as share of total primary energy supply (%), 2024',
  source = 'Energy Institute, Ember analysis, 2025',
}: Props) {
  const margin = { top: 8, right: 64, bottom: 32, left: 120 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} width="wide" aspectRatio={0.45}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const y = d3.scaleBand()
          .domain(DATA.map(d => d.country))
          .range([0, innerH])
          .padding(0.25);

        const x = d3.scaleLinear()
          .domain([0, 30])
          .range([0, innerW]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid */}
              {[0, 5, 10, 15, 20, 25, 30].map(tick => (
                <g key={tick}>
                  <line
                    x1={x(tick)} x2={x(tick)}
                    y1={0} y2={innerH}
                    stroke="var(--color-rule-light)"
                    strokeDasharray="2 3"
                  />
                  {tick > 0 && (
                    <text
                      x={x(tick)} y={innerH + 18}
                      textAnchor="middle" fontSize={12}
                      fill="var(--color-ink-faint)" fontFamily="var(--font-sans)"
                    >
                      {tick}%
                    </text>
                  )}
                </g>
              ))}

              {DATA.map((d) => {
                const barY = y(d.country) ?? 0;
                const barH = y.bandwidth();
                const barW = x(d.value);
                const barColor = d.isAsia ? 'var(--color-accent)' : 'var(--color-viz-blue)';

                return (
                  <g key={d.country}>
                    {/* Bar background */}
                    <rect
                      x={0} y={barY}
                      width={innerW} height={barH}
                      fill="var(--color-paper-alt)" rx={2}
                    />
                    {/* Bar */}
                    <rect
                      x={0} y={barY}
                      width={barW} height={barH}
                      fill={barColor} rx={3}
                      opacity={0.85}
                    />
                    {/* Label */}
                    <text
                      x={-12} y={barY + barH / 2}
                      textAnchor="end" dominantBaseline="central"
                      fontSize={13} fontFamily="var(--font-sans)" fontWeight={500}
                      fill="var(--color-ink-secondary)"
                    >
                      {d.country}
                    </text>
                    {/* Value */}
                    <text
                      x={barW + 8} y={barY + barH / 2}
                      dominantBaseline="central"
                      fontSize={15} fontFamily="var(--font-sans)" fontWeight={700}
                      fill={barColor}
                    >
                      {d.value}%
                    </text>
                  </g>
                );
              })}

              {/* Divider between Asia-highlighted and rest */}
              <line
                x1={-margin.left + 16} x2={innerW + 20}
                y1={(y('South Korea') ?? 0) + y.bandwidth() + y.step() * 0.125}
                y2={(y('South Korea') ?? 0) + y.bandwidth() + y.step() * 0.125}
                stroke="var(--color-rule-light)"
                strokeDasharray="4 3"
              />

              {/* Annotation */}
              {(() => {
                const annotY = (y('Taiwan') ?? 0) + y.bandwidth() + 4;
                const annotX = x(24) + 20;
                return (
                  <g transform={`translate(${Math.min(annotX, innerW - 200)}, ${annotY})`}>
                    <text fontSize={12} fontFamily="var(--font-sans)" fontWeight={500} fontStyle="italic" fill="var(--color-accent)" opacity={0.85} y={10}>
                      A quarter of their energy depends
                    </text>
                    <text fontSize={12} fontFamily="var(--font-sans)" fontWeight={500} fontStyle="italic" fill="var(--color-accent)" opacity={0.85} y={26}>
                      {'on LNG \u2014 most of it through Hormuz'}
                    </text>
                  </g>
                );
              })()}

              {/* Legend */}
              <g transform={`translate(0, ${innerH + 24})`}>
                <rect x={0} y={0} width={10} height={10} rx={2} fill="var(--color-accent)" opacity={0.85} />
                <text x={14} y={9} fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                  Asia-Pacific
                </text>
                <rect x={100} y={0} width={10} height={10} rx={2} fill="var(--color-viz-blue)" opacity={0.85} />
                <text x={114} y={9} fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                  Other
                </text>
              </g>

              {/* Bottom axis line */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
