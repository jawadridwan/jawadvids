import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useVideoUpload = (onUploadComplete: (videoData: any) => void) => {
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
      toast.error("Please enter a title for your video.");
      return false;
    }

    setUploading(true);
    setProgress(0);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to upload videos");
        return false;
      }

      // Create form data
      const formData = new FormData();
      formData.append('video', video);
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('userId', user.id);

      // Get the function URL from Supabase
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-video`;
      console.log('Uploading to:', functionUrl);

      try {
        // Upload video using the Edge Function
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: formData,
        });

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        // Try to parse the response as JSON
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          throw new Error('Server returned invalid JSON response');
        }

        if (!response.ok) {
          throw new Error(responseData.error || 'Upload failed');
        }

        if (!responseData.video) {
          throw new Error('Invalid response from server: missing video data');
        }

        // If thumbnail exists, upload it
        if (thumbnail) {
          const thumbnailPath = `thumbnails/${responseData.video.id}`;
          const { error: thumbnailError } = await supabase.storage
            .from('videos')
            .upload(thumbnailPath, thumbnail);

          if (thumbnailError) {
            console.error('Failed to upload thumbnail:', thumbnailError);
            toast.error("Thumbnail upload failed, but video was uploaded successfully");
          } else {
            const { data: { publicUrl: thumbnailUrl } } = supabase.storage
              .from('videos')
              .getPublicUrl(thumbnailPath);

            await supabase
              .from('videos')
              .update({ thumbnail_url: thumbnailUrl })
              .eq('id', responseData.video.id);

            responseData.video.thumbnail_url = thumbnailUrl;
          }
        }

        onUploadComplete({
          ...responseData.video,
          hashtags,
          status: 'processing',
          visibility,
        });

        toast.success("Video uploaded successfully!");
        return true;
      } catch (error: any) {
        console.error('Upload error:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "An error occurred while uploading your video.");
      return false;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadVideo,
    uploading,
    progress,
  };
};