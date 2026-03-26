import type { Draft, LogEntry } from '../../types';
import styles from './SetLogger.module.css';

interface SetLoggerProps {
  setIdx: number;
  done: boolean;
  last: LogEntry | null;
  draft: Draft;
  color: string;
  accent: string;
  logEntry: LogEntry | undefined;
  onUpdateDraft: (field: keyof Draft, value: string) => void;
  onLogSet: () => void;
}

export default function SetLogger({
  setIdx,
  done,
  last,
  draft,
  color,
  accent,
  logEntry,
  onUpdateDraft,
  onLogSet,
}: SetLoggerProps) {
  return (
    <div
      className={styles.set}
      style={{
        background: done ? `${color}15` : undefined,
        borderColor: done ? `${color}55` : undefined,
      }}
    >
      <div className={styles.setHeader}>
        <span className={styles.setLabel} style={{ color: done ? accent : undefined }}>
          {done ? '\u2713 ' : ''}Set {setIdx + 1}
        </span>
        {last ? (
          <span className={styles.lastSession}>
            Last ({last.date}):{' '}
            <span className={styles.lastValue}>
              {last.weight ? `${last.weight} lbs` : ''}
              {last.weight && last.reps ? ' \u00d7 ' : ''}
              {last.reps ? `${last.reps} reps` : ''}
            </span>
          </span>
        ) : (
          <span className={styles.noData}>No previous data</span>
        )}
      </div>

      {!done && (
        <div className={styles.inputs}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Weight (lbs)</div>
            <input
              type="number"
              inputMode="decimal"
              placeholder={last?.weight || '0'}
              value={draft.weight}
              onChange={(e) => onUpdateDraft('weight', e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Reps Done</div>
            <input
              type="number"
              inputMode="numeric"
              placeholder={last?.reps || '0'}
              value={draft.reps}
              onChange={(e) => onUpdateDraft('reps', e.target.value)}
              className={styles.input}
            />
          </div>
          <button
            onClick={onLogSet}
            className={styles.confirmBtn}
            style={{ background: color, boxShadow: `0 2px 12px ${color}66` }}
          >
            &#10003;
          </button>
        </div>
      )}

      {done && logEntry && (
        <div className={styles.completed} style={{ color: accent }}>
          {logEntry.weight ? `${logEntry.weight} lbs` : ''}
          {logEntry.weight && logEntry.reps ? ' \u00d7 ' : ''}
          {logEntry.reps ? `${logEntry.reps} reps` : ''}
          <span className={styles.loggedLabel}>logged &#10003;</span>
        </div>
      )}
    </div>
  );
}
