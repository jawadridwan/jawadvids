import React from 'react';
import { 
  Play, Pause, Maximize, Minimize, Settings, 
  Volume2, Volume1, Volume, VolumeX,
  SkipBack, SkipForward, ArrowLeft, ArrowRight, X
} from 'lucide-react';
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
import { toast } from 'sonner';

interface VideoControlsProps {
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
  onClose?: () => void;
  onNextVideo?: () => void;
  onPreviousVideo?: () => void;
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
  viewMode,
  onClose,
  onNextVideo,
  onPreviousVideo
}: VideoControlsProps) => {
  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      toast.success(`Skipped ${seconds > 0 ? 'forward' : 'backward'} ${Math.abs(seconds)} seconds`);
    }
  };

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4",
        "transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <div className="flex flex-col gap-4">
        {/* Video navigation controls */}
        <div className="flex items-center justify-center gap-4">
          {onPreviousVideo && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onPreviousVideo}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => skipTime(-10)}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onPlayPause}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => skipTime(10)}
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          {onNextVideo && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onNextVideo}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Bottom controls row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <VideoVolume
              volume={preferences.volume}
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
            {onTogglePiP && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={onTogglePiP}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}

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
    </div>
  );
};