import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface VideoCardProps {
  title: string;
  views: string;
  thumbnail: string;
  description?: string;
  hashtags?: string[];
  status?: 'processing' | 'ready' | 'failed';
  className?: string;
  url?: string;
}

export const VideoCard = ({ 
  title, 
  views, 
  thumbnail, 
  description, 
  hashtags, 
  status,
  className,
  url 
}: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Log video loading status
    if (videoRef.current) {
      console.log('Video element loaded:', {
        url,
        readyState: videoRef.current.readyState,
        networkState: videoRef.current.networkState
      });
    }
  }, [url]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      // Handle playback errors
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
        toast.error("Error playing video. Please try again.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    toast.error("Error loading video. Please try again later.");
  };

  return (
    <div className={cn(
      "bg-youtube-dark rounded-xl overflow-hidden animate-fade-in hover:scale-105 transition-transform",
      className
    )}>
      <div className="relative" onClick={handlePlayPause}>
        {url && status === 'ready' ? (
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover cursor-pointer"
            poster={thumbnail || "/placeholder.svg"}
            onError={handleVideoError}
            playsInline
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={thumbnail || "/placeholder.svg"} 
            alt={title} 
            className="w-full aspect-video object-cover"
          />
        )}
        {status && (
          <Badge 
            variant={status === 'ready' ? 'default' : status === 'processing' ? 'secondary' : 'destructive'}
            className="absolute top-2 left-2"
          >
            {status === 'ready' ? 'Ready' : status === 'processing' ? 'Processing' : 'Failed'}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-medium mb-2 line-clamp-2">{title}</h3>
        {description && (
          <p className="text-youtube-gray text-sm mb-2 line-clamp-2">{description}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          {hashtags?.map((tag, index) => (
            <span key={index} className="text-blue-400 text-xs hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-youtube-gray text-sm">{views} views</p>
      </div>
    </div>
  );
};