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
      console.error('No request body received');
      throw new Error('No request body')
    }

    const formData = await req.formData()
    const video = formData.get('video')
    const title = formData.get('title')
    const description = formData.get('description')
    const userId = formData.get('userId')

    console.log('Received form data:', { 
      title, 
      description: description ? 'present' : 'not present',
      userId: userId ? 'present' : 'not present',
      videoName: video instanceof File ? video.name : 'not a file'
    });

    if (!video || !title || !userId) {
      console.error('Missing required fields:', {
        video: !!video,
        title: !!title,
        userId: !!userId
      });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Initialize Supabase client
    console.log('Initializing Supabase client');
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
    console.log('Creating video record in database');
    const { data: videoData, error: dbError } = await supabase
      .from('videos')
      .insert({
        title,
        description: description || '',
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

    console.log('Video record created successfully:', videoData);

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