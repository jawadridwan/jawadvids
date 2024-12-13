import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received upload request');

    // Validate request
    if (!req.body) {
      throw new Error('No request body')
    }

    const formData = await req.formData()
    const video = formData.get('video')
    const title = formData.get('title')
    const description = formData.get('description')
    const userId = formData.get('userId')

    console.log('Received form data:', { title, description, userId });

    if (!video || !title || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Use Gemini to enhance the video description if none was provided
    if (!description || description.trim() === '') {
      try {
        const prompt = `Generate a brief, engaging description for a video titled "${title}". Keep it under 100 words and make it appealing for social media.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const enhancedDescription = response.text();
        console.log('Generated description:', enhancedDescription);
        formData.set('description', enhancedDescription);
      } catch (error) {
        console.error('Error generating description:', error);
        // Continue with upload even if description generation fails
      }
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload video to storage
    const fileExt = video instanceof File ? video.name.split('.').pop() : 'mp4'
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    console.log('Uploading video to storage:', filePath)

    const { data: storageData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, video, {
        contentType: video instanceof File ? video.type : 'video/mp4',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath)

    console.log('Video uploaded successfully:', publicUrl)

    // Create video record
    const { data: videoData, error: dbError } = await supabase
      .from('videos')
      .insert({
        title,
        description: formData.get('description'),
        url: publicUrl,
        user_id: userId,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Cleanup uploaded file if database insert fails
      await supabase.storage.from('videos').remove([filePath])
      return new Response(
        JSON.stringify({ error: 'Failed to save video metadata', details: dbError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Video uploaded successfully',
        video: videoData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})