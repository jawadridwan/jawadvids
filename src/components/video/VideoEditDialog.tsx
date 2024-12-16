import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface VideoEditDialogProps {
  video: {
    id: string;
    title: string;
    description?: string;
    hashtags?: string[];
  };
  onClose: () => void;
}

export const VideoEditDialog = ({ video, onClose }: VideoEditDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState(video.title);
  const [newDescription, setNewDescription] = useState(video.description || "");
  const [newHashtags, setNewHashtags] = useState(video.hashtags?.join(" ") || "");

  const saveEdit = async () => {
    if (newTitle.trim()) {
      try {
        const { error } = await supabase
          .from('videos')
          .update({
            title: newTitle,
            description: newDescription,
          })
          .eq('id', video.id);

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['videos'] });
        onClose();
        toast({
          title: "Changes saved",
          description: "Your video details have been updated.",
        });
      } catch (error) {
        console.error('Error updating video:', error);
        toast({
          title: "Error",
          description: "Failed to update video. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Video Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter new title"
        />
        <Textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter new description"
        />
        <Input
          value={newHashtags}
          onChange={(e) => setNewHashtags(e.target.value)}
          placeholder="#youtube #video"
        />
        <Button onClick={saveEdit}>Save Changes</Button>
      </div>
    </DialogContent>
  );
};