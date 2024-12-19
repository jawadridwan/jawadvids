import { useState, useEffect, RefObject } from 'react';

export const useFullscreen = (containerRef: RefObject<HTMLDivElement>) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        }
        
        // Handle mobile orientation
        if ('orientation' in screen && 'unlock' in screen.orientation) {
          try {
            await screen.orientation.unlock();
            await screen.orientation.lock('landscape');
          } catch (error) {
            console.log('Orientation lock not supported');
          }
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        
        // Release orientation lock
        if ('orientation' in screen && 'unlock' in screen.orientation) {
          try {
            await screen.orientation.unlock();
          } catch (error) {
            console.log('Orientation unlock not supported');
          }
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return { isFullscreen, toggleFullscreen };
};