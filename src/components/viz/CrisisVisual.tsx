import { useMemo } from 'react';
import * as d3 from 'd3';

interface StepData {
  transits: number;
  date: string;
  status: string;
  dataUpTo: number;
}

const STEP_DATA: Record<string, StepData> = {
  'pre-crisis': { transits: 141, date: 'Feb 27', status: 'Normal operations', dataUpTo: 9 },
  'day-1': { transits: 81, date: 'Feb 28', status: 'Operation Epic Fury', dataUpTo: 10 },
  'day-3': { transits: 3, date: 'Mar 3', status: 'Near-total shutdown', dataUpTo: 13 },
  'day-7': { transits: 4, date: 'Mar 7', status: 'Four transits. 150+ ships anchored.', dataUpTo: 17 },
  'day-11': { transits: 12, date: 'Mar 11', status: 'IEA emergency release', dataUpTo: 21 },
  'day-13': { transits: 22, date: 'Mar 13', status: 'Selective reopening', dataUpTo: 23 },
};

const ALL_DATA = [
  120, 132, 125, 137, 129, 134, 131, 128, 140, 141,
  81, 20, 10, 3, 6, 5, 5, 4, 7, 8, 6, 12, 15, 22,
];

interface CrisisVisualProps {
  activeStep: string;
}

export function CrisisVisual({ activeStep }: CrisisVisualProps) {
  const step = STEP_DATA[activeStep] || STEP_DATA['pre-crisis'];
  const visibleData = ALL_DATA.slice(0, step.dataUpTo + 1);

  const miniChart = useMemo(() => {
    const w = 320;
    const h = 100;
    const m = { top: 4, right: 4, bottom: 4, left: 4 };
    const iW = w - m.left - m.right;
    const iH = h - m.top - m.bottom;

    const x = d3.scaleLinear().domain([0, ALL_DATA.length - 1]).range([0, iW]);
    const y = d3.scaleLinear().domain([0, 160]).range([iH, 0]);

    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(iH)
      .y1(d => y(d))
      .curve(d3.curveMonotoneX);

    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    const crisisIndex = 10;

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full max-w-[320px]">
        <defs>
          <linearGradient id="crisis-mini-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <g transform={`translate(${m.left},${m.top})`}>
          {/* Crisis zone */}
          <rect x={x(crisisIndex)} y={0} width={iW - x(crisisIndex)} height={iH} fill="var(--color-paper-rose)" opacity={0.5} />
          {/* Crisis line */}
          <line x1={x(crisisIndex)} x2={x(crisisIndex)} y1={0} y2={iH} stroke="var(--color-accent)" strokeWidth={1} strokeDasharray="3 2" opacity={0.3} />
          {/* Area */}
          <path d={area(visibleData) || ''} fill="url(#crisis-mini-gradient)" />
          {/* Line */}
          <path d={line(visibleData) || ''} fill="none" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" />
          {/* End dot */}
          {visibleData.length > 0 && (
            <circle
              cx={x(visibleData.length - 1)}
              cy={y(visibleData[visibleData.length - 1])}
              r={4}
              fill="var(--color-accent)"
            />
          )}
        </g>
      </svg>
    );
  }, [visibleData]);

  const collapse = step.transits < 141 ? Math.round((1 - step.transits / 141) * 100) : 0;

  return (
    <div className="text-center">
      {/* Date */}
      <p className="font-mono text-[0.8125rem] font-bold tracking-[0.05em] text-ink-tertiary mb-2">
        {step.date}, 2026
      </p>

      {/* Transit number */}
      <p
        className="font-serif font-extralight tracking-[-0.06em] leading-[0.8] transition-all duration-700"
        style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          color: step.transits <= 10 ? 'var(--color-accent-warm)' : 'var(--color-ink)',
        }}
      >
        {step.transits}
      </p>
      <p className="font-sans text-[0.75rem] font-medium tracking-[0.08em] uppercase text-ink-tertiary mt-2">
        ships per day
      </p>

      {/* Collapse percentage */}
      {collapse > 0 && (
        <p className="mt-4 font-mono text-[0.8125rem] font-bold text-accent">
          &darr; {collapse}% from normal
        </p>
      )}

      {/* Mini chart */}
      <div className="mt-8 flex justify-center">
        {miniChart}
      </div>

      {/* Status */}
      <p className="mt-6 font-serif text-[0.9375rem] font-light italic text-ink-tertiary max-w-xs mx-auto">
        {step.status}
      </p>
    </div>
  );
}
