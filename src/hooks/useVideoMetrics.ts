
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VideoMetrics } from '@/types/video-types';

export const useVideoMetrics = (videoId: string, initialMetrics: VideoMetrics) => {
  const [metrics, setMetrics] = useState<VideoMetrics>(initialMetrics);

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'views',
          filter: `video_id=eq.${videoId}`
        },
        async () => {
          const { data: viewsData, error } = await supabase
            .from('performance_metrics')
            .select('views_count')
            .eq('video_id', videoId)
            .single();
          
          if (error) {
            console.error('Error fetching view count:', error);
            return;
          }
          
          if (viewsData) {
            setMetrics(prev => ({
              ...prev,
              views: viewsData.views_count
            }));
          }
        }
      )
      .subscribe();

    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('views_count, likes_count, comments_count')
        .eq('video_id', videoId)
        .single();

      if (error) {
        console.error('Error fetching metrics:', error);
        return;
      }

      if (data) {
        setMetrics(prev => ({
          ...prev,
          views: data.views_count || 0,
          likes: data.likes_count || 0,
          comments: data.comments_count || 0
        }));
      }
    };

    fetchMetrics();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [videoId]);

  return { metrics, setMetrics };
};
