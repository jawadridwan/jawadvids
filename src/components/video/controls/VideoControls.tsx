import React from 'react';
import { cn } from '@/lib/utils';
import { PlaybackControls } from './PlaybackControls';
import { ViewModeControls } from './ViewModeControls';

export interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  onPlayPause: () => void;
  onToggleFullscreen: () => void;
  onViewModeChange: (mode: 'default' | 'medium' | 'fullscreen') => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  viewMode: 'default' | 'medium' | 'fullscreen';
  children?: React.ReactNode;
}

export const VideoControls = ({
  isPlaying,
  isFullscreen,
  showControls,
  onPlayPause,
  onToggleFullscreen,
  onViewModeChange,
  videoRef,
  viewMode,
  children,
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
          videoRef={videoRef}
        />

        <div className="flex items-center justify-between gap-4">
          {children}
          <ViewModeControls
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
            onViewModeChange={onViewModeChange}
          />
        </div>
      </div>
    </div>
  );
};