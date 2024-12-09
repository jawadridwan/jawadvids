import { Badge } from "./ui/badge";

interface VideoCardProps {
  title: string;
  views: string;
  thumbnail: string;
  description?: string;
  hashtags?: string[];
  status?: 'processing' | 'ready' | 'failed';
}

export const VideoCard = ({ title, views, thumbnail, description, hashtags, status }: VideoCardProps) => {
  return (
    <div className="bg-youtube-dark rounded-xl overflow-hidden animate-fade-in hover:scale-105 transition-transform">
      <div className="relative">
        <img src={thumbnail} alt={title} className="w-full aspect-video object-cover" />
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
          00:00
        </div>
        {status && (
          <Badge 
            variant={status === 'ready' ? 'default' : status === 'processing' ? 'secondary' : 'destructive'}
            className="absolute top-2 left-2"
          >
            {status === 'ready' ? 'Ready' : status === 'processing' ? 'Processing' : 'Failed'}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-medium mb-2 line-clamp-2">{title}</h3>
        {description && (
          <p className="text-youtube-gray text-sm mb-2 line-clamp-2">{description}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          {hashtags?.map((tag, index) => (
            <span key={index} className="text-blue-400 text-xs hover:underline cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-youtube-gray text-sm">{views} views</p>
      </div>
    </div>
  );
};