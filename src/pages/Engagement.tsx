import { Sidebar } from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Engagement = () => {
  const { data: engagementData } = useQuery({
    queryKey: ['engagement'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagement')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="flex bg-youtube-darker min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Engagement Analytics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-youtube-dark rounded-lg p-6">
              <h3 className="text-white font-medium mb-2">Total Comments</h3>
              <p className="text-2xl font-bold text-youtube-red">
                {engagementData?.filter(e => e.type === 'comment').length || 0}
              </p>
            </div>
            
            <div className="bg-youtube-dark rounded-lg p-6">
              <h3 className="text-white font-medium mb-2">Total Likes</h3>
              <p className="text-2xl font-bold text-youtube-red">
                {engagementData?.filter(e => e.type === 'like').length || 0}
              </p>
            </div>
            
            <div className="bg-youtube-dark rounded-lg p-6">
              <h3 className="text-white font-medium mb-2">Total Shares</h3>
              <p className="text-2xl font-bold text-youtube-red">
                {engagementData?.filter(e => e.type === 'share').length || 0}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Engagement;