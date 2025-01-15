import { useState, useEffect } from "react";
import { AuthComponent } from "@/components/auth/Auth";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Video } from "@/types/video";
import { TikTokFeed } from "@/components/video/TikTokFeed";
import { VideoUploadDialog } from "@/components/upload/VideoUploadDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch videos');
        return;
      }

      setVideos(data || []);
    };

    fetchVideos();
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
    <div className="relative min-h-screen bg-youtube-darker">
      <TikTokFeed videos={videos} />
      
      <div className="fixed top-4 right-4 z-50">
        <VideoUploadDialog
          onUploadComplete={(videoData) => {
            setVideos(prev => [videoData, ...prev]);
            toast.success("Video uploaded successfully!");
          }}
        >
          <Button size="icon" className="rounded-full bg-youtube-red hover:bg-youtube-red/90">
            <Plus className="h-4 w-4" />
          </Button>
        </VideoUploadDialog>
      </div>
    </div>
  );
};

export default Index;