import { VideoCard } from "./VideoCard";
import { VideoActions } from "./video/VideoActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  description?: string;
  hashtags?: string[];
  views: string;
  thumbnail: string;
  url?: string;
  file?: File;
  uploadDate: string;
  status: 'processing' | 'ready' | 'failed';
  created_at: string;
  updated_at: string;
  user_id: string;
  thumbnail_url: string;
}

interface VideoListProps {
  videos: Video[];
  setVideos: (videos: Video[]) => void;
}

export const VideoList = ({ videos: initialVideos, setVideos }: VideoListProps) => {
  // Fetch videos using React Query
  const { data: videos = initialVideos } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      console.log('Fetching videos from Supabase');
      const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }

      return videos.map(video => ({
        ...video,
        views: '0',
        status: 'ready' as const,
        uploadDate: video.created_at,
        thumbnail: video.thumbnail_url || '/placeholder.svg',
        hashtags: [], // Initialize empty hashtags array if none exists
      }));
    },
    initialData: initialVideos.map(video => ({
      ...video,
      created_at: video.uploadDate,
      updated_at: video.uploadDate,
      user_id: '', // Provide default value
      thumbnail_url: video.thumbnail,
    })),
  });

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        No videos uploaded yet. Click the Upload Video button to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="relative group">
          <VideoCard
            title={video.title}
            views={video.views}
            thumbnail={video.thumbnail}
            description={video.description}
            hashtags={video.hashtags}
            status={video.status}
            url={video.url}
          />
          <VideoActions video={video} />
        </div>
      ))}
    </div>
  );
};