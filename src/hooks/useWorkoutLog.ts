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

  const movKey = useCallback(
    (exIdx: number, setIdx: number, movIdx: number) => `${activeDay}-${exIdx}-${setIdx}-${movIdx}`,
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
    (exIdx: number, setIdx: number, movIdx: number) =>
      log[movKey(exIdx, setIdx, movIdx)] ?? log[setKey(exIdx, setIdx)] ?? null,
    [log, movKey, setKey],
  );

  const logSet = useCallback(
    (exIdx: number, setIdx: number) => {
      const ex = day.exercises[exIdx];
      const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (ex.movements) {
        const anyFilled = ex.movements.some((_, mIdx) => {
          const d = drafts[movKey(exIdx, setIdx, mIdx)];
          return d?.weight || d?.reps;
        });
        if (!anyFilled) return;
        const newLog = { ...log };
        ex.movements.forEach((_, mIdx) => {
          const k = movKey(exIdx, setIdx, mIdx);
          const draft = drafts[k] ?? { weight: '', reps: '' };
          newLog[k] = { weight: draft.weight || '', reps: draft.reps || '', date };
        });
        setLog(newLog);
        saveLog(newLog);
        setCompletedSets((prev) => ({ ...prev, [setKey(exIdx, setIdx)]: true }));
      } else {
        const k = setKey(exIdx, setIdx);
        const draft = drafts[k];
        if (!draft?.weight && !draft?.reps) return;
        const entry = { weight: draft.weight || '', reps: draft.reps || '', date };
        const newLog = { ...log, [k]: entry };
        setLog(newLog);
        saveLog(newLog);
        setCompletedSets((prev) => ({ ...prev, [k]: true }));
      }
    },
    [drafts, log, day.exercises, setKey, movKey],
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
  };
}
