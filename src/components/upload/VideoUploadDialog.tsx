import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { VideoUploadButton } from "./VideoUploadButton";
import { UploadForm } from "./UploadForm";
import { useState } from "react";

interface VideoUploadDialogProps {
  onUploadComplete: (videoData: any) => void;
}

export const VideoUploadDialog = ({ onUploadComplete }: VideoUploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <VideoUploadButton />
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
        </DialogHeader>
        <UploadForm 
          onUploadComplete={onUploadComplete}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};