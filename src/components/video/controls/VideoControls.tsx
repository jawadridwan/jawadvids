import React from 'react';
import { cn } from '@/lib/utils';
import { PlaybackControls } from './PlaybackControls';
import { ViewModeControls } from './ViewModeControls';
import { VideoPreferences } from '../hooks/useVideoPreferences';

interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  isPiPActive?: boolean;
  preferences?: VideoPreferences;
  showControls: boolean;
  onPlayPause: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP?: () => void;
  onToggleCaptions?: () => void;
  onViewModeChange: (mode: 'default' | 'medium' | 'fullscreen') => void;
  onPreferenceChange?: <K extends keyof VideoPreferences>(key: K, value: VideoPreferences[K]) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  viewMode: 'default' | 'medium' | 'fullscreen';
  onClose?: () => void;
  onNextVideo?: () => void;
  onPreviousVideo?: () => void;
}

export const VideoControls = ({
  isPlaying,
  isFullscreen,
  isPiPActive,
  showControls,
  onPlayPause,
  onToggleFullscreen,
  onTogglePiP,
  onToggleCaptions,
  onViewModeChange,
  videoRef,
  viewMode,
  onClose,
  onNextVideo,
  onPreviousVideo
}: VideoControlsProps) => {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4",
        "transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="flex flex-col gap-4">
        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onPreviousVideo={onPreviousVideo}
          onNextVideo={onNextVideo}
          videoRef={videoRef}
        />

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <ViewModeControls
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
            onViewModeChange={onViewModeChange}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};