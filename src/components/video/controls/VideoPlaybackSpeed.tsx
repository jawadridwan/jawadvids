import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoPlaybackSpeedProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const VideoPlaybackSpeed = ({ speed, onSpeedChange }: VideoPlaybackSpeedProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white text-sm hover:bg-white/10"
        >
          {speed}x
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 border-white/10">
        <DropdownMenuRadioGroup value={speed.toString()} onValueChange={(value) => onSpeedChange(Number(value))}>
          {[0.5, 1, 1.5, 2].map((speedOption) => (
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