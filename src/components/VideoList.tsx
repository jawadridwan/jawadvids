import { useState } from "react";
import { VideoCard } from "./VideoCard";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface Video {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  file?: File;
}

export const VideoList = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const handleVideoUpload = (file: File) => {
    const videoUrl = URL.createObjectURL(file);
    const newVideo: Video = {
      id: Date.now().toString(),
      title: file.name,
      views: "0",
      thumbnail: videoUrl,
      file: file
    };
    setVideos([...videos, newVideo]);
    toast({
      title: "Video uploaded",
      description: "Your video has been successfully uploaded.",
    });
  };

  const handleDelete = (videoId: string) => {
    setVideos(videos.filter(video => video.id !== videoId));
    toast({
      title: "Video deleted",
      description: "Your video has been removed.",
    });
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setNewTitle(video.title);
  };

  const saveEdit = () => {
    if (editingVideo && newTitle.trim()) {
      setVideos(videos.map(v => 
        v.id === editingVideo.id ? { ...v, title: newTitle } : v
      ));
      setEditingVideo(null);
      toast({
        title: "Changes saved",
        description: "Your video title has been updated.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="relative group">
          <VideoCard
            title={video.title}
            views={video.views}
            thumbnail={video.thumbnail}
          />
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70"
                  onClick={() => handleEdit(video)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Video Title</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter new title"
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