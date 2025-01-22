import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Profile {
  full_name: string | null;
  bio: string | null;
  date_of_birth: string | null;
  profile_picture_url: string | null;
}

export const ProfileView = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        toast.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-youtube-red"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-white p-8">
        <h2 className="text-2xl font-bold">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 bg-youtube-dark rounded-lg">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.profile_picture_url || ""} alt={profile.full_name || "User"} />
          <AvatarFallback>{(profile.full_name?.[0] || "U").toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-white">{profile.full_name || "Anonymous User"}</h1>
        </div>
      </div>

      {profile.bio && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Bio</h2>
          <p className="text-youtube-gray">{profile.bio}</p>
        </div>
      )}

      {profile.date_of_birth && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Date of Birth</h2>
          <p className="text-youtube-gray">
            {new Date(profile.date_of_birth).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};