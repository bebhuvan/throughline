import * as d3 from 'd3';
import { Chart } from './Chart';

interface CountrySeries {
  name: string;
  values: { year: number; imports: number }[];
  color: string;
  bold: boolean;
}

const YEARS = [1980, 1990, 2000, 2010, 2020, 2025];

const SERIES: CountrySeries[] = [
  {
    name: 'China',
    values: YEARS.map((y, i) => ({ year: y, imports: [0, 10, 80, 280, 550, 700][i] })),
    color: 'var(--color-accent)',
    bold: true,
  },
  {
    name: 'Europe',
    values: YEARS.map((y, i) => ({ year: y, imports: [500, 470, 500, 520, 450, 430][i] })),
    color: 'var(--color-viz-green)',
    bold: false,
  },
  {
    name: 'India',
    values: YEARS.map((y, i) => ({ year: y, imports: [20, 40, 90, 170, 220, 260][i] })),
    color: 'var(--color-viz-blue)',
    bold: true,
  },
  {
    name: 'Japan',
    values: YEARS.map((y, i) => ({ year: y, imports: [250, 270, 260, 210, 140, 130][i] })),
    color: 'var(--color-viz-amber)',
    bold: false,
  },
  {
    name: 'US',
    values: YEARS.map((y, i) => ({ year: y, imports: [350, 400, 550, 500, -50, -80][i] })),
    color: 'var(--color-viz-cyan)',
    bold: false,
  },
];

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function OilImportDependencyChart({
  title = "Asia\u2019s oil hunger has grown for 40 years. America\u2019s hasn\u2019t.",
  subtitle = 'Net oil imports by country, million tonnes per year, 1980\u20132025',
  source = 'Energy Institute, JP Morgan Asset Management',
}: Props) {
  const margin = { top: 24, right: 80, bottom: 48, left: 56 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} width="wide" aspectRatio={0.5}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const x = d3.scaleLinear()
          .domain([1980, 2025])
          .range([0, innerW]);

        const y = d3.scaleLinear()
          .domain([-150, 750])
          .range([innerH, 0]);

        const lineGen = d3.line<{ year: number; imports: number }>()
          .x(d => x(d.year))
          .y(d => y(d.imports))
          .curve(d3.curveMonotoneX);

        // Find where US crosses zero
        const usData = SERIES.find(s => s.name === 'US')!.values;
        // Between 2010 (500) and 2020 (-50): interpolate
        const crossYear = 2010 + (500 / (500 + 50)) * 10;
        const crossX = x(crossYear);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {[-100, 0, 100, 200, 300, 400, 500, 600, 700].map(tick => (
                <g key={tick}>
                  <line
                    x1={0} x2={innerW}
                    y1={y(tick)} y2={y(tick)}
                    stroke={tick === 0 ? 'var(--color-ink-faint)' : 'var(--color-rule-light)'}
                    strokeWidth={tick === 0 ? 1.5 : 1}
                    strokeDasharray={tick === 0 ? 'none' : '2 3'}
                    opacity={tick === 0 ? 0.6 : 1}
                  />
                  <text
                    x={-10} y={y(tick)}
                    textAnchor="end" dominantBaseline="central"
                    fontSize={13} fill="var(--color-ink-tertiary)"
                    fontFamily="var(--font-sans)"
                  >
                    {tick}
                  </text>
                </g>
              ))}

              {/* Zero line label */}
              <text
                x={innerW + 4} y={y(0)}
                dominantBaseline="central"
                fontSize={11} fontFamily="var(--font-sans)" fontWeight={500}
                fill="var(--color-ink-faint)"
              >
                zero
              </text>

              {/* Net exporter / net importer zone labels */}
              <text
                x={8} y={y(-80)}
                fontSize={11} fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-ink-faint)" letterSpacing="0.08em"
              >
                NET EXPORTER
              </text>
              <text
                x={8} y={y(30)}
                fontSize={11} fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-ink-faint)" letterSpacing="0.08em"
              >
                NET IMPORTER
              </text>

              {/* Lines */}
              {SERIES.map((s, i) => (
                <path
                  key={`line-${i}`}
                  d={lineGen(s.values) ?? ''}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.bold ? 3 : 2}
                  strokeLinecap="round"
                  opacity={s.bold ? 1 : 0.7}
                />
              ))}

              {/* End dots and labels */}
              {SERIES.map((s, i) => {
                const last = s.values[s.values.length - 1];
                const lx = x(last.year);
                const ly = y(last.imports);

                return (
                  <g key={`end-${i}`}>
                    <circle cx={lx} cy={ly} r={s.bold ? 5 : 4} fill={s.color} />
                    <text
                      x={lx + 10} y={ly - 6}
                      fontSize={14} fontFamily="var(--font-sans)" fontWeight={700}
                      fill={s.color}
                    >
                      {last.imports > 0 ? last.imports : last.imports}
                    </text>
                    <text
                      x={lx + 10} y={ly + 8}
                      fontSize={11} fontFamily="var(--font-sans)" fontWeight={500}
                      fill={s.color} opacity={0.8}
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}

              {/* US crosses zero annotation */}
              <circle cx={crossX} cy={y(0)} r={5} fill="none" stroke="var(--color-viz-cyan)" strokeWidth={2} />
              <line
                x1={crossX} x2={crossX}
                y1={y(0) - 30} y2={y(0) - 8}
                stroke="var(--color-viz-cyan)" strokeWidth={1}
              />
              <text
                x={crossX} y={y(0) - 44}
                textAnchor="middle"
                fontSize={12} fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-viz-cyan)" opacity={0.85}
              >
                US becomes net exporter
              </text>
              <text
                x={crossX} y={y(0) - 30}
                textAnchor="middle"
                fontSize={11} fontFamily="var(--font-sans)"
                fill="var(--color-ink-tertiary)" opacity={0.7}
              >
                ~2018
              </text>

              {/* China growth annotation */}
              <g transform={`translate(${x(2005)}, ${y(400)})`}>
                <text fontSize={12} fontFamily="var(--font-sans)" fontWeight={500} fontStyle="italic" fill="var(--color-accent)" opacity={0.85}>
                  China: zero to 700M tonnes
                </text>
                <text y={16} fontSize={11} fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-ink-tertiary)" opacity={0.7}>
                  in four decades
                </text>
              </g>

              {/* X axis */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
              {YEARS.map(year => (
                <text
                  key={year}
                  x={x(year)} y={innerH + 20}
                  textAnchor="middle" fontSize={12}
                  fill="var(--color-ink-tertiary)" fontFamily="var(--font-sans)"
                >
                  {year}
                </text>
              ))}
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
