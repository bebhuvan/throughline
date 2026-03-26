import * as d3 from 'd3';
import { Chart } from './Chart';

interface DataPoint {
  date: string | Date;
  value: number;
}

interface Series {
  name: string;
  data: DataPoint[];
  color?: string;
}

interface LineChartProps {
  series: Series[];
  title?: string;
  subtitle?: string;
  source?: string;
  sourceUrl?: string;
  width?: 'prose' | 'wide' | 'full';
  yFormat?: (v: number) => string;
  xFormat?: (d: Date) => string;
  showArea?: boolean;
}

const VIZ_COLORS = [
  'var(--color-viz-blue)',
  'var(--color-viz-red)',
  'var(--color-viz-green)',
  'var(--color-viz-amber)',
  'var(--color-viz-violet)',
  'var(--color-viz-cyan)',
];

export function LineChart({
  series,
  title,
  subtitle,
  source,
  sourceUrl,
  width = 'wide',
  yFormat = (v) => v.toLocaleString(),
  xFormat,
  showArea = false,
}: LineChartProps) {
  const margin = { top: 16, right: 80, bottom: 40, left: 56 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} sourceUrl={sourceUrl} width={width}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const allPoints = series.flatMap((s) =>
          s.data.map((d) => ({ date: new Date(d.date), value: d.value }))
        );

        const x = d3.scaleTime()
          .domain(d3.extent(allPoints, (d) => d.date) as [Date, Date])
          .range([0, innerW]);

        const y = d3.scaleLinear()
          .domain([0, d3.max(allPoints, (d) => d.value) ?? 0])
          .nice()
          .range([innerH, 0]);

        const line = d3.line<DataPoint>()
          .x((d) => x(new Date(d.date)))
          .y((d) => y(d.value))
          .curve(d3.curveMonotoneX);

        const area = d3.area<DataPoint>()
          .x((d) => x(new Date(d.date)))
          .y0(innerH)
          .y1((d) => y(d.value))
          .curve(d3.curveMonotoneX);

        const defaultXFormat = xFormat || d3.timeFormat('%b %Y');

        return (
          <svg width={w} height={h} className="overflow-visible">
            <defs>
              {showArea && series.map((s, i) => {
                const color = s.color || VIZ_COLORS[i % VIZ_COLORS.length];
                return (
                  <linearGradient key={`grad-${s.name}`} id={`area-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                );
              })}
            </defs>
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {y.ticks(5).map((tick) => (
                <line key={tick} x1={0} x2={innerW} y1={y(tick)} y2={y(tick)} stroke="var(--color-rule-light)" strokeDasharray="2,4" opacity={0.7} />
              ))}

              {/* Area fills — gradient */}
              {showArea && series.map((s, i) => (
                <path
                  key={`area-${s.name}`}
                  d={area(s.data) ?? ''}
                  fill={`url(#area-grad-${i})`}
                />
              ))}

              {/* Lines */}
              {series.map((s, i) => (
                <path
                  key={s.name}
                  d={line(s.data) ?? ''}
                  fill="none"
                  stroke={s.color || VIZ_COLORS[i % VIZ_COLORS.length]}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* End dots + labels */}
              {series.map((s, i) => {
                const last = s.data[s.data.length - 1];
                if (!last) return null;
                const color = s.color || VIZ_COLORS[i % VIZ_COLORS.length];
                return (
                  <g key={`end-${s.name}`}>
                    <circle
                      cx={x(new Date(last.date))}
                      cy={y(last.value)}
                      r={4}
                      fill="var(--color-paper-cream)"
                      stroke={color}
                      strokeWidth={2}
                    />
                    <text
                      x={innerW + 10}
                      y={y(last.value)}
                      dominantBaseline="central"
                      fill={color}
                      fontFamily="var(--font-sans)"
                      fontSize={12}
                      fontWeight={600}
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}

              {/* X axis */}
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
                  {defaultXFormat(tick)}
                </text>
              ))}

              {/* Y axis */}
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
