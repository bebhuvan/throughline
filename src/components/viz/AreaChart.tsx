import * as d3 from 'd3';
import { Chart } from './Chart';

interface DataPoint {
  date: string | Date;
  [key: string]: string | number | Date;
}

interface AreaChartProps {
  data: DataPoint[];
  keys: string[];
  colors?: string[];
  title?: string;
  subtitle?: string;
  source?: string;
  sourceUrl?: string;
  width?: 'prose' | 'wide' | 'full';
  yFormat?: (v: number) => string;
  stacked?: boolean;
}

const VIZ_COLORS = [
  'var(--color-viz-blue)',
  'var(--color-viz-red)',
  'var(--color-viz-green)',
  'var(--color-viz-amber)',
  'var(--color-viz-violet)',
  'var(--color-viz-cyan)',
];

export function AreaChart({
  data,
  keys,
  colors,
  title,
  subtitle,
  source,
  sourceUrl,
  width = 'wide',
  yFormat = (v) => v.toLocaleString(),
  stacked = true,
}: AreaChartProps) {
  const margin = { top: 16, right: 80, bottom: 40, left: 56 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} sourceUrl={sourceUrl} width={width}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const x = d3.scaleTime()
          .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
          .range([0, innerW]);

        const stack = d3.stack<DataPoint>().keys(keys);
        const stacks = stacked ? stack(data) : null;

        const yMax = stacked
          ? d3.max(stacks!, (layer) => d3.max(layer, (d) => d[1])) ?? 0
          : d3.max(data, (d) => d3.max(keys, (k) => Number(d[k]))) ?? 0;

        const y = d3.scaleLinear().domain([0, yMax]).nice().range([innerH, 0]);

        const area = d3.area<[number, number] & { data: DataPoint }>()
          .x((d) => x(new Date(d.data.date)))
          .y0((d) => y(d[0]))
          .y1((d) => y(d[1]))
          .curve(d3.curveMonotoneX);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {y.ticks(5).map((tick) => (
                <line key={tick} x1={0} x2={innerW} y1={y(tick)} y2={y(tick)} stroke="var(--color-rule-light)" strokeDasharray="2,4" opacity={0.7} />
              ))}

              {stacks?.map((layer, i) => (
                <g key={keys[i]}>
                  <path
                    d={area(layer as any) ?? ''}
                    fill={colors?.[i] || VIZ_COLORS[i % VIZ_COLORS.length]}
                    opacity={0.65}
                  />
                  {/* Subtle top stroke for definition */}
                  <path
                    d={d3.line<(typeof layer)[number]>()
                      .x((d) => x(new Date(d.data.date)))
                      .y((d) => y(d[1]))
                      .curve(d3.curveMonotoneX)(layer) ?? ''}
                    fill="none"
                    stroke={colors?.[i] || VIZ_COLORS[i % VIZ_COLORS.length]}
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                </g>
              ))}

              {/* Legend labels at end */}
              {stacks?.map((layer, i) => {
                const last = layer[layer.length - 1];
                if (!last) return null;
                const midY = (y(last[0]) + y(last[1])) / 2;
                return (
                  <text
                    key={`label-${keys[i]}`}
                    x={innerW + 10}
                    y={midY}
                    dominantBaseline="central"
                    fill={colors?.[i] || VIZ_COLORS[i % VIZ_COLORS.length]}
                    fontFamily="var(--font-sans)"
                    fontSize={12}
                    fontWeight={600}
                  >
                    {keys[i]}
                  </text>
                );
              })}

              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" strokeWidth={1.5} />
              {x.ticks(6).map((tick) => (
                <text
                  key={tick.toISOString()}
                  x={x(tick)}
                  y={innerH + 24}
                  textAnchor="middle"
                  fill="var(--color-ink-tertiary)"
                  fontFamily="var(--font-mono)"
                  fontSize={12}
                >
                  {d3.timeFormat('%b %Y')(tick)}
                </text>
              ))}
              {y.ticks(5).map((tick) => (
                <text
                  key={tick}
                  x={-10}
                  y={y(tick)}
                  textAnchor="end"
                  dominantBaseline="central"
                  fill="var(--color-ink-tertiary)"
                  fontFamily="var(--font-mono)"
                  fontSize={12}
                >
                  {yFormat(tick)}
                </text>
              ))}
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
