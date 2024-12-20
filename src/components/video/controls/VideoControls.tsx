import React from 'react';
import { Play, Pause, Maximize, Minimize, Settings, PictureInPicture, Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoVolume } from './VideoVolume';
import { VideoPlaybackSpeed } from './VideoPlaybackSpeed';
import { VideoQualitySelector } from './VideoQualitySelector';
import { cn } from '@/lib/utils';
import { VideoPreferences } from '../hooks/useVideoPreferences';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface VideoControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  isPiPActive?: boolean;
  preferences: VideoPreferences;
  showControls: boolean;
  onPlayPause: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP?: () => void;
  onToggleCaptions?: () => void;
  onViewModeChange: (mode: 'default' | 'medium' | 'fullscreen') => void;
  onPreferenceChange: <K extends keyof VideoPreferences>(key: K, value: VideoPreferences[K]) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  viewMode: 'default' | 'medium' | 'fullscreen';
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
  videoRef,
  viewMode
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
            isMuted={preferences.volume === 0}
            onVolumeChange={(value) => onPreferenceChange('volume', value[0])}
            onToggleMute={() => onPreferenceChange('volume', preferences.volume === 0 ? 1 : 0)}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-white/10">
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => onViewModeChange('default')}
              >
                Default Size
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => onViewModeChange('medium')}
              >
                Theater Mode
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-white hover:bg-white/10 cursor-pointer"
                onClick={() => onViewModeChange('fullscreen')}
              >
                Fullscreen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {onToggleCaptions && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onToggleCaptions}
            >
              <Subtitles className="w-4 h-4" />
            </Button>
          )}

          {onTogglePiP && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onTogglePiP}
            >
              <PictureInPicture className={cn("w-4 h-4", isPiPActive && "text-primary")} />
            </Button>
          )}

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