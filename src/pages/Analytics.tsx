import { Sidebar } from "@/components/Sidebar";
import { MetricCard } from "@/components/MetricCard";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const [realtimeStats, setRealtimeStats] = useState<{
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  } | null>(null);

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

  const { data: videoStats, isLoading } = useQuery({
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

        setRealtimeStats({
          totalViews,
          totalLikes,
          totalComments
        });

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

  // Subscribe to real-time updates for views, reactions, and comments
  useEffect(() => {
    if (!videos?.length) return;

    const videoIds = videos.map(video => video.id);
    
    const channel = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'views',
          filter: `video_id=in.(${videoIds.join(',')})`
        },
        () => {
          console.log('Views updated, refreshing data...');
          refetch();
          toast.success('Views updated');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions',
          filter: `video_id=in.(${videoIds.join(',')})`
        },
        () => {
          console.log('Reactions updated, refreshing data...');
          refetch();
          toast.success('Reactions updated');
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `video_id=in.(${videoIds.join(',')})`
        },
        () => {
          console.log('Comments updated, refreshing data...');
          refetch();
          toast.success('Comments updated');
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
  }, [videos, refetch]);

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            {isLoading && (
              <div className="flex items-center gap-2 text-youtube-gray">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating metrics...</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
            <MetricCard
              title="Total Videos"
              value={videoStats?.totalVideos || 0}
              icon="video"
              className="hover:scale-105 transition-transform"
            />
            <MetricCard
              title="Total Views"
              value={realtimeStats?.totalViews || videoStats?.totalViews || 0}
              icon="eye"
              className="hover:scale-105 transition-transform"
            />
            <MetricCard
              title="Total Likes"
              value={realtimeStats?.totalLikes || videoStats?.totalLikes || 0}
              icon="thumbs-up"
              className="hover:scale-105 transition-transform"
            />
            <MetricCard
              title="Total Comments"
              value={realtimeStats?.totalComments || videoStats?.totalComments || 0}
              icon="message-circle"
              className="hover:scale-105 transition-transform"
            />
          </div>

          <div className="bg-youtube-dark rounded-lg p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-4">Performance Over Time</h2>
            <AnalyticsChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;