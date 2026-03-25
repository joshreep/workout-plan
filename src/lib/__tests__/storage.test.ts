import { describe, it, expect, beforeEach } from 'vitest';
import { loadLog, saveLog } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadLog', () => {
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

  describe('saveLog', () => {
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
});
