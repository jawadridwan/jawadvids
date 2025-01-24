import React, { createContext, useContext, useRef } from 'react';

interface VideoPlaybackContextType {
  registerVideo: (id: string, element: HTMLVideoElement) => void;
  unregisterVideo: (id: string) => void;
  handlePlay: (playingId: string) => void;
}

const VideoPlaybackContext = createContext<VideoPlaybackContextType | null>(null);

export const VideoPlaybackProvider = ({ children }: { children: React.ReactNode }) => {
  const videoRegistry = useRef<Map<string, HTMLVideoElement>>(new Map());

  const registerVideo = (id: string, element: HTMLVideoElement) => {
    videoRegistry.current.set(id, element);
  };

  const unregisterVideo = (id: string) => {
    videoRegistry.current.delete(id);
  };

  const handlePlay = (playingId: string) => {
    videoRegistry.current.forEach((video, id) => {
      if (id !== playingId) {
        video.pause();
      }
    });
  };

  return (
    <VideoPlaybackContext.Provider value={{ registerVideo, unregisterVideo, handlePlay }}>
      {children}
    </VideoPlaybackContext.Provider>
  );
};

export const useVideoPlayback = () => {
  const context = useContext(VideoPlaybackContext);
  if (!context) {
    throw new Error('useVideoPlayback must be used within a VideoPlaybackProvider');
  }
  return context;
};