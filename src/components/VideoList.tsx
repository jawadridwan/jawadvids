
import { VideoCard } from "./VideoCard";
import { VideoActions } from "./video/VideoActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/video";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

interface VideoListProps {
  videos: Video[];
  setVideos: (videos: Video[]) => void;
  showOnlyUserVideos?: boolean;
}

export const VideoList = ({ videos: initialVideos, setVideos, showOnlyUserVideos = false }: VideoListProps) => {
  const session = useSession();

  const { data: videos = initialVideos, isError, refetch } = useQuery({
    queryKey: ['videos', showOnlyUserVideos],
    queryFn: async () => {
      try {
        let query = supabase
          .from('videos')
          .select(`
            *,
            reactions (
              type
            ),
            performance_metrics(
              views_count,
              likes_count,
              comments_count,
              shares_count
            )
          `);

        if (showOnlyUserVideos && session?.user) {
          query = query.eq('user_id', session.user.id);
        }

        const { data: videosData, error: videosError } = await query;

        if (videosError) {
          console.error('Error fetching videos:', videosError);
          toast.error('Failed to load videos');
          throw videosError;
        }

        if (!videosData) {
          return [];
        }

        return videosData.map((video: any) => ({
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
          engagement: {
            views: video.performance_metrics?.[0]?.views_count || 0,
            likes: video.performance_metrics?.[0]?.likes_count || 0,
            comments: video.performance_metrics?.[0]?.comments_count || 0,
            shares: video.performance_metrics?.[0]?.shares_count || 0
          }
        }));
      } catch (error) {
        console.error('Error in video query:', error);
        toast.error('Failed to load videos');
        return initialVideos;
      }
    },
    initialData: initialVideos,
  });

  if (isError) {
    return (
      <div className="text-center text-red-500 py-12">
        Failed to load videos. Please try again later.
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No videos available. Click the Upload Video button to be the first!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="relative group">
          <VideoCard
            id={video.id}
            title={video.title}
            views={video.views}
            thumbnail={video.thumbnail}
            description={video.description || ''}
            hashtags={video.hashtags}
            status={video.status}
            url={video.url}
            likes={video.likes}
            user_id={video.user_id}
          />
          <VideoActions video={video} onDelete={refetch} />
        </div>
      ))}
    </div>
  );
};
