import { useCallback, useEffect, useState } from 'react';
import { appendEntry, replaceLastEntry, loadHistory, saveHistory } from '../lib/storage';
import type { AggregatedEntry, Day, Draft, HistoryEntry, LogEntry, WorkoutLogV2 } from '../types';

function historyToLogEntry(entry: HistoryEntry): LogEntry {
  const d = new Date(entry.timestamp);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { weight: entry.weight, reps: entry.reps, date };
}

function sessionKey(timestamp: string): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function epley(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

function aggregateEntries(
  entries: HistoryEntry[],
  metric: 'volume' | 'e1rm' | 'reps',
  bodyweight?: number | null,
  isBodyweight?: boolean,
): AggregatedEntry[] {
  // Group entries by calendar day
  const sessions = new Map<string, HistoryEntry[]>();
  for (const e of entries) {
    const key = sessionKey(e.timestamp);
    const group = sessions.get(key) ?? [];
    group.push(e);
    sessions.set(key, group);
  }

  const result: AggregatedEntry[] = [];
  for (const group of sessions.values()) {
    const timestamp = group[0].timestamp;
    let value: number;

    if (metric === 'reps') {
      value = group.reduce((sum, e) => sum + (parseInt(e.reps) || 0), 0);
    } else if (metric === 'e1rm') {
      value = Math.max(
        ...group.map((e) => {
          const addedWeight = parseFloat(e.weight) || 0;
          const load = isBodyweight ? (bodyweight ?? 0) + addedWeight : addedWeight;
          const r = parseInt(e.reps) || 0;
          return epley(load, r);
        }),
      );
    } else {
      value = group.reduce((sum, e) => {
        const addedWeight = parseFloat(e.weight) || 0;
        const load = isBodyweight ? (bodyweight ?? 0) + addedWeight : addedWeight;
        const r = parseInt(e.reps) || 0;
        return sum + load * r;
      }, 0);
    }
    result.push({ timestamp, value });
  }

  return result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function useWorkoutLog(day: Day, bodyweight?: number | null) {
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [editingSets, setEditingSets] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<WorkoutLogV2>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    setLog(loadHistory());
    setStorageReady(true);
  }, []);

  // Reset completed and editing sets when the day changes
  useEffect(() => {
    setCompletedSets({});
    setEditingSets({});
  }, [day.id]);

  const setKey = useCallback(
    (exIdx: number, setIdx: number) => `${day.exercises[exIdx].id}-${setIdx}`,
    [day.exercises],
  );

  const movKey = useCallback(
    (exIdx: number, setIdx: number, movIdx: number) =>
      `${day.exercises[exIdx].id}-${setIdx}-${movIdx}`,
    [day.exercises],
  );

  const isSetDone = useCallback(
    (exIdx: number, setIdx: number) => !!completedSets[setKey(exIdx, setIdx)],
    [completedSets, setKey],
  );

  const isSetEditing = useCallback(
    (exIdx: number, setIdx: number) => !!editingSets[setKey(exIdx, setIdx)],
    [editingSets, setKey],
  );

  const uneditSet = useCallback(
    (exIdx: number, setIdx: number) => {
      const k = setKey(exIdx, setIdx);
      const ex = day.exercises[exIdx];
      // Pre-fill draft with the current last logged values so the user can tweak them
      if (ex.movements) {
        ex.movements.forEach((_, mIdx) => {
          const mk = movKey(exIdx, setIdx, mIdx);
          const entries = log[mk];
          if (entries && entries.length > 0) {
            const last = entries[entries.length - 1];
            setDrafts((prev) => ({ ...prev, [mk]: { weight: last.weight, reps: last.reps } }));
          }
        });
      } else {
        const entries = log[k];
        if (entries && entries.length > 0) {
          const last = entries[entries.length - 1];
          setDrafts((prev) => ({ ...prev, [k]: { weight: last.weight, reps: last.reps } }));
        }
      }
      setCompletedSets((prev) => ({ ...prev, [k]: false }));
      setEditingSets((prev) => ({ ...prev, [k]: true }));
    },
    [day.exercises, log, setKey, movKey],
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
      // Fallback to flat set key for data logged before per-movement tracking
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
      const sk = setKey(exIdx, setIdx);
      const isEditing = !!editingSets[sk];
      const timestamp = new Date().toISOString();
      const persist = isEditing ? replaceLastEntry : appendEntry;
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
          newLog = persist(newLog, k, entry);
        });
        setLog(newLog);
        saveHistory(newLog);
        setCompletedSets((prev) => ({ ...prev, [sk]: true }));
        setEditingSets((prev) => ({ ...prev, [sk]: false }));
      } else {
        const k = setKey(exIdx, setIdx);
        const draft = drafts[k];
        if (!draft?.weight && !draft?.reps) return;
        const entry: HistoryEntry = {
          weight: draft.weight || '',
          reps: draft.reps || '',
          timestamp,
        };
        const newLog = persist(log, k, entry);
        setLog(newLog);
        saveHistory(newLog);
        setCompletedSets((prev) => ({ ...prev, [k]: true }));
        setEditingSets((prev) => ({ ...prev, [k]: false }));
      }
    },
    [drafts, editingSets, log, day.exercises, setKey, movKey],
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

  const getAggregatedHistory = useCallback(
    (exIdx: number): AggregatedEntry[] => {
      const ex = day.exercises[exIdx];
      const metric = ex.progressMetric ?? 'volume';
      const allEntries: HistoryEntry[] = [];
      for (let s = 0; s < ex.sets; s++) {
        allEntries.push(...(log[setKey(exIdx, s)] ?? []));
      }
      return aggregateEntries(allEntries, metric, bodyweight, ex.isBodyweight);
    },
    [log, setKey, day.exercises, bodyweight],
  );

  const getMovAggregatedHistory = useCallback(
    (exIdx: number, movIdx: number): AggregatedEntry[] => {
      const ex = day.exercises[exIdx];
      const mov = ex.movements?.[movIdx];
      const metric = mov?.progressMetric ?? ex.progressMetric ?? 'volume';
      const isBodyweight = mov?.isBodyweight ?? ex.isBodyweight;
      const allEntries: HistoryEntry[] = [];
      for (let s = 0; s < ex.sets; s++) {
        allEntries.push(...(log[movKey(exIdx, s, movIdx)] ?? []));
      }
      return aggregateEntries(allEntries, metric, bodyweight, isBodyweight);
    },
    [log, movKey, day.exercises, bodyweight],
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
    isSetEditing,
    uneditSet,
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
    getAggregatedHistory,
    getMovAggregatedHistory,
  };
}
