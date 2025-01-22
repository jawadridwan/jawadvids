import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Profile {
  full_name: string | null;
  bio: string | null;
  date_of_birth: string | null;
  profile_picture_url: string | null;
}

export const ProfileManager = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    bio: "",
    date_of_birth: "",
    profile_picture_url: "",
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          bio: data.bio || "",
          date_of_birth: data.date_of_birth || "",
          profile_picture_url: data.profile_picture_url || "",
        });
      }
    } catch (error) {
      toast.error("Error fetching profile");
    }
  };

  const handleProfileUpdate = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          date_of_birth: profile.date_of_birth,
          profile_picture_url: profile.profile_picture_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${session.user.id}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      setProfile({ ...profile, profile_picture_url: publicUrl });
      toast.success("Profile picture uploaded successfully");
    } catch (error) {
      toast.error("Error uploading profile picture");
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 bg-youtube-dark rounded-lg">
      <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-32 h-32">
            <img
              src={profile.profile_picture_url || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={triggerFileInput}
          >
            Change Profile Picture
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-white">Full Name</label>
          <Input
            value={profile.full_name || ""}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="bg-youtube-darker text-white"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-white">Bio</label>
          <Textarea
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="bg-youtube-darker text-white"
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="text-white">Date of Birth</label>
          <Input
            type="date"
            value={profile.date_of_birth || ""}
            onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
            className="bg-youtube-darker text-white"
          />
        </div>

        <Button
          onClick={handleProfileUpdate}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};