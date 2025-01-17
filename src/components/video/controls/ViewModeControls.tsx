import React from 'react';
import { Maximize, Minimize, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ViewModeControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onViewModeChange: (mode: 'default' | 'medium' | 'fullscreen') => void;
  onClose?: () => void;
}

export const ViewModeControls = ({
  isFullscreen,
  onToggleFullscreen,
  onViewModeChange,
  onClose,
}: ViewModeControlsProps) => {
  return (
    <div className="flex items-center gap-2">
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

      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};