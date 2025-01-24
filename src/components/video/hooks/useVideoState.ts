import { useState, useEffect, RefObject } from 'react';
import { useVideoPlayback } from '@/contexts/VideoPlaybackContext';
import { toast } from 'sonner';

export const useVideoState = (
  videoRef: RefObject<HTMLVideoElement>,
  videoId: string,
  onPlayStateChange?: (isPlaying: boolean) => void
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { registerVideo, unregisterVideo, handlePlay } = useVideoPlayback();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      setError('Failed to load video');
      toast.error('Failed to load video');
    };

    const handleVideoPlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
      handlePlay(videoId);
    };

    const handleVideoPause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    video.addEventListener('error', handleError);
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);

    registerVideo(videoId, video);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
      unregisterVideo(videoId);
    };
  }, [videoId, onPlayStateChange, registerVideo, unregisterVideo, handlePlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        setError('Failed to play video');
        toast.error('Failed to play video');
      });
    } else {
      video.pause();
    }
  };

  return { isPlaying, error, togglePlay };
};