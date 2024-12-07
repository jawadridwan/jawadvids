import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRef } from "react";

const Index = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Processing video",
        description: "Your video is being processed...",
      });
    }
  };

  return (
    <div className="flex bg-[#1F1F1F] min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
              />
              <Button 
                onClick={handleUploadClick}
                className="bg-youtube-red hover:bg-youtube-red/90 transition-colors active:scale-95 touch-none"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
            </div>
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