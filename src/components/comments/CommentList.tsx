import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommentActions } from "./CommentActions";
import { CommentContent } from "./CommentContent";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
}

interface CommentListProps {
  comments: Comment[];
  onCommentUpdate: () => void;
}

export const CommentList = ({ comments, onCommentUpdate }: CommentListProps) => {
  const session = useSession();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editContent.trim() })
        .eq('id', commentId);

      if (error) throw error;

      toast.success("Comment updated successfully");
      setEditingId(null);
      setEditContent("");
      onCommentUpdate();
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', commentId);

      if (error) throw error;

      toast.success("Comment deleted successfully");
      onCommentUpdate();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-youtube-dark p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <CommentContent
              username={comment.profiles?.username}
              avatarUrl={comment.profiles?.avatar_url}
              createdAt={comment.created_at}
              content={comment.content}
              isEditing={editingId === comment.id}
              editContent={editContent}
              onEditContentChange={setEditContent}
            />
            <CommentActions
              isEditing={editingId === comment.id}
              isOwnComment={session?.user?.id === comment.user_id}
              onEdit={() => handleEdit(comment)}
              onSave={() => handleSaveEdit(comment.id)}
              onCancel={handleCancelEdit}
              onDelete={() => handleDelete(comment.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};