
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { VideoHeader } from "./video/VideoHeader";
import { VideoThumbnail } from "./video/VideoThumbnail";
import { VideoMetadata } from "./video/VideoMetadata";
import { VideoOwnerActions } from "./video/VideoOwnerActions";
import { VideoEditDialog } from "./video/VideoEditDialog";
import { VideoTags } from "./video/VideoTags";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ThumbsUp, Share2 } from "lucide-react";
import { Button } from "./ui/button";

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
  user_id: string;
  category_id?: string;
}

export const VideoCard = ({ 
  id,
  title, 
  thumbnail, 
  description, 
  hashtags = [], 
  status,
  className,
  url,
  likes = 0,
  user_id,
  category_id
}: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSize, setVideoSize] = useState<'default' | 'medium' | 'fullscreen'>('default');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    likes,
  });
  
  const session = useSession();
  const isOwner = session?.user?.id === user_id;

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

  const handleVideoPlay = async () => {
    if (!session?.user?.id) return;
    
    try {
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

  const handleLike = async () => {
    if (!session?.user?.id) {
      toast.error('Please sign in to like videos');
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from('reactions')
        .select()
        .eq('video_id', id)
        .eq('user_id', session.user.id)
        .eq('type', 'like')
        .single();

      if (existingLike) {
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existingLike.id);
        setMetrics(prev => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        await supabase
          .from('reactions')
          .insert({ 
            video_id: id,
            user_id: session.user.id,
            type: 'like'
          });
        setMetrics(prev => ({ ...prev, likes: prev.likes + 1 }));
      }
      
      toast.success('Reaction updated');
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Video link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-gradient-to-br from-youtube-dark/80 to-youtube-dark rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
        "backdrop-blur-sm border border-white/5",
        videoSize === 'default' && "hover:scale-102",
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

      <VideoHeader title={title} status={status} />
      
      {category && (
        <div className="px-4 py-1">
          <span className="text-sm text-youtube-gray bg-youtube-dark/50 px-2 py-1 rounded-full">
            {category.name}
          </span>
        </div>
      )}

      <VideoTags hashtags={hashtags} onTagClick={(tag) => {
        toast.info(`Filtering by tag: ${tag}`);
      }} />

      <VideoMetadata
        title={title}
        description={description}
        hashtags={hashtags}
        status={status}
      />

      <div className="px-4 pb-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-youtube-gray hover:text-white flex items-center gap-2"
          onClick={handleLike}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{metrics.likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-youtube-gray hover:text-white"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
        </Button>
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
