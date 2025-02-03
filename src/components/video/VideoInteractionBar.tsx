import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "@supabase/auth-helpers-react";

interface VideoInteractionBarProps {
  videoId: string;
  initialLikes: number;
  initialDislikes: number;
  initialComments: number;
  onInteraction?: () => void;
  className?: string;
}

export const VideoInteractionBar = ({
  videoId,
  initialLikes,
  initialDislikes,
  initialComments,
  onInteraction,
  className
}: VideoInteractionBarProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [comments, setComments] = useState(initialComments);
  const session = useSession();

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!session?.user) {
      toast.error('Please sign in to react to videos');
      return;
    }

    try {
      const { data: existingReaction } = await supabase
        .from('reactions')
        .select()
        .eq('video_id', videoId)
        .eq('user_id', session.user.id)
        .eq('type', type)
        .single();

      if (existingReaction) {
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);
        
        type === 'like' ? setLikes(prev => prev - 1) : setDislikes(prev => prev - 1);
      } else {
        await supabase
          .from('reactions')
          .insert({ 
            video_id: videoId,
            user_id: session.user.id,
            type 
          });
        
        type === 'like' ? setLikes(prev => prev + 1) : setDislikes(prev => prev - 1);
      }

      onInteraction?.();
      toast.success(`${type === 'like' ? 'Liked' : 'Disliked'} video`);
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Video link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 hover:bg-youtube-dark"
        onClick={() => handleReaction('like')}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{likes}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 hover:bg-youtube-dark"
        onClick={() => handleReaction('dislike')}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{dislikes}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 hover:bg-youtube-dark"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{comments}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 hover:bg-youtube-dark"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>
    </div>
  );
};