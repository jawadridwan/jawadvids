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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !captions?.length) return;

    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = activeCaptions ? 'showing' : 'hidden';
    }
  }, [videoRef, captions, activeCaptions]);

  const toggleCaptions = () => {
    setActiveCaptions(prev => !prev);
  };

  return { activeCaptions, toggleCaptions };
};