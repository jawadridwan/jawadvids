import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoQualitySelectorProps {
  quality: string;
  onQualityChange: (quality: string) => void;
}

export const VideoQualitySelector = ({
  quality,
  onQualityChange,
}: VideoQualitySelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 border-white/10">
        <DropdownMenuRadioGroup value={quality} onValueChange={onQualityChange}>
          {['auto', '1080p', '720p', '480p', '360p'].map((q) => (
            <DropdownMenuRadioItem
              key={q}
              value={q}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              {q}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};