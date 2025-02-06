
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoHeader } from "./video/VideoHeader";
import { VideoThumbnail } from "./video/VideoThumbnail";
import { VideoMetadata } from "./video/VideoMetadata";
import { VideoMetricsDisplay } from "./video/VideoMetricsDisplay";
import { VideoInteractionBar } from "./video/VideoInteractionBar";
import { VideoOwnerActions } from "./video/VideoOwnerActions";
import { VideoEditDialog } from "./video/VideoEditDialog";
import { VideoTags } from "./video/VideoTags";
import { VideoContainer } from "./video/VideoContainer";
import { useVideoMetrics } from "@/hooks/useVideoMetrics";
import { useVideoInteractions } from "@/hooks/useVideoInteractions";
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
  const { handleVideoPlay } = useVideoInteractions(id);
  const { metrics } = useVideoMetrics(id, {
    views: parseInt(views) || 0,
    likes,
    dislikes: dislikes || 0,
    comments: 0
  });

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
    <VideoContainer videoSize={videoSize} className={className}>
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
          <span className="text-sm text-youtube-gray bg-youtube-dark/50 px-2 py-1 rounded">
            {category.name}
          </span>
        </div>
      )}

      <VideoTags 
        hashtags={hashtags} 
        onTagClick={(tag) => {
          toast.info(`Filtering by tag: ${tag}`);
        }} 
      />

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
    </VideoContainer>
  );
};
