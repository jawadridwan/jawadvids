
import { VideoMetadata } from "./VideoMetadata";
import { VideoMetricsDisplay } from "./VideoMetricsDisplay";
import { VideoInteractionBar } from "./VideoInteractionBar";
import { VideoTags } from "./VideoTags";
import { VideoHeader } from "./VideoHeader";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
}

export const VideoContent = ({
  title,
  description,
  hashtags = [],
  metrics,
  status,
  videoId,
  category,
  onInteraction
}: VideoContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-b from-youtube-dark/50 to-youtube-darker rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/5"
    >
      <VideoHeader title={title} status={status} />
      
      {category && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-4 py-1"
        >
          <span className="text-sm text-youtube-gray glass-dark px-3 py-1 rounded-full inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            {category.name}
          </span>
        </motion.div>
      )}

      <VideoTags hashtags={hashtags} onTagClick={(tag) => {
        toast.info(`Filtering by tag: ${tag}`, {
          className: 'glass-dark',
          duration: 2000,
        });
      }} />

      <VideoMetadata
        title={title}
        description={description}
        hashtags={hashtags}
        views={metrics.views.toString()}
        showTitle={false}
        showViews={false}
      />

      <div className="p-4 space-y-4">
        <VideoMetricsDisplay
          views={metrics.views}
          likes={metrics.likes}
          comments={metrics.comments}
        />
        
        <VideoInteractionBar
          videoId={videoId}
          initialLikes={metrics.likes}
          initialDislikes={metrics.dislikes}
          initialComments={metrics.comments}
          onInteraction={onInteraction}
        />
      </div>
    </motion.div>
  );
};
