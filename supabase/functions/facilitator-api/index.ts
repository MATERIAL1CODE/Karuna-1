import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FacilitatorLocation {
  latitude: number;
  longitude: number;
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

    // Verify user is a facilitator
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'facilitator') {
      return new Response(
        JSON.stringify({ error: 'Access denied. Facilitator role required.' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request body
    const { action, ...params } = await req.json()

    switch (action) {
      case 'getAvailableMissions':
        return await getAvailableMissions(supabaseClient, user.id, params.location)
      
      case 'acceptMission':
        return await acceptMission(supabaseClient, user.id, params.mission_id)
      
      case 'updateMissionStatus':
        return await updateMissionStatus(supabaseClient, user.id, params.mission_id, params.status, params.location)
      
      case 'getMissionDetails':
        return await getMissionDetails(supabaseClient, user.id, params.mission_id)
      
      case 'updateLocation':
        return await updateFacilitatorLocation(supabaseClient, user.id, params.location)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }
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

async function getAvailableMissions(supabaseClient: any, facilitatorId: string, location?: FacilitatorLocation) {
  try {
    // Get unassigned missions with related data
    const { data: missions, error } = await supabaseClient
      .from('missions')
      .select(`
        *,
        reports!inner(
          id,
          location,
          description,
          people_in_need,
          video_url,
          reporter_id,
          profiles!reports_reporter_id_fkey(full_name, phone)
        ),
        donations!inner(
          id,
          resource_type,
          quantity,
          pickup_location,
          pickup_address,
          pickup_contact,
          pickup_time_preference,
          notes,
          donor_id,
          profiles!donations_donor_id_fkey(full_name, phone)
        )
      `)
      .eq('status', 'unassigned')
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    // If facilitator location is provided, calculate distances and sort by proximity
    if (location && missions.length > 0) {
      const missionsWithDistance = await Promise.all(
        missions.map(async (mission) => {
          // Calculate distance to pickup location
          const { data: distanceData } = await supabaseClient
            .rpc('calculate_distance', {
              point1: `POINT(${location.longitude} ${location.latitude})`,
              point2: mission.donations.pickup_location
            })

          return {
            ...mission,
            distance_to_pickup: distanceData || 0
          }
        })
      )

      // Sort by distance (closest first)
      missionsWithDistance.sort((a, b) => a.distance_to_pickup - b.distance_to_pickup)

      return new Response(
        JSON.stringify({
          success: true,
          missions: missionsWithDistance,
          total_count: missionsWithDistance.length
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        missions: missions,
        total_count: missions.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error getting available missions:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch available missions' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}

async function acceptMission(supabaseClient: any, facilitatorId: string, missionId: number) {
  try {
    // Update mission with facilitator assignment
    const { data: mission, error } = await supabaseClient
      .from('missions')
      .update({
        facilitator_id: facilitatorId,
        status: 'assigned'
      })
      .eq('id', missionId)
      .eq('status', 'unassigned') // Ensure mission is still unassigned
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Mission no longer available' }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        mission: mission,
        message: 'Mission accepted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error accepting mission:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to accept mission' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}

async function updateMissionStatus(supabaseClient: any, facilitatorId: string, missionId: number, status: string, location?: FacilitatorLocation) {
  try {
    const validStatuses = ['assigned', 'en_route_pickup', 'pickup_completed', 'en_route_delivery', 'completed', 'failed']
    
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const updateData: any = { status }

    // Add timestamps for specific status changes
    if (status === 'pickup_completed') {
      updateData.pickup_completed_at = new Date().toISOString()
    } else if (status === 'completed') {
      updateData.delivery_completed_at = new Date().toISOString()
    }

    // Update mission status
    const { data: mission, error } = await supabaseClient
      .from('missions')
      .update(updateData)
      .eq('id', missionId)
      .eq('facilitator_id', facilitatorId) // Ensure facilitator owns this mission
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update facilitator location if provided
    if (location) {
      await supabaseClient
        .from('profiles')
        .update({
          location: `POINT(${location.longitude} ${location.latitude})`
        })
        .eq('id', facilitatorId)
    }

    // If mission is completed, trigger thank you letter generation
    if (status === 'completed') {
      try {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-thank-you-letter`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mission_id: missionId }),
        })
      } catch (error) {
        console.error('Failed to trigger thank you letter generation:', error)
        // Don't fail the request if letter generation fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        mission: mission,
        message: 'Mission status updated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error updating mission status:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update mission status' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}

async function getMissionDetails(supabaseClient: any, facilitatorId: string, missionId: number) {
  try {
    // Get mission with all related data
    const { data: mission, error } = await supabaseClient
      .from('missions')
      .select(`
        *,
        reports!inner(
          id,
          location,
          description,
          people_in_need,
          video_url,
          reporter_id,
          profiles!reports_reporter_id_fkey(full_name, phone)
        ),
        donations!inner(
          id,
          resource_type,
          quantity,
          pickup_location,
          pickup_address,
          pickup_contact,
          pickup_time_preference,
          notes,
          donor_id,
          profiles!donations_donor_id_fkey(full_name, phone)
        )
      `)
      .eq('id', missionId)
      .eq('facilitator_id', facilitatorId)
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        mission: mission
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error getting mission details:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch mission details' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}

async function updateFacilitatorLocation(supabaseClient: any, facilitatorId: string, location: FacilitatorLocation) {
  try {
    const { error } = await supabaseClient
      .from('profiles')
      .update({
        location: `POINT(${location.longitude} ${location.latitude})`
      })
      .eq('id', facilitatorId)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Location updated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error updating facilitator location:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update location' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}