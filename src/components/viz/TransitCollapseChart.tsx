import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Chart } from './Chart';

interface TransitPoint {
  date: string;
  transits: number;
}

const DATA: TransitPoint[] = [
  { date: '2026-02-01', transits: 120 },
  { date: '2026-02-04', transits: 132 },
  { date: '2026-02-07', transits: 125 },
  { date: '2026-02-10', transits: 137 },
  { date: '2026-02-13', transits: 129 },
  { date: '2026-02-16', transits: 134 },
  { date: '2026-02-19', transits: 131 },
  { date: '2026-02-22', transits: 128 },
  { date: '2026-02-25', transits: 140 },
  { date: '2026-02-27', transits: 141 },
  { date: '2026-02-28', transits: 81 },
  { date: '2026-03-01', transits: 20 },
  { date: '2026-03-02', transits: 10 },
  { date: '2026-03-03', transits: 3 },
  { date: '2026-03-04', transits: 6 },
  { date: '2026-03-05', transits: 5 },
  { date: '2026-03-06', transits: 5 },
  { date: '2026-03-07', transits: 4 },
  { date: '2026-03-08', transits: 7 },
  { date: '2026-03-09', transits: 8 },
  { date: '2026-03-10', transits: 6 },
  { date: '2026-03-11', transits: 12 },
  { date: '2026-03-12', transits: 15 },
  { date: '2026-03-13', transits: 22 },
];

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
}

export function TransitCollapseChart({
  title = 'Ship transits through the Strait of Hormuz',
  subtitle = 'Daily vessel count, February–March 2026',
  source = 'UNCTAD, based on Clarksons Research Shipping Intelligence Network',
}: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const [animated, setAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          const path = pathRef.current;
          if (path) {
            const len = path.getTotalLength();
            path.style.strokeDasharray = `${len}`;
            path.style.strokeDashoffset = `${len}`;
            path.getBoundingClientRect();
            path.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
            path.style.strokeDashoffset = '0';
          }
          const area = areaRef.current;
          if (area) {
            area.style.opacity = '0';
            area.getBoundingClientRect();
            area.style.transition = 'opacity 1.5s ease 0.8s';
            area.style.opacity = '1';
          }
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animated]);

  const margin = { top: 24, right: 16, bottom: 48, left: 48 };

  return (
    <div ref={containerRef}>
      <Chart title={title} subtitle={subtitle} source={source} width="wide" aspectRatio={0.5}>
        {({ width: w, height: h }) => {
          const innerW = w - margin.left - margin.right;
          const innerH = h - margin.top - margin.bottom;

          const x = d3.scaleTime()
            .domain([new Date('2026-02-01'), new Date('2026-03-14')])
            .range([0, innerW]);

          const y = d3.scaleLinear()
            .domain([0, 160])
            .range([innerH, 0]);

          const line = d3.line<TransitPoint>()
            .x(d => x(new Date(d.date)))
            .y(d => y(d.transits))
            .curve(d3.curveMonotoneX);

          const area = d3.area<TransitPoint>()
            .x(d => x(new Date(d.date)))
            .y0(innerH)
            .y1(d => y(d.transits))
            .curve(d3.curveMonotoneX);

          const crisisDate = new Date('2026-02-28');
          const crisisX = x(crisisDate);

          return (
            <svg width={w} height={h} className="overflow-visible">
              <defs>
                <linearGradient id="transit-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="crisis-zone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-paper-rose)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--color-paper-rose)" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <g transform={`translate(${margin.left},${margin.top})`}>
                {/* Crisis zone — warm rose tint */}
                <rect
                  x={crisisX}
                  y={0}
                  width={innerW - crisisX}
                  height={innerH}
                  fill="url(#crisis-zone)"
                />

                {/* "Before" / "After" labels */}
                <text x={crisisX - 12} y={-8} textAnchor="end" fontSize={12} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-ink-faint)" letterSpacing="0.08em">
                  BEFORE
                </text>
                <text x={crisisX + 12} y={-8} textAnchor="start" fontSize={12} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-accent)" letterSpacing="0.08em">
                  AFTER
                </text>

                {/* Normal traffic reference line */}
                <line x1={0} x2={crisisX} y1={y(130)} y2={y(130)} stroke="var(--color-ink-faint)" strokeWidth={1} strokeDasharray="4 3" opacity={0.3} />
                <text x={4} y={y(130) - 7} fontSize={12} fontFamily="var(--font-sans)" fontWeight={500} fill="var(--color-ink-tertiary)">
                  Normal traffic ~130/day
                </text>

                {/* Grid lines */}
                {[0, 40, 80, 120, 160].map(tick => (
                  <g key={tick}>
                    <line x1={0} x2={innerW} y1={y(tick)} y2={y(tick)} stroke="var(--color-rule-light)" />
                    <text x={-8} y={y(tick)} textAnchor="end" dominantBaseline="central" fontSize={13} fill="var(--color-ink-tertiary)" fontFamily="var(--font-sans)">
                      {tick}
                    </text>
                  </g>
                ))}

                {/* Crisis annotation line */}
                <line x1={crisisX} x2={crisisX} y1={0} y2={innerH} stroke="var(--color-accent)" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />
                <text x={crisisX + 8} y={16} fontSize={12} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-accent)" opacity={0.8}>
                  Operation Epic Fury
                </text>
                <text x={crisisX + 8} y={28} fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-accent)" opacity={0.5}>
                  Feb 28, 2026
                </text>

                {/* Area fill */}
                <path ref={areaRef} d={area(DATA) ?? ''} fill="url(#transit-gradient)" />

                {/* Main line */}
                <path ref={pathRef} d={line(DATA) ?? ''} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" />

                {/* Key data points */}
                <circle cx={x(new Date('2026-02-27'))} cy={y(141)} r={4.5} fill="var(--color-accent)" />
                <text x={x(new Date('2026-02-27')) - 4} y={y(141) - 14} textAnchor="end" fontSize={15} fontFamily="var(--font-sans)" fontWeight={700} fill="var(--color-ink)">
                  141
                </text>
                <text x={x(new Date('2026-02-27')) - 4} y={y(141) - 1} textAnchor="end" fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-ink-tertiary)">
                  ships/day
                </text>

                <circle cx={x(new Date('2026-03-07'))} cy={y(4)} r={4.5} fill="var(--color-accent)" />
                <text x={x(new Date('2026-03-07')) + 10} y={y(4) - 10} fontSize={15} fontFamily="var(--font-sans)" fontWeight={700} fill="var(--color-accent)">
                  4
                </text>
                <text x={x(new Date('2026-03-07')) + 10} y={y(4) + 3} fontSize={12} fontFamily="var(--font-sans)" fill="var(--color-accent)" opacity={0.7}>
                  ships/day
                </text>

                {/* X axis */}
                <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
                {x.ticks(d3.timeDay.every(5) as any).map(tick => (
                  <text key={tick.toISOString()} x={x(tick)} y={innerH + 20} textAnchor="middle" fontSize={12} fill="var(--color-ink-tertiary)" fontFamily="var(--font-sans)">
                    {d3.timeFormat('%b %d')(tick)}
                  </text>
                ))}

                {/* 97% annotation — large, dramatic */}
                <g transform={`translate(${innerW - 90}, ${innerH / 2 - 20})`} opacity={0.9}>
                  <text fontSize={56} fontFamily="var(--font-serif)" fontWeight={200} fill="var(--color-accent-warm)" letterSpacing="-0.04em">
                    97%
                  </text>
                  <text y={20} fontSize={12} fontFamily="var(--font-sans)" fontWeight={600} fill="var(--color-accent)" opacity={0.6} letterSpacing="0.08em">
                    COLLAPSE
                  </text>
                </g>
              </g>
            </svg>
          );
        }}
      </Chart>
    </div>
  );
}
