
import React, { useState } from "react";
import { Home, TrendingUp, PlaySquare, Clock, ThumbsUp, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Analytics", path: "/analytics" },
  { icon: PlaySquare, label: "Content", path: "/content" },
  { icon: Clock, label: "Playlists", path: "/playlists" },
  { icon: ThumbsUp, label: "Engagement", path: "/engagement" },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = menuItems.find(item => item.path === location.pathname)?.label || "Dashboard";

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully", {
        className: "bg-youtube-darker border border-white/10",
      });
      navigate("/");
    } catch (error) {
      toast.error("Error logging out", {
        className: "bg-youtube-darker border border-white/10",
      });
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-white font-bold text-lg">PB</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
        >
          Pure Bloom
        </motion.h1>
      </div>
      
      <nav className="flex flex-col h-[calc(100%-6rem)] justify-between">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-youtube-gray hover:bg-gradient-to-r hover:from-youtube-dark hover:to-transparent hover:text-white transition-all active:scale-95 touch-none",
                location.pathname === item.path && "bg-gradient-to-r from-youtube-dark to-transparent text-white"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
        
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-youtube-gray hover:bg-youtube-dark hover:text-red-400 transition-colors active:scale-95 touch-none mt-auto"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </motion.button>
      </nav>
    </div>
  );

  const MobileSidebar = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-youtube-darker/80 backdrop-blur-lg shadow-lg border border-white/10">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 border-r border-white/10 bg-gradient-to-b from-youtube-darker to-[#121218]">
        <div className="p-4 h-full">
          <div className="flex justify-end mb-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <NavContent />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <MobileSidebar />
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-gradient-to-b from-youtube-darker to-[#121218] h-screen p-4 hidden md:block border-r border-white/5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 to-transparent pointer-events-none"></div>
        <NavContent />
      </motion.div>
    </>
  );
};
