import { useRef, useEffect, type CSSProperties } from 'react';
import * as Plot from '@observablehq/plot';

interface PlotChartProps {
  spec: Plot.PlotOptions;
  title?: string;
  subtitle?: string;
  source?: string;
  sourceUrl?: string;
  className?: string;
  style?: CSSProperties;
}

export function PlotChart({ spec, title, subtitle, source, sourceUrl, className, style }: PlotChartProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const plot = Plot.plot({
      ...spec,
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--color-ink-secondary)',
        background: 'transparent',
        ...spec.style,
      },
    });
    ref.current.replaceChildren(plot);
    return () => plot.remove();
  }, [spec]);

  return (
    <div className={`chart-container ${className || ''}`} style={style}>
      {title && <div className="chart-title">{title}</div>}
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
      <div ref={ref} />
      {source && (
        <div className="chart-source">
          Source:{' '}
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {source}
            </a>
          ) : (
            source
          )}
        </div>
      )}
    </div>
  );
}
