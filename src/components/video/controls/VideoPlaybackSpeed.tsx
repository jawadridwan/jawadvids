import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Gauge } from 'lucide-react';

interface VideoPlaybackSpeedProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const VideoPlaybackSpeed = ({ speed, onSpeedChange }: VideoPlaybackSpeedProps) => {
  const handleSpeedChange = (value: number) => {
    onSpeedChange(value);
    localStorage.setItem('videoPlaybackSpeed', value.toString());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white text-sm hover:bg-white/10 flex items-center gap-2"
        >
          <Gauge className="w-4 h-4" />
          <span className="hidden sm:inline">{speed}x</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 border-white/10">
        <DropdownMenuRadioGroup value={speed.toString()} onValueChange={(value) => handleSpeedChange(Number(value))}>
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speedOption) => (
            <DropdownMenuRadioItem
              key={speedOption}
              value={speedOption.toString()}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              {speedOption}x
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};