import { useRef, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useVideoRegistry = () => {
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const registerVideo = (id: string, element: HTMLVideoElement) => {
    videoRefs.current.set(id, element);
  };

  const unregisterVideo = (id: string) => {
    videoRefs.current.delete(id);
  };

  const handlePlay = async (id: string) => {
    try {
      if (currentlyPlaying && currentlyPlaying !== id) {
        const currentVideo = videoRefs.current.get(currentlyPlaying);
        if (currentVideo) {
          currentVideo.pause();
        }
      }
      setCurrentlyPlaying(id);

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

  return {
    registerVideo,
    unregisterVideo,
    handlePlay,
    currentlyPlaying
  };
};