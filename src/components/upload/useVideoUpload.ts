import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useVideoUpload = (onUploadComplete: (videoData: any) => void) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadVideo = async (
    video: File,
    title: string,
    description: string,
    thumbnail: File | null,
    hashtags: string[],
    visibility: string
  ) => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your video.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // Create form data
      const formData = new FormData();
      formData.append('video', video);
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('userId', user.id);

      // Get the function URL from Supabase
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-video`;
      console.log('Uploading to:', functionUrl);

      // Upload video using the Edge Function
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to upload video';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      let videoData;
      try {
        const jsonResponse = JSON.parse(responseText);
        videoData = jsonResponse.video;
      } catch (e) {
        console.error('Failed to parse success response:', e);
        throw new Error('Invalid response from server');
      }

      console.log('Upload successful:', videoData);

      // If thumbnail exists, upload it
      if (thumbnail) {
        const thumbnailPath = `thumbnails/${videoData.id}`;
        const { error: thumbnailError } = await supabase.storage
          .from('videos')
          .upload(thumbnailPath, thumbnail);

        if (thumbnailError) {
          console.error('Failed to upload thumbnail:', thumbnailError);
        } else {
          const { data: { publicUrl: thumbnailUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(thumbnailPath);

          await supabase
            .from('videos')
            .update({ thumbnail_url: thumbnailUrl })
            .eq('id', videoData.id);

          videoData.thumbnail_url = thumbnailUrl;
        }
      }

      onUploadComplete({
        ...videoData,
        hashtags,
        status: 'processing',
        visibility,
      });

      toast({
        title: "Video uploaded successfully",
        description: "Your video is now processing and will be available soon.",
      });

      return true;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your video.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadVideo,
    uploading,
    progress,
  };
};