import { MessageSquare, Share2 } from "lucide-react";
import { VideoReactions } from "./VideoReactions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VideoCardActionsProps {
  videoId: string;
  userId: string;
  likes?: number;
  dislikes?: number;
  commentsCount?: number;
  sharesCount?: number;
}

export const VideoCardActions = ({
  videoId,
  userId,
  likes = 0,
  dislikes = 0,
  commentsCount = 0,
  sharesCount = 0
}: VideoCardActionsProps) => {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/video/' + videoId);
      toast.success('Video link copied to clipboard!');
      
      await supabase.from('engagement').insert({
        video_id: videoId,
        type: 'share',
        user_id: userId
      });
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <VideoReactions videoId={videoId} initialLikes={likes} initialDislikes={dislikes} />
      <div className="flex items-center gap-2 text-youtube-gray">
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm">{commentsCount}</span>
      </div>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 text-youtube-gray hover:text-white transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm">{sharesCount}</span>
      </button>
    </div>
  );
};