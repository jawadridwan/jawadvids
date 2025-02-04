import React, { createContext, useContext } from 'react';
import { VideoPlaybackContextType } from './video/types';
import { useVideoRegistry } from './video/useVideoRegistry';

const VideoPlaybackContext = createContext<VideoPlaybackContextType | undefined>(undefined);

export const VideoPlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const videoRegistry = useVideoRegistry();

  return (
    <VideoPlaybackContext.Provider value={videoRegistry}>
      {children}
    </VideoPlaybackContext.Provider>
  );
};

export const useVideoPlayback = () => {
  const context = useContext(VideoPlaybackContext);
  if (context === undefined) {
    throw new Error('useVideoPlayback must be used within a VideoPlaybackProvider');
  }
  return context;
};