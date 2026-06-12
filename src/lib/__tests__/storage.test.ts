import { describe, it, expect, beforeEach } from 'vitest';
import { loadLog, saveLog, loadHistory, saveHistory, appendEntry } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadLog (v1 compat)', () => {
    it('returns empty object when no data exists', () => {
      expect(loadLog()).toEqual({});
    });

    it('returns parsed data from localStorage', () => {
      const data = { '0-0-0': { weight: '135', reps: '8', date: 'Mar 10' } };
      localStorage.setItem('workout-log-v1', JSON.stringify(data));
      expect(loadLog()).toEqual(data);
    });

    it('returns empty object on corrupted data', () => {
      localStorage.setItem('workout-log-v1', 'not-json');
      expect(loadLog()).toEqual({});
    });
  });

  describe('saveLog (v1 compat)', () => {
    it('persists log to localStorage', () => {
      const data = { '0-0-0': { weight: '135', reps: '8', date: 'Mar 10' } };
      saveLog(data);
      expect(JSON.parse(localStorage.getItem('workout-log-v1')!)).toEqual(data);
    });

    it('overwrites existing data', () => {
      saveLog({ '0-0-0': { weight: '100', reps: '5', date: 'Mar 9' } });
      const updated = { '0-0-0': { weight: '135', reps: '8', date: 'Mar 10' } };
      saveLog(updated);
      expect(JSON.parse(localStorage.getItem('workout-log-v1')!)).toEqual(updated);
    });
  });

  describe('loadHistory (v2)', () => {
    it('returns empty object when no v1 or v2 data exists', () => {
      expect(loadHistory()).toEqual({});
    });

    it('returns v2 data when it exists', () => {
      const data = { '0-0-0': [{ weight: '135', reps: '8', timestamp: '2026-06-01T10:00:00.000Z' }] };
      localStorage.setItem('workout-log-v2', JSON.stringify(data));
      expect(loadHistory()).toEqual(data);
    });

    it('migrates v1 data to v2 on first load', () => {
      const v1 = { '0-0-0': { weight: '135', reps: '8', date: 'Mar 10' } };
      localStorage.setItem('workout-log-v1', JSON.stringify(v1));

      const result = loadHistory();
      expect(result['0-0-0']).toHaveLength(1);
      expect(result['0-0-0'][0].weight).toBe('135');
      expect(result['0-0-0'][0].reps).toBe('8');
      expect(result['0-0-0'][0].timestamp).toBeDefined();
    });

    it('does not re-migrate once v2 exists', () => {
      const v1 = { '0-0-0': { weight: '100', reps: '5', date: 'Mar 9' } };
      localStorage.setItem('workout-log-v1', JSON.stringify(v1));

      const v2 = { '0-0-0': [{ weight: '200', reps: '10', timestamp: '2026-06-10T10:00:00.000Z' }] };
      localStorage.setItem('workout-log-v2', JSON.stringify(v2));

      const result = loadHistory();
      expect(result['0-0-0'][0].weight).toBe('200');
    });

    it('returns empty object on corrupted v2 data', () => {
      localStorage.setItem('workout-log-v2', 'not-json');
      expect(loadHistory()).toEqual({});
    });

    it('preserves v1 data after migration', () => {
      const v1 = { '0-0-0': { weight: '135', reps: '8', date: 'Mar 10' } };
      localStorage.setItem('workout-log-v1', JSON.stringify(v1));
      loadHistory();
      expect(JSON.parse(localStorage.getItem('workout-log-v1')!)).toEqual(v1);
    });
  });

  describe('saveHistory', () => {
    it('persists to workout-log-v2 key', () => {
      const data = { '0-0-0': [{ weight: '135', reps: '8', timestamp: '2026-06-01T10:00:00.000Z' }] };
      saveHistory(data);
      expect(JSON.parse(localStorage.getItem('workout-log-v2')!)).toEqual(data);
    });
  });

  describe('appendEntry', () => {
    it('adds entry to empty key', () => {
      const log = {};
      const entry = { weight: '135', reps: '8', timestamp: '2026-06-01T10:00:00.000Z' };
      const result = appendEntry(log, '0-0-0', entry);
      expect(result['0-0-0']).toEqual([entry]);
    });

    it('appends to existing entries', () => {
      const existing = { weight: '130', reps: '8', timestamp: '2026-05-25T10:00:00.000Z' };
      const log = { '0-0-0': [existing] };
      const entry = { weight: '135', reps: '8', timestamp: '2026-06-01T10:00:00.000Z' };
      const result = appendEntry(log, '0-0-0', entry);
      expect(result['0-0-0']).toEqual([existing, entry]);
    });

    it('caps at 52 entries', () => {
      const entries = Array.from({ length: 52 }, (_, i) => ({
        weight: String(100 + i),
        reps: '8',
        timestamp: `2026-01-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`,
      }));
      const log = { '0-0-0': entries };
      const newEntry = { weight: '200', reps: '10', timestamp: '2026-06-01T10:00:00.000Z' };
      const result = appendEntry(log, '0-0-0', newEntry);
      expect(result['0-0-0']).toHaveLength(52);
      expect(result['0-0-0'][51]).toEqual(newEntry);
      expect(result['0-0-0'][0].weight).toBe('101');
    });
  });
});
