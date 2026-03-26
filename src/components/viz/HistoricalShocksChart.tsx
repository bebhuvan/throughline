import * as d3 from 'd3';
import { Chart } from './Chart';

interface Shock {
  name: string;
  year: string;
  disrupted: number;
  spare: number;
  current?: boolean;
}

const DATA: Shock[] = [
  { name: 'Suez Crisis', year: '1956', disrupted: 10, spare: 35 },
  { name: 'Six Day War', year: '1967', disrupted: 5, spare: 14 },
  { name: 'Arab Embargo', year: '1973', disrupted: 7, spare: 8 },
  { name: 'Iranian Revolution', year: '1978', disrupted: 5, spare: 5 },
  { name: 'Iran-Iraq War', year: '1980', disrupted: 5, spare: 10 },
  { name: 'Gulf War I', year: '1990', disrupted: 9, spare: 4 },
  { name: 'Gulf War II', year: '2003', disrupted: 7, spare: 1 },
  { name: 'Abqaiq Attack', year: '2019', disrupted: 5, spare: 1 },
  { name: 'Hormuz Crisis', year: '2026', disrupted: 20, spare: 0, current: true },
];

export function HistoricalShocksChart() {
  const margin = { top: 24, right: 40, bottom: 56, left: 140 };

  return (
    <Chart
      title="Every safety margin, gone"
      subtitle="Supply disrupted vs. available spare capacity (% of global oil supply). The world systematically eliminated its buffer — and then had its largest shock."
      source="JP Morgan, March 2026"
      width="wide"
      aspectRatio={0.55}
    >
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const y = d3.scaleBand()
          .domain(DATA.map(d => d.name))
          .range([0, innerH])
          .padding(0.22);

        const x = d3.scaleLinear()
          .domain([0, 40])
          .range([0, innerW]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid */}
              {[0, 10, 20, 30, 40].map(tick => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={0} y2={innerH} stroke="var(--color-rule-light)" strokeDasharray={tick === 0 ? 'none' : '2 3'} />
                  <text x={x(tick)} y={innerH + 16} textAnchor="middle" fontSize={12} fill="var(--color-ink-faint)" fontFamily="var(--font-sans)">
                    {tick}%
                  </text>
                </g>
              ))}

              {DATA.map((d) => {
                const barY = y(d.name) ?? 0;
                const barH = y.bandwidth();
                const halfH = barH / 2 - 1;

                return (
                  <g key={d.name}>
                    {/* Highlight row for current crisis */}
                    {d.current && (
                      <rect x={-margin.left} y={barY - 4} width={w} height={barH + 8} fill="var(--color-accent-muted)" rx={3} />
                    )}

                    {/* Disrupted bar (top half) */}
                    <rect x={0} y={barY} width={x(d.disrupted)} height={halfH} fill={d.current ? 'var(--color-accent)' : 'var(--color-ink)'} opacity={d.current ? 0.85 : 0.3} rx={2} />

                    {/* Spare capacity bar (bottom half) */}
                    <rect x={0} y={barY + halfH + 2} width={x(d.spare)} height={halfH} fill={d.spare === 0 ? 'transparent' : 'var(--color-viz-green)'} opacity={0.5} rx={2} stroke={d.spare === 0 ? 'var(--color-accent)' : 'none'} strokeWidth={d.spare === 0 ? 1 : 0} strokeDasharray={d.spare === 0 ? '3 2' : 'none'} />

                    {/* Zero spare label */}
                    {d.spare === 0 && (
                      <text x={8} y={barY + halfH + 2 + halfH / 2 + 1} dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fontWeight={700} fill="var(--color-accent)">
                        0% spare
                      </text>
                    )}

                    {/* Label */}
                    <text
                      x={-8} y={barY + barH / 2}
                      textAnchor="end" dominantBaseline="central"
                      fontSize={12} fontFamily="var(--font-sans)"
                      fontWeight={d.current ? 700 : 400}
                      fill={d.current ? 'var(--color-accent)' : 'var(--color-ink-secondary)'}
                    >
                      {d.name}
                    </text>
                    <text
                      x={-8} y={barY + barH / 2 + 14}
                      textAnchor="end" dominantBaseline="central"
                      fontSize={12} fontFamily="var(--font-mono)"
                      fill="var(--color-ink-faint)"
                    >
                      {d.year}
                    </text>

                    {/* Disrupted value */}
                    <text x={x(d.disrupted) + 6} y={barY + halfH / 2} dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fontWeight={700} fill={d.current ? 'var(--color-accent)' : 'var(--color-ink-tertiary)'}>
                      {d.disrupted}%
                    </text>
                  </g>
                );
              })}

              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />

              {/* Annotation — the key editorial insight */}
              {innerW > 400 && (
                <g transform={`translate(${x(25)}, ${(y('Hormuz Crisis') ?? 0) - 8})`}>
                  <text fontSize={13} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-accent)">
                    3–5× larger than any previous shock
                  </text>
                  <text y={16} fontSize={12} fontFamily="var(--font-sans)" fontWeight={400} fill="var(--color-accent)" opacity={0.7}>
                    and zero spare capacity to cushion it
                  </text>
                </g>
              )}

              {/* Legend */}
              <g transform={`translate(0, ${innerH + 36})`}>
                <rect x={0} y={-5} width={14} height={10} fill="var(--color-ink)" opacity={0.2} rx={2} />
                <text x={20} y={1} dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">Supply disrupted</text>
                <rect x={140} y={-5} width={14} height={10} fill="var(--color-viz-green)" opacity={0.5} rx={2} />
                <text x={160} y={1} dominantBaseline="central" fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">Available spare capacity</text>
              </g>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
