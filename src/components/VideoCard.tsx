import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { VideoHeader } from "./video/VideoHeader";
import { VideoThumbnail } from "./video/VideoThumbnail";
import { VideoMetadata } from "./video/VideoMetadata";
import { VideoMetricsDisplay } from "./video/VideoMetricsDisplay";
import { VideoInteractionBar } from "./video/VideoInteractionBar";
import { VideoOwnerActions } from "./video/VideoOwnerActions";
import { VideoEditDialog } from "./video/VideoEditDialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

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
    views: parseInt(views) || 0,
    likes,
    dislikes,
    comments: 0
  });
  
  const session = useSession();
  const isOwner = session?.user?.id === user_id;

  // Track video view when played
  const handleVideoPlay = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Record the view
      const { error: viewError } = await supabase
        .from('views')
        .insert({
          video_id: id,
          viewer_id: session.user.id,
          watched_duration: 0,
          watched_percentage: 0
        });

      if (viewError) throw viewError;
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  // Subscribe to real-time view updates
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'views',
          filter: `video_id=eq.${id}`
        },
        async () => {
          // Fetch updated view count
          const { data: viewsData, error } = await supabase
            .from('performance_metrics')
            .select('views_count')
            .eq('video_id', id)
            .single();
          
          if (error) {
            console.error('Error fetching view count:', error);
            return;
          }
          
          if (viewsData) {
            setMetrics(prev => ({
              ...prev,
              views: viewsData.views_count
            }));
          }
        }
      )
      .subscribe();

    // Initial fetch of metrics
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('views_count, likes_count, comments_count')
        .eq('video_id', id)
        .single();

      if (error) {
        console.error('Error fetching metrics:', error);
        return;
      }

      if (data) {
        setMetrics(prev => ({
          ...prev,
          views: data.views_count || 0,
          likes: data.likes_count || 0,
          comments: data.comments_count || 0
        }));
      }
    };

    fetchMetrics();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

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

  // Default thumbnail if none provided
  const defaultThumbnail = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
  const displayThumbnail = thumbnail || defaultThumbnail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-youtube-dark rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
        videoSize === 'default' && "hover:scale-105",
        className
      )}
    >
      <div className="relative">
        <VideoThumbnail
          url={url}
          thumbnail={displayThumbnail}
          title={title}
          status={status}
          videoId={id}
          videoSize={videoSize}
          isPlaying={isPlaying}
          onPlayStateChange={(playing) => {
            setIsPlaying(playing);
            if (playing) handleVideoPlay();
          }}
          onVideoSizeChange={() => setVideoSize(prev => 
            prev === 'default' ? 'medium' : 
            prev === 'medium' ? 'fullscreen' : 
            'default'
          )}
        />
        
        {isOwner && (
          <VideoOwnerActions
            isOwner={isOwner}
            onEdit={() => setIsEditDialogOpen(true)}
            onDelete={handleDelete}
          />
        )}
      </div>

      <VideoHeader title={title} status={status} />

      <VideoMetadata
        title={title}
        description={description}
        hashtags={hashtags}
        views={metrics.views.toString()}
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
          onInteraction={() => {
            toast.success('Interaction recorded');
          }}
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