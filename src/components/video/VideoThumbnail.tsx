
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
    <div className="relative group">
      {url && status === 'ready' ? (
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <EnhancedVideoPlayer
            videoId={videoId}
            url={url}
            thumbnail={thumbnail}
            onTimeUpdate={onTimeUpdate}
            onPlayStateChange={onPlayStateChange}
            className={cn(
              "w-full aspect-video transition-all duration-300 rounded-lg",
              videoSize === 'medium' && "w-[854px] h-[480px]",
              videoSize === 'fullscreen' && "fixed inset-0 z-50 h-screen"
            )}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
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
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img 
            src={thumbnail || "/placeholder.svg"} 
            alt={title} 
            className="w-full aspect-video object-cover transform hover:scale-105 transition-transform duration-300"
          />
          {status === 'processing' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <div className="animate-pulse">Processing...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
