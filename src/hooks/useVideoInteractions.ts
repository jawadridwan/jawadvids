
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export const useVideoInteractions = (videoId: string) => {
  const session = useSession();

  const handleVideoPlay = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { error: viewError } = await supabase
        .from('views')
        .insert({
          video_id: videoId,
          viewer_id: session.user.id,
          watched_duration: 0,
          watched_percentage: 0
        });

      if (viewError) throw viewError;
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  return { handleVideoPlay };
};
