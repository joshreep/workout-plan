import type { Day, Draft, Exercise, LogEntry } from '../../types';
import SetLogger from './SetLogger';
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
  logSet: (exIdx: number, setIdx: number) => void;
  getLogEntry: (exIdx: number, setIdx: number) => LogEntry | undefined;
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
  logSet,
  getLogEntry,
}: ExerciseCardProps) {
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
              {Array.from({ length: ex.sets }, (_, setIdx) => (
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
                />
              ))}
            </div>
          </div>

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
