import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { useState } from "react";
import { Video } from "@/types/video";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Content = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const session = useSession();

  const { data: userVideos } = useQuery({
    queryKey: ['user-videos'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('videos')
        .select('*, reactions(type)')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      return data.map((video: any) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        views: '0',
        status: video.status || 'ready' as const,
        uploadDate: video.created_at,
        thumbnail: video.thumbnail_url || '/placeholder.svg',
        hashtags: [],
        created_at: video.created_at,
        updated_at: video.updated_at,
        user_id: video.user_id,
        thumbnail_url: video.thumbnail_url,
        url: video.url,
        likes: video.reactions?.filter((r: any) => r.type === 'like').length || 0,
        dislikes: video.reactions?.filter((r: any) => r.type === 'dislike').length || 0
      }));
    },
    enabled: !!session?.user?.id
  });

  return (
    <div className="flex bg-youtube-darker min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Your Content</h1>
          <VideoList videos={userVideos || videos} setVideos={setVideos} />
        </div>
      </main>
    </div>
  );
};

export default Content;