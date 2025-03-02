
import { VideoMetadata } from "./VideoMetadata";
import { VideoMetricsDisplay } from "./VideoMetricsDisplay";
import { VideoInteractionBar } from "./VideoInteractionBar";
import { VideoTags } from "./VideoTags";
import { VideoHeader } from "./VideoHeader";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clock, Eye, Sparkles } from "lucide-react";
import { formatDistance } from "date-fns";

interface VideoContentProps {
  title: string;
  description?: string;
  hashtags?: string[];
  metrics: {
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  };
  status?: 'processing' | 'ready' | 'failed';
  videoId: string;
  category?: { name: string } | null;
  onInteraction?: () => void;
  isCompact?: boolean;
  uploadDate?: string;
}

export const VideoContent = ({
  title,
  description,
  hashtags = [],
  metrics,
  status,
  videoId,
  category,
  onInteraction,
  isCompact = false,
  uploadDate
}: VideoContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col overflow-hidden"
    >
      <VideoHeader 
        title={title} 
        status={status} 
        isCompact={isCompact}
      />
      
      <VideoTags 
        hashtags={hashtags} 
        onTagClick={(tag) => {
          toast.info(`Filtering by tag: ${tag}`, {
            className: 'glass-dark',
            duration: 2000,
          });
        }} 
        isCompact={isCompact}
      />

      {!isCompact && (
        <div className="p-3 space-y-3">
          {description && (
            <p className="text-youtube-gray text-sm line-clamp-2 mb-2">{description}</p>
          )}
          
          <VideoMetricsDisplay
            views={metrics.views}
            likes={metrics.likes}
            comments={metrics.comments}
            isCompact={isCompact}
          />
          
          <VideoInteractionBar
            videoId={videoId}
            initialLikes={metrics.likes}
            initialDislikes={metrics.dislikes}
            initialComments={metrics.comments}
            onInteraction={onInteraction}
          />
        </div>
      )}
      
      {isCompact && (
        <div className="px-3 pb-3 pt-1">
          <div className="flex items-center justify-between text-xs text-youtube-gray">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{metrics.views}</span>
            </div>
            
            {uploadDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDistance(new Date(uploadDate), new Date(), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
