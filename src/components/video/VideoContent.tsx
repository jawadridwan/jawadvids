
import { VideoMetadata } from "./VideoMetadata";
import { VideoMetricsDisplay } from "./VideoMetricsDisplay";
import { VideoInteractionBar } from "./VideoInteractionBar";
import { VideoTags } from "./VideoTags";

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
    <>
      <VideoHeader title={title} status={status} />
      
      {category && (
        <div className="px-4 py-1">
          <span className="text-sm text-youtube-gray bg-youtube-dark/50 px-2 py-1 rounded">
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
    </>
  );
};
