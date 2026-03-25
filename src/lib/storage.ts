import type { WorkoutLog } from '../types';

const STORAGE_KEY = 'workout-log-v1';

export function loadLog(): WorkoutLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLog(log: WorkoutLog): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    // Storage full or unavailable — fail silently
  }
}
