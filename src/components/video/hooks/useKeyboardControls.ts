import { useEffect } from 'react';

interface KeyboardControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  togglePlay: () => void;
  toggleFullscreen: () => void;
  togglePiP?: () => void;  // Made optional
  toggleCaptions?: () => void;  // Made optional
  skip?: (seconds: number) => void;  // Made optional
}

export const useKeyboardControls = ({
  videoRef,
  togglePlay,
  toggleFullscreen,
  togglePiP,
  toggleCaptions,
  skip
}: KeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'p':
          togglePiP?.();
          break;
        case 'c':
          toggleCaptions?.();
          break;
        case 'arrowleft':
          skip?.(-5);
          break;
        case 'arrowright':
          skip?.(5);
          break;
        default:
          if (!isNaN(parseInt(e.key)) && parseInt(e.key) >= 1 && parseInt(e.key) <= 9) {
            const percentage = (parseInt(e.key) * 10) / 100;
            video.currentTime = video.duration * percentage;
          }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [videoRef, togglePlay, toggleFullscreen, togglePiP, toggleCaptions, skip]);
};