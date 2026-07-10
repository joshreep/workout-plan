import type { HistoryEntry, WorkoutLog, WorkoutLogV2 } from '../types';

const STORAGE_KEY_V1 = 'workout-log-v1';
const STORAGE_KEY_V2 = 'workout-log-v2';
const STORAGE_KEY_V3 = 'workout-log-v3';
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

function loadV2(): WorkoutLogV2 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (raw) return JSON.parse(raw);
    return migrateV1ToV2();
  } catch {
    return {};
  }
}

// Maps old V2 index-based keys ("dayId-exIdx-setIdx" or "dayId-exIdx-setIdx-movIdx")
// to new V3 exercise-ID-based keys ("exerciseId-setIdx" or "exerciseId-setIdx-movIdx").
// Encodes the old 5-day Push/Pull/Legs/Upper/Lower+Core structure.
const V2_TO_V3_KEY_MAP: Record<string, string> = {
  // Day 0 (PUSH): bench-press, db-shoulder-press, cable-lateral-raise, tricep-pushdown
  '0-0': 'bench-press',
  '0-1': 'db-shoulder-press',
  '0-2': 'cable-lateral-raise',
  '0-3': 'tricep-pushdown',
  // Day 1 (PULL): barbell-row, lat-pulldown, face-pulls, curl (as flat entry)
  '1-0': 'barbell-row',
  '1-1': 'lat-pulldown',
  '1-2': 'face-pulls',
  '1-3': 'curl-skull-crusher', // was flat curl, maps to superset exercise id
  // Day 2 (LEGS): back-squat, rdl, leg-press, seated-leg-curl
  '2-0': 'back-squat',
  '2-1': 'rdl',
  '2-2': 'leg-press',
  '2-3': 'seated-leg-curl',
  // Day 3 (UPPER): incline-db-press (removed), seated-cable-row (removed), pull-ups, curl+skull superset
  '3-2': 'pull-ups',
  '3-3': 'curl-skull-crusher',
  // Day 4 (SAT/LOWER+CORE): deadlift, bulgarian-split-squat, dead-bug-woodchop superset, calf-raise
  '4-0': 'deadlift',
  '4-1': 'bulgarian-split-squat',
  '4-2': 'dead-bug-woodchop',
  '4-3': 'calf-raise',
};

function migrateV2ToV3(v2: WorkoutLogV2): WorkoutLogV2 {
  const v3: WorkoutLogV2 = {};

  for (const [oldKey, entries] of Object.entries(v2)) {
    // Key formats: "dayId-exIdx-setIdx" or "dayId-exIdx-setIdx-movIdx"
    const parts = oldKey.split('-');
    if (parts.length < 3) continue;

    const [dayId, exIdx, setIdx, movIdx] = parts;
    const lookupKey = `${dayId}-${exIdx}`;
    const exerciseId = V2_TO_V3_KEY_MAP[lookupKey];
    if (!exerciseId) continue; // exercise was removed, drop its history

    const newKey = movIdx !== undefined
      ? `${exerciseId}-${setIdx}-${movIdx}`
      : `${exerciseId}-${setIdx}`;

    // Merge in case two old keys map to the same new key (e.g. day 1 curl and day 3 superset)
    const existing = v3[newKey] ?? [];
    const merged = [...existing, ...entries].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    if (merged.length > MAX_HISTORY_PER_KEY) {
      merged.splice(0, merged.length - MAX_HISTORY_PER_KEY);
    }
    v3[newKey] = merged;
  }

  saveHistoryV3(v3);
  return v3;
}

export function loadHistory(): WorkoutLogV2 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V3);
    if (raw) return JSON.parse(raw);
    return migrateV2ToV3(loadV2());
  } catch {
    return {};
  }
}

function saveHistoryV3(log: WorkoutLogV2): void {
  try {
    localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(log));
  } catch {
    // Storage full or unavailable
  }
}

export function saveHistory(log: WorkoutLogV2): void {
  saveHistoryV3(log);
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

export function replaceLastEntry(
  log: WorkoutLogV2,
  key: string,
  entry: HistoryEntry,
): WorkoutLogV2 {
  const existing = log[key] ?? [];
  if (existing.length === 0) return appendEntry(log, key, entry);
  return { ...log, [key]: [...existing.slice(0, -1), entry] };
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
