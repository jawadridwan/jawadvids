
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/format";

interface VideoMetricsDisplayProps {
  views: number;
  likes: number;
  comments: number;
  isCompact?: boolean;
}

export const VideoMetricsDisplay = ({ 
  views, 
  likes, 
  comments,
  isCompact = false
}: VideoMetricsDisplayProps) => {
  const metrics = [
    { icon: Eye, label: 'views', value: views },
    { icon: ThumbsUp, label: 'likes', value: likes },
    { icon: MessageCircle, label: 'comments', value: comments },
  ];

  if (isCompact) {
    return (
      <div className="flex items-center gap-3 text-xs text-youtube-gray">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{formatCompactNumber(views)}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3" />
          <span>{formatCompactNumber(likes)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {metrics.map(({ icon: Icon, label, value }, index) => (
        <div 
          key={label}
          className={cn(
            "flex flex-col items-center gap-1 px-2 py-1 rounded-lg",
            "bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm"
          )}
        >
          <Icon className="w-4 h-4 text-youtube-gray" />
          <div className="flex flex-col items-center">
            <span className="text-white font-medium text-sm">
              {formatCompactNumber(value)}
            </span>
            <span className="text-youtube-gray text-xs">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
