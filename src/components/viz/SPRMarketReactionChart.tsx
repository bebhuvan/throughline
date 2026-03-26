import * as d3 from 'd3';
import { Chart } from './Chart';

interface PricePoint {
  date: string;
  price: number;
}

const DATA: PricePoint[] = [
  { date: '2026-03-04', price: 92 },
  { date: '2026-03-05', price: 96 },
  { date: '2026-03-06', price: 100 },
  { date: '2026-03-07', price: 104 },
  { date: '2026-03-08', price: 112 },
  { date: '2026-03-09', price: 108 },
  { date: '2026-03-10', price: 110 },
  { date: '2026-03-11', price: 107 },
  { date: '2026-03-12', price: 103 },
  { date: '2026-03-13', price: 108 },
  { date: '2026-03-14', price: 112 },
  { date: '2026-03-15', price: 118 },
  { date: '2026-03-16', price: 115 },
  { date: '2026-03-17', price: 120 },
  { date: '2026-03-18', price: 126 },
];

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function SPRMarketReactionChart({
  title = 'The market ignored the biggest oil release in history',
  subtitle = "Brent crude price around the IEA\u2019s record 412-million-barrel strategic reserve release",
  source = 'Bloomberg, JP Morgan Asset Management, March 2026',
}: Props) {
  const margin = { top: 32, right: 24, bottom: 48, left: 56 };

  return (
    <Chart title={title} subtitle={subtitle} source={source} width="wide" aspectRatio={0.5}>
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const parseDate = (s: string) => new Date(s);

        const x = d3.scaleTime()
          .domain([parseDate('2026-03-04'), parseDate('2026-03-18')])
          .range([0, innerW]);

        const y = d3.scaleLinear()
          .domain([85, 135])
          .range([innerH, 0]);

        const lineGen = d3.line<PricePoint>()
          .x(d => x(parseDate(d.date)))
          .y(d => y(d.price))
          .curve(d3.curveMonotoneX);

        const areaGen = d3.area<PricePoint>()
          .x(d => x(parseDate(d.date)))
          .y0(innerH)
          .y1(d => y(d.price))
          .curve(d3.curveMonotoneX);

        // Key dates
        const sprDate = parseDate('2026-03-11');
        const sprX = x(sprDate);
        const peakDate = parseDate('2026-03-18');
        const peakX = x(peakDate);
        const hundredDate = parseDate('2026-03-06');
        const hundredX = x(hundredDate);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <defs>
              <linearGradient id="spr-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="spr-post-release-zone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-paper-rose)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="var(--color-paper-rose)" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Post-release shaded zone */}
              <rect
                x={sprX}
                y={0}
                width={peakX - sprX}
                height={innerH}
                fill="url(#spr-post-release-zone)"
              />
              <text
                x={sprX + (peakX - sprX) / 2} y={-8}
                textAnchor="middle"
                fontSize={11} fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-accent)" letterSpacing="0.08em" opacity={0.7}
              >
                POST-RELEASE
              </text>

              {/* Grid lines */}
              {[90, 100, 110, 120, 130].map(tick => (
                <g key={tick}>
                  <line
                    x1={0} x2={innerW}
                    y1={y(tick)} y2={y(tick)}
                    stroke={tick === 100 ? 'var(--color-ink-faint)' : 'var(--color-rule-light)'}
                    strokeWidth={tick === 100 ? 1 : 1}
                    strokeDasharray={tick === 100 ? '4 3' : '2 3'}
                    opacity={tick === 100 ? 0.5 : 1}
                  />
                  <text
                    x={-10} y={y(tick)}
                    textAnchor="end" dominantBaseline="central"
                    fontSize={13} fill="var(--color-ink-tertiary)"
                    fontFamily="var(--font-sans)"
                  >
                    ${tick}
                  </text>
                </g>
              ))}

              {/* $100 annotation */}
              <line
                x1={hundredX} x2={hundredX}
                y1={y(100) - 40} y2={y(100) + 4}
                stroke="var(--color-ink-faint)" strokeWidth={1}
                strokeDasharray="3 2" opacity={0.5}
              />
              <text
                x={hundredX} y={y(100) - 48}
                textAnchor="middle"
                fontSize={11} fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-ink-secondary)" opacity={0.7}
              >
                $100 crossed
              </text>

              {/* SPR release annotation */}
              <line
                x1={sprX} x2={sprX}
                y1={0} y2={innerH}
                stroke="var(--color-accent)" strokeWidth={1}
                strokeDasharray="4 3" opacity={0.5}
              />
              <g transform={`translate(${sprX + 8}, ${y(132)})`}>
                <text fontSize={11} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-accent)" opacity={0.85}>
                  IEA announces 412M barrel
                </text>
                <text y={14} fontSize={11} fontFamily="var(--font-sans)" fontWeight={500} fill="var(--color-accent)" opacity={0.7}>
                  strategic reserve release
                </text>
              </g>

              {/* Area fill */}
              <path d={areaGen(DATA) ?? ''} fill="url(#spr-area-gradient)" />

              {/* Main line */}
              <path
                d={lineGen(DATA) ?? ''}
                fill="none" stroke="var(--color-accent)"
                strokeWidth={2.5} strokeLinecap="round"
              />

              {/* Key data points */}
              {/* Mar 11 - SPR dip low */}
              <circle cx={x(parseDate('2026-03-12'))} cy={y(103)} r={4.5} fill="var(--color-accent)" />
              <text
                x={x(parseDate('2026-03-12')) - 8} y={y(103) + 16}
                textAnchor="end"
                fontSize={12} fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-accent)"
              >
                Brief -4% dip
              </text>

              {/* Peak */}
              <circle cx={peakX} cy={y(126)} r={5} fill="var(--color-accent)" />
              <text
                x={peakX - 8} y={y(126) - 14}
                textAnchor="end"
                fontSize={15} fontFamily="var(--font-sans)" fontWeight={700}
                fill="var(--color-accent)"
              >
                $126/bbl
              </text>
              <text
                x={peakX - 8} y={y(126) - 1}
                textAnchor="end"
                fontSize={11} fontFamily="var(--font-sans)"
                fill="var(--color-ink-tertiary)"
              >
                Peak: Mar 18
              </text>

              {/* Start point */}
              <circle cx={x(parseDate('2026-03-04'))} cy={y(92)} r={4} fill="var(--color-ink-tertiary)" />
              <text
                x={x(parseDate('2026-03-04')) + 8} y={y(92) + 4}
                fontSize={13} fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-ink-secondary)"
              >
                $92
              </text>

              {/* Editorial insight */}
              <g transform={`translate(${innerW * 0.05}, ${y(125)})`}>
                <text fontSize={12} fontFamily="var(--font-sans)" fontWeight={500} fontStyle="italic" fill="var(--color-ink-secondary)" opacity={0.8}>
                  Prices dipped 4%, then surged to new highs
                </text>
                <text y={16} fontSize={11} fontFamily="var(--font-sans)" fontStyle="italic" fill="var(--color-ink-tertiary)" opacity={0.7}>
                  The market called the bluff on reserves
                </text>
              </g>

              {/* X axis */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
              {DATA.filter((_, i) => i % 2 === 0).map(d => {
                const date = parseDate(d.date);
                return (
                  <text
                    key={d.date}
                    x={x(date)} y={innerH + 20}
                    textAnchor="middle" fontSize={12}
                    fill="var(--color-ink-tertiary)" fontFamily="var(--font-sans)"
                  >
                    {d3.timeFormat('%b %d')(date)}
                  </text>
                );
              })}
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
