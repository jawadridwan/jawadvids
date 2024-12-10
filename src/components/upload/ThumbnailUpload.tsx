import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Upload } from "lucide-react";

interface ThumbnailUploadProps {
  onThumbnailSelect: (file: File) => void;
  disabled?: boolean;
}

export const ThumbnailUpload = ({ onThumbnailSelect, disabled }: ThumbnailUploadProps) => {
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onThumbnailSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
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
              Upload Thumbnail
            </span>
          </Button>
        </label>
      </div>
      {preview && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={preview}
            alt="Thumbnail preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
};