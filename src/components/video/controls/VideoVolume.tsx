import React, { useState } from 'react';
import { Volume2, Volume1, Volume, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface VideoVolumeProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export const VideoVolume = ({ volume, onVolumeChange, onToggleMute }: VideoVolumeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const isMobile = useIsMobile();

  const handleVolumeIconClick = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      onVolumeChange([0]);
    } else {
      onVolumeChange([previousVolume]);
    }
    onToggleMute();
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-4 h-4" />;
    if (volume < 0.3) return <Volume className="w-4 h-4" />;
    if (volume < 0.7) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  return (
    <div 
      className="flex items-center gap-2 group relative"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => isMobile && setIsHovered(!isHovered)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        onClick={handleVolumeIconClick}
      >
        <VolumeIcon />
      </Button>
      <div className={cn(
        "transition-all duration-200 overflow-hidden absolute left-10 bg-black/90 rounded-lg p-2",
        isHovered ? "w-24 opacity-100 visible" : "w-0 opacity-0 invisible"
      )}>
        <Slider
          value={[volume]}
          onValueChange={onVolumeChange}
          max={1}
          step={0.01}
          className="w-20"
        />
      </div>
    </div>
  );
};