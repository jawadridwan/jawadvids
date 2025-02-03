import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface VideoHeaderProps {
  title: string;
  status?: 'processing' | 'ready' | 'failed';
}

export const VideoHeader = ({ title, status }: VideoHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      {status && (
        <Badge 
          variant={status === 'ready' ? 'default' : status === 'processing' ? 'secondary' : 'destructive'}
          className="mb-2"
        >
          {status === 'ready' ? 'Ready' : status === 'processing' ? 'Processing' : 'Failed'}
        </Badge>
      )}
      <h3 className="text-white font-medium line-clamp-2 text-base md:text-lg">
        {title}
      </h3>
    </motion.div>
  );
};