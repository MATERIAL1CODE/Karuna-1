import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportData {
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  people_in_need: number;
  video_file?: File;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse form data
    const formData = await req.formData()
    const locationStr = formData.get('location') as string
    const description = formData.get('description') as string
    const peopleInNeedStr = formData.get('people_in_need') as string
    const videoFile = formData.get('video_file') as File

    // Validate required fields
    if (!locationStr || !peopleInNeedStr) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: location, people_in_need' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse and validate location
    let location: { latitude: number; longitude: number }
    try {
      location = JSON.parse(locationStr)
      if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        throw new Error('Invalid location format')
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid location format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate people_in_need
    const peopleInNeed = parseInt(peopleInNeedStr)
    if (isNaN(peopleInNeed) || peopleInNeed <= 0) {
      return new Response(
        JSON.stringify({ error: 'people_in_need must be a positive integer' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    let videoUrl: string | null = null

    // Upload video if provided
    if (videoFile && videoFile.size > 0) {
      const fileExt = videoFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('mission_videos')
        .upload(fileName, videoFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Video upload error:', uploadError)
        return new Response(
          JSON.stringify({ error: 'Failed to upload video' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Get the private URL for the video
      const { data: urlData } = await supabaseClient.storage
        .from('mission_videos')
        .createSignedUrl(uploadData.path, 60 * 60 * 24 * 7) // 7 days expiry

      videoUrl = urlData?.signedUrl || null
    }

    // Insert report into database
    const { data: reportData, error: insertError } = await supabaseClient
      .from('reports')
      .insert({
        reporter_id: user.id,
        location: `POINT(${location.longitude} ${location.latitude})`,
        description: description || null,
        people_in_need: peopleInNeed,
        video_url: videoUrl,
        status: 'pending_match',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create report' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Trigger matching engine
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/match-engine`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trigger: 'new_report', report_id: reportData.id }),
      })
    } catch (error) {
      console.error('Failed to trigger matching engine:', error)
      // Don't fail the request if matching engine fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        report_id: reportData.id,
        message: 'Report submitted successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})