import { useState, useEffect, RefObject } from 'react';

interface Caption {
  src: string;
  label: string;
  language: string;
}

export const useClosedCaptions = (
  videoRef: RefObject<HTMLVideoElement>,
  captions?: Caption[]
) => {
  const [activeCaptions, setActiveCaptions] = useState(false);

  const toggleCaptions = () => {
    const video = videoRef.current;
    if (!video || !video.textTracks) return;

    const newState = !activeCaptions;
    setActiveCaptions(newState);

    Array.from(video.textTracks).forEach(track => {
      track.mode = newState ? 'showing' : 'hidden';
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !video.textTracks) return;

    Array.from(video.textTracks).forEach(track => {
      track.mode = activeCaptions ? 'showing' : 'hidden';
    });
  }, [videoRef, activeCaptions]);

  return { activeCaptions, toggleCaptions };
};