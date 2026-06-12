import { days } from '../../data/exercises';
import type { Day, HistoryEntry } from '../../types';
import DaySelector from '../plan/DaySelector';
import ProgressChart from '../plan/ProgressChart';
import styles from './ProgressTab.module.css';

interface ProgressTabProps {
  activeDay: number;
  onDayChange: (dayIdx: number) => void;
  getHistory: (exIdx: number, setIdx?: number) => HistoryEntry[];
  getMovHistory: (exIdx: number, setIdx: number, movIdx: number) => HistoryEntry[];
}

export default function ProgressTab({
  activeDay,
  onDayChange,
  getHistory,
  getMovHistory,
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
                  entries={getMovHistory(exIdx, 0, mIdx)}
                  color={day.color}
                  label={mov.name}
                />
              ))
            ) : (
              <ProgressChart
                entries={getHistory(exIdx, 0)}
                color={day.color}
              />
            )}
            <RecentEntries entries={ex.movements
              ? getMovHistory(exIdx, 0, 0)
              : getHistory(exIdx, 0)
            } />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentEntries({ entries }: { entries: HistoryEntry[] }) {
  const recent = entries.slice(-5).reverse();
  if (recent.length === 0) return null;

  return (
    <div className={styles.recentList}>
      {recent.map((entry, i) => {
        const d = new Date(entry.timestamp);
        const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return (
          <div key={i} className={styles.recentRow}>
            <span className={styles.recentDate}>{date}</span>
            <span className={styles.recentValue}>
              {entry.weight ? `${entry.weight} lbs` : ''}
              {entry.weight && entry.reps ? ' × ' : ''}
              {entry.reps ? `${entry.reps} reps` : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
