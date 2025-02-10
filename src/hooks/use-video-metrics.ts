
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VideoMetrics {
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
}

export const useVideoMetrics = (
  id: string,
  initialViews: string,
  initialLikes: number = 0,
  initialDislikes: number = 0
) => {
  const [metrics, setMetrics] = useState<VideoMetrics>({
    views: parseInt(initialViews) || 0,
    likes: initialLikes,
    dislikes: initialDislikes,
    comments: 0
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'views',
          filter: `video_id=eq.${id}`
        },
        async () => {
          const { data: viewsData, error } = await supabase
            .from('performance_metrics')
            .select('views_count')
            .eq('video_id', id)
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleVideoPlay = async (userId?: string) => {
    if (!userId) return;
    
    try {
      const { error: viewError } = await supabase
        .from('views')
        .upsert({
          video_id: id,
          viewer_id: userId,
          watched_duration: 0,
          watched_percentage: 0
        }, {
          onConflict: 'unique_viewer_video'
        });

      if (viewError) {
        console.error('Error recording view:', viewError);
        toast.error('Error recording view');
        return;
      }

      // Update local state optimistically
      setMetrics(prev => ({
        ...prev,
        views: prev.views + 1
      }));
      
    } catch (error) {
      console.error('Error recording view:', error);
      toast.error('Error recording view');
    }
  };

  return {
    metrics,
    setMetrics,
    handleVideoPlay
  };
};
