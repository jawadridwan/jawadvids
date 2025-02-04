import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface VideoTagsProps {
  hashtags: string[];
  onTagClick?: (tag: string) => void;
}

export const VideoTags = ({ hashtags, onTagClick }: VideoTagsProps) => {
  if (!hashtags?.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 p-2"
    >
      {hashtags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="cursor-pointer hover:bg-youtube-red/20 transition-colors"
          onClick={() => onTagClick?.(tag)}
        >
          {tag}
        </Badge>
      ))}
    </motion.div>
  );
};