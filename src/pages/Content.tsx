import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { useState } from "react";
import { Video } from "@/types/video";

const Content = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  return (
    <div className="flex bg-youtube-darker min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Your Content</h1>
          <VideoList videos={videos} setVideos={setVideos} />
        </div>
      </main>
    </div>
  );
};

export default Content;