import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsChart = () => {
  const { data: viewsData } = useQuery({
    queryKey: ['views-over-time'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('views')
        .select('timestamp')
        .order('timestamp', { ascending: true });
      
      if (error) throw error;

      // Group views by day
      const groupedData = data.reduce((acc: any, view) => {
        const date = new Date(view.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // If no data, provide some default values
      if (Object.keys(groupedData).length === 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
          groupedData[day] = 0;
        });
      }

      return Object.entries(groupedData).map(([date, views]) => ({
        date,
        views,
      }));
    }
  });

  return (
    <div className="bg-youtube-dark p-6 rounded-xl h-[300px]">
      <h2 className="text-white text-lg font-medium mb-4">Views Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={viewsData || []}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#909090" />
          <YAxis stroke="#909090" />
          <Tooltip 
            contentStyle={{ 
              background: "#282828", 
              border: "none", 
              borderRadius: "8px",
              color: "#FFFFFF" 
            }} 
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#FF0000"
            fillOpacity={1}
            fill="url(#viewsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};