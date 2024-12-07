import { Sidebar } from "@/components/Sidebar";
import { MetricCard } from "@/components/MetricCard";
import { VideoCard } from "@/components/VideoCard";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Upload started",
      description: "Your video is being processed...",
    });
  };

  return (
    <div className="flex bg-[#1F1F1F] min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <Button 
              onClick={handleUpload}
              className="bg-youtube-red hover:bg-youtube-red/90 transition-colors"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </div>
          
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

          {/* Recent Videos */}
          <h2 className="text-xl font-bold text-white mb-4">Recent Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 touch-pan-x">
            <VideoCard
              title="How to Build a YouTube Dashboard with React"
              views="1.2K"
              thumbnail="https://picsum.photos/seed/1/400/225"
            />
            <VideoCard
              title="10 Tips for Growing Your YouTube Channel in 2024"
              views="3.4K"
              thumbnail="https://picsum.photos/seed/2/400/225"
            />
            <VideoCard
              title="The Ultimate Guide to Video SEO"
              views="892"
              thumbnail="https://picsum.photos/seed/3/400/225"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;