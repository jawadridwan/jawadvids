import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { useState, useEffect } from "react";
import { Video } from "@/types/video";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VideoUploadDialog } from "@/components/upload/VideoUploadDialog";
import { Loader2 } from "lucide-react";

const Content = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const session = useSession();

  const { data: userVideos, isError, refetch, isLoading } = useQuery({
    queryKey: ['user-videos'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          reactions(type),
          performance_metrics(
            views_count,
            likes_count,
            comments_count,
            shares_count
          )
        `)
        .eq('user_id', session.user.id);

      if (error) {
        toast.error('Failed to fetch videos');
        throw error;
      }
      
      return data.map((video: any) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        views: video.performance_metrics?.[0]?.views_count?.toString() || '0',
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
        dislikes: video.reactions?.filter((r: any) => r.type === 'dislike').length || 0,
        engagement: {
          views: video.performance_metrics?.[0]?.views_count || 0,
          likes: video.performance_metrics?.[0]?.likes_count || 0,
          comments: video.performance_metrics?.[0]?.comments_count || 0,
          shares: video.performance_metrics?.[0]?.shares_count || 0
        }
      }));
    },
    enabled: !!session?.user?.id
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos',
          filter: `user_id=eq.${session?.user?.id}`
        },
        (payload) => {
          console.log('Video changes detected:', payload);
          refetch();
          toast.success('Content updated');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, refetch]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-youtube-darker">
        <p className="text-white text-xl">Please sign in to view your content</p>
      </div>
    );
  }

  return (
    <div className="flex bg-youtube-darker min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Your Content</h1>
              {isLoading && (
                <div className="flex items-center gap-2 text-youtube-gray">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              )}
            </div>
            <VideoUploadDialog onUploadComplete={(video) => setVideos([...videos, video])} />
          </div>
          {isError ? (
            <p className="text-red-500">Failed to load videos. Please try again later.</p>
          ) : (
            <VideoList videos={userVideos || videos} setVideos={setVideos} showOnlyUserVideos={true} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Content;