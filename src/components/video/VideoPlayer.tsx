import React from 'react';
import { EnhancedVideoPlayer } from './EnhancedVideoPlayer';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  nextVideoId?: string;
  captions?: { src: string; label: string; language: string }[];
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  return <EnhancedVideoPlayer {...props} />;
};