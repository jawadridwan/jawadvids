import { Sidebar } from "@/components/Sidebar";
import { MetricCard } from "@/components/MetricCard";
import { VideoList } from "@/components/VideoList";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRef } from "react";

const Index = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Processing video",
        description: "Your video is being processed...",
      });
    }
  };

  return (
    <div className="flex bg-[#1F1F1F] min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
              />
              <Button 
                onClick={handleUploadClick}
                className="bg-youtube-red hover:bg-youtube-red/90 transition-colors active:scale-95 touch-none"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
            </div>
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

          {/* Video List */}
          <h2 className="text-xl font-bold text-white mb-4">Your Videos</h2>
          <VideoList />
        </div>
      </main>
    </div>
  );
};

export default Index;