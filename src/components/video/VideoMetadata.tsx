
import { Badge } from "../ui/badge";

interface VideoMetadataProps {
  title: string;
  description?: string;
  hashtags?: string[];
  views: string;
  status?: 'processing' | 'ready' | 'failed';
  showTitle?: boolean;
  showViews?: boolean;
}

export const VideoMetadata = ({ 
  title, 
  description, 
  hashtags, 
  views, 
  status,
  showTitle = true,
  showViews = true
}: VideoMetadataProps) => {
  return (
    <div className="p-4 space-y-3">
      {status && (
        <Badge 
          variant={status === 'ready' ? 'default' : status === 'processing' ? 'secondary' : 'destructive'}
          className="mb-2"
        >
          {status === 'ready' ? 'Ready' : status === 'processing' ? 'Processing' : 'Failed'}
        </Badge>
      )}
      {showTitle && (
        <h3 className="text-white font-medium line-clamp-2 text-base md:text-lg">{title}</h3>
      )}
      {description && (
        <p className="text-youtube-gray text-sm line-clamp-2">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {hashtags?.map((tag, index) => (
          <span key={index} className="text-blue-400 text-xs hover:underline cursor-pointer">
            #{tag}
          </span>
        ))}
      </div>
      {showViews && (
        <p className="text-youtube-gray text-sm">{views} views</p>
      )}
    </div>
  );
};
