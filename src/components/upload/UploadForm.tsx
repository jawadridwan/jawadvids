
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ThumbnailUpload } from "./ThumbnailUpload";
import { HashtagInput } from "./HashtagInput";
import { VisibilitySelect } from "./VisibilitySelect";
import { Progress } from "../ui/progress";
import { VideoUploadField } from "./VideoUploadField";
import { useVideoUpload } from "./useVideoUpload";
import { CategorySelect } from "./CategorySelect";

interface UploadFormProps {
  onUploadComplete: (videoData: any) => void;
  onClose: () => void;
}

export const UploadForm = ({ onUploadComplete, onClose }: UploadFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState("public");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");

  const { uploadVideo, uploading, progress } = useVideoUpload(onUploadComplete);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return;

    const success = await uploadVideo(
      video,
      title,
      description,
      thumbnail,
      hashtags,
      visibility,
      categoryId
    );

    if (success) {
      onClose();
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
          required
        />
        
        <Textarea
          placeholder="Video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
          disabled={uploading}
        />

        <CategorySelect
          value={categoryId}
          onChange={setCategoryId}
          disabled={uploading}
        />

        <HashtagInput
          hashtags={hashtags}
          onChange={setHashtags}
          maxTags={15}
          disabled={uploading}
        />

        <VideoUploadField
          onVideoSelect={setVideo}
          disabled={uploading}
        />
        {video && (
          <p className="text-sm text-gray-500">
            Selected: {video.name} ({(video.size / (1024 * 1024)).toFixed(2)}MB)
          </p>
        )}

        <ThumbnailUpload
          onThumbnailSelect={(file) => setThumbnail(file)}
          disabled={uploading}
          videoName={video?.name}
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
        <Button 
          type="submit" 
          disabled={uploading || !title || !video || !categoryId}
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </Button>
      </div>
    </form>
  );
};
