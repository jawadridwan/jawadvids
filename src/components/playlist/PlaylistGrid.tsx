
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Music, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Playlist {
  id: string;
  title: string;
  description: string | null;
  visibility: 'public' | 'private';
  video_count?: number;
}

export const PlaylistGrid = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ title: '', description: '' });

  const { data: playlists, isLoading, refetch } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_videos (count)
        `);

      if (error) throw error;

      return data.map((playlist: any) => ({
        ...playlist,
        video_count: playlist.playlist_videos?.[0]?.count || 0
      }));
    }
  });

  const handleCreatePlaylist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a playlist");
        return;
      }

      const { error } = await supabase
        .from('playlists')
        .insert({
          title: newPlaylist.title,
          description: newPlaylist.description,
          visibility: 'private',
          user_id: user.id
        });

      if (error) throw error;

      toast.success('Playlist created successfully');
      setIsCreateDialogOpen(false);
      setNewPlaylist({ title: '', description: '' });
      refetch();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Your Playlists</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-youtube-red hover:bg-youtube-red/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Playlist Title"
                value={newPlaylist.title}
                onChange={(e) => setNewPlaylist(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
              />
              <Button 
                onClick={handleCreatePlaylist}
                disabled={!newPlaylist.title.trim()}
                className="w-full bg-youtube-red hover:bg-youtube-red/90"
              >
                Create Playlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!playlists?.length ? (
        <div className="text-center py-12 bg-youtube-dark rounded-lg">
          <Music className="w-12 h-12 mx-auto mb-4 text-youtube-gray" />
          <p className="text-youtube-gray">No playlists yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist: Playlist) => (
            <div
              key={playlist.id}
              className="bg-youtube-dark p-6 rounded-lg hover:bg-youtube-dark/80 transition-all duration-300 hover:scale-105 group"
            >
              <h3 className="text-white font-medium mb-2">{playlist.title}</h3>
              {playlist.description && (
                <p className="text-youtube-gray text-sm mb-4">{playlist.description}</p>
              )}
              <div className="flex justify-between items-center text-youtube-gray text-sm">
                <span>{playlist.video_count} videos</span>
                <span className="capitalize">{playlist.visibility}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
