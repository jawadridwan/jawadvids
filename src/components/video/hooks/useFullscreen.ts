import { useState, useCallback, useRef } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const enterFullscreen = useCallback(async () => {
    const element = elementRef.current;
    if (!element) return;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }

      // Only attempt to lock orientation if the API is available
      if (screen.orientation && 'lock' in screen.orientation) {
        try {
          await screen.orientation.lock('landscape');
        } catch (error) {
          console.warn('Failed to lock screen orientation:', error);
        }
      }

      setIsFullscreen(true);
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }

      // Only attempt to unlock orientation if the API is available
      if (screen.orientation && 'unlock' in screen.orientation) {
        try {
          screen.orientation.unlock();
        } catch (error) {
          console.warn('Failed to unlock screen orientation:', error);
        }
      }

      setIsFullscreen(false);
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      await enterFullscreen();
    } else {
      await exitFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    elementRef,
    toggleFullscreen,
  };
};