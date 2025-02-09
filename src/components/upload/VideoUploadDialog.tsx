
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadForm } from "./UploadForm";
import { Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoUploadDialogProps {
  onUploadComplete: (videoData: any) => void;
}

export const VideoUploadDialog = ({ onUploadComplete }: VideoUploadDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-youtube-red hover:bg-youtube-red/90 transition-colors active:scale-95 touch-none"
      >
        <Upload className="mr-2 h-5 w-5" />
        Upload Video
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] bg-youtube-darker border-youtube-dark max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Upload Video</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-120px)] pr-4">
            <UploadForm 
              onUploadComplete={(data) => {
                onUploadComplete(data);
                setOpen(false);
              }}
              onClose={() => setOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
