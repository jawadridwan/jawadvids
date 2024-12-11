import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ThumbnailUpload } from "./ThumbnailUpload";
import { HashtagInput } from "./HashtagInput";
import { VisibilitySelect } from "./VisibilitySelect";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "../ui/progress";

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
  const [video, setVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a video file under 100MB.",
          variant: "destructive",
        });
        return;
      }
      setVideo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your video.",
        variant: "destructive",
      });
      return;
    }

    if (!video) {
      toast({
        title: "Video required",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // Create form data
      const formData = new FormData();
      formData.append('video', video);
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('userId', user.id);

      // Get the function URL from Supabase
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-video`;
      console.log('Uploading to:', functionUrl); // Debug log

      // Upload video using the Edge Function
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Upload failed:', errorData); // Debug log
        throw new Error(errorData.message || 'Failed to upload video');
      }

      const { video: videoData } = await response.json();
      console.log('Upload successful:', videoData); // Debug log

      // If thumbnail exists, upload it
      if (thumbnail) {
        const thumbnailPath = `thumbnails/${videoData.id}`;
        const { error: thumbnailError } = await supabase.storage
          .from('videos')
          .upload(thumbnailPath, thumbnail);

        if (thumbnailError) {
          console.error('Failed to upload thumbnail:', thumbnailError);
        } else {
          const { data: { publicUrl: thumbnailUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(thumbnailPath);

          // Update video record with thumbnail URL
          await supabase
            .from('videos')
            .update({ thumbnail_url: thumbnailUrl })
            .eq('id', videoData.id);

          videoData.thumbnail_url = thumbnailUrl;
        }
      }

      onUploadComplete({
        ...videoData,
        hashtags,
        status: 'processing',
        visibility,
      });

      onClose();
      
      toast({
        title: "Video uploaded successfully",
        description: "Your video is now processing and will be available soon.",
      });
    } catch (error: any) {
      console.error('Upload error:', error); // Debug log
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your video.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          disabled={uploading}
        />
        
        <Textarea
          placeholder="Video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
          disabled={uploading}
        />

        <HashtagInput
          hashtags={hashtags}
          onChange={setHashtags}
          maxTags={15}
          disabled={uploading}
        />

        <div className="space-y-2">
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            disabled={uploading}
          />
          {video && (
            <p className="text-sm text-gray-500">
              Selected: {video.name} ({(video.size / (1024 * 1024)).toFixed(2)}MB)
            </p>
          )}
        </div>

        <ThumbnailUpload
          onThumbnailSelect={(file) => setThumbnail(file)}
          disabled={uploading}
        />

        <VisibilitySelect
          value={visibility}
          onChange={setVisibility}
          disabled={uploading}
        />

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-gray-500">
              Uploading... {progress}%
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Video"}
        </Button>
      </div>
    </form>
  );
};