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
      id: 'bench-press',
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
    const { result } = renderHook(() => useWorkoutLog(mockDay));
    expect(result.current.progress).toBe(0);
    expect(result.current.doneSets).toBe(0);
    expect(result.current.totalSets).toBe(3);
    expect(result.current.storageReady).toBe(true);
  });

  it('reports no sets done initially', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));
    expect(result.current.isSetDone(0, 0)).toBe(false);
    expect(result.current.isSetDone(0, 1)).toBe(false);
    expect(result.current.isSetDone(0, 2)).toBe(false);
  });

  it('returns null for last entry when no data', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));
    expect(result.current.lastEntry(0, 0)).toBeNull();
  });

  it('returns empty draft by default', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));
    expect(result.current.getDraft(0, 0)).toEqual({ weight: '', reps: '' });
  });

  it('updates draft values', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));
    act(() => {
      result.current.updateDraft(0, 0, 'weight', '135');
    });
    expect(result.current.getDraft(0, 0).weight).toBe('135');
    expect(result.current.getDraft(0, 0).reps).toBe('');
  });

  it('logs a set and marks it complete', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));

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

  it('persists logged sets to localStorage v3 using exercise id', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));

    act(() => {
      result.current.updateDraft(0, 0, 'weight', '135');
      result.current.updateDraft(0, 0, 'reps', '8');
    });

    act(() => {
      result.current.logSet(0, 0);
    });

    const stored = JSON.parse(localStorage.getItem('workout-log-v3')!);
    expect(stored['bench-press-0']).toBeDefined();
    expect(stored['bench-press-0']).toHaveLength(1);
    expect(stored['bench-press-0'][0].weight).toBe('135');
    expect(stored['bench-press-0'][0].reps).toBe('8');
    expect(stored['bench-press-0'][0].timestamp).toBeDefined();
  });

  it('does not log set when draft is empty', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));

    act(() => {
      result.current.logSet(0, 0);
    });

    expect(result.current.isSetDone(0, 0)).toBe(false);
  });

  it('migrates v3 data and returns it via lastEntry', () => {
    // Seed v3 directly with an exercise-id key matching the mock exercise
    const existingData = {
      'bench-press-0': [{ weight: '200', reps: '5', timestamp: '2026-03-20T10:00:00.000Z' }],
    };
    localStorage.setItem('workout-log-v3', JSON.stringify(existingData));

    const { result } = renderHook(() => useWorkoutLog(mockDay));
    const entry = result.current.lastEntry(0, 0);
    expect(entry).not.toBeNull();
    expect(entry!.weight).toBe('200');
    expect(entry!.reps).toBe('5');
    expect(entry!.date).toContain('Mar');
  });

  it('accumulates history entries on multiple logSet calls', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));

    act(() => {
      result.current.updateDraft(0, 0, 'weight', '135');
      result.current.updateDraft(0, 0, 'reps', '8');
    });
    act(() => {
      result.current.logSet(0, 0);
    });

    const history = result.current.getHistory(0, 0);
    expect(history).toHaveLength(1);
    expect(history[0].weight).toBe('135');
  });

  it('getHistory returns empty array when no data', () => {
    const { result } = renderHook(() => useWorkoutLog(mockDay));
    expect(result.current.getHistory(0, 0)).toEqual([]);
  });
});
