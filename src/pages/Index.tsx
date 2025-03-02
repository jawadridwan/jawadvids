import { Sidebar } from "@/components/Sidebar";
import { VideoList } from "@/components/VideoList";
import { VideoUploadDialog } from "@/components/upload/VideoUploadDialog";
import { useState, useEffect } from "react";
import { AuthComponent } from "@/components/auth/Auth";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Video, SearchResult } from "@/types/video";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Filter, SunMoon, Tags, SlidersHorizontal, Layout, LayoutGrid, ChevronDown, ArrowUpDown, ListFilter } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeSection, setActiveSection] = useState<string>("all");
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
      
      if (error) {
        console.error('Error fetching tags:', error);
        return [];
      }
      return data || [];
    }
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;

      const { data, error } = await supabase
        .rpc('search_videos', {
          search_query: searchQuery
        });

      if (error) throw error;
      
      return data?.map((result: SearchResult): Video => ({
        id: result.id,
        title: result.title,
        description: result.description,
        hashtags: [],
        views: '0',
        thumbnail: result.thumbnail_url || '/placeholder.svg',
        url: result.url || '',
        uploadDate: result.created_at,
        status: (result.status as 'processing' | 'ready' | 'failed') || 'ready',
        created_at: result.created_at,
        updated_at: result.updated_at,
        user_id: result.user_id,
        thumbnail_url: result.thumbnail_url,
        category_id: result.category_id || undefined,
        rank: result.rank,
        engagement: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        }
      }));
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full animate-ping bg-youtube-red opacity-75"></div>
            <div className="absolute inset-2 rounded-full bg-youtube-red"></div>
          </div>
          <p className="text-white animate-pulse">Loading Pure Bloom...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthComponent />;
  }

  const FilterSheet = () => (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent side="right" className="w-[300px] sm:w-[380px] bg-youtube-darker border-youtube-dark">
        <SheetHeader className="text-left pb-6 border-b border-white/10">
          <SheetTitle className="text-gradient text-xl font-bold flex items-center gap-2">
            <ListFilter className="h-5 w-5" />
            Filter Options
          </SheetTitle>
          <SheetDescription className="text-youtube-gray">
            Refine your video discovery
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="mt-6 h-[calc(100vh-180px)] pr-4">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Badge variant="outline" className="py-1">
                  Categories
                </Badge>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "h-10 text-xs rounded-lg transition-all duration-300 border",
                      selectedCategory === category.id 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none" 
                        : "bg-black/40 border-white/10 text-white hover:bg-black/60"
                    )}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Badge variant="outline" className="py-1">
                  Tags
                </Badge>
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <motion.button
                    key={tag.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "h-8 px-3 text-xs rounded-full transition-all duration-200",
                      selectedTags.includes(tag.name)
                        ? "bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white" 
                        : "bg-white/5 text-white hover:bg-white/10"
                    )}
                    onClick={() => setSelectedTags(prev =>
                      prev.includes(tag.name)
                        ? prev.filter(t => t !== tag.name)
                        : [...prev, tag.name]
                    )}
                  >
                    #{tag.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-youtube-darker">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              className="text-youtube-gray"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedTags([]);
              }}
            >
              Reset
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-youtube-darker via-[#1a1a2e] to-youtube-darker min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 pt-2 pb-20 md:pb-8 px-2 md:px-4 lg:px-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-50 bg-gradient-to-b from-youtube-darker/95 to-youtube-darker/80 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/5"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                >
                  Dashboard
                </motion.h1>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="text-white hover:text-purple-400 group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                      animate={{
                        scale: [1, 1.1, 1],
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row gap-3 items-center"
              >
                <div className="relative flex-1 w-full group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  <Input
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full glass-dark border-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                  />
                </div>
                
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 glass-dark border-white/10 hover:border-white/20 w-full md:w-auto">
                        <ArrowUpDown className="h-4 w-4" />
                        <span className="hidden sm:inline">Sort by:</span> 
                        <span className="font-medium">{sortBy === "latest" ? "Latest" : sortBy === "popular" ? "Popular" : "Trending"}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-dark border-white/10">
                      <DropdownMenuItem 
                        className={cn(sortBy === "latest" && "bg-white/10")}
                        onClick={() => setSortBy("latest")}
                      >
                        Latest
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={cn(sortBy === "popular" && "bg-white/10")}
                        onClick={() => setSortBy("popular")}
                      >
                        Most viewed
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={cn(sortBy === "trending" && "bg-white/10")}
                        onClick={() => setSortBy("trending")}
                      >
                        Trending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    className="gap-2 glass-dark border-white/10 hover:border-white/20 w-full md:w-auto relative"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {(selectedCategory || selectedTags.length > 0) && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-youtube-red text-white text-xs flex items-center justify-center">
                        {(selectedCategory ? 1 : 0) + selectedTags.length}
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="gap-1 glass-dark border-white/10 hover:border-white/20 hidden md:flex"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? (
                      <Layout className="h-4 w-4" />
                    ) : (
                      <LayoutGrid className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
              
              {/* Category/Tag Pills */}
              <AnimatePresence>
                {(selectedCategory || selectedTags.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 overflow-hidden"
                  >
                    {selectedCategory && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="bg-purple-500/20 hover:bg-purple-500/30 px-3 h-7 flex items-center gap-1 cursor-pointer"
                          onClick={() => setSelectedCategory(null)}
                        >
                          {categories.find(c => c.id === selectedCategory)?.name}
                          <span className="text-xs">×</span>
                        </Badge>
                      </motion.div>
                    )}
                    
                    {selectedTags.map(tag => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="bg-pink-500/20 hover:bg-pink-500/30 px-3 h-7 flex items-center gap-1 cursor-pointer"
                          onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                        >
                          #{tag}
                          <span className="text-xs">×</span>
                        </Badge>
                      </motion.div>
                    ))}
                    
                    {(selectedCategory || selectedTags.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="bg-white/10 hover:bg-white/20 px-3 h-7 flex items-center cursor-pointer"
                          onClick={() => {
                            setSelectedCategory(null);
                            setSelectedTags([]);
                          }}
                        >
                          Clear all
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={searchQuery + sortBy + selectedCategory + selectedTags.join(',') + viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                    <p className="text-youtube-gray">Searching videos...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2"
                    >
                      {searchQuery ? 'Search Results' : 'Discover Videos'}
                      <Badge variant="outline" className="ml-2 bg-white/5">
                        {sortedVideos.length} videos
                      </Badge>
                    </motion.h2>
                    
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
                    videos={sortedVideos as Video[]} 
                    setVideos={setVideos} 
                    showOnlyUserVideos={false}
                    layout={viewMode}
                  />
                  
                  {sortedVideos.length === 0 && !isSearching && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-16 px-4 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-youtube-dark flex items-center justify-center mb-4">
                        <Search className="h-10 w-10 text-youtube-gray" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
                      <p className="text-youtube-gray max-w-md">
                        {searchQuery 
                          ? `No videos matching "${searchQuery}" were found. Try different keywords or clear your filters.` 
                          : 'No videos match your current filters. Try adjusting your filter criteria or upload new videos.'}
                      </p>
                      <Button 
                        className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory(null);
                          setSelectedTags([]);
                        }}
                      >
                        Clear filters
                      </Button>
                    </motion.div>
                  )}
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
