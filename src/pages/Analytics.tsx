import { Sidebar } from "@/components/Sidebar";
import { MetricCard } from "@/components/MetricCard";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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

  const { data: videos, refetch } = useQuery({
    queryKey: ['videos', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          reactions (type),
          performance_metrics (views_count, comments_count)
        `)
        .eq('user_id', session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: videoStats } = useQuery({
    queryKey: ['videoStats', videos],
    queryFn: async () => {
      try {
        if (!videos) return null;

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
        console.error('Error calculating video stats:', error);
        return null;
      }
    },
    enabled: !!videos
  });

  useEffect(() => {
    const channel = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos'
        },
        () => {
          refetch();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to analytics changes');
        }
      });

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
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Total Videos"
              value={videoStats?.totalVideos || 0}
              icon="video"
            />
            <MetricCard
              title="Total Views"
              value={videoStats?.totalViews || 0}
              icon="eye"
            />
            <MetricCard
              title="Total Likes"
              value={videoStats?.totalLikes || 0}
              icon="thumbs-up"
            />
            <MetricCard
              title="Total Comments"
              value={videoStats?.totalComments || 0}
              icon="message-circle"
            />
          </div>

          <div className="bg-youtube-dark rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Performance Over Time</h2>
            <AnalyticsChart data={videos || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;