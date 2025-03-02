
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
  category_id?: string;
  engagement?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  // Additional fields for search results
  rank?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  status: string;
  category_id: string | null;
  rank: number;
}

export type VideoStatus = 'processing' | 'ready' | 'failed';
