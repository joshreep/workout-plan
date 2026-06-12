import type { HistoryEntry, WorkoutLog, WorkoutLogV2 } from '../types';

const STORAGE_KEY_V1 = 'workout-log-v1';
const STORAGE_KEY_V2 = 'workout-log-v2';
const MAX_HISTORY_PER_KEY = 52;

function loadV1(): WorkoutLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V1);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function parseV1Date(dateStr: string): string {
  const currentYear = new Date().getFullYear();
  const d = new Date(`${dateStr} ${currentYear}`);
  if (isNaN(d.getTime())) {
    return new Date().toISOString();
  }
  if (d.getTime() > Date.now()) {
    d.setFullYear(currentYear - 1);
  }
  return d.toISOString();
}

function migrateV1ToV2(): WorkoutLogV2 {
  const v1 = loadV1();
  const v2: WorkoutLogV2 = {};

  for (const [key, entry] of Object.entries(v1)) {
    v2[key] = [
      {
        weight: entry.weight,
        reps: entry.reps,
        timestamp: parseV1Date(entry.date),
      },
    ];
  }

  saveHistory(v2);
  return v2;
}

export function loadHistory(): WorkoutLogV2 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (raw) return JSON.parse(raw);
    return migrateV1ToV2();
  } catch {
    return {};
  }
}

export function saveHistory(log: WorkoutLogV2): void {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(log));
  } catch {
    // Storage full or unavailable
  }
}

export function appendEntry(
  log: WorkoutLogV2,
  key: string,
  entry: HistoryEntry,
): WorkoutLogV2 {
  const existing = log[key] ?? [];
  const updated = [...existing, entry];
  if (updated.length > MAX_HISTORY_PER_KEY) {
    updated.splice(0, updated.length - MAX_HISTORY_PER_KEY);
  }
  return { ...log, [key]: updated };
}

// Keep v1 exports for backwards compatibility with existing tests
export function loadLog(): WorkoutLog {
  return loadV1();
}

export function saveLog(log: WorkoutLog): void {
  try {
    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(log));
  } catch {
    // Storage full or unavailable
  }
}
