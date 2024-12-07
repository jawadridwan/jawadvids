import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "Mon", views: 4000 },
  { date: "Tue", views: 3000 },
  { date: "Wed", views: 5000 },
  { date: "Thu", views: 2780 },
  { date: "Fri", views: 6890 },
  { date: "Sat", views: 8390 },
  { date: "Sun", views: 9490 },
];

export const AnalyticsChart = () => {
  return (
    <div className="bg-youtube-dark p-6 rounded-xl h-[300px]">
      <h2 className="text-white text-lg font-medium mb-4">Views Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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