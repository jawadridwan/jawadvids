
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
import { Search, Filter, SunMoon, Tags, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("latest");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Enhanced search with full-text search capability
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;

      const { data, error } = await supabase
        .rpc('search_videos', {
          search_query: searchQuery
        });

      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length > 0
  });

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
    toast.success(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`);
  };

  // Enhanced filtering logic
  const filteredVideos = (searchResults || videos).filter((video) => {
    const matchesCategory = !selectedCategory || video.category_id === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
      (video.hashtags && video.hashtags.some(tag => selectedTags.includes(tag)));
    return matchesCategory && matchesTags;
  });

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

  const FilterSheet = () => (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent side="right" className="w-[300px] sm:w-[540px] bg-youtube-darker border-youtube-dark">
        <SheetHeader>
          <SheetTitle className="text-white">Filters</SheetTitle>
          <SheetDescription className="text-youtube-gray">
            Refine your video search
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={cn(
                    "h-8 text-xs",
                    selectedCategory === category.id && "bg-youtube-red hover:bg-youtube-red/90"
                  )}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                  className={cn(
                    "h-8 text-xs",
                    selectedTags.includes(tag.name) && "bg-youtube-red hover:bg-youtube-red/90"
                  )}
                  onClick={() => setSelectedTags(prev =>
                    prev.includes(tag.name)
                      ? prev.filter(t => t !== tag.name)
                      : [...prev, tag.name]
                  )}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-youtube-darker via-[#1a1a2e] to-youtube-darker min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-50 bg-youtube-darker/80 backdrop-blur-lg p-4 rounded-lg shadow-lg"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Dashboard
              </h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="text-white hover:text-youtube-red relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <SunMoon className="h-5 w-5 relative z-10" />
                </Button>
                <VideoUploadDialog onUploadComplete={(video) => setVideos([...videos, video])} />
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex flex-col md:flex-row gap-4 items-center"
            >
              <div className="relative flex-1 group w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full glass-dark border-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 glass-dark border-white/10 hover:border-white/20 w-full md:w-auto">
                      <Filter className="h-4 w-4" />
                      Sort by
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-dark border-white/10">
                    <DropdownMenuItem onClick={() => setSortBy("latest")}>Latest</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>Most viewed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("trending")}>Trending</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  className="gap-2 glass-dark border-white/10 hover:border-white/20 w-full md:w-auto"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={searchQuery + sortBy + selectedCategory + selectedTags.join(',')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-youtube-red"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      {searchQuery ? 'Search Results' : 'Discover Videos'}
                    </h2>
                    {selectedTags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tags className="h-4 w-4 text-youtube-gray" />
                        <span className="text-sm text-youtube-gray">
                          {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                        </span>
                      </div>
                    )}
                  </div>
                  <VideoList 
                    videos={sortedVideos} 
                    setVideos={setVideos} 
                    showOnlyUserVideos={false} 
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <FilterSheet />
    </div>
  );
};

export default Index;
