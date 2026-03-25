import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWorkoutLog } from '../useWorkoutLog';
import type { Day } from '../../types';

const mockDay: Day = {
  id: 0,
  label: 'MON',
  name: 'PUSH',
  subtitle: 'Test',
  color: '#E8533A',
  accent: '#ff7a5c',
  cardio: 'Test cardio',
  exercises: [
    {
      name: 'Bench Press',
      sets: 3,
      reps: '6-8',
      rest: '90 sec',
      muscle: 'Chest',
      notes: 'Test notes',
      videoUrl: 'https://example.com',
    },
  ],
};

describe('useWorkoutLog', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useWorkoutLog(0, mockDay));
    expect(result.current.progress).toBe(0);
    expect(result.current.doneSets).toBe(0);
    expect(result.current.totalSets).toBe(3);
    expect(result.current.storageReady).toBe(true);
  });

  it('reports no sets done initially', () => {
    const { result } = renderHook(() => useWorkoutLog(0, mockDay));
    expect(result.current.isSetDone(0, 0)).toBe(false);
    expect(result.current.isSetDone(0, 1)).toBe(false);
    expect(result.current.isSetDone(0, 2)).toBe(false);
  });

  it('returns null for last entry when no data', () => {
    const { result } = renderHook(() => useWorkoutLog(0, mockDay));
    expect(result.current.lastEntry(0, 0)).toBeNull();
  });

  it('returns empty draft by default', () => {
    const { result } = renderHook(() => useWorkoutLog(0, mockDay));
    expect(result.current.getDraft(0, 0)).toEqual({ weight: '', reps: '' });
  });

  it('updates draft values', () => {
    const { result } = renderHook(() => useWorkoutLog(0, mockDay));
    act(() => {
      result.current.updateDraft(0, 0, 'weight', '135');
    });
    expect(result.current.getDraft(0, 0).weight).toBe('135');
    expect(result.current.getDraft(0, 0).reps).toBe('');
  });

  it('logs a set and marks it complete', () => {
    const { result } = renderHook(() => useWorkoutLog(0, mockDay));

    act(() => {
      result.current.updateDraft(0, 0, 'weight', '135');
      result.current.updateDraft(0, 0, 'reps', '8');
    });

    act(() => {
      result.current.logSet(0, 0);
    });

    expect(result.current.isSetDone(0, 0)).toBe(true);
    expect(result.current.doneSets).toBe(1);
    expect(result.current.progress).toBe(33);
  });

  it('persists logged sets to localStorage', () => {
    const { result } = renderHook(() => useWorkoutLog(0, mockDay));

    act(() => {
      result.current.updateDraft(0, 0, 'weight', '135');
      result.current.updateDraft(0, 0, 'reps', '8');
    });

    act(() => {
      result.current.logSet(0, 0);
    });

    const stored = JSON.parse(localStorage.getItem('workout-log-v1')!);
    expect(stored['0-0-0']).toBeDefined();
    expect(stored['0-0-0'].weight).toBe('135');
    expect(stored['0-0-0'].reps).toBe('8');
  });

  it('does not log set when draft is empty', () => {
    const { result } = renderHook(() => useWorkoutLog(0, mockDay));

    act(() => {
      result.current.logSet(0, 0);
    });

    expect(result.current.isSetDone(0, 0)).toBe(false);
  });

  it('loads existing data from localStorage', () => {
    const existingData = { '0-0-0': { weight: '200', reps: '5', date: 'Mar 20' } };
    localStorage.setItem('workout-log-v1', JSON.stringify(existingData));

    const { result } = renderHook(() => useWorkoutLog(0, mockDay));
    expect(result.current.lastEntry(0, 0)).toEqual(existingData['0-0-0']);
  });
});
