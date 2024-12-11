import { Home, TrendingUp, PlaySquare, Clock, ThumbsUp, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  return (
    <div className="w-64 bg-youtube-darker h-screen p-4 hidden md:block">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-youtube-red rounded-full" />
        <h1 className="text-xl font-bold text-white">JR Dashboard</h1>
      </div>
      <nav className="flex flex-col h-[calc(100%-6rem)] justify-between">
        <div>
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path, item.label)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-youtube-gray hover:bg-youtube-dark hover:text-white transition-colors active:scale-95 touch-none",
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
};