import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface VideoOwnerActionsProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const VideoOwnerActions = ({ isOwner, onEdit, onDelete }: VideoOwnerActionsProps) => {
  if (!isOwner) return null;

  return (
    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="secondary"
        size="icon"
        className="bg-black/50 hover:bg-black/70"
        onClick={onEdit}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        className="bg-black/50 hover:bg-red-600"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};