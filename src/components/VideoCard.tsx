
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useVideoMetrics } from "@/hooks/use-video-metrics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoThumbnail } from "./video/VideoThumbnail";
import { VideoContent } from "./video/VideoContent";
import { VideoOwnerActions } from "./video/VideoOwnerActions";
import { VideoEditDialog } from "./video/VideoEditDialog";
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
  category_id?: string;
}

export const VideoCard = ({ 
  id,
  title, 
  views, 
  thumbnail, 
  description, 
  hashtags = [], 
  status,
  className,
  url,
  likes = 0,
  dislikes = 0,
  user_id,
  category_id
}: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSize, setVideoSize] = useState<'default' | 'medium' | 'fullscreen'>('default');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const session = useSession();
  const isOwner = session?.user?.id === user_id;

  const { metrics, handleVideoPlay } = useVideoMetrics(id, views, likes, dislikes);

  const { data: category } = useQuery({
    queryKey: ['category', category_id],
    queryFn: async () => {
      if (!category_id) return null;
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('id', category_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!category_id
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-youtube-dark rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
        "group hover:scale-[1.02] hover:ring-2 hover:ring-youtube-red/20",
        videoSize === 'default' && "hover:scale-105",
        className
      )}
    >
      <div className="relative">
        <VideoThumbnail
          url={url}
          thumbnail={thumbnail}
          title={title}
          status={status}
          videoId={id}
          videoSize={videoSize}
          isPlaying={isPlaying}
          onPlayStateChange={(playing) => {
            setIsPlaying(playing);
            if (playing) handleVideoPlay(session?.user?.id);
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
        )}
      </div>

      <VideoContent
        title={title}
        description={description}
        hashtags={hashtags}
        metrics={metrics}
        status={status}
        videoId={id}
        category={category}
        onInteraction={() => {
          toast.success('Interaction recorded');
        }}
      />

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
