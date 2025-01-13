import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VideoPlayer } from "./video/VideoPlayer";
import { CommentSection } from "./comments/CommentSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoCardActions } from "./video/VideoCardActions";

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

  const { data: engagementMetrics } = useQuery({
    queryKey: ['engagement-metrics', id],
    queryFn: async () => {
      const { data: metrics, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('video_id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching engagement metrics:', error);
        return null;
      }

      return metrics || {
        views_count: 0,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0
      };
    },
    enabled: !!id
  });

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
            onPlayStateChange={setIsPlaying}
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
        <div className="flex items-center justify-between mb-4">
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
        <CommentSection videoId={id} />
      </div>
    </div>
  );
};