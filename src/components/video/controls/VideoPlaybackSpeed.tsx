import React from 'react';
import { Button } from '@/components/ui/button';

interface VideoPlaybackSpeedProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const VideoPlaybackSpeed = ({ speed, onSpeedChange }: VideoPlaybackSpeedProps) => {
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="text-white text-sm"
      >
        {speed}x
      </Button>
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
        <div className="bg-black/90 rounded-lg p-2">
          {[0.5, 1, 1.5, 2].map((speedOption) => (
            <button
              key={speedOption}
              className="block w-full text-white text-sm px-4 py-1 hover:bg-white/10 rounded"
              onClick={() => onSpeedChange(speedOption)}
            >
              {speedOption}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};