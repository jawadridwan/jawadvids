
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VideoTagsProps {
  hashtags: string[];
  onTagClick?: (tag: string) => void;
  isCompact?: boolean;
}

export const VideoTags = ({ hashtags, onTagClick, isCompact = false }: VideoTagsProps) => {
  if (!hashtags?.length) return null;

  const displayedTags = isCompact ? hashtags.slice(0, 2) : hashtags;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-wrap gap-1.5",
        isCompact ? "px-3 py-1" : "px-3 py-2"
      )}
    >
      {displayedTags.map((tag, index) => (
        <Badge
          key={index}
          variant="outline"
          className={cn(
            "text-xs bg-white/5 hover:bg-purple-500/20 transition-colors border-white/10 cursor-pointer",
            isCompact && "py-0 px-1.5 text-[10px]"
          )}
          onClick={() => onTagClick?.(tag)}
        >
          #{tag}
        </Badge>
      ))}
      
      {isCompact && hashtags.length > 2 && (
        <Badge
          variant="outline"
          className="text-[10px] bg-white/5 border-white/10 py-0 px-1.5"
        >
          +{hashtags.length - 2}
        </Badge>
      )}
    </motion.div>
  );
};
