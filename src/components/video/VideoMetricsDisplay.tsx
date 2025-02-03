import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

interface VideoMetricsDisplayProps {
  views: number;
  likes: number;
  comments: number;
  className?: string;
}

export const VideoMetricsDisplay = ({ views, likes, comments, className }: VideoMetricsDisplayProps) => {
  return (
    <div className={cn("flex gap-4 text-sm text-youtube-gray", className)}>
      <AnimatePresence mode="wait">
        <motion.span 
          key={`views-${views}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1"
        >
          <span>{formatNumber(views)}</span>
          <span>views</span>
        </motion.span>
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        <motion.span 
          key={`likes-${likes}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1"
        >
          <span>{formatNumber(likes)}</span>
          <span>likes</span>
        </motion.span>
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        <motion.span 
          key={`comments-${comments}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1"
        >
          <span>{formatNumber(comments)}</span>
          <span>comments</span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
};