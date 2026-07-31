import { useState } from 'react';
import type { AggregatedEntry, Day, Draft, Exercise, LogEntry, WorkoutLogV2 } from '../../types';
import ProgressChart from './ProgressChart';
import SetLogger from './SetLogger';
import SupersetSetLogger from './SupersetSetLogger';
import styles from './ExerciseCard.module.css';

interface ExerciseCardProps {
  exercise: Exercise;
  exIdx: number;
  day: Day;
  expanded: boolean;
  onToggle: () => void;
  isSetDone: (exIdx: number, setIdx: number) => boolean;
  lastEntry: (exIdx: number, setIdx: number) => LogEntry | null;
  getDraft: (exIdx: number, setIdx: number) => Draft;
  updateDraft: (exIdx: number, setIdx: number, field: keyof Draft, value: string) => void;
  getMovDraft: (exIdx: number, setIdx: number, movIdx: number) => Draft;
  updateMovDraft: (exIdx: number, setIdx: number, movIdx: number, field: keyof Draft, value: string) => void;
  lastMovEntry: (exIdx: number, setIdx: number, movIdx: number) => LogEntry | null;
  logSet: (exIdx: number, setIdx: number) => void;
  uneditSet: (exIdx: number, setIdx: number) => void;
  log: WorkoutLogV2;
  movKey: (exIdx: number, setIdx: number, movIdx: number) => string;
  getLogEntry: (exIdx: number, setIdx: number) => LogEntry | undefined;
  getAggregatedHistory: (exIdx: number) => AggregatedEntry[];
  getMovAggregatedHistory: (exIdx: number, movIdx: number) => AggregatedEntry[];
}

export default function ExerciseCard({
  exercise: ex,
  exIdx,
  day,
  expanded,
  onToggle,
  isSetDone,
  lastEntry,
  getDraft,
  updateDraft,
  getMovDraft,
  updateMovDraft,
  lastMovEntry,
  logSet,
  uneditSet,
  log,
  movKey,
  getLogEntry,
  getAggregatedHistory,
  getMovAggregatedHistory,
}: ExerciseCardProps) {
  const [showProgress, setShowProgress] = useState(false);
  const allDone = Array.from({ length: ex.sets }, (_, i) => isSetDone(exIdx, i)).every(Boolean);

  return (
    <div
      className={styles.card}
      style={{
        background: expanded ? '#1a1a22' : undefined,
        borderColor: expanded ? `${day.color}55` : allDone ? `${day.color}44` : undefined,
      }}
    >
      <div className={styles.header} onClick={onToggle}>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            {allDone && <span className={styles.checkmark}>&#9989;</span>}
            <span className={styles.name}>{ex.name}</span>
            <span
              className={styles.muscle}
              style={{ background: `${day.color}22`, color: day.accent }}
            >
              {ex.muscle}
            </span>
          </div>
          <div className={styles.meta}>
            {ex.sets} sets &middot; {ex.reps} reps &middot; {ex.rest} rest
          </div>
        </div>
        <div className={styles.chevron}>{expanded ? '\u25b2' : '\u25bc'}</div>
      </div>

      {expanded && (
        <div className={styles.body}>
          <p className={styles.notes}>{ex.notes}</p>

          <div className={styles.logSection}>
            <div className={styles.logLabel}>Log Sets</div>
            <div className={styles.sets}>
              {Array.from({ length: ex.sets }, (_, setIdx) =>
                ex.movements ? (
                  <SupersetSetLogger
                    key={setIdx}
                    setIdx={setIdx}
                    movements={ex.movements}
                    done={isSetDone(exIdx, setIdx)}
                    drafts={ex.movements.map((_, mIdx) => getMovDraft(exIdx, setIdx, mIdx))}
                    lasts={ex.movements.map((_, mIdx) => lastMovEntry(exIdx, setIdx, mIdx))}
                    logEntries={ex.movements.map((_, mIdx) => {
                      const entries = log[movKey(exIdx, setIdx, mIdx)];
                      if (!entries || entries.length === 0) return undefined;
                      const last = entries[entries.length - 1];
                      return { weight: last.weight, reps: last.reps, date: '' };
                    })}
                    color={day.color}
                    accent={day.accent}
                    onUpdateMovDraft={(mIdx, field, value) =>
                      updateMovDraft(exIdx, setIdx, mIdx, field, value)
                    }
                    onLogSet={() => logSet(exIdx, setIdx)}
                    onEdit={() => uneditSet(exIdx, setIdx)}
                  />
                ) : (
                  <SetLogger
                    key={setIdx}
                    setIdx={setIdx}
                    done={isSetDone(exIdx, setIdx)}
                    last={lastEntry(exIdx, setIdx)}
                    draft={getDraft(exIdx, setIdx)}
                    color={day.color}
                    accent={day.accent}
                    logEntry={getLogEntry(exIdx, setIdx)}
                    onUpdateDraft={(field, value) => updateDraft(exIdx, setIdx, field, value)}
                    onLogSet={() => logSet(exIdx, setIdx)}
                    onEdit={() => uneditSet(exIdx, setIdx)}
                  />
                ),
              )}
            </div>
          </div>

          <button
            className={styles.progressBtn}
            style={{ color: day.accent, borderColor: `${day.color}44` }}
            onClick={() => setShowProgress(!showProgress)}
          >
            {showProgress ? 'Hide Progress' : 'View Progress'}
          </button>

          {showProgress && (
            <div className={styles.progressSection}>
              {ex.movements ? (
                ex.movements.map((mov, mIdx) => (
                  <ProgressChart
                    key={mIdx}
                    entries={getMovAggregatedHistory(exIdx, mIdx)}
                    color={day.color}
                    label={mov.name}
                    metric={mov.progressMetric ?? ex.progressMetric ?? 'volume'}
                  />
                ))
              ) : (
                <ProgressChart
                  entries={getAggregatedHistory(exIdx)}
                  color={day.color}
                  metric={ex.progressMetric ?? 'volume'}
                />
              )}
            </div>
          )}

          <a
            href={ex.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.videoLink}
            style={{ borderColor: `${day.color}44`, color: day.accent }}
          >
            &#9654; Watch Tutorial on YouTube
          </a>
        </div>
      )}
    </div>
  );
}
