import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { VideoEditDialog } from "./VideoEditDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { Video } from "@/types/video";

interface VideoActionsProps {
  video: Video;
  onDelete?: () => void;
}

export const VideoActions = ({ video, onDelete }: VideoActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const isOwner = session?.user?.id === video.user_id;

  const handleDelete = async (videoId: string) => {
    try {
      if (!isOwner) {
        toast({
          title: "Permission denied",
          description: "You can only delete videos you've uploaded.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: "Video deleted",
        description: "Your video has been removed.",
      });
      onDelete?.();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {isOwner && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="bg-black/50 hover:bg-black/70"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="bg-black/50 hover:bg-red-600"
            onClick={() => handleDelete(video.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
      <VideoEditDialog
        id={video.id}
        title={video.title}
        description={video.description}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};