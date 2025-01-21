import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/MetricCard";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

interface VideoWithMetrics {
  id: string;
  reactions: { type: string }[];
  performance_metrics: {
    views_count: number;
    comments_count: number;
  }[];
}

const Analytics = () => {
  const session = useSession();
  
  const { data: metrics, refetch } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: videoStats } = useQuery({
    queryKey: ['video-stats'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data: videos, error: videosError } = await supabase
          .from('videos')
          .select(`
            *,
            reactions (type),
            performance_metrics (
              views_count,
              comments_count
            )
          `)
          .eq('user_id', session.user.id);

        if (videosError) throw videosError;

        const typedVideos = videos as VideoWithMetrics[];
        
        const totalVideos = typedVideos?.length || 0;
        const totalViews = typedVideos?.reduce((sum, video) => {
          const metrics = video.performance_metrics?.[0];
          return sum + (metrics?.views_count || 0);
        }, 0) || 0;
        const totalLikes = typedVideos?.reduce((sum, video) => {
          return sum + (video.reactions?.filter(r => r.type === 'like').length || 0);
        }, 0) || 0;
        const totalComments = typedVideos?.reduce((sum, video) => {
          const metrics = video.performance_metrics?.[0];
          return sum + (metrics?.comments_count || 0);
        }, 0) || 0;

        return {
          totalVideos,
          totalViews,
          totalLikes,
          totalComments
        };
      } catch (error) {
        console.error('Error fetching video stats:', error);
        toast.error('Failed to load video statistics');
        return null;
      }
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    const channel = supabase
      .channel('analytics')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'performance_metrics' }, 
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-youtube-darker">
        <p className="text-white text-xl">Please sign in to view analytics</p>
      </div>
    );
  }

  return (
    <div className="flex bg-[#1F1F1F] min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>
          
          <div className="bg-youtube-dark rounded-xl p-6 mb-8 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-youtube-darker p-4 rounded-lg">
                <p className="text-youtube-gray text-sm">Total Videos</p>
                <p className="text-2xl font-bold text-white">{videoStats?.totalVideos || 0}</p>
              </div>
              <div className="bg-youtube-darker p-4 rounded-lg">
                <p className="text-youtube-gray text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">{videoStats?.totalViews || 0}</p>
              </div>
              <div className="bg-youtube-darker p-4 rounded-lg">
                <p className="text-youtube-gray text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-white">{videoStats?.totalLikes || 0}</p>
              </div>
              <div className="bg-youtube-darker p-4 rounded-lg">
                <p className="text-youtube-gray text-sm">Total Comments</p>
                <p className="text-2xl font-bold text-white">{videoStats?.totalComments || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 touch-pan-x">
            <MetricCard 
              title="Total Views" 
              value={metrics?.views_count?.toLocaleString() || '0'} 
              change="+12.3%" 
              positive 
            />
            <MetricCard 
              title="Total Likes" 
              value={metrics?.likes_count?.toLocaleString() || '0'} 
              change="+8.1%" 
              positive 
            />
            <MetricCard 
              title="Comments" 
              value={metrics?.comments_count?.toLocaleString() || '0'} 
              change="-2.4%" 
            />
            <MetricCard 
              title="Avg. Watch Duration" 
              value={`${Math.round((metrics?.avg_watch_duration || 0) / 60)}m`}
              change="+1.2%" 
              positive 
            />
          </div>

          <div className="mb-8 touch-none">
            <AnalyticsChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;