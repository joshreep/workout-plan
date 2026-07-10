import { useCallback, useEffect, useState } from 'react';
import { appendBodyweightEntry, loadProfile, saveProfile } from '../lib/storage';
import type { UserProfile } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>({ bodyweight: null, bodyweightHistory: [] });

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const logBodyweight = useCallback((weight: number) => {
    const entry = { weight, timestamp: new Date().toISOString() };
    setProfile((prev) => {
      const updated = appendBodyweightEntry(prev, entry);
      saveProfile(updated);
      return updated;
    });
  }, []);

  return { profile, logBodyweight };
}
