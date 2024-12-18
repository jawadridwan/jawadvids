import { useEffect, RefObject } from 'react';
import { useNavigate } from 'react-router-dom';

interface AutoScrollProps {
  videoRef: RefObject<HTMLVideoElement>;
  nextVideoId?: string;
  isEnabled: boolean;
  scrollThreshold: number;
  scrollSpeed: number;
}

export const useAutoScroll = ({
  videoRef,
  nextVideoId,
  isEnabled,
  scrollThreshold,
  scrollSpeed
}: AutoScrollProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isEnabled || !nextVideoId) return;

    const handleTimeUpdate = () => {
      const progress = video.currentTime / video.duration;
      if (progress >= scrollThreshold) {
        video.pause();
        const start = window.scrollY;
        const end = start + window.innerHeight;
        const startTime = performance.now();

        const scroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / scrollSpeed, 1);
          
          window.scrollTo(0, start + (end - start) * progress);
          
          if (progress < 1) {
            requestAnimationFrame(scroll);
          } else {
            navigate(`/video/${nextVideoId}`);
          }
        };

        requestAnimationFrame(scroll);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef, nextVideoId, isEnabled, scrollThreshold, scrollSpeed, navigate]);
};