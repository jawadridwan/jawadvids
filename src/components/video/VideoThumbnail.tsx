
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnhancedVideoPlayer } from "./EnhancedVideoPlayer";

interface VideoThumbnailProps {
  url?: string;
  thumbnail: string;
  title: string;
  status?: 'processing' | 'ready' | 'failed';
  videoId: string;
  videoSize: 'default' | 'medium' | 'fullscreen';
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
  onVideoSizeChange: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoThumbnail = ({
  url,
  thumbnail,
  title,
  status,
  videoId,
  videoSize,
  isPlaying,
  onPlayStateChange,
  onTimeUpdate = () => {},
  onVideoSizeChange
}: VideoThumbnailProps) => {
  return (
    <div className="relative group w-full max-w-4xl mx-auto">
      {url && status === 'ready' ? (
        <div className="relative w-full">
          <EnhancedVideoPlayer
            videoId={videoId}
            url={url}
            thumbnail={thumbnail}
            onTimeUpdate={onTimeUpdate}
            onPlayStateChange={onPlayStateChange}
            className={cn(
              "w-full transition-all duration-300 rounded-lg shadow-lg",
              videoSize === 'medium' && "max-w-[854px] aspect-video mx-auto",
              videoSize === 'fullscreen' && "fixed inset-0 z-50 h-screen w-screen"
            )}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onVideoSizeChange}
          >
            {videoSize === 'fullscreen' ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <img 
            src={thumbnail || "/placeholder.svg"} 
            alt={title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        </div>
      )}
    </div>
  );
};
