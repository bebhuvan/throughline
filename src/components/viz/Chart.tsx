import { useRef, useState, useEffect, type ReactNode } from 'react';

interface ChartProps {
  title?: string;
  subtitle?: string;
  source?: string;
  sourceUrl?: string;
  width?: 'prose' | 'wide' | 'full';
  aspectRatio?: number;
  children: (dimensions: { width: number; height: number }) => ReactNode;
}

export function Chart({
  title,
  subtitle,
  source,
  sourceUrl,
  width = 'wide',
  aspectRatio = 0.56,
  children,
}: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      setDimensions({ width: w, height: Math.round(w * aspectRatio) });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [aspectRatio]);

  const containerClass =
    width === 'prose'
      ? 'container-prose'
      : width === 'full'
        ? 'container-full'
        : 'container-wide';

  return (
    <div className={`chart-container ${containerClass}`} role="figure" aria-label={title || 'Chart'}>
      {title && <div className="chart-title">{title}</div>}
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}

      <div ref={containerRef} className="w-full">
        {dimensions.width > 0 && children(dimensions)}
      </div>

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
