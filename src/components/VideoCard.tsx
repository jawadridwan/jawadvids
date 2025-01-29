import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VideoCardActions } from "./video/VideoCardActions";
import { VideoMetadata } from "./video/VideoMetadata";
import { VideoEditDialog } from "./video/VideoEditDialog";
import { VideoThumbnail } from "./video/VideoThumbnail";
import { VideoOwnerActions } from "./video/VideoOwnerActions";
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
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    views: parseInt(views),
    likes,
    dislikes,
    comments: 0
  });
  
  const isMobile = useIsMobile();
  const session = useSession();
  const isOwner = session?.user?.id === user_id;

  useEffect(() => {
    const channel = supabase
      .channel(`video_metrics_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'performance_metrics',
          filter: `video_id=eq.${id}`
        },
        (payload: any) => {
          const newData = payload.new;
          setRealTimeMetrics(prev => ({
            ...prev,
            views: newData.views_count || prev.views,
            comments: newData.comments_count || prev.comments
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions',
          filter: `video_id=eq.${id}`
        },
        () => {
          supabase
            .from('reactions')
            .select('type')
            .eq('video_id', id)
            .then(({ data }) => {
              if (data) {
                setRealTimeMetrics(prev => ({
                  ...prev,
                  likes: data.filter(r => r.type === 'like').length,
                  dislikes: data.filter(r => r.type === 'dislike').length
                }));
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

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
          <VideoThumbnail
            url={url}
            thumbnail={thumbnail}
            title={title}
            status={status}
            videoId={id}
            videoSize={videoSize}
            isPlaying={isPlaying}
            onPlayStateChange={setIsPlaying}
            onTimeUpdate={handleTimeUpdate}
            onVideoSizeChange={toggleVideoSize}
          />
          <VideoOwnerActions
            isOwner={isOwner}
            onEdit={() => setIsEditDialogOpen(true)}
            onDelete={handleDelete}
          />
        </div>

        <VideoMetadata
          title={title}
          description={description}
          hashtags={hashtags}
          views={realTimeMetrics.views.toString()}
          status={status}
        />

        <div className="px-4 pb-4">
          <VideoCardActions
            videoId={id}
            userId={user_id}
            likes={realTimeMetrics.likes}
            dislikes={realTimeMetrics.dislikes}
            commentsCount={realTimeMetrics.comments}
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