import { Button } from "@/components/ui/button";
import { Pencil, Save, Trash2, X } from "lucide-react";

interface CommentActionsProps {
  isEditing: boolean;
  isOwnComment: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export const CommentActions = ({
  isEditing,
  isOwnComment,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: CommentActionsProps) => {
  if (!isOwnComment) return null;

  return (
    <div className="flex gap-2">
      {isEditing ? (
        <>
          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};