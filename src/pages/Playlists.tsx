import { Sidebar } from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePlaylistDialog } from "@/components/playlist/CreatePlaylistDialog";

const Playlists = () => {
  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

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
              No playlists created yet. Click the Create Playlist button to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-youtube-dark rounded-lg p-4 hover:bg-youtube-dark/80 transition-colors"
                >
                  <h3 className="text-white font-medium mb-2">{playlist.title}</h3>
                  <p className="text-youtube-gray text-sm">{playlist.description}</p>
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