import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface ThumbnailUploadProps {
  onThumbnailSelect: (file: File) => void;
  disabled?: boolean;
}

export const ThumbnailUpload = ({ onThumbnailSelect, disabled }: ThumbnailUploadProps) => {
  const [preview, setPreview] = useState<string>("");

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

      try {
        // Create a preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Resize image if needed
        const resizedFile = await resizeImage(file);
        onThumbnailSelect(resizedFile);
        toast.success('Thumbnail uploaded successfully');
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to process image');
      }
    }
  };

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maximum dimensions
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 720;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    });
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