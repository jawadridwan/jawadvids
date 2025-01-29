import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "./ui/button";
import { Maximize2, Minimize2, Pencil, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedVideoPlayer } from "./video/EnhancedVideoPlayer";
import { VideoCardActions } from "./video/VideoCardActions";
import { VideoMetadata } from "./video/VideoMetadata";
import { VideoEditDialog } from "./video/VideoEditDialog";
import { cn } from "@/lib/utils";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const session = useSession();

  const isOwner = session?.user?.id === user_id;

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  return (
    <>
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
          {isOwner && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                className="bg-black/50 hover:bg-black/70"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="bg-black/50 hover:bg-red-600"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <VideoMetadata
          title={title}
          description={description}
          hashtags={hashtags}
          views={views}
          status={status}
        />

        <div className="px-4 pb-4">
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

      <VideoEditDialog
        id={id}
        title={title}
        description={description}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
};