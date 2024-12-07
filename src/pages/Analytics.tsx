import { MetricCard } from "@/components/MetricCard";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { Sidebar } from "@/components/Sidebar";

const Analytics = () => {
  return (
    <div className="flex bg-[#1F1F1F] min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 touch-pan-x">
            <MetricCard title="Total Views" value="128.8K" change="+12.3%" positive />
            <MetricCard title="Watch Time (hrs)" value="12,492" change="+8.1%" positive />
            <MetricCard title="Subscribers" value="1,021" change="-2.4%" />
            <MetricCard title="Avg. View Duration" value="4:12" change="+1.2%" positive />
          </div>

          {/* Analytics Chart */}
          <div className="mb-8 touch-none">
            <AnalyticsChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;