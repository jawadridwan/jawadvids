import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  videoId: string;
}

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  const session = useSession();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: comments = [], refetch } = useQuery({
    queryKey: ['comments', videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq('video_id', videoId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: comment.trim(),
          video_id: videoId,
          user_id: session.user.id,
        });

      if (error) throw error;

      toast.success("Comment added successfully");
      setComment("");
      refetch();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1"
            disabled={!session || isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={!session || isSubmitting || !comment.trim()}
            className="self-start"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <CommentList comments={comments} onCommentUpdate={refetch} />
    </div>
  );
};