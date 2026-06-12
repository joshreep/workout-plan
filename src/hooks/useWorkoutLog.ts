import { useCallback, useEffect, useState } from 'react';
import { appendEntry, loadHistory, saveHistory } from '../lib/storage';
import type { Day, Draft, HistoryEntry, LogEntry, WorkoutLogV2 } from '../types';

function historyToLogEntry(entry: HistoryEntry): LogEntry {
  const d = new Date(entry.timestamp);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { weight: entry.weight, reps: entry.reps, date };
}

export function useWorkoutLog(activeDay: number, day: Day) {
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<WorkoutLogV2>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    setLog(loadHistory());
    setStorageReady(true);
  }, []);

  const setKey = useCallback(
    (exIdx: number, setIdx: number) => `${activeDay}-${exIdx}-${setIdx}`,
    [activeDay],
  );

  const movKey = useCallback(
    (exIdx: number, setIdx: number, movIdx: number) => `${activeDay}-${exIdx}-${setIdx}-${movIdx}`,
    [activeDay],
  );

  const isSetDone = useCallback(
    (exIdx: number, setIdx: number) => !!completedSets[setKey(exIdx, setIdx)],
    [completedSets, setKey],
  );

  const lastEntry = useCallback(
    (exIdx: number, setIdx: number): LogEntry | null => {
      const entries = log[setKey(exIdx, setIdx)];
      if (!entries || entries.length === 0) return null;
      return historyToLogEntry(entries[entries.length - 1]);
    },
    [log, setKey],
  );

  const getDraft = useCallback(
    (exIdx: number, setIdx: number): Draft =>
      drafts[setKey(exIdx, setIdx)] ?? { weight: '', reps: '' },
    [drafts, setKey],
  );

  const updateDraft = useCallback(
    (exIdx: number, setIdx: number, field: keyof Draft, value: string) => {
      const k = setKey(exIdx, setIdx);
      setDrafts((prev) => ({
        ...prev,
        [k]: { weight: prev[k]?.weight ?? '', reps: prev[k]?.reps ?? '', [field]: value },
      }));
    },
    [setKey],
  );

  const getMovDraft = useCallback(
    (exIdx: number, setIdx: number, movIdx: number): Draft =>
      drafts[movKey(exIdx, setIdx, movIdx)] ?? { weight: '', reps: '' },
    [drafts, movKey],
  );

  const updateMovDraft = useCallback(
    (exIdx: number, setIdx: number, movIdx: number, field: keyof Draft, value: string) => {
      const k = movKey(exIdx, setIdx, movIdx);
      setDrafts((prev) => ({
        ...prev,
        [k]: { weight: prev[k]?.weight ?? '', reps: prev[k]?.reps ?? '', [field]: value },
      }));
    },
    [movKey],
  );

  const lastMovEntry = useCallback(
    (exIdx: number, setIdx: number, movIdx: number): LogEntry | null => {
      const movEntries = log[movKey(exIdx, setIdx, movIdx)];
      if (movEntries && movEntries.length > 0) {
        return historyToLogEntry(movEntries[movEntries.length - 1]);
      }
      const flatEntries = log[setKey(exIdx, setIdx)];
      if (flatEntries && flatEntries.length > 0) {
        return historyToLogEntry(flatEntries[flatEntries.length - 1]);
      }
      return null;
    },
    [log, movKey, setKey],
  );

  const logSet = useCallback(
    (exIdx: number, setIdx: number) => {
      const ex = day.exercises[exIdx];
      const timestamp = new Date().toISOString();
      if (ex.movements) {
        const anyFilled = ex.movements.some((_, mIdx) => {
          const d = drafts[movKey(exIdx, setIdx, mIdx)];
          return d?.weight || d?.reps;
        });
        if (!anyFilled) return;
        let newLog = { ...log };
        ex.movements.forEach((_, mIdx) => {
          const k = movKey(exIdx, setIdx, mIdx);
          const draft = drafts[k] ?? { weight: '', reps: '' };
          const entry: HistoryEntry = {
            weight: draft.weight || '',
            reps: draft.reps || '',
            timestamp,
          };
          newLog = appendEntry(newLog, k, entry);
        });
        setLog(newLog);
        saveHistory(newLog);
        setCompletedSets((prev) => ({ ...prev, [setKey(exIdx, setIdx)]: true }));
      } else {
        const k = setKey(exIdx, setIdx);
        const draft = drafts[k];
        if (!draft?.weight && !draft?.reps) return;
        const entry: HistoryEntry = {
          weight: draft.weight || '',
          reps: draft.reps || '',
          timestamp,
        };
        const newLog = appendEntry(log, k, entry);
        setLog(newLog);
        saveHistory(newLog);
        setCompletedSets((prev) => ({ ...prev, [k]: true }));
      }
    },
    [drafts, log, day.exercises, setKey, movKey],
  );

  const getHistory = useCallback(
    (exIdx: number, setIdx = 0): HistoryEntry[] => {
      return log[setKey(exIdx, setIdx)] ?? [];
    },
    [log, setKey],
  );

  const getMovHistory = useCallback(
    (exIdx: number, setIdx: number, movIdx: number): HistoryEntry[] => {
      return log[movKey(exIdx, setIdx, movIdx)] ?? [];
    },
    [log, movKey],
  );

  const totalSets = day.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const doneSets = day.exercises.reduce(
    (acc, ex, exIdx) =>
      acc +
      Array.from({ length: ex.sets }, (_, i) => (isSetDone(exIdx, i) ? 1 : 0)).reduce<number>(
        (a, b) => a + b,
        0,
      ),
    0,
  );
  const progress = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  return {
    storageReady,
    log,
    completedSets,
    isSetDone,
    lastEntry,
    getDraft,
    updateDraft,
    getMovDraft,
    updateMovDraft,
    lastMovEntry,
    logSet,
    totalSets,
    doneSets,
    progress,
    setKey,
    movKey,
    getHistory,
    getMovHistory,
  };
}
