import React from 'react';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoVolume } from './VideoVolume';
import { VideoPlaybackSpeed } from './VideoPlaybackSpeed';

interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  playbackSpeed: number;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onToggleFullscreen: () => void;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  onSpeedChange: (speed: number) => void;
}

export const VideoControls = ({
  isPlaying,
  isFullscreen,
  volume,
  isMuted,
  playbackSpeed,
  currentTime,
  duration,
  onPlayPause,
  onToggleFullscreen,
  onVolumeChange,
  onToggleMute,
  onSpeedChange,
}: VideoControlsProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        <VideoVolume
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />

        <span className="text-white text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <VideoPlaybackSpeed
          speed={playbackSpeed}
          onSpeedChange={onSpeedChange}
        />

        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};