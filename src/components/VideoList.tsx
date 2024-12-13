import { VideoCard } from "./VideoCard";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  description?: string;
  hashtags?: string[];
  views: string;
  thumbnail: string;
  url?: string;
  file?: File;
  uploadDate: string;
  status: 'processing' | 'ready' | 'failed';
}

interface VideoListProps {
  videos: Video[];
  setVideos: (videos: Video[]) => void;
}

export const VideoList = ({ videos: initialVideos, setVideos }: VideoListProps) => {
  const { toast } = useToast();
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newHashtags, setNewHashtags] = useState("");
  const queryClient = useQueryClient();

  // Fetch videos using React Query
  const { data: videos = initialVideos } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      console.log('Fetching videos from Supabase');
      const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }

      return videos.map(video => ({
        ...video,
        views: '0', // You might want to fetch this from performance_metrics
        status: 'ready' as const,
        uploadDate: video.created_at,
      }));
    },
    initialData: initialVideos,
  });

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

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setNewTitle(video.title);
    setNewDescription(video.description || "");
    setNewHashtags(video.hashtags?.join(" ") || "");
  };

  const saveEdit = async () => {
    if (editingVideo && newTitle.trim()) {
      try {
        const { error } = await supabase
          .from('videos')
          .update({
            title: newTitle,
            description: newDescription,
          })
          .eq('id', editingVideo.id);

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['videos'] });
        setEditingVideo(null);
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

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No videos uploaded yet. Click the Upload Video button to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="relative group">
          <VideoCard
            title={video.title}
            views={video.views}
            thumbnail={video.thumbnail}
            description={video.description}
            hashtags={video.hashtags}
            status={video.status}
            url={video.url}
          />
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog>
              <Button
                variant="secondary"
                size="icon"
                className="bg-black/50 hover:bg-black/70"
                onClick={() => handleEdit(video)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
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
        </div>
      ))}
    </div>
  );
};