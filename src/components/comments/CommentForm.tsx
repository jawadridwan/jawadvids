import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CommentFormProps {
  videoId: string;
  onCommentAdded: () => void;
  parentId?: string;
}

export const CommentForm = ({ videoId, onCommentAdded, parentId }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();

  if (!session) {
    return (
      <div className="text-gray-400 text-sm">
        Please sign in to comment
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      // First fetch recent comments by the user on this video
      const { data: existingComments } = await supabase
        .from('comments')
        .select('content, created_at')
        .eq('video_id', videoId)
        .eq('user_id', session.user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1);

      // Check if the most recent comment is identical and was posted within the last minute
      if (existingComments && existingComments.length > 0) {
        const lastComment = existingComments[0];
        const timeSinceLastComment = Date.now() - new Date(lastComment.created_at).getTime();
        if (lastComment.content === comment.trim() && timeSinceLastComment < 60000) {
          toast.error("Please wait a moment before posting the same comment again");
          return;
        }
      }

      // If no recent duplicate exists, insert the new comment
      const { error } = await supabase
        .from('comments')
        .insert({
          content: comment.trim(),
          video_id: videoId,
          user_id: session.user.id,
          parent_id: parentId || null
        });

      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }

      toast.success("Comment added successfully");
      setComment("");
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="min-h-[100px] bg-youtube-dark text-white placeholder:text-gray-400 resize-none"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="bg-youtube-red hover:bg-youtube-red/90"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};