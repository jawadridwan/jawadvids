import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

interface VideoMetricsDisplayProps {
  views: number;
  likes: number;
  comments: number;
  className?: string;
}

export const VideoMetricsDisplay = ({ views, likes, comments, className }: VideoMetricsDisplayProps) => {
  return (
    <div className={cn("flex gap-4 text-sm text-youtube-gray", className)}>
      <span className="flex items-center gap-1">
        <span>{formatNumber(views)}</span>
        <span>views</span>
      </span>
      <span className="flex items-center gap-1">
        <span>{formatNumber(likes)}</span>
        <span>likes</span>
      </span>
      <span className="flex items-center gap-1">
        <span>{formatNumber(comments)}</span>
        <span>comments</span>
      </span>
    </div>
  );
};