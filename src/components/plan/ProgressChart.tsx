import { useState } from 'react';
import type { AggregatedEntry } from '../../types';
import styles from './ProgressChart.module.css';

interface ProgressChartProps {
  entries: AggregatedEntry[];
  color: string;
  label?: string;
  metric?: 'volume' | 'e1rm' | 'reps';
}

export default function ProgressChart({ entries, color, label, metric = 'volume' }: ProgressChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (entries.length < 2) {
    return (
      <div className={styles.container}>
        {label && <div className={styles.label}>{label}</div>}
        <div className={styles.placeholder}>Not enough data yet</div>
      </div>
    );
  }

  const values = entries.map((e) => e.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const padding = { top: 20, right: 16, bottom: 28, left: 48 };
  const width = 300;
  const height = 100;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = entries.map((_, i) => {
    const x = padding.left + (i / (entries.length - 1)) * chartW;
    const y = padding.top + chartH - ((values[i] - minV) / range) * chartH;
    return { x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatValue = (v: number) => {
    if (metric === 'e1rm') return `~${v} lbs (e1RM)`;
    if (metric === 'reps') return `${v} reps total`;
    return `${v.toLocaleString()} lbs total`;
  };

  const formatAxisLabel = (v: number) => {
    if (metric === 'volume' && v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    if (metric === 'reps') return `${v}r`;
    return String(v);
  };

  const activeEntry = activeIdx !== null ? entries[activeIdx] : null;

  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.svg}
        onMouseLeave={() => setActiveIdx(null)}
        onTouchEnd={() => setActiveIdx(null)}
      >
        {/* Y-axis labels */}
        <text x={padding.left - 4} y={padding.top + 4} className={styles.axisLabel} textAnchor="end">
          {formatAxisLabel(maxV)}
        </text>
        <text x={padding.left - 4} y={padding.top + chartH + 4} className={styles.axisLabel} textAnchor="end">
          {formatAxisLabel(minV)}
        </text>

        {/* X-axis labels (first and last) */}
        <text x={padding.left} y={height - 4} className={styles.axisLabel} textAnchor="start">
          {formatDate(entries[0].timestamp)}
        </text>
        <text x={width - padding.right} y={height - 4} className={styles.axisLabel} textAnchor="end">
          {formatDate(entries[entries.length - 1].timestamp)}
        </text>

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={activeIdx === i ? 5 : 3}
            fill={color}
            stroke="#16161c"
            strokeWidth="1.5"
            onMouseEnter={() => setActiveIdx(i)}
            onTouchStart={() => setActiveIdx(i)}
            className={styles.dot}
          />
        ))}
      </svg>

      {activeEntry && (
        <div className={styles.tooltip} style={{ borderColor: `${color}66` }}>
          {formatDate(activeEntry.timestamp)} &mdash; {formatValue(activeEntry.value)}
        </div>
      )}
    </div>
  );
}
