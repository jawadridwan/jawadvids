
import { Button } from "../ui/button";
import { ThumbsUp } from "lucide-react";
import { VideoMetricsProps } from "@/types/video-card";

export const VideoMetrics = ({ likes, onLike }: VideoMetricsProps) => {
  return (
    <div className="px-3 pb-3">
      <Button
        variant="ghost"
        size="sm"
        className="text-youtube-gray hover:text-white flex items-center gap-2"
        onClick={onLike}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm">{likes}</span>
      </Button>
    </div>
  );
};
