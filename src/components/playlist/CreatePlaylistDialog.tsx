import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CreatePlaylistDialog: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          title,
          description,
          visibility: 'private',
          // Using a temporary user ID since we removed auth
          user_id: '00000000-0000-0000-0000-000000000000'
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success("Playlist created successfully!");
      setIsOpen(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error("Failed to create playlist");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-youtube-red hover:bg-youtube-red/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-youtube-darker border-youtube-dark">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Playlist Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-youtube-dark border-youtube-gray text-white"
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-youtube-dark border-youtube-gray text-white"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-youtube-red hover:bg-youtube-red/90">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};