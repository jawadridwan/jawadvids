import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { VideoUploadDialog } from "@/components/upload/VideoUploadDialog";
import { useState, useEffect } from "react";
import { AuthComponent } from "@/components/auth/Auth";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Video } from "@/types/video";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Filter, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("latest");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Load dark mode preference
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }

    return () => subscription.unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!isDarkMode).toString());
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return ((b.engagement?.views || 0) - (a.engagement?.views || 0));
      case "trending":
        return ((b.engagement?.likes || 0) - (a.engagement?.likes || 0));
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-youtube-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-youtube-red"></div>
      </div>
    );
  }

  if (!session) {
    return <AuthComponent />;
  }

  return (
    <div className="flex flex-col md:flex-row bg-youtube-darker min-h-screen touch-pan-y">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-white hover:text-youtube-red"
              >
                <SunMoon className="h-5 w-5" />
              </Button>
              <VideoUploadDialog onUploadComplete={(video) => setVideos([...videos, video])} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-youtube-dark text-white border-none focus:ring-youtube-red"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("latest")}>Latest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("popular")}>Most viewed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("trending")}>Trending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Discover Videos</h2>
            <VideoList videos={sortedVideos} setVideos={setVideos} showOnlyUserVideos={false} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;