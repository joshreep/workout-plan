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

  describe('loadHistory (v3)', () => {
    it('returns empty object when no data exists', () => {
      expect(loadHistory()).toEqual({});
    });

    it('returns v3 data when it exists', () => {
      const data = { 'bench-press-0': [{ weight: '135', reps: '8', timestamp: '2026-06-01T10:00:00.000Z' }] };
      localStorage.setItem('workout-log-v3', JSON.stringify(data));
      expect(loadHistory()).toEqual(data);
    });

    it('migrates v2 data to v3 using exercise id map', () => {
      // Day 0, ex 0 = bench-press in the V2_TO_V3 map
      const v2 = { '0-0-0': [{ weight: '135', reps: '8', timestamp: '2026-03-10T10:00:00.000Z' }] };
      localStorage.setItem('workout-log-v2', JSON.stringify(v2));

      const result = loadHistory();
      expect(result['bench-press-0']).toHaveLength(1);
      expect(result['bench-press-0'][0].weight).toBe('135');
      expect(result['bench-press-0'][0].reps).toBe('8');
      expect(result['bench-press-0'][0].timestamp).toBeDefined();
    });

    it('drops v2 keys for removed exercises during migration', () => {
      // Day 3 ex 0 (incline db press) and ex 1 (seated cable row) were removed
      const v2 = {
        '3-0-0': [{ weight: '80', reps: '10', timestamp: '2026-03-10T10:00:00.000Z' }],
        '3-1-0': [{ weight: '100', reps: '10', timestamp: '2026-03-10T10:00:00.000Z' }],
      };
      localStorage.setItem('workout-log-v2', JSON.stringify(v2));

      const result = loadHistory();
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('does not re-migrate once v3 exists', () => {
      const v2 = { '0-0-0': [{ weight: '100', reps: '5', timestamp: '2026-03-09T10:00:00.000Z' }] };
      localStorage.setItem('workout-log-v2', JSON.stringify(v2));

      const v3 = { 'bench-press-0': [{ weight: '200', reps: '10', timestamp: '2026-06-10T10:00:00.000Z' }] };
      localStorage.setItem('workout-log-v3', JSON.stringify(v3));

      const result = loadHistory();
      expect(result['bench-press-0'][0].weight).toBe('200');
    });

    it('returns empty object on corrupted v3 data', () => {
      localStorage.setItem('workout-log-v3', 'not-json');
      expect(loadHistory()).toEqual({});
    });
  });

  describe('saveHistory', () => {
    it('persists to workout-log-v3 key', () => {
      const data = { 'bench-press-0': [{ weight: '135', reps: '8', timestamp: '2026-06-01T10:00:00.000Z' }] };
      saveHistory(data);
      expect(JSON.parse(localStorage.getItem('workout-log-v3')!)).toEqual(data);
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
