import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadForm } from "./UploadForm";
import { toast } from "sonner";

interface VideoUploadDialogProps {
  onUploadComplete: (videoData: any) => void;
}

export const VideoUploadDialog = ({ onUploadComplete }: VideoUploadDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleUploadComplete = (videoData: any) => {
    onUploadComplete(videoData);
    setOpen(false);
    toast.success("Video uploaded successfully!");
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    toast.error("Upload failed: " + error.message);
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-youtube-red hover:bg-youtube-red/90"
      >
        Upload Video
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] bg-youtube-darker border-youtube-dark">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Upload Video</DialogTitle>
          </DialogHeader>
          <UploadForm 
            onSuccess={handleUploadComplete}
            onError={handleUploadError}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};