import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ThumbnailUpload } from "./ThumbnailUpload";
import { HashtagInput } from "./HashtagInput";
import { VisibilitySelect } from "./VisibilitySelect";
import { useToast } from "../ui/use-toast";

interface UploadFormProps {
  onUploadComplete: (videoData: any) => void;
  onClose: () => void;
}

export const UploadForm = ({ onUploadComplete, onClose }: UploadFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState("public");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your video.",
        variant: "destructive",
      });
      return;
    }

    const videoData = {
      id: crypto.randomUUID(),
      title,
      description,
      hashtags,
      views: "0",
      thumbnail: thumbnail ? URL.createObjectURL(thumbnail) : "/placeholder.svg",
      uploadDate: new Date().toISOString(),
      status: 'processing' as const,
      visibility,
    };

    onUploadComplete(videoData);
    onClose();
    
    toast({
      title: "Video uploaded successfully",
      description: "Your video is now processing and will be available soon.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
        
        <Textarea
          placeholder="Video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
        />

        <HashtagInput
          hashtags={hashtags}
          onChange={setHashtags}
          maxTags={15}
        />

        <ThumbnailUpload
          onThumbnailSelect={(file) => setThumbnail(file)}
        />

        <VisibilitySelect
          value={visibility}
          onChange={setVisibility}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Upload Video</Button>
      </div>
    </form>
  );
};