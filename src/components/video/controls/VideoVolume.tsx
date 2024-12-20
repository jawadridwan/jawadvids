import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface VideoVolumeProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export const VideoVolume = ({ volume, onVolumeChange, onToggleMute }: VideoVolumeProps) => {
  const isMuted = volume === 0;
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        onClick={onToggleMute}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
      <div className="w-24">
        <Slider
          value={[volume]}
          onValueChange={onVolumeChange}
          max={1}
          step={0.1}
          className="w-24"
        />
      </div>
    </div>
  );
};