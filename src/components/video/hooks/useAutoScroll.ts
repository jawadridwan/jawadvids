import { RefObject, useEffect } from 'react';

interface AutoScrollProps {
  videoRef: RefObject<HTMLVideoElement>;
  nextVideoId?: string;
  isEnabled: boolean;
  scrollThreshold: number;
}

export const useAutoScroll = ({
  videoRef,
  nextVideoId,
  isEnabled,
  scrollThreshold
}: AutoScrollProps) => {
  useEffect(() => {
    if (!videoRef.current || !isEnabled || !nextVideoId) return;

    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (!video) return;
      
      const progress = video.currentTime / video.duration;
      if (progress >= scrollThreshold) {
        const nextVideo = document.getElementById(nextVideoId);
        nextVideo?.scrollIntoView();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef, nextVideoId, isEnabled, scrollThreshold]);
};