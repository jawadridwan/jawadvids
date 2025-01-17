import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPreviousVideo?: () => void;
  onNextVideo?: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  onPreviousVideo,
  onNextVideo,
  videoRef,
}: PlaybackControlsProps) => {
  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      toast.success(`Skipped ${seconds > 0 ? 'forward' : 'backward'} ${Math.abs(seconds)} seconds`);
    }
  };

  return (
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
  );
};