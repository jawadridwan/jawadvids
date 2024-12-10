import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/MetricCard";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Analytics = () => {
  const { data: metrics, refetch } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
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

  return (
    <div className="flex bg-[#1F1F1F] min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>
          
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