import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadForm } from "./UploadForm";
import { Upload } from "lucide-react";

interface VideoUploadDialogProps {
  onUploadComplete: (videoData: any) => void;
}

export const VideoUploadDialog: React.FC<VideoUploadDialogProps> = ({ onUploadComplete }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-youtube-red hover:bg-youtube-red/90 transition-colors active:scale-95 touch-none"
      >
        <Upload className="mr-2 h-5 w-5" />
        Upload Video
      </Button>
      <DialogContent className="sm:max-w-[600px] bg-youtube-darker border-youtube-dark">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Upload Video</DialogTitle>
        </DialogHeader>
        <UploadForm 
          onUploadComplete={(data) => {
            onUploadComplete(data);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};