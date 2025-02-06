
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VideoContainerProps {
  children: React.ReactNode;
  videoSize: 'default' | 'medium' | 'fullscreen';
  className?: string;
}

export const VideoContainer = ({ 
  children, 
  videoSize, 
  className 
}: VideoContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-youtube-dark rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
        "group hover:ring-2 hover:ring-youtube-red/20",
        videoSize === 'default' && "w-full max-w-2xl mx-auto",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
