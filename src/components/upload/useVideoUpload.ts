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
    visibility: string,
    categoryId: string
  ) => {
    if (!title.trim()) {
      toast.error("Please enter a title for your video.");
      return false;
    }

    if (!categoryId) {
      toast.error("Please select a category for your video.");
      return false;
    }

    setUploading(true);
    setProgress(0);

    try {
      console.log('Starting video upload process');
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('No authenticated user found');
        toast.error("You must be logged in to upload videos");
        return false;
      }

      // Create form data
      const formData = new FormData();
      formData.append('video', video);
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('userId', user.id);
      formData.append('categoryId', categoryId);

      console.log('Invoking upload-video function with:', {
        title,
        description: description ? 'present' : 'not present',
        userId: user.id,
        videoName: video.name,
        categoryId
      });

      try {
        // Get the function URL from Supabase
        const { data: functionData, error: functionError } = await supabase.functions.invoke('upload-video', {
          body: formData,
        });

        console.log('Function response:', { functionData, functionError });

        if (functionError) {
          console.error('Function error:', functionError);
          throw new Error(functionError.message || 'Upload failed');
        }

        if (!functionData?.video) {
          console.error('Invalid response:', functionData);
          throw new Error('Invalid response from server: missing video data');
        }

        // If thumbnail exists, upload it
        if (thumbnail) {
          console.log('Uploading thumbnail');
          const thumbnailPath = `thumbnails/${functionData.video.id}`;
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
              .eq('id', functionData.video.id);

            functionData.video.thumbnail_url = thumbnailUrl;
          }
        }

        console.log('Upload completed successfully');
        onUploadComplete({
          ...functionData.video,
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