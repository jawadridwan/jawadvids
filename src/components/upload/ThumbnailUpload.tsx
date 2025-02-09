
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface ThumbnailUploadProps {
  onThumbnailSelect: (file: File) => void;
  disabled?: boolean;
  videoName?: string;
}

export const ThumbnailUpload = ({ onThumbnailSelect, disabled, videoName }: ThumbnailUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      setSelectedFile(file.name);
      onThumbnailSelect(file);
      toast.success('Thumbnail selected successfully');
    }
  };

  return (
    <div className="space-y-4">
      {videoName && (
        <div className="p-4 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Video selected: {videoName}
          </p>
        </div>
      )}
      {selectedFile && (
        <div className="p-4 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thumbnail selected: {selectedFile}
          </p>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="thumbnail-upload"
          disabled={disabled}
        />
        <label htmlFor="thumbnail-upload">
          <Button type="button" variant="outline" asChild disabled={disabled}>
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Custom Thumbnail (Optional)
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
};
