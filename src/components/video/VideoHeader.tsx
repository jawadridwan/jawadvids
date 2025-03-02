
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoHeaderProps {
  title: string;
  status?: 'processing' | 'ready' | 'failed';
  isCompact?: boolean;
}

export const VideoHeader = ({ title, status, isCompact = false }: VideoHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-3 border-b border-white/5",
        isCompact ? "pb-2" : ""
      )}
    >
      {status === 'ready' && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mb-2 inline-flex"
        >
          <Badge 
            variant="outline"
            className="bg-gradient-to-r from-green-500/80 to-emerald-700/80 text-white border-none shadow-sm text-xs px-2"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Ready
          </Badge>
        </motion.div>
      )}
      
      <h3 className={cn(
        "font-medium line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400",
        isCompact ? "text-sm" : "text-base"
      )}>
        {title}
      </h3>
    </motion.div>
  );
};
