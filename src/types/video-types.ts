
export interface VideoMetrics {
  views: number;
  likes: number;
  dislikes?: number;
  comments: number;
}

export interface VideoMetricsResponse {
  views_count: number;
  likes_count: number;
  comments_count: number;
}

export interface VideoState {
  isPlaying: boolean;
  videoSize: 'default' | 'medium' | 'fullscreen';
  isEditDialogOpen: boolean;
  metrics: VideoMetrics;
}
