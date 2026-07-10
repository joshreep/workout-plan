import type { Draft, LogEntry, Movement } from '../../types';
import setStyles from './SetLogger.module.css';
import styles from './SupersetSetLogger.module.css';

interface SupersetSetLoggerProps {
  setIdx: number;
  movements: Movement[];
  done: boolean;
  drafts: Draft[];
  lasts: (LogEntry | null)[];
  logEntries: (LogEntry | undefined)[];
  color: string;
  accent: string;
  onUpdateMovDraft: (movIdx: number, field: keyof Draft, value: string) => void;
  onLogSet: () => void;
  onEdit: () => void;
}

export default function SupersetSetLogger({
  setIdx,
  movements,
  done,
  drafts,
  lasts,
  logEntries,
  color,
  accent,
  onUpdateMovDraft,
  onLogSet,
  onEdit,
}: SupersetSetLoggerProps) {
  return (
    <div
      className={setStyles.set}
      style={{
        background: done ? `${color}15` : undefined,
        borderColor: done ? `${color}55` : undefined,
      }}
    >
      <div className={setStyles.setHeader}>
        <span className={setStyles.setLabel} style={{ color: done ? accent : undefined }}>
          {done ? '✓ ' : ''}Set {setIdx + 1}
        </span>
        {!done && (
          <button
            onClick={onLogSet}
            className={setStyles.confirmBtn}
            style={{ background: color, boxShadow: `0 2px 12px ${color}66` }}
          >
            &#10003;
          </button>
        )}
        {done && (
          <button className={setStyles.editBtn} onClick={onEdit} title="Edit this set">
            &#9998;
          </button>
        )}
      </div>

      <div className={styles.movements}>
        {movements.map((mov, mIdx) => {
          const last = lasts[mIdx];
          const draft = drafts[mIdx];
          const logEntry = logEntries[mIdx];

          return (
            <div key={mIdx} className={styles.movement}>
              <div className={styles.movHeader}>
                <span className={styles.movLabel}>
                  {mov.name}
                  <span className={styles.movReps}> ({mov.reps})</span>
                </span>
                {last ? (
                  <span className={setStyles.lastSession}>
                    Last ({last.date}):{' '}
                    <span className={setStyles.lastValue}>
                      {last.weight ? `${last.weight} lbs` : ''}
                      {last.weight && last.reps ? ' × ' : ''}
                      {last.reps ? `${last.reps} reps` : ''}
                    </span>
                  </span>
                ) : (
                  <span className={setStyles.noData}>No previous data</span>
                )}
              </div>

              {!done && (
                <div className={styles.movInputs}>
                  <div className={setStyles.field}>
                    <div className={setStyles.fieldLabel}>Weight (lbs)</div>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder={last?.weight || '0'}
                      value={draft.weight}
                      onChange={(e) => onUpdateMovDraft(mIdx, 'weight', e.target.value)}
                      className={setStyles.input}
                    />
                  </div>
                  <div className={setStyles.field}>
                    <div className={setStyles.fieldLabel}>Reps Done</div>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder={last?.reps || '0'}
                      value={draft.reps}
                      onChange={(e) => onUpdateMovDraft(mIdx, 'reps', e.target.value)}
                      className={setStyles.input}
                    />
                  </div>
                </div>
              )}

              {done && logEntry && (
                <div className={setStyles.completed} style={{ color: accent }}>
                  {logEntry.weight ? `${logEntry.weight} lbs` : ''}
                  {logEntry.weight && logEntry.reps ? ' × ' : ''}
                  {logEntry.reps ? `${logEntry.reps} reps` : ''}
                  <span className={setStyles.loggedLabel}>logged &#10003;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
