import * as d3 from 'd3';
import { Chart } from './Chart';

interface BypassItem {
  label: string;
  capacity: number;
  type: 'flow' | 'bypass';
}

const DATA: BypassItem[] = [
  { label: 'Total Hormuz flow', capacity: 20.9, type: 'flow' },
  { label: 'Saudi East-West Pipeline', capacity: 4.0, type: 'bypass' },
  { label: 'UAE ADCOP Pipeline', capacity: 0.4, type: 'bypass' },
  { label: 'Iran Goreh-Jask', capacity: 0.3, type: 'bypass' },
];

export function BypassGapChart() {
  const margin = { top: 8, right: 80, bottom: 32, left: 170 };

  return (
    <Chart
      title="No plan B"
      subtitle="Pipeline bypass capacity vs. total Hormuz flow (million barrels/day)"
      source="EIA; IEA; S&P Global, March 2026"
      width="wide"
      aspectRatio={0.3}
    >
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const y = d3.scaleBand()
          .domain(DATA.map(d => d.label))
          .range([0, innerH])
          .padding(0.35);

        const x = d3.scaleLinear()
          .domain([0, 24])
          .range([0, innerW]);

        const totalBypass = DATA.filter(d => d.type === 'bypass').reduce((sum, d) => sum + d.capacity, 0);
        const gap = 20.9 - totalBypass;

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid */}
              {[0, 5, 10, 15, 20].map(tick => (
                <line key={tick} x1={x(tick)} x2={x(tick)} y1={0} y2={innerH} stroke="var(--color-rule-light)" strokeDasharray="2 3" />
              ))}

              {DATA.map((d) => {
                const barY = y(d.label) ?? 0;
                const barH = y.bandwidth();
                const isFlow = d.type === 'flow';

                return (
                  <g key={d.label}>
                    <rect
                      x={0} y={barY} width={x(d.capacity)} height={barH}
                      fill={isFlow ? 'var(--color-viz-red)' : 'var(--color-viz-blue)'}
                      opacity={isFlow ? 0.85 : 0.7}
                      rx={2}
                    />
                    <text x={-12} y={barY + barH / 2} textAnchor="end" dominantBaseline="central" fontSize={13} fontFamily="var(--font-sans)" fontWeight={isFlow ? 700 : 400} fill={isFlow ? 'var(--color-viz-red)' : 'var(--color-ink-secondary)'}>
                      {d.label}
                    </text>
                    <text x={x(d.capacity) + 8} y={barY + barH / 2} dominantBaseline="central" fontSize={14} fontFamily="var(--font-sans)" fontWeight={700} fill={isFlow ? 'var(--color-viz-red)' : 'var(--color-viz-blue)'}>
                      {d.capacity.toFixed(1)} mb/d
                    </text>
                  </g>
                );
              })}

              {/* Gap annotation */}
              <g transform={`translate(${x(totalBypass)}, ${innerH + 16})`}>
                <line x1={0} x2={x(gap)} y1={0} y2={0} stroke="var(--color-viz-red)" strokeWidth={2} />
                <line x1={0} x2={0} y1={-4} y2={4} stroke="var(--color-viz-red)" strokeWidth={2} />
                <line x1={x(gap)} x2={x(gap)} y1={-4} y2={4} stroke="var(--color-viz-red)" strokeWidth={2} />
                <text x={x(gap) / 2} y={14} textAnchor="middle" fontSize={13} fontFamily="var(--font-sans)" fontWeight={700} fill="var(--color-viz-red)">
                  {gap.toFixed(1)} mb/d — no backup
                </text>
              </g>

              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
