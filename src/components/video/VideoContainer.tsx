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
        "bg-youtube-dark rounded-xl overflow-hidden shadow-lg transition-all duration-300",
        "max-w-full mx-auto",
        videoSize === 'default' && "w-full md:max-w-2xl",
        videoSize === 'medium' && "w-full md:max-w-4xl",
        videoSize === 'fullscreen' && "fixed inset-0 z-50",
        className
      )}
    >
      {children}
    </motion.div>
  );
};