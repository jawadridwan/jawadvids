import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EnhancedVideoPlayer } from "./video/EnhancedVideoPlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoCardActions } from "./video/VideoCardActions";
import { Button } from "./ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface VideoCardProps {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  description?: string;
  hashtags?: string[];
  status?: 'processing' | 'ready' | 'failed';
  className?: string;
  url?: string;
  likes?: number;
  dislikes?: number;
  user_id: string;
}

export const VideoCard = ({ 
  id,
  title, 
  views, 
  thumbnail, 
  description, 
  hashtags, 
  status,
  className,
  url,
  likes = 0,
  dislikes = 0,
  user_id
}: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSize, setVideoSize] = useState<'default' | 'medium' | 'fullscreen'>('default');
  const isMobile = useIsMobile();

  const { data: engagementMetrics } = useQuery({
    queryKey: ['engagement-metrics', id],
    queryFn: async () => {
      try {
        const { data: metrics, error } = await supabase
          .from('performance_metrics')
          .select('*')
          .eq('video_id', id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching engagement metrics:', error);
          toast.error('Failed to load engagement metrics');
          return null;
        }

        return metrics || {
          views_count: 0,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0
        };
      } catch (error) {
        console.error('Error in engagement metrics query:', error);
        return null;
      }
    },
    enabled: !!id
  });

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    console.log('Video progress:', Math.round((currentTime / duration) * 100), '%');
  };

  const toggleVideoSize = () => {
    if (isMobile) {
      setVideoSize(prev => prev === 'fullscreen' ? 'default' : 'fullscreen');
      return;
    }
    setVideoSize(prev => {
      if (prev === 'default') return 'medium';
      if (prev === 'medium') return 'fullscreen';
      return 'default';
    });
  };

  return (
    <div className={cn(
      "bg-youtube-dark rounded-xl overflow-hidden animate-fade-in transition-all duration-300",
      videoSize === 'default' && "hover:scale-105",
      className
    )}>
      <div className="relative group">
        {url && status === 'ready' ? (
          <div className="relative">
            <EnhancedVideoPlayer
              videoId={id}
              url={url}
              thumbnail={thumbnail}
              onTimeUpdate={handleTimeUpdate}
              onPlayStateChange={setIsPlaying}
              className={cn(
                "w-full",
                videoSize === 'medium' && "w-[854px] h-[480px]",
                videoSize === 'fullscreen' && "fixed inset-0 z-50 h-screen"
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={toggleVideoSize}
            >
              {videoSize === 'fullscreen' ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
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
      <div className="p-4 space-y-3">
        <h3 className="text-white font-medium line-clamp-2 text-base md:text-lg">{title}</h3>
        {description && (
          <p className="text-youtube-gray text-sm line-clamp-2">{description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {hashtags?.map((tag, index) => (
            <span key={index} className="text-blue-400 text-xs hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="text-youtube-gray text-sm">{views} views</p>
          <VideoCardActions
            videoId={id}
            userId={user_id}
            likes={likes}
            dislikes={dislikes}
            commentsCount={engagementMetrics?.comments_count}
            sharesCount={engagementMetrics?.shares_count}
          />
        </div>
      </div>
    </div>
  );
};