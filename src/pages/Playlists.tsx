import { Sidebar } from "@/components/Sidebar";
import { PlaylistGrid } from "@/components/playlist/PlaylistGrid";
import { useSession } from "@supabase/auth-helpers-react";

const Playlists = () => {
  const session = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-youtube-darker">
        <p className="text-white text-xl">Please sign in to view playlists</p>
      </div>
    );
  }

  return (
    <div className="flex bg-youtube-darker min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <PlaylistGrid />
        </div>
      </main>
    </div>
  );
};

export default Playlists;