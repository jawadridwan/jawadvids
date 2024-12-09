import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface UploadFormData {
  title: string;
  description: string;
  hashtags: string;
  file?: File;
}

const Index = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<UploadFormData>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('title', file.name.split('.')[0]);
    }
  };

  const handleUpload = (data: UploadFormData) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }

    // Create video object with form data
    const videoUrl = URL.createObjectURL(selectedFile);
    const videoData = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      hashtags: data.hashtags.split(' ').filter(tag => tag.startsWith('#')),
      views: "0",
      thumbnail: videoUrl,
      file: selectedFile,
    };

    // Reset form and close dialog
    form.reset();
    setSelectedFile(null);
    setIsDialogOpen(false);

    toast({
      title: "Success",
      description: "Your video has been uploaded successfully",
    });
  };

  return (
    <div className="flex bg-[#1F1F1F] min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-youtube-red hover:bg-youtube-red/90 transition-colors active:scale-95 touch-none"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload Video</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="video">Video File</Label>
                    <Input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                    />
                  </div>
                  
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      {...form.register('title')}
                      placeholder="Enter video title"
                    />
                  </div>

                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      {...form.register('description')}
                      placeholder="Enter video description"
                    />
                  </div>

                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="hashtags">Hashtags</Label>
                    <Input
                      {...form.register('hashtags')}
                      placeholder="#youtube #video"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Upload
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Video List */}
          <h2 className="text-xl font-bold text-white mb-4">Your Videos</h2>
          <VideoList />
        </div>
      </main>
    </div>
  );
};

export default Index;