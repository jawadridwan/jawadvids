
import { Badge } from "../ui/badge";

interface VideoMetadataProps {
  title: string;
  description?: string;
  hashtags?: string[];
  status?: 'processing' | 'ready' | 'failed';
}

export const VideoMetadata = ({ 
  title, 
  description, 
  hashtags,
  status 
}: VideoMetadataProps) => {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        {status && (
          <Badge 
            variant={status === 'ready' ? 'default' : status === 'processing' ? 'secondary' : 'destructive'}
            className="px-2 py-0.5 text-xs font-medium rounded-full"
          >
            {status === 'ready' ? 'Ready' : status === 'processing' ? 'Processing' : 'Failed'}
          </Badge>
        )}
      </div>
      <h3 className="text-white font-medium line-clamp-2 text-base md:text-lg tracking-tight">{title}</h3>
      {description && (
        <p className="text-youtube-gray text-sm line-clamp-2 leading-relaxed">{description}</p>
      )}
      {hashtags && hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <span 
              key={index} 
              className="text-blue-400 text-xs hover:text-blue-300 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
