import * as d3 from 'd3';
import { Chart } from './Chart';

interface RegionSeries {
  name: string;
  values: number[];
  color: string;
}

const DATES = ['Jan 1', 'Jan 16', 'Jan 31', 'Feb 15', 'Mar 2', 'Mar 17'];

const SERIES: RegionSeries[] = [
  { name: 'Japan', values: [100, 102, 98, 103, 145, 205], color: 'var(--color-accent)' },
  { name: 'India', values: [100, 101, 97, 102, 140, 195], color: 'var(--color-viz-blue)' },
  { name: 'Singapore', values: [100, 103, 99, 104, 142, 190], color: 'var(--color-viz-amber)' },
  { name: 'US', values: [100, 100, 96, 101, 130, 175], color: 'var(--color-viz-cyan)' },
  { name: 'NW Europe', values: [100, 101, 97, 102, 128, 168], color: 'var(--color-viz-green)' },
];

const ANNOTATIONS = [
  { dateIndex: 4, label: 'US-Israel strikes', sublabel: 'Feb 28' },
  { dateIndex: 5, label: 'IRGC declares strait closed', sublabel: 'Mar 4' },
];

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function GasolineByRegionChart({
  title = 'Fuel prices are rising everywhere \u2014 but not equally',
  subtitle = 'Wholesale gasoline price index (100 = January 1, 2026), by region',
  source = 'Bloomberg, JP Morgan Asset Management, March 2026',
}: Props) {
  const margin = { top: 24, right: 90, bottom: 48, left: 48 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} width="wide" aspectRatio={0.5}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const x = d3.scalePoint<string>()
          .domain(DATES)
          .range([0, innerW]);

        const y = d3.scaleLinear()
          .domain([80, 220])
          .range([innerH, 0]);

        const lineGen = d3.line<number>()
          .x((_, i) => x(DATES[i]) ?? 0)
          .y(d => y(d))
          .curve(d3.curveMonotoneX);

        const areaGen = d3.area<number>()
          .x((_, i) => x(DATES[i]) ?? 0)
          .y0(innerH)
          .y1(d => y(d))
          .curve(d3.curveMonotoneX);

        // Annotation x positions (interpolated between date indices)
        const annotX1 = (x(DATES[4])! + x(DATES[3])!) / 2 + (x(DATES[4])! - x(DATES[3])!) * 0.8;
        const annotX2 = (x(DATES[4])! + x(DATES[5])!) / 2 - (x(DATES[5])! - x(DATES[4])!) * 0.3;

        return (
          <svg width={w} height={h} className="overflow-visible">
            <defs>
              {SERIES.map((s, i) => (
                <linearGradient key={i} id={`gasoline-area-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.01} />
                </linearGradient>
              ))}
            </defs>
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {[100, 120, 140, 160, 180, 200, 220].map(tick => (
                <g key={tick}>
                  <line
                    x1={0} x2={innerW}
                    y1={y(tick)} y2={y(tick)}
                    stroke="var(--color-rule-light)"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={-8} y={y(tick)}
                    textAnchor="end" dominantBaseline="central"
                    fontSize={13} fill="var(--color-ink-tertiary)"
                    fontFamily="var(--font-sans)"
                  >
                    {tick}
                  </text>
                </g>
              ))}

              {/* Baseline 100 line — prominent */}
              <line
                x1={0} x2={innerW}
                y1={y(100)} y2={y(100)}
                stroke="var(--color-ink-faint)" strokeWidth={1}
                strokeDasharray="4 3" opacity={0.5}
              />
              <text
                x={4} y={y(100) + 14}
                fontSize={11} fontFamily="var(--font-sans)" fontWeight={500}
                fill="var(--color-ink-tertiary)"
              >
                Baseline = 100
              </text>

              {/* Annotation lines */}
              <line
                x1={annotX1} x2={annotX1}
                y1={0} y2={innerH}
                stroke="var(--color-accent)" strokeWidth={1}
                strokeDasharray="4 3" opacity={0.4}
              />
              <text x={annotX1} y={-8} textAnchor="middle" fontSize={11} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-accent)" opacity={0.8}>
                US-Israel strikes
              </text>
              <text x={annotX1} y={4} textAnchor="middle" fontSize={11} fontFamily="var(--font-sans)" fill="var(--color-accent)" opacity={0.5}>
                Feb 28
              </text>

              <line
                x1={annotX2} x2={annotX2}
                y1={0} y2={innerH}
                stroke="var(--color-accent)" strokeWidth={1}
                strokeDasharray="4 3" opacity={0.4}
              />
              <text x={annotX2} y={-8} textAnchor="middle" fontSize={11} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-accent)" opacity={0.8}>
                IRGC declares strait closed
              </text>
              <text x={annotX2} y={4} textAnchor="middle" fontSize={11} fontFamily="var(--font-sans)" fill="var(--color-accent)" opacity={0.5}>
                Mar 4
              </text>

              {/* Area fills */}
              {SERIES.map((s, i) => (
                <path
                  key={`area-${i}`}
                  d={areaGen(s.values) ?? ''}
                  fill={`url(#gasoline-area-${i})`}
                />
              ))}

              {/* Lines */}
              {SERIES.map((s, i) => (
                <path
                  key={`line-${i}`}
                  d={lineGen(s.values) ?? ''}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              ))}

              {/* End dots and labels — with collision avoidance */}
              {(() => {
                const lastX = x(DATES[DATES.length - 1]) ?? 0;
                const minSpacing = 16;

                // Build label positions sorted by Y
                const labels = SERIES.map((s, i) => ({
                  ...s,
                  i,
                  lastVal: s.values[s.values.length - 1],
                  rawY: y(s.values[s.values.length - 1]),
                  adjustedY: y(s.values[s.values.length - 1]),
                })).sort((a, b) => a.rawY - b.rawY);

                // Push overlapping labels apart (many passes for convergence)
                for (let pass = 0; pass < 12; pass++) {
                  for (let j = 1; j < labels.length; j++) {
                    const gap = labels[j].adjustedY - labels[j - 1].adjustedY;
                    if (gap < minSpacing) {
                      const shift = (minSpacing - gap) / 2;
                      labels[j - 1].adjustedY -= shift;
                      labels[j].adjustedY += shift;
                    }
                  }
                }

                return labels.map((s) => (
                  <g key={`end-${s.i}`}>
                    <circle cx={lastX} cy={s.rawY} r={4} fill={s.color} />
                    {/* Connector line from dot to label if shifted */}
                    {Math.abs(s.adjustedY - s.rawY) > 3 && (
                      <line
                        x1={lastX + 4} y1={s.rawY}
                        x2={lastX + 10} y2={s.adjustedY}
                        stroke={s.color} strokeWidth={1} opacity={0.25}
                      />
                    )}
                    <text
                      x={lastX + 12} y={s.adjustedY + 4}
                      fontSize={12} fontFamily="var(--font-sans)" fontWeight={600}
                      fill={s.color}
                    >
                      {s.lastVal} {s.name}
                    </text>
                  </g>
                ));
              })()}

              {/* Key data point dots at inflection */}
              {SERIES.map((s, i) => {
                const inflectionVal = s.values[4];
                const inflectionX = x(DATES[4]) ?? 0;
                return (
                  <circle
                    key={`dot-${i}`}
                    cx={inflectionX} cy={y(inflectionVal)}
                    r={3} fill={s.color} opacity={0.6}
                  />
                );
              })}

              {/* X axis */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
              {DATES.map(date => (
                <text
                  key={date}
                  x={x(date) ?? 0} y={innerH + 20}
                  textAnchor="middle" fontSize={12}
                  fill="var(--color-ink-tertiary)" fontFamily="var(--font-sans)"
                >
                  {date}
                </text>
              ))}

              {/* Editorial annotation */}
              <g transform={`translate(${innerW * 0.12}, ${y(200)})`}>
                <text fontSize={12} fontFamily="var(--font-sans)" fontWeight={500} fontStyle="italic" fill="var(--color-ink-secondary)" opacity={0.8}>
                  Asia pays 15–20% more than Europe
                </text>
                <text y={16} fontSize={11} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)" opacity={0.7}>
                  Proximity to Hormuz means higher exposure
                </text>
              </g>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
