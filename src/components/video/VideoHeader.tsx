
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface VideoHeaderProps {
  title: string;
  status?: 'processing' | 'ready' | 'failed';
}

export const VideoHeader = ({ title, status }: VideoHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 glass-dark backdrop-blur-lg border border-white/10 rounded-t-xl"
    >
      {status && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mb-2 inline-flex"
        >
          <Badge 
            variant={status === 'ready' ? 'default' : status === 'processing' ? 'secondary' : 'destructive'}
            className={`
              ${status === 'ready' ? 'bg-gradient-to-r from-green-500 to-emerald-700' : ''}
              ${status === 'processing' ? 'animate-pulse bg-gradient-to-r from-blue-500 to-purple-700' : ''}
              ${status === 'failed' ? 'bg-gradient-to-r from-red-500 to-pink-700' : ''}
              shadow-lg
            `}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {status === 'ready' ? 'Ready' : status === 'processing' ? 'Processing' : 'Failed'}
          </Badge>
        </motion.div>
      )}
      <h3 className="text-white font-medium line-clamp-2 text-base md:text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        {title}
      </h3>
    </motion.div>
  );
};
