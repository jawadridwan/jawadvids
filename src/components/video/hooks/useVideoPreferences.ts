import { useState, useEffect } from 'react';

export interface VideoPreferences {
  volume: number;
  playbackSpeed: number;
  autoScroll: boolean;
  scrollThreshold: number;
  scrollSpeed: number;
}

const DEFAULT_PREFERENCES: VideoPreferences = {
  volume: 1,
  playbackSpeed: 1,
  autoScroll: true,
  scrollThreshold: 0.8,
  scrollSpeed: 1000,
};

export const useVideoPreferences = () => {
  const [preferences, setPreferences] = useState<VideoPreferences>(() => {
    const saved = localStorage.getItem('videoPreferences');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    localStorage.setItem('videoPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof VideoPreferences>(
    key: K,
    value: VideoPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return { preferences, updatePreference };
};