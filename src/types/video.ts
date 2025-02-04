export interface Video {
  id: string;
  title: string;
  description: string | null;
  hashtags: string[];
  views: string;
  thumbnail: string;
  url: string;
  file?: File;
  uploadDate: string;
  status: 'processing' | 'ready' | 'failed';
  created_at: string;
  updated_at: string;
  user_id: string;
  thumbnail_url: string | null;
  likes?: number;
  dislikes?: number;
  engagement?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export type VideoStatus = 'processing' | 'ready' | 'failed';