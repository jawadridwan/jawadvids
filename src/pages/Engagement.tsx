import { Sidebar } from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { MetricCard } from "@/components/MetricCard";

const Engagement = () => {
  const session = useSession();

  const { data: engagementData } = useQuery({
    queryKey: ['engagement-metrics'],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data: videos } = await supabase
        .from('videos')
        .select('id')
        .eq('user_id', session.user.id);

      if (!videos?.length) return null;

      const videoIds = videos.map(v => v.id);

      const { data, error } = await supabase
        .from('engagement')
        .select('*')
        .in('video_id', videoIds);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: performanceMetrics } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const totalLikes = engagementData?.filter(e => e.type === 'like').length || 0;
  const totalComments = engagementData?.filter(e => e.type === 'comment').length || 0;
  const totalShares = engagementData?.filter(e => e.type === 'share').length || 0;

  return (
    <div className="flex bg-youtube-darker min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Engagement Analytics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Total Likes"
              value={totalLikes.toString()}
              change="+12.3%"
              positive
            />
            
            <MetricCard
              title="Total Comments"
              value={totalComments.toString()}
              change="+8.1%"
              positive
            />
            
            <MetricCard
              title="Total Shares"
              value={totalShares.toString()}
              change="+15.7%"
              positive
            />

            {performanceMetrics && (
              <>
                <MetricCard
                  title="Average Watch Duration"
                  value={`${Math.round((performanceMetrics.avg_watch_duration || 0) / 60)}m`}
                  change="+5.2%"
                  positive
                />
                <MetricCard
                  title="Average Watch Percentage"
                  value={`${Math.round(performanceMetrics.avg_watch_percentage || 0)}%`}
                  change="+3.8%"
                  positive
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Engagement;