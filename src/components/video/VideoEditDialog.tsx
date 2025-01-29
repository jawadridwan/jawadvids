import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VideoEditDialogProps {
  id: string;
  title: string;
  description?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VideoEditDialog = ({
  id,
  title: initialTitle,
  description: initialDescription,
  isOpen,
  onOpenChange,
}: VideoEditDialogProps) => {
  const [editTitle, setEditTitle] = useState(initialTitle);
  const [editDescription, setEditDescription] = useState(initialDescription || '');

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({
          title: editTitle,
          description: editDescription,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Video updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('Failed to update video');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Video title"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Video description"
          />
          <Button onClick={handleEdit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};