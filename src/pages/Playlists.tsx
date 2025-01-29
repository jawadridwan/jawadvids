import { Sidebar } from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePlaylistDialog } from "@/components/playlist/CreatePlaylistDialog";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Music, Video } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

const Playlists = () => {
  const session = useSession();
  const { data: playlists, isLoading, refetch } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_videos (
            video_id,
            position
          )
        `)
        .eq('user_id', session?.user?.id);
        
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('playlist_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'playlists',
          filter: `user_id=eq.${session?.user?.id}`
        },
        () => {
          console.log('Playlist changes detected');
          refetch();
          toast.success('Playlists updated');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, refetch]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-youtube-darker">
        <p className="text-white text-xl">Please sign in to view playlists</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex bg-youtube-darker min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-youtube-dark rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-youtube-dark rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-youtube-darker min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Your Playlists</h1>
            <CreatePlaylistDialog />
          </div>
          
          {!playlists?.length ? (
            <div className="text-center text-gray-500 py-12">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No playlists created yet. Click the Create Playlist button to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-youtube-dark rounded-lg p-6 hover:bg-youtube-dark/80 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium mb-2">{playlist.title}</h3>
                      <p className="text-youtube-gray text-sm mb-4">{playlist.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-youtube-gray">
                      <Video className="w-4 h-4" />
                      <span>{playlist.playlist_videos?.length || 0}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-youtube-gray/20">
                    <p className="text-youtube-gray text-sm">
                      {playlist.visibility === 'public' ? 'Public' : 'Private'} playlist
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Playlists;