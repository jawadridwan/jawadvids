import { useState, useEffect, RefObject } from 'react';

export const useFullscreen = (elementRef: RefObject<HTMLElement>) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === element);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [elementRef]);

  const toggleFullscreen = async () => {
    const element = elementRef.current;
    if (!element) return;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
        // Only try to lock orientation if the API is available
        if (screen.orientation && typeof screen.orientation.lock === 'function') {
          try {
            await screen.orientation.lock('landscape');
          } catch (error) {
            console.warn('Failed to lock screen orientation:', error);
          }
        }
      } else {
        await document.exitFullscreen();
        // Only try to unlock orientation if the API is available
        if (screen.orientation && typeof screen.orientation.unlock === 'function') {
          try {
            await screen.orientation.unlock();
          } catch (error) {
            console.warn('Failed to unlock screen orientation:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return { isFullscreen, toggleFullscreen };
};