import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VideoReactionsProps {
  videoId: string;
  initialLikes?: number;
  initialDislikes?: number;
}

export const VideoReactions = ({ videoId, initialLikes = 0, initialDislikes = 0 }: VideoReactionsProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    fetchUserReaction();
  }, [videoId]);

  const fetchUserReaction = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: reactions } = await supabase
      .from('reactions')
      .select('type')
      .eq('video_id', videoId)
      .eq('user_id', session.user.id);

    if (reactions && reactions.length > 0) {
      setUserReaction(reactions[0].type as 'like' | 'dislike');
    }
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please sign in to react to videos');
      return;
    }

    try {
      if (userReaction === type) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', session.user.id);

        setUserReaction(null);
        if (type === 'like') {
          setLikes(prev => Math.max(0, prev - 1));
        } else {
          setDislikes(prev => Math.max(0, prev - 1));
        }
      } else {
        // Remove existing reaction if any
        if (userReaction) {
          await supabase
            .from('reactions')
            .delete()
            .eq('video_id', videoId)
            .eq('user_id', session.user.id);

          if (userReaction === 'like') {
            setLikes(prev => Math.max(0, prev - 1));
          } else {
            setDislikes(prev => Math.max(0, prev - 1));
          }
        }

        // Add new reaction
        await supabase
          .from('reactions')
          .insert([
            {
              video_id: videoId,
              user_id: session.user.id,
              type
            }
          ]);

        setUserReaction(type);
        if (type === 'like') {
          setLikes(prev => prev + 1);
        } else {
          setDislikes(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${userReaction === 'like' ? 'text-youtube-red' : ''}`}
        onClick={() => handleReaction('like')}
      >
        <ThumbsUp className="w-5 h-5" />
        <span>{likes}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${userReaction === 'dislike' ? 'text-youtube-red' : ''}`}
        onClick={() => handleReaction('dislike')}
      >
        <ThumbsDown className="w-5 h-5" />
        <span>{dislikes}</span>
      </Button>
    </div>
  );
};