import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { VideoEditDialog } from "./VideoEditDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Video {
  id: string;
  title: string;
  description?: string;
  hashtags?: string[];
}

interface VideoActionsProps {
  video: Video;
}

export const VideoActions = ({ video }: VideoActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (videoId: string) => {
    try {
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
      <Dialog>
        <Button
          variant="secondary"
          size="icon"
          className="bg-black/50 hover:bg-black/70"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <VideoEditDialog video={video} onClose={() => {}} />
      </Dialog>
      <Button
        variant="destructive"
        size="icon"
        className="bg-black/50 hover:bg-red-600"
        onClick={() => handleDelete(video.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};