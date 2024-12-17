import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { VideoPlayer } from "./video/VideoPlayer";

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

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    console.log('Video progress:', Math.round((currentTime / duration) * 100), '%');
  };

  return (
    <div className={cn(
      "bg-youtube-dark rounded-xl overflow-hidden animate-fade-in hover:scale-105 transition-transform",
      className
    )}>
      <div className="relative">
        {url && status === 'ready' ? (
          <VideoPlayer
            url={url}
            thumbnail={thumbnail}
            onTimeUpdate={handleTimeUpdate}
            className="w-full aspect-video"
          />
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