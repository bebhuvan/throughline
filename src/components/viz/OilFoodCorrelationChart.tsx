import * as d3 from 'd3';
import { Chart } from './Chart';

interface DataPoint {
  year: number;
  oil: number;
  food: number;
}

const DATA: DataPoint[] = [
  { year: 1990, oil: 24, food: 80 },
  { year: 1995, oil: 17, food: 85 },
  { year: 2000, oil: 28, food: 80 },
  { year: 2003, oil: 31, food: 85 },
  { year: 2005, oil: 55, food: 95 },
  { year: 2007, oil: 72, food: 130 },
  { year: 2008, oil: 97, food: 165 },
  { year: 2009, oil: 62, food: 130 },
  { year: 2010, oil: 80, food: 145 },
  { year: 2011, oil: 111, food: 170 },
  { year: 2012, oil: 112, food: 165 },
  { year: 2014, oil: 99, food: 150 },
  { year: 2015, oil: 52, food: 130 },
  { year: 2016, oil: 44, food: 125 },
  { year: 2018, oil: 71, food: 130 },
  { year: 2020, oil: 42, food: 135 },
  { year: 2021, oil: 71, food: 160 },
  { year: 2022, oil: 99, food: 180 },
  { year: 2023, oil: 82, food: 155 },
  { year: 2024, oil: 80, food: 145 },
  { year: 2025, oil: 72, food: 140 },
  { year: 2026, oil: 126, food: 155 },
];

export function OilFoodCorrelationChart() {
  const margin = { top: 16, right: 72, bottom: 40, left: 56 };

  return (
    <Chart
      title="When oil spikes, food follows"
      subtitle="Brent crude oil price ($/barrel) vs FAO Food Price Index, 1990-2026"
      source="FAO; U.S. EIA"
      width="wide"
      aspectRatio={0.45}
    >
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const x = d3.scaleLinear()
          .domain([1990, 2026])
          .range([0, innerW]);

        const yOil = d3.scaleLinear()
          .domain([0, 140])
          .range([innerH, 0]);

        const yFood = d3.scaleLinear()
          .domain([60, 200])
          .range([innerH, 0]);

        const oilLine = d3.line<DataPoint>()
          .x(d => x(d.year))
          .y(d => yOil(d.oil))
          .curve(d3.curveMonotoneX);

        const foodLine = d3.line<DataPoint>()
          .x(d => x(d.year))
          .y(d => yFood(d.food))
          .curve(d3.curveMonotoneX);

        // Crisis zone for 2026
        const crisisX = x(2025.5);
        const crisisW = x(2026) - x(2025.5);

        // Annotation positions
        const ann2008 = DATA.find(d => d.year === 2008)!;
        const ann2022 = DATA.find(d => d.year === 2022)!;
        const ann2026 = DATA.find(d => d.year === 2026)!;

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {yOil.ticks(5).map(tick => (
                <line key={tick} x1={0} x2={innerW} y1={yOil(tick)} y2={yOil(tick)} stroke="var(--color-rule-light)" />
              ))}

              {/* Crisis zone shading for 2026 */}
              <rect
                x={crisisX} y={0} width={crisisW + 4} height={innerH}
                fill="var(--color-accent)" opacity={0.08}
              />

              {/* Oil area fill */}
              <path
                d={`${oilLine(DATA) ?? ''} L${x(2026)},${innerH} L${x(1990)},${innerH} Z`}
                fill="var(--color-accent)"
                opacity={0.06}
              />

              {/* Oil line */}
              <path
                d={oilLine(DATA) ?? ''}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Food area fill */}
              <path
                d={`${foodLine(DATA) ?? ''} L${x(2026)},${innerH} L${x(1990)},${innerH} Z`}
                fill="var(--color-viz-green)"
                opacity={0.05}
              />

              {/* Food line */}
              <path
                d={foodLine(DATA) ?? ''}
                fill="none"
                stroke="var(--color-viz-green)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points on key moments */}
              <circle cx={x(2008)} cy={yOil(97)} r={4} fill="var(--color-accent)" />
              <circle cx={x(2022)} cy={yOil(99)} r={4} fill="var(--color-accent)" />
              <circle cx={x(2026)} cy={yOil(126)} r={5} fill="var(--color-accent)" />

              {/* End labels */}
              <text
                x={innerW + 8} y={yOil(ann2026.oil)}
                dominantBaseline="central"
                fill="var(--color-accent)"
                fontFamily="var(--font-sans)" fontSize={12} fontWeight={700}
              >
                Oil
              </text>
              <text
                x={innerW + 8} y={yFood(ann2026.food)}
                dominantBaseline="central"
                fill="var(--color-viz-green)"
                fontFamily="var(--font-sans)" fontSize={12} fontWeight={700}
              >
                Food
              </text>

              {/* Annotation: 2008 food crisis */}
              <line
                x1={x(2008)} x2={x(2008)} y1={yOil(ann2008.oil) - 8} y2={yOil(ann2008.oil) - 36}
                stroke="var(--color-ink-tertiary)" strokeWidth={1}
              />
              <text
                x={x(2008)} y={yOil(ann2008.oil) - 40}
                textAnchor="middle" fontSize={11}
                fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-ink-secondary)"
              >
                2008 food crisis
              </text>

              {/* Annotation: Ukraine war 2022 */}
              <line
                x1={x(2022)} x2={x(2022)} y1={yFood(ann2022.food) - 8} y2={yFood(ann2022.food) - 36}
                stroke="var(--color-ink-tertiary)" strokeWidth={1}
              />
              <text
                x={x(2022)} y={yFood(ann2022.food) - 40}
                textAnchor="middle" fontSize={11}
                fontFamily="var(--font-sans)" fontWeight={600}
                fill="var(--color-ink-secondary)"
              >
                Ukraine war
              </text>

              {/* Annotation: Hormuz 2026 */}
              <line
                x1={x(2026)} x2={x(2026)} y1={yOil(ann2026.oil) - 8} y2={yOil(ann2026.oil) - 36}
                stroke="var(--color-accent)" strokeWidth={1.5}
              />
              <text
                x={x(2026)} y={yOil(ann2026.oil) - 40}
                textAnchor="end" fontSize={11}
                fontFamily="var(--font-sans)" fontWeight={700}
                fill="var(--color-accent)"
              >
                Hormuz
              </text>

              {/* X axis */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
              {d3.range(1990, 2027, 5).map(tick => (
                <text
                  key={tick} x={x(tick)} y={innerH + 24}
                  textAnchor="middle" fontSize={11}
                  fontFamily="var(--font-mono)"
                  fill="var(--color-ink-tertiary)"
                >
                  {tick}
                </text>
              ))}

              {/* Left Y axis: Oil price */}
              {yOil.ticks(5).map(tick => (
                <text
                  key={`oil-${tick}`} x={-8} y={yOil(tick)}
                  textAnchor="end" dominantBaseline="central"
                  fontSize={11} fontFamily="var(--font-mono)"
                  fill="var(--color-ink-tertiary)"
                >
                  ${tick}
                </text>
              ))}
              <text
                x={-8} y={-8}
                textAnchor="end" fontSize={12}
                fontFamily="var(--font-sans)"
                fill="var(--color-accent)" fontWeight={600}
              >
                Oil ($/barrel)
              </text>

              {/* Right Y axis: Food index */}
              {yFood.ticks(5).map(tick => (
                <text
                  key={`food-${tick}`} x={innerW + 8} y={yFood(tick)}
                  textAnchor="start" dominantBaseline="central"
                  fontSize={11} fontFamily="var(--font-mono)"
                  fill="var(--color-ink-tertiary)"
                >
                  {tick}
                </text>
              ))}
              <text
                x={innerW + 8} y={-8}
                textAnchor="start" fontSize={12}
                fontFamily="var(--font-sans)"
                fill="var(--color-viz-green)" fontWeight={600}
              >
                Food Price Index
              </text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
