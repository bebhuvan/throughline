import * as d3 from 'd3';
import { Chart } from './Chart';

interface GCCItem {
  country: string;
  covid: number;
  hormuz: number;
}

const DATA: GCCItem[] = [
  { country: 'Oman', covid: -3.5, hormuz: -10.0 },
  { country: 'Saudi Arabia', covid: -5.0, hormuz: -8.5 },
  { country: 'UAE', covid: -6.0, hormuz: -7.5 },
  { country: 'Bahrain', covid: -4.5, hormuz: -7.0 },
  { country: 'Qatar', covid: -4.0, hormuz: -6.5 },
  { country: 'Kuwait', covid: -6.5, hormuz: -6.0 },
];

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function GCCGDPHitChart({
  title = 'Worse than Covid for the Gulf economies',
  subtitle = 'Potential non-oil GDP decline \u2014 Covid-19 pandemic vs. Hormuz crisis',
  source = 'Haver Analytics, Goldman Sachs GIR, March 2026',
}: Props) {
  const margin = { top: 8, right: 56, bottom: 56, left: 120 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} width="wide" aspectRatio={0.45}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const countries = DATA.map(d => d.country);

        const y0 = d3.scaleBand()
          .domain(countries)
          .range([0, innerH])
          .padding(0.2);

        const y1 = d3.scaleBand()
          .domain(['covid', 'hormuz'])
          .range([0, y0.bandwidth()])
          .padding(0.1);

        const x = d3.scaleLinear()
          .domain([-12, 0])
          .range([0, innerW]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {[-12, -10, -8, -6, -4, -2, 0].map(tick => (
                <g key={tick}>
                  <line
                    x1={x(tick)} x2={x(tick)}
                    y1={0} y2={innerH}
                    stroke={tick === 0 ? 'var(--color-ink-faint)' : 'var(--color-rule-light)'}
                    strokeWidth={tick === 0 ? 1.5 : 1}
                    strokeDasharray={tick === 0 ? 'none' : '2 3'}
                    opacity={tick === 0 ? 0.6 : 1}
                  />
                  <text
                    x={x(tick)} y={innerH + 18}
                    textAnchor="middle" fontSize={12}
                    fill="var(--color-ink-faint)" fontFamily="var(--font-sans)"
                  >
                    {tick === 0 ? '0%' : `${tick}%`}
                  </text>
                </g>
              ))}

              {DATA.map((d) => {
                const groupY = y0(d.country) ?? 0;
                const covidBarY = groupY + (y1('covid') ?? 0);
                const hormuzBarY = groupY + (y1('hormuz') ?? 0);
                const barH = y1.bandwidth();

                const covidW = innerW - x(d.covid);
                const hormuzW = innerW - x(d.hormuz);

                return (
                  <g key={d.country}>
                    {/* Country label */}
                    <text
                      x={-12}
                      y={groupY + y0.bandwidth() / 2}
                      textAnchor="end" dominantBaseline="central"
                      fontSize={13} fontFamily="var(--font-sans)" fontWeight={500}
                      fill="var(--color-ink-secondary)"
                    >
                      {d.country}
                    </text>

                    {/* Bar backgrounds */}
                    <rect x={0} y={covidBarY} width={innerW} height={barH} fill="var(--color-paper-alt)" rx={2} />
                    <rect x={0} y={hormuzBarY} width={innerW} height={barH} fill="var(--color-paper-alt)" rx={2} />

                    {/* Covid bar — grows left from zero (right edge) */}
                    <rect
                      x={innerW - covidW} y={covidBarY}
                      width={covidW} height={barH}
                      fill="var(--color-viz-slate)" rx={3}
                      opacity={0.85}
                    />
                    {/* Covid value */}
                    <text
                      x={innerW - covidW - 8} y={covidBarY + barH / 2}
                      textAnchor="end" dominantBaseline="central"
                      fontSize={14} fontFamily="var(--font-sans)" fontWeight={700}
                      fill="var(--color-viz-slate)"
                    >
                      {d.covid}%
                    </text>

                    {/* Hormuz bar — grows left from zero (right edge) */}
                    <rect
                      x={innerW - hormuzW} y={hormuzBarY}
                      width={hormuzW} height={barH}
                      fill="var(--color-accent)" rx={3}
                      opacity={0.85}
                    />
                    {/* Hormuz value */}
                    <text
                      x={innerW - hormuzW - 8} y={hormuzBarY + barH / 2}
                      textAnchor="end" dominantBaseline="central"
                      fontSize={14} fontFamily="var(--font-sans)" fontWeight={700}
                      fill="var(--color-accent)"
                    >
                      {d.hormuz}%
                    </text>
                  </g>
                );
              })}

              {/* Oman annotation */}
              {(() => {
                const omanY = y0('Oman') ?? 0;
                const hormuzBarY = omanY + (y1('hormuz') ?? 0);
                const hormuzW = innerW - x(-10.0);
                const annotX = innerW - hormuzW - 12;
                return (
                  <g>
                    <line
                      x1={annotX} x2={annotX - 20}
                      y1={hormuzBarY + y1.bandwidth() / 2}
                      y2={hormuzBarY + y1.bandwidth() / 2 - 24}
                      stroke="var(--color-accent)" strokeWidth={1} opacity={0.6}
                    />
                    <text
                      x={annotX - 24} y={hormuzBarY + y1.bandwidth() / 2 - 29}
                      textAnchor="end"
                      fontSize={12} fontFamily="var(--font-sans)" fontWeight={500}
                      fontStyle="italic" fill="var(--color-accent)" opacity={0.85}
                    >
                      3× worse than the pandemic
                    </text>
                  </g>
                );
              })()}

              {/* Bottom axis line */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />

              {/* Legend */}
              <g transform={`translate(${innerW / 2 - 120}, ${innerH + 34})`}>
                <rect x={0} y={0} width={12} height={12} rx={2} fill="var(--color-viz-slate)" opacity={0.85} />
                <text x={16} y={10} fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                  Covid-19 pandemic
                </text>
                <rect x={150} y={0} width={12} height={12} rx={2} fill="var(--color-accent)" opacity={0.85} />
                <text x={166} y={10} fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                  Hormuz crisis
                </text>
              </g>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
