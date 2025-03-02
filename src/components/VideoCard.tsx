
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
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";

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
  isCompact?: boolean;
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
  category_id,
  isCompact = false
}: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSize, setVideoSize] = useState<'default' | 'medium' | 'fullscreen'>('default');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
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

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (duration > 0) {
      setCurrentProgress((currentTime / duration) * 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "rounded-xl overflow-hidden shadow-lg transition-all duration-300",
        "group hover:shadow-xl",
        isCompact 
          ? "bg-gradient-to-br from-youtube-dark to-youtube-darker/80 border border-white/5" 
          : "bg-gradient-to-br from-youtube-dark to-youtube-darker border border-white/5",
        !isCompact && "hover:scale-[1.02] hover:shadow-purple-900/10",
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
          onTimeUpdate={handleTimeUpdate}
          onVideoSizeChange={() => setVideoSize(prev => 
            prev === 'default' ? 'medium' : 
            prev === 'medium' ? 'fullscreen' : 
            'default'
          )}
        />
        
        {/* Progress indicator */}
        {currentProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-youtube-red"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        )}
        
        {/* Category badge */}
        {category && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-black/60 backdrop-blur-sm border-white/10 px-2 py-0.5 text-xs">
              {category.name}
            </Badge>
          </div>
        )}
        
        {/* Status badge */}
        {status && status !== 'ready' && (
          <div className="absolute top-2 right-2 z-10">
            <Badge 
              className={cn(
                "px-2 py-0.5 text-xs backdrop-blur-sm",
                status === 'processing' ? "bg-blue-500/80 text-white" : "bg-red-500/80 text-white"
              )}
            >
              {status === 'processing' ? 'Processing' : 'Failed'}
            </Badge>
          </div>
        )}
        
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
                toast.success('Video deleted successfully', {
                  className: "bg-youtube-darker border border-white/10",
                });
              } catch (error) {
                console.error('Error deleting video:', error);
                toast.error('Failed to delete video', {
                  className: "bg-youtube-darker border border-white/10",
                });
              }
            }}
          />
        )}
      </div>

      {/* Quick stats overlay */}
      {!isPlaying && isHovered && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent flex items-center gap-3 text-xs text-white"
        >
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{metrics.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{metrics.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{metrics.comments}</span>
          </div>
        </motion.div>
      )}

      <VideoContent
        title={title}
        description={description}
        hashtags={hashtags}
        metrics={metrics}
        status={status}
        videoId={id}
        category={category}
        isCompact={isCompact}
        onInteraction={() => {
          toast.success('Interaction recorded', {
            className: "bg-youtube-darker border border-white/10",
          });
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
