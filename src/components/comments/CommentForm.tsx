import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommentFormProps {
  videoId: string;
  onCommentAdded: () => void;
}

export const CommentForm = ({ videoId, onCommentAdded }: CommentFormProps) => {
  const session = useSession();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          user_id: session.user.id
        });

      if (error) {
        toast.error("Failed to add comment");
        console.error('Error adding comment:', error.message);
        return;
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
  );
};