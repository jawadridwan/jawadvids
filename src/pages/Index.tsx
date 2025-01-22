import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { VideoUploadDialog } from "@/components/upload/VideoUploadDialog";
import { ProfileManager } from "@/components/profile/ProfileManager";
import { useState, useEffect } from "react";
import { AuthComponent } from "@/components/auth/Auth";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Video } from "@/types/video";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-youtube-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-youtube-red"></div>
      </div>
    );
  }

  if (!session) {
    return <AuthComponent />;
  }

  return (
    <div className="flex flex-col md:flex-row bg-youtube-darker min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
              Dashboard
            </h1>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowProfile(!showProfile)}
                className="whitespace-nowrap"
              >
                {showProfile ? "Hide Profile" : "Edit Profile"}
              </Button>
              <VideoUploadDialog onUploadComplete={(video) => setVideos([...videos, video])} />
            </div>
          </div>

          {showProfile ? (
            <ProfileManager />
          ) : (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Your Videos</h2>
              <VideoList videos={videos} setVideos={setVideos} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;