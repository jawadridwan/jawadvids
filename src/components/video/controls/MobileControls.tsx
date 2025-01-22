import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download
} from 'lucide-react';

interface MobileControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onDownload?: () => void;
  allowDownload?: boolean;
}

export const MobileControls = ({
  isPlaying,
  isMuted,
  isFullscreen,
  onPlayPause,
  onMuteToggle,
  onFullscreenToggle,
  onSkipBackward,
  onSkipForward,
  onDownload,
  allowDownload
}: MobileControlsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 p-4 flex justify-between items-center z-50">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={onSkipBackward}
        >
          <SkipBack className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={onSkipForward}
        >
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={onMuteToggle}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </Button>

        {allowDownload && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={onDownload}
          >
            <Download className="w-6 h-6" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={onFullscreenToggle}
        >
          {isFullscreen ? (
            <Minimize className="w-6 h-6" />
          ) : (
            <Maximize className="w-6 h-6" />
          )}
        </Button>
      </div>
    </div>
  );
};