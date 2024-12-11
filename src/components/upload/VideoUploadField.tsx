import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

interface VideoUploadFieldProps {
  onVideoSelect: (file: File) => void;
  disabled: boolean;
}

export const VideoUploadField = ({ onVideoSelect, disabled }: VideoUploadFieldProps) => {
  const { toast } = useToast();

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
      onVideoSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="video/*"
        onChange={handleVideoSelect}
        disabled={disabled}
      />
    </div>
  );
};