import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { VideoUploadDialog } from "@/components/upload/VideoUploadDialog";
import { useState, useEffect } from "react";
import { AuthComponent } from "@/components/auth/Auth";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Video } from "@/types/video";

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUploadComplete = (videoData: Video) => {
    setVideos(prev => [...prev, videoData]);
    toast.success("Video uploaded successfully!");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-youtube-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-youtube-red"></div>
      </div>
    );
  }

  // Show auth component if not authenticated
  if (!session) {
    return <AuthComponent />;
  }

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