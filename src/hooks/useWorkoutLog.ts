import { useCallback, useEffect, useState } from 'react';
import { loadLog, saveLog } from '../lib/storage';
import type { Day, Draft, WorkoutLog } from '../types';

export function useWorkoutLog(activeDay: number, day: Day) {
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<WorkoutLog>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    setLog(loadLog());
    setStorageReady(true);
  }, []);

  const setKey = useCallback(
    (exIdx: number, setIdx: number) => `${activeDay}-${exIdx}-${setIdx}`,
    [activeDay],
  );

  const isSetDone = useCallback(
    (exIdx: number, setIdx: number) => !!completedSets[setKey(exIdx, setIdx)],
    [completedSets, setKey],
  );

  const lastEntry = useCallback(
    (exIdx: number, setIdx: number) => log[setKey(exIdx, setIdx)] ?? null,
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

  const logSet = useCallback(
    (exIdx: number, setIdx: number) => {
      const k = setKey(exIdx, setIdx);
      const draft = drafts[k];
      if (!draft?.weight && !draft?.reps) return;
      const entry = {
        weight: draft.weight || '',
        reps: draft.reps || '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
      const newLog = { ...log, [k]: entry };
      setLog(newLog);
      saveLog(newLog);
      setCompletedSets((prev) => ({ ...prev, [k]: true }));
    },
    [drafts, log, setKey],
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
    logSet,
    totalSets,
    doneSets,
    progress,
    setKey,
  };
}
