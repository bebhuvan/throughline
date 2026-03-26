import * as d3 from 'd3';
import { Chart } from './Chart';

interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarDatum[];
  title?: string;
  subtitle?: string;
  source?: string;
  sourceUrl?: string;
  width?: 'prose' | 'wide' | 'full';
  horizontal?: boolean;
  valueFormat?: (v: number) => string;
  barColor?: string;
}

const VIZ_COLORS = [
  'var(--color-viz-blue)',
  'var(--color-viz-red)',
  'var(--color-viz-green)',
  'var(--color-viz-amber)',
  'var(--color-viz-violet)',
  'var(--color-viz-cyan)',
];

export function BarChart({
  data,
  title,
  subtitle,
  source,
  sourceUrl,
  width = 'wide',
  horizontal = false,
  valueFormat = (v) => v.toLocaleString(),
  barColor,
}: BarChartProps) {
  const margin = { top: 8, right: 16, bottom: horizontal ? 32 : 48, left: horizontal ? 120 : 48 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} sourceUrl={sourceUrl} width={width} aspectRatio={horizontal ? Math.max(0.4, data.length * 0.06) : 0.56}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        if (horizontal) {
          const y = d3.scaleBand().domain(data.map((d) => d.label)).range([0, innerH]).padding(0.3);
          const x = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) ?? 0]).nice().range([0, innerW]);

          return (
            <svg width={w} height={h} className="overflow-visible">
              <g transform={`translate(${margin.left},${margin.top})`}>
                {/* Grid lines */}
                {x.ticks(5).map((tick) => (
                  <line key={tick} x1={x(tick)} x2={x(tick)} y1={0} y2={innerH} stroke="var(--color-rule-light)" strokeDasharray="2,4" opacity={0.7} />
                ))}
                {/* Bars */}
                {data.map((d, i) => {
                  const color = d.color || barColor || VIZ_COLORS[i % VIZ_COLORS.length];
                  return (
                    <g key={d.label}>
                      <rect
                        y={y(d.label)}
                        width={x(d.value)}
                        height={y.bandwidth()}
                        fill={color}
                        rx={2}
                        ry={2}
                        opacity={0.85}
                      />
                      <text
                        x={-10}
                        y={(y(d.label) ?? 0) + y.bandwidth() / 2}
                        textAnchor="end"
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight={500}
                        fill="var(--color-ink-secondary)"
                        fontFamily="var(--font-sans)"
                      >
                        {d.label}
                      </text>
                      <text
                        x={x(d.value) + 8}
                        y={(y(d.label) ?? 0) + y.bandwidth() / 2}
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight={600}
                        fill="var(--color-ink-tertiary)"
                        fontFamily="var(--font-mono)"
                      >
                        {valueFormat(d.value)}
                      </text>
                    </g>
                  );
                })}
                {/* X axis */}
                <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" strokeWidth={1.5} />
                {x.ticks(5).map((tick) => (
                  <text
                    key={tick}
                    x={x(tick)}
                    y={innerH + 22}
                    textAnchor="middle"
                    fontSize={12}
                    fill="var(--color-ink-tertiary)"
                    fontFamily="var(--font-mono)"
                  >
                    {valueFormat(tick)}
                  </text>
                ))}
              </g>
            </svg>
          );
        }

        // Vertical bars
        const x = d3.scaleBand().domain(data.map((d) => d.label)).range([0, innerW]).padding(0.35);
        const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) ?? 0]).nice().range([innerH, 0]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {y.ticks(5).map((tick) => (
                <line key={tick} x1={0} x2={innerW} y1={y(tick)} y2={y(tick)} stroke="var(--color-rule-light)" strokeDasharray="2,4" opacity={0.7} />
              ))}
              {/* Bars */}
              {data.map((d, i) => (
                <g key={d.label}>
                  <rect
                    x={x(d.label)}
                    y={y(d.value)}
                    width={x.bandwidth()}
                    height={innerH - y(d.value)}
                    fill={d.color || barColor || VIZ_COLORS[i % VIZ_COLORS.length]}
                    rx={2}
                    ry={2}
                    opacity={0.85}
                  />
                  <text
                    x={(x(d.label) ?? 0) + x.bandwidth() / 2}
                    y={innerH + 22}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={500}
                    fill="var(--color-ink-secondary)"
                    fontFamily="var(--font-sans)"
                  >
                    {d.label}
                  </text>
                </g>
              ))}
              {/* Y axis */}
              <line x1={0} x2={0} y1={0} y2={innerH} stroke="var(--color-rule)" strokeWidth={1.5} />
              {y.ticks(5).map((tick) => (
                <text
                  key={tick}
                  x={-10}
                  y={y(tick)}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize={12}
                  fill="var(--color-ink-tertiary)"
                  fontFamily="var(--font-mono)"
                >
                  {valueFormat(tick)}
                </text>
              ))}
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
