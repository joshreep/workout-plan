import { days } from '../../data/exercises';
import type { AggregatedEntry, Day } from '../../types';
import DaySelector from '../plan/DaySelector';
import ProgressChart from '../plan/ProgressChart';
import styles from './ProgressTab.module.css';

interface ProgressTabProps {
  activeDay: number;
  onDayChange: (dayIdx: number) => void;
  getAggregatedHistory: (exIdx: number) => AggregatedEntry[];
  getMovAggregatedHistory: (exIdx: number, movIdx: number) => AggregatedEntry[];
}

export default function ProgressTab({
  activeDay,
  onDayChange,
  getAggregatedHistory,
  getMovAggregatedHistory,
}: ProgressTabProps) {
  const day: Day = days[activeDay];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px' }}>
      <DaySelector activeDay={activeDay} onDayChange={onDayChange} />

      <h2 className={styles.heading} style={{ color: day.accent }}>
        {day.name} Progress
      </h2>

      <div className={styles.exercises}>
        {day.exercises.map((ex, exIdx) => (
          <div key={exIdx} className={styles.exerciseBlock}>
            <div className={styles.exerciseName}>{ex.name}</div>
            {ex.movements ? (
              ex.movements.map((mov, mIdx) => (
                <ProgressChart
                  key={mIdx}
                  entries={getMovAggregatedHistory(exIdx, mIdx)}
                  color={day.color}
                  label={mov.name}
                  metric={ex.progressMetric ?? 'volume'}
                />
              ))
            ) : (
              <ProgressChart
                entries={getAggregatedHistory(exIdx)}
                color={day.color}
                metric={ex.progressMetric ?? 'volume'}
              />
            )}
            <RecentEntries
              entries={getAggregatedHistory(exIdx)}
              metric={ex.progressMetric ?? 'volume'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentEntries({ entries, metric }: { entries: AggregatedEntry[]; metric: 'volume' | 'e1rm' }) {
  const recent = entries.slice(-5).reverse();
  if (recent.length === 0) return null;

  const formatValue = (v: number) =>
    metric === 'e1rm' ? `~${v} lbs (e1RM)` : `${v.toLocaleString()} lbs total`;

  return (
    <div className={styles.recentList}>
      {recent.map((entry, i) => {
        const d = new Date(entry.timestamp);
        const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return (
          <div key={i} className={styles.recentRow}>
            <span className={styles.recentDate}>{date}</span>
            <span className={styles.recentValue}>{formatValue(entry.value)}</span>
          </div>
        );
      })}
    </div>
  );
}
