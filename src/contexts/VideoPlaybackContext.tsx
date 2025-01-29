import React, { createContext, useContext, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VideoPlaybackContextType {
  registerVideo: (id: string, element: HTMLVideoElement) => void;
  unregisterVideo: (id: string) => void;
  handlePlay: (id: string) => void;
  currentlyPlaying: string | null;
}

const VideoPlaybackContext = createContext<VideoPlaybackContextType | undefined>(undefined);

export const VideoPlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const registerVideo = (id: string, element: HTMLVideoElement) => {
    videoRefs.current.set(id, element);
  };

  const unregisterVideo = (id: string) => {
    videoRefs.current.delete(id);
  };

  const handlePlay = async (id: string) => {
    if (currentlyPlaying && currentlyPlaying !== id) {
      const currentVideo = videoRefs.current.get(currentlyPlaying);
      if (currentVideo) {
        currentVideo.pause();
      }
    }
    setCurrentlyPlaying(id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('views').insert({
          video_id: id,
          viewer_id: user.id,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const value = {
    registerVideo,
    unregisterVideo,
    handlePlay,
    currentlyPlaying
  };

  return (
    <VideoPlaybackContext.Provider value={value}>
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