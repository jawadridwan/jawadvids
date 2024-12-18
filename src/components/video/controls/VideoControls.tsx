import React from 'react';
import { Play, Pause, Maximize, Minimize, PictureInPicture, Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoVolume } from './VideoVolume';
import { VideoPlaybackSpeed } from './VideoPlaybackSpeed';
import { VideoQualitySelector } from './VideoQualitySelector';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  isPiPActive: boolean;
  preferences: {
    volume: number;
    playbackSpeed: number;
    quality: string;
    autoScroll: boolean;
    scrollThreshold: number;
    scrollSpeed: number;
  };
  showControls: boolean;
  onPlayPause: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onToggleCaptions: () => void;
  onViewModeChange: (mode: 'default' | 'medium' | 'fullscreen') => void;
  onPreferenceChange: <K extends keyof typeof preferences>(
    key: K,
    value: typeof preferences[K]
  ) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const VideoControls = ({
  isPlaying,
  isFullscreen,
  isPiPActive,
  preferences,
  showControls,
  onPlayPause,
  onToggleFullscreen,
  onTogglePiP,
  onToggleCaptions,
  onViewModeChange,
  onPreferenceChange,
  videoRef
}: VideoControlsProps) => {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4",
        "transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onPlayPause}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <VideoVolume
            volume={preferences.volume}
            onVolumeChange={(value) => onPreferenceChange('volume', value)}
            videoRef={videoRef}
          />

          <VideoPlaybackSpeed
            speed={preferences.playbackSpeed}
            onSpeedChange={(value) => onPreferenceChange('playbackSpeed', value)}
          />

          <VideoQualitySelector
            quality={preferences.quality}
            onQualityChange={(value) => onPreferenceChange('quality', value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onToggleCaptions}
          >
            <Subtitles className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onTogglePiP}
          >
            <PictureInPicture className={cn("w-4 h-4", isPiPActive && "text-primary")} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
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
    </div>
  );
};