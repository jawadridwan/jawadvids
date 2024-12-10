import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    // Validate request
    if (!req.body) {
      throw new Error('No request body')
    }

    const formData = await req.formData()
    const video = formData.get('video')
    const title = formData.get('title')
    const description = formData.get('description')
    const userId = formData.get('userId')

    console.log('Received upload request:', { title, description, userId })

    if (!video || !title || !userId) {
      throw new Error('Missing required fields')
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
      throw uploadError
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
        description,
        url: publicUrl,
        user_id: userId,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Cleanup uploaded file if database insert fails
      await supabase.storage.from('videos').remove([filePath])
      throw dbError
    }

    // Initialize performance metrics
    const { error: metricsError } = await supabase
      .from('performance_metrics')
      .insert({
        video_id: videoData.id,
      })

    if (metricsError) {
      console.error('Metrics initialization error:', metricsError)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Video uploaded successfully',
        video: videoData
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to upload video',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    )
  }
})