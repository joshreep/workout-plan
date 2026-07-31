import { useState } from 'react';
import { days } from '../../data/exercises';
import type { AggregatedEntry, BodyweightEntry, Day } from '../../types';
import DaySelector from '../plan/DaySelector';
import ProgressChart from '../plan/ProgressChart';
import styles from './ProgressTab.module.css';

interface ProgressTabProps {
  activeDay: number;
  onDayChange: (dayIdx: number) => void;
  getAggregatedHistory: (exIdx: number) => AggregatedEntry[];
  getMovAggregatedHistory: (exIdx: number, movIdx: number) => AggregatedEntry[];
  bodyweight: number | null;
  bodyweightHistory: BodyweightEntry[];
  onLogBodyweight: (weight: number) => void;
}

export default function ProgressTab({
  activeDay,
  onDayChange,
  getAggregatedHistory,
  getMovAggregatedHistory,
  bodyweight,
  bodyweightHistory,
  onLogBodyweight,
}: ProgressTabProps) {
  const day: Day = days[activeDay];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px' }}>
      <BodyweightCard
        bodyweight={bodyweight}
        history={bodyweightHistory}
        onLog={onLogBodyweight}
      />

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
                <div key={mIdx}>
                  <ProgressChart
                    entries={getMovAggregatedHistory(exIdx, mIdx)}
                    color={day.color}
                    label={mov.name}
                    metric={mov.progressMetric ?? ex.progressMetric ?? 'volume'}
                  />
                  <RecentEntries
                    entries={getMovAggregatedHistory(exIdx, mIdx)}
                    metric={mov.progressMetric ?? ex.progressMetric ?? 'volume'}
                  />
                </div>
              ))
            ) : (
              <>
                <ProgressChart
                  entries={getAggregatedHistory(exIdx)}
                  color={day.color}
                  metric={ex.progressMetric ?? 'volume'}
                />
                <RecentEntries
                  entries={getAggregatedHistory(exIdx)}
                  metric={ex.progressMetric ?? 'volume'}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BodyweightCard({
  bodyweight,
  history,
  onLog,
}: {
  bodyweight: number | null;
  history: BodyweightEntry[];
  onLog: (weight: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const handleSubmit = () => {
    const val = parseFloat(draft);
    if (val > 0) {
      onLog(val);
      setDraft('');
      setEditing(false);
    }
  };

  const chartEntries: AggregatedEntry[] = history.map((e) => ({
    timestamp: e.timestamp,
    value: e.weight,
  }));

  return (
    <div className={styles.bwCard}>
      <div className={styles.bwHeader}>
        <span className={styles.bwLabel}>Body Weight</span>
        {!editing && (
          <button className={styles.bwEditBtn} onClick={() => { setDraft(bodyweight ? String(bodyweight) : ''); setEditing(true); }}>
            {bodyweight ? `${bodyweight} lbs` : 'Set weight'} ✏️
          </button>
        )}
        {editing && (
          <div className={styles.bwInputRow}>
            <input
              className={styles.bwInput}
              type="number"
              inputMode="decimal"
              placeholder="lbs"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') setEditing(false); }}
              autoFocus
            />
            <button className={styles.bwSaveBtn} onClick={handleSubmit}>Log</button>
            <button className={styles.bwCancelBtn} onClick={() => setEditing(false)}>✕</button>
          </div>
        )}
      </div>
      {chartEntries.length >= 2 && (
        <ProgressChart
          entries={chartEntries}
          color="#888"
          metric="volume"
          label=""
        />
      )}
      {chartEntries.length > 0 && chartEntries.length < 2 && (
        <div className={styles.bwHint}>Log again next week to see your trend</div>
      )}
    </div>
  );
}

function RecentEntries({ entries, metric }: { entries: AggregatedEntry[]; metric: 'volume' | 'e1rm' | 'reps' }) {
  const recent = entries.slice(-5).reverse();
  if (recent.length === 0) return null;

  const formatValue = (v: number) => {
    if (metric === 'e1rm') return `~${v} lbs (e1RM)`;
    if (metric === 'reps') return `${v} reps total`;
    return `${v.toLocaleString()} lbs total`;
  };

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
