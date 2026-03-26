import * as d3 from 'd3';
import { Chart } from './Chart';

interface FlowItem {
  commodity: string;
  share: number;
  icon: string;
}

const DATA: FlowItem[] = [
  { commodity: 'Crude oil', share: 38, icon: '●' },
  { commodity: 'LPG', share: 29, icon: '●' },
  { commodity: 'LNG', share: 19, icon: '●' },
  { commodity: 'Refined products', share: 19, icon: '●' },
  { commodity: 'Chemicals & fertilizers', share: 13, icon: '●' },
  { commodity: 'Container', share: 2.8, icon: '●' },
  { commodity: 'Dry bulk', share: 2.4, icon: '●' },
];

const COLORS = [
  'var(--color-ink)',
  'var(--color-viz-amber)',
  'var(--color-viz-blue)',
  'var(--color-viz-cyan)',
  'var(--color-viz-green)',
  'var(--color-viz-slate)',
  'var(--color-viz-slate)',
];

export function CommodityFlowChart() {
  const margin = { top: 8, right: 56, bottom: 24, left: 160 };

  return (
    <Chart
      title="Far more than oil"
      subtitle="Share of global seaborne trade passing through the Strait of Hormuz — strip away the crude, and the strait would still be one of the most critical waterways on Earth"
      source="UNCTAD, based on Clarksons Research, 2026"
      width="wide"
      aspectRatio={0.38}
    >
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const y = d3.scaleBand()
          .domain(DATA.map(d => d.commodity))
          .range([0, innerH])
          .padding(0.3);

        const x = d3.scaleLinear()
          .domain([0, 45])
          .range([0, innerW]);

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {[0, 10, 20, 30, 40].map(tick => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={0} y2={innerH} stroke="var(--color-rule-light)" strokeDasharray="2 3" />
                </g>
              ))}

              {DATA.map((d, i) => {
                const barY = y(d.commodity) ?? 0;
                const barH = y.bandwidth();
                const color = COLORS[i];

                return (
                  <g key={d.commodity}>
                    <rect x={0} y={barY} width={innerW} height={barH} fill="var(--color-paper-alt)" rx={2} />
                    <rect x={0} y={barY} width={x(d.share)} height={barH} fill={color} opacity={0.85} rx={2} />
                    <text x={-12} y={barY + barH / 2} textAnchor="end" dominantBaseline="central" fontSize={13} fontFamily="var(--font-sans)" fontWeight={500} fill="var(--color-ink-secondary)">
                      {d.commodity}
                    </text>
                    <text x={x(d.share) + 8} y={barY + barH / 2} dominantBaseline="central" fontSize={14} fontFamily="var(--font-sans)" fontWeight={700} fill={color}>
                      {d.share}%
                    </text>
                  </g>
                );
              })}

              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
              <text x={0} y={-12} textAnchor="start" fontSize={12} fontFamily="var(--font-sans)" fontWeight={600} letterSpacing="0.06em" fill="var(--color-ink-faint)">% of global seaborne trade through Hormuz</text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
