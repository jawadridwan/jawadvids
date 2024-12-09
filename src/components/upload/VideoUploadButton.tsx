import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { DialogTrigger } from "../ui/dialog";

export const VideoUploadButton = () => {
  return (
    <DialogTrigger asChild>
      <Button 
        size="lg"
        className="bg-youtube-red hover:bg-youtube-red/90 transition-colors active:scale-95 touch-none"
      >
        <Upload className="mr-2 h-5 w-5" />
        Upload Video
      </Button>
    </DialogTrigger>
  );
};