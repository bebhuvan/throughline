/**
 * The Cascade Chain — From Wellhead to Kitchen
 * Each step is a row. The disruption point at step 2 dominates visually.
 * Steps below the break get progressively warmer colours to show amplification.
 */

import { Chart } from './Chart';

const STEPS = [
  { number: 1, label: 'Oil wellhead', sublabel: 'Persian Gulf offshore platforms', price: '+74% crude', color: 'var(--color-ink)', above: true },
  { number: 2, label: 'Tanker in the strait', sublabel: 'VLCC carrying 2M barrels through Hormuz', price: '', color: 'var(--color-viz-red)', above: true },
  { number: 3, label: 'Shipping costs', sublabel: 'Marine fuel doubled, insurance 4×, tanker rates 4×', price: '4× rates', color: 'var(--color-viz-amber)', above: false },
  { number: 4, label: 'Refinery + gas', sublabel: 'European gas +74%, Asian LNG +50%', price: '+74% gas', color: 'var(--color-viz-blue)', above: false },
  { number: 5, label: 'Fertilizer', sublabel: 'Urea from $400 to $677/tonne. Spring planting at risk.', price: '+69% urea', color: 'var(--color-viz-green)', above: false },
  { number: 6, label: 'Food prices', sublabel: 'WFP: 45 million more people into food insecurity', price: '3-6 mo lag', color: 'var(--color-viz-violet)', above: false },
  { number: 7, label: 'Your kitchen', sublabel: 'LPG cylinder +Rs 60. Petrol, dal, rice — all more expensive.', price: '+Rs 60 LPG', color: 'var(--color-accent)', above: false },
];

function Step({ y, step, isLast }: {
  y: number; step: typeof STEPS[0]; isLast: boolean;
}) {
  return (
    <g transform={`translate(0, ${y})`}>
      {/* Step circle */}
      <circle
        cx="44" cy="0" r="20"
        fill={step.color} opacity={0.15}
        stroke={step.color} strokeWidth="2" strokeOpacity={0.45}
      />
      <text
        x="44" y="6"
        textAnchor="middle" fontSize="15" fontFamily="var(--font-sans)"
        fontWeight="700" fill={step.color} opacity={0.8}
      >
        {step.number}
      </text>

      {/* Labels */}
      <text
        x="80" y="-4"
        fontSize="15" fontFamily="var(--font-sans)"
        fontWeight="600" fill="var(--color-ink)" opacity={0.8}
      >
        {step.label}
      </text>
      <text
        x="80" y="16"
        fontSize="13" fontFamily="var(--font-sans)"
        fill="var(--color-ink-tertiary)"
      >
        {step.sublabel}
      </text>

      {/* Price badge */}
      {step.price && (
        <g transform="translate(430, 0)">
          <rect
            x="0" y="-14" width="100" height="28" rx="14"
            fill={step.color} opacity={0.12}
            stroke={step.color} strokeWidth="1.5" strokeOpacity={0.3}
          />
          <text
            x="50" y="5"
            textAnchor="middle" fontSize="14" fontFamily="var(--font-mono)"
            fontWeight="700" fill={step.color} opacity={0.85}
          >
            {step.price}
          </text>
        </g>
      )}

      {/* Connector to next step */}
      {!isLast && (
        <line
          x1="44" y1="20" x2="44" y2="48"
          stroke={step.color} strokeWidth="2" strokeOpacity={0.2}
          strokeDasharray="4 4"
        />
      )}
    </g>
  );
}

export function CascadeChainIllustration() {
  return (
    <Chart
      title="From wellhead to kitchen — and where the chain breaks"
      subtitle="Each stage of the cascade amplifies the shock from the Strait of Hormuz"
      source="UNCTAD, JP Morgan, Goldman Sachs, ING Research"
      aspectRatio={0.58}
    >
      {({ width }) => {
        const vw = 580;
        const vh = 540;
        const h = Math.min(width * 0.58, vh);

        return (
          <svg viewBox={`0 0 ${vw} ${vh}`} width={width} height={h} className="select-none">
            {/* Step 1 */}
            <Step y={35} step={STEPS[0]} isLast={false} />

            {/* Step 2 */}
            <Step y={105} step={STEPS[1]} isLast={false} />

            {/* ══ DISRUPTION MARKER ══ */}
            <g transform="translate(0, 150)">
              {/* Background band */}
              <rect
                x="14" y="-14" width="545" height="36" rx="6"
                fill="var(--color-viz-red)" opacity={0.1}
                stroke="var(--color-viz-red)" strokeWidth="2" strokeOpacity={0.35}
              />
              {/* X icon */}
              <g transform="translate(33, 4)">
                <line x1="-6" y1="-6" x2="6" y2="6" stroke="var(--color-viz-red)" strokeWidth="3" strokeLinecap="round" opacity={0.65} />
                <line x1="6" y1="-6" x2="-6" y2="6" stroke="var(--color-viz-red)" strokeWidth="3" strokeLinecap="round" opacity={0.65} />
              </g>
              <text
                x="55" y="8"
                fontSize="14" fontFamily="var(--font-sans)"
                fontWeight="700" fill="var(--color-viz-red)" opacity={0.75}
                letterSpacing="0.5"
              >
                STRAIT CLOSED — chain breaks here
              </text>
            </g>

            {/* Steps 3-7 below the break */}
            <Step y={210} step={STEPS[2]} isLast={false} />
            <Step y={280} step={STEPS[3]} isLast={false} />
            <Step y={350} step={STEPS[4]} isLast={false} />
            <Step y={420} step={STEPS[5]} isLast={false} />
            <Step y={490} step={STEPS[6]} isLast={true} />
          </svg>
        );
      }}
    </Chart>
  );
}
