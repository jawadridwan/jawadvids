import { Home, TrendingUp, PlaySquare, Clock, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="w-64 bg-youtube-darker h-screen p-4 hidden md:block">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-youtube-red rounded-full" />
        <h1 className="text-xl font-bold text-white">YT Dashboard</h1>
      </div>
      <nav>
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
      </nav>
    </div>
  );
};