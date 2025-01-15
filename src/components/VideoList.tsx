import { VideoCard } from "./VideoCard";
import { VideoActions } from "./video/VideoActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/video";
import { AnalyticsChart } from "./AnalyticsChart";

interface VideoListProps {
  videos: Video[];
  setVideos: (videos: Video[]) => void;
}

export const VideoList = ({ videos: initialVideos, setVideos }: VideoListProps) => {
  const { data: videos = initialVideos } = useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      console.log('Fetching videos from Supabase');
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*, reactions(type)');

      if (videosError) {
        console.error('Error fetching videos:', videosError);
        throw videosError;
      }

      return videosData.map((video: any) => ({
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
    initialData: initialVideos,
  });

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No videos uploaded yet. Click the Upload Video button to get started.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnalyticsChart />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              dislikes={video.dislikes}
              user_id={video.user_id}
            />
            <VideoActions video={video} />
          </div>
        ))}
      </div>
    </div>
  );
};