import { useState, useEffect } from "react";
import { AuthComponent } from "@/components/auth/Auth";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Video } from "@/types/video";
import { TikTokFeed } from "@/components/video/TikTokFeed";
import { VideoUploadDialog } from "@/components/upload/VideoUploadDialog";

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

      // Transform the data to match the Video interface
      const transformedVideos: Video[] = (data || []).map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        hashtags: [], // Default empty array since it's not in the database
        views: '0', // Default value
        thumbnail: video.thumbnail_url || '',
        url: video.url,
        thumbnail_url: video.thumbnail_url,
        uploadDate: video.created_at,
        status: 'ready' as const, // Default to ready since we're displaying existing videos
        created_at: video.created_at,
        updated_at: video.updated_at,
        user_id: video.user_id,
        likes: 0,
        dislikes: 0
      }));

      setVideos(transformedVideos);
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
        />
      </div>
    </div>
  );
};

export default Index;