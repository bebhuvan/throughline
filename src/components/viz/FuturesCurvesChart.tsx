import * as d3 from 'd3';
import { Chart } from './Chart';

interface DataPoint {
  year: number;
  oil: number;
  gas: number;
}

const DATA: DataPoint[] = [
  { year: 2026, oil: 115, gas: 18 },
  { year: 2027, oil: 104, gas: 16 },
  { year: 2028, oil: 88, gas: 14 },
  { year: 2029, oil: 78, gas: 12.5 },
  { year: 2030, oil: 71, gas: 11 },
];

const PREWAR = { oil: 72, gas: 12 };

export function FuturesCurvesChart() {
  const margin = { top: 16, right: 100, bottom: 56, left: 56 };

  return (
    <Chart
      title="Markets expect years of elevated prices"
      subtitle="Brent crude and European TTF natural gas futures curves as of March 20, 2026"
      source="JP Morgan, March 2026"
      width="wide"
      aspectRatio={0.45}
    >
      {({ width: w, height: h }) => {
        const innerW = w - margin.left - margin.right;
        const innerH = h - margin.top - margin.bottom;

        const x = d3.scaleLinear()
          .domain([2026, 2030])
          .range([0, innerW]);

        const yOil = d3.scaleLinear()
          .domain([60, 120])
          .range([innerH, 0]);

        const yGas = d3.scaleLinear()
          .domain([8, 22])
          .range([innerH, 0]);

        const oilLine = d3.line<DataPoint>()
          .x(d => x(d.year))
          .y(d => yOil(d.oil))
          .curve(d3.curveMonotoneX);

        const gasLine = d3.line<DataPoint>()
          .x(d => x(d.year))
          .y(d => yGas(d.gas))
          .curve(d3.curveMonotoneX);

        const lastPoint = DATA[DATA.length - 1]!;

        return (
          <svg width={w} height={h} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid lines */}
              {yOil.ticks(5).map(tick => (
                <line key={tick} x1={0} x2={innerW} y1={yOil(tick)} y2={yOil(tick)} stroke="var(--color-rule-light)" />
              ))}

              {/* Pre-war oil reference line */}
              <line
                x1={0} x2={innerW}
                y1={yOil(PREWAR.oil)} y2={yOil(PREWAR.oil)}
                stroke="var(--color-accent)" strokeWidth={1.5}
                strokeDasharray="6 4" opacity={0.4}
              />
              <text
                x={4} y={yOil(PREWAR.oil) - 8}
                dominantBaseline="auto" fontSize={12}
                fontFamily="var(--font-sans)" fontWeight={500}
                fill="var(--color-accent)" opacity={0.7}
              >
                Pre-war oil ${PREWAR.oil}
              </text>

              {/* Pre-war gas reference line */}
              <line
                x1={0} x2={innerW}
                y1={yGas(PREWAR.gas)} y2={yGas(PREWAR.gas)}
                stroke="var(--color-viz-blue)" strokeWidth={1.5}
                strokeDasharray="6 4" opacity={0.4}
              />
              <text
                x={4} y={yGas(PREWAR.gas) + 16}
                dominantBaseline="auto" fontSize={12}
                fontFamily="var(--font-sans)" fontWeight={500}
                fill="var(--color-viz-blue)" opacity={0.7}
              >
                Pre-war gas ${PREWAR.gas}
              </text>

              {/* Oil area fill */}
              <path
                d={`${oilLine(DATA) ?? ''} L${x(2030)},${innerH} L${x(2026)},${innerH} Z`}
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

              {/* Oil dots */}
              {DATA.map(d => (
                <circle
                  key={`oil-${d.year}`}
                  cx={x(d.year)} cy={yOil(d.oil)} r={4}
                  fill="var(--color-accent)"
                />
              ))}

              {/* Gas line */}
              <path
                d={gasLine(DATA) ?? ''}
                fill="none"
                stroke="var(--color-viz-blue)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Gas dots */}
              {DATA.map(d => (
                <circle
                  key={`gas-${d.year}`}
                  cx={x(d.year)} cy={yGas(d.gas)} r={4}
                  fill="var(--color-viz-blue)"
                />
              ))}

              {/* End labels for lines — offset to avoid overlap with right Y axis */}
              {(() => {
                const oilY = yOil(lastPoint.oil);
                const gasY = yGas(lastPoint.gas);
                // If labels are too close, push them apart
                const minGap = 18;
                let adjustedOilY = oilY;
                let adjustedGasY = gasY;
                if (Math.abs(oilY - gasY) < minGap) {
                  const mid = (oilY + gasY) / 2;
                  adjustedOilY = mid - minGap / 2;
                  adjustedGasY = mid + minGap / 2;
                }
                return (
                  <>
                    <text
                      x={innerW + 8} y={adjustedOilY}
                      dominantBaseline="central"
                      fill="var(--color-accent)"
                      fontFamily="var(--font-sans)" fontSize={12} fontWeight={700}
                    >
                      Oil ${lastPoint.oil}
                    </text>
                    <text
                      x={innerW + 8} y={adjustedGasY}
                      dominantBaseline="central"
                      fill="var(--color-viz-blue)"
                      fontFamily="var(--font-sans)" fontSize={12} fontWeight={700}
                    >
                      Gas ${lastPoint.gas}
                    </text>
                  </>
                );
              })()}

              {/* X axis */}
              <line y1={innerH} y2={innerH} x1={0} x2={innerW} stroke="var(--color-rule)" />
              {DATA.map(d => (
                <text
                  key={d.year} x={x(d.year)} y={innerH + 24}
                  textAnchor="middle" fontSize={11}
                  fontFamily="var(--font-mono)"
                  fill="var(--color-ink-tertiary)"
                >
                  {d.year}
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

              {/* Right Y axis: Gas label only — tick labels removed to avoid overlap with end labels */}
              <text
                x={innerW + 8} y={-8}
                textAnchor="start" fontSize={12}
                fontFamily="var(--font-sans)"
                fill="var(--color-viz-blue)" fontWeight={600}
              >
                Gas ($/MMBtu)
              </text>

              {/* Annotation */}
              <text
                x={innerW / 2} y={innerH + 44}
                textAnchor="middle" fontSize={12}
                fontFamily="var(--font-sans)" fontWeight={500}
                fill="var(--color-ink-secondary)"
              >
                Oil recovers faster than gas — LNG infrastructure damage lasts years
              </text>
            </g>
          </svg>
        );
      }}
    </Chart>
  );
}
