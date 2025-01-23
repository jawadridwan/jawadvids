import { Home, TrendingUp, PlaySquare, Clock, ThumbsUp, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Analytics", path: "/analytics" },
  { icon: PlaySquare, label: "Content", path: "/content" },
  { icon: Clock, label: "Playlists", path: "/playlists" },
  { icon: ThumbsUp, label: "Engagement", path: "/engagement" },
];

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  const handleNavigation = (path: string, label: string) => {
    setActiveItem(label);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-youtube-red rounded-full" />
        <h1 className="text-xl font-bold text-white">Haven Glow</h1>
      </div>
      
      <nav className="flex flex-col h-[calc(100%-6rem)] justify-between">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path, item.label)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-youtube-gray hover:bg-youtube-dark hover:text-white transition-colors active:scale-95 touch-none",
                activeItem === item.label && "bg-youtube-dark text-white"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-youtube-gray hover:bg-youtube-dark hover:text-white transition-colors active:scale-95 touch-none mt-auto"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );

  // Mobile sidebar using Sheet component
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-youtube-darker p-4">
        <NavContent />
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <MobileSidebar />
      <div className="w-64 bg-youtube-darker h-screen p-4 hidden md:block">
        <NavContent />
      </div>
    </>
  );
};