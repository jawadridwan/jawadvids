import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { VideoUploadDialog } from "@/components/upload/VideoUploadDialog";
import { useState } from "react";

interface Video {
  id: string;
  title: string;
  description?: string;
  hashtags?: string[];
  views: string;
  thumbnail: string;
  file?: File;
  uploadDate: string;
  status: 'processing' | 'ready' | 'failed';
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  const handleUploadComplete = (videoData: Video) => {
    setVideos(prev => [...prev, videoData]);
  };

  return (
    <div className="flex bg-youtube-darker min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <VideoUploadDialog onUploadComplete={handleUploadComplete} />
          </div>

          <h2 className="text-xl font-bold text-white mb-4">Your Videos</h2>
          <VideoList videos={videos} setVideos={setVideos} />
        </div>
      </main>
    </div>
  );
};

export default Index;