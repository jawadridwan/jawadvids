
export interface VideoCardProps {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  description?: string;
  hashtags?: string[];
  status?: 'processing' | 'ready' | 'failed';
  className?: string;
  url?: string;
  likes?: number;
  user_id: string;
  category_id?: string;
}

export interface VideoMetricsProps {
  likes: number;
  onLike: () => void;
}
