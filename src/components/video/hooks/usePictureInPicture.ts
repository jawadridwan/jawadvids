import { useState, useEffect, RefObject } from 'react';

export const usePictureInPicture = (videoRef: RefObject<HTMLVideoElement>) => {
  const [isPiPActive, setIsPiPActive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePiPChange = () => {
      setIsPiPActive(document.pictureInPictureElement === video);
    };

    video.addEventListener('enterpictureinpicture', handlePiPChange);
    video.addEventListener('leavepictureinpicture', handlePiPChange);

    return () => {
      video.removeEventListener('enterpictureinpicture', handlePiPChange);
      video.removeEventListener('leavepictureinpicture', handlePiPChange);
    };
  }, [videoRef]);

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Failed to toggle Picture-in-Picture:', error);
    }
  };

  return { isPiPActive, togglePiP };
};