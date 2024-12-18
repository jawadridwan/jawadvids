import React from 'react';
import { Slider } from '@/components/ui/slider';

interface VideoProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
}

export const VideoProgress = ({ currentTime, duration, onSeek }: VideoProgressProps) => {
  return (
    <Slider
      value={[currentTime ? (currentTime / duration) * 100 : 0]}
      onValueChange={onSeek}
      max={100}
      step={0.1}
      className="mb-4"
    />
  );
};