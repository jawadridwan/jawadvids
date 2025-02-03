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
import { VideoMetricsDisplay } from "./video/VideoMetricsDisplay";
import { VideoInteractionBar } from "./video/VideoInteractionBar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const [metrics, setMetrics] = useState({
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
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'performance_metrics',
        filter: `video_id=eq.${id}`
      }, (payload: any) => {
        const newData = payload.new;
        setMetrics(prev => ({
          ...prev,
          views: newData.views_count || prev.views,
          comments: newData.comments_count || prev.comments
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleMetricsUpdate = () => {
    // Refresh metrics after interaction
    supabase
      .from('performance_metrics')
      .select('*')
      .eq('video_id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setMetrics(prev => ({
            ...prev,
            views: data.views_count,
            comments: data.comments_count
          }));
        }
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-youtube-dark rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300",
        videoSize === 'default' && "hover:scale-105",
        className
      )}
    >
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
          onVideoSizeChange={() => setVideoSize(prev => 
            prev === 'default' ? 'medium' : 
            prev === 'medium' ? 'fullscreen' : 
            'default'
          )}
        />
        <VideoOwnerActions
          isOwner={isOwner}
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={async () => {
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
          }}
        />
      </div>

      <VideoMetadata
        title={title}
        description={description}
        hashtags={hashtags}
        views={metrics.views.toString()}
        status={status}
      />

      <div className="p-4 space-y-4">
        <VideoMetricsDisplay
          views={metrics.views}
          likes={metrics.likes}
          comments={metrics.comments}
        />
        
        <VideoInteractionBar
          videoId={id}
          initialLikes={metrics.likes}
          initialDislikes={metrics.dislikes}
          initialComments={metrics.comments}
          onInteraction={handleMetricsUpdate}
        />
      </div>

      <VideoEditDialog
        id={id}
        title={title}
        description={description}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </motion.div>
  );
};