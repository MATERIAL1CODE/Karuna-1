import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DonationData {
  resource_type: string;
  quantity: string;
  pickup_location: {
    latitude: number;
    longitude: number;
  };
  pickup_address: string;
  pickup_contact: string;
  pickup_time_preference: string;
  notes?: string;
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

    // Parse request body
    const donationData: DonationData = await req.json()

    // Validate required fields
    const requiredFields = [
      'resource_type',
      'quantity',
      'pickup_location',
      'pickup_address',
      'pickup_contact',
      'pickup_time_preference'
    ]

    for (const field of requiredFields) {
      if (!donationData[field as keyof DonationData]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Validate pickup_location
    const { latitude, longitude } = donationData.pickup_location
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid pickup_location format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Insert donation into database
    const { data: donationRecord, error: insertError } = await supabaseClient
      .from('donations')
      .insert({
        donor_id: user.id,
        resource_type: donationData.resource_type,
        quantity: donationData.quantity,
        pickup_location: `POINT(${longitude} ${latitude})`,
        pickup_address: donationData.pickup_address,
        pickup_contact: donationData.pickup_contact,
        pickup_time_preference: donationData.pickup_time_preference,
        notes: donationData.notes || null,
        status: 'available',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to log donation' }),
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
        body: JSON.stringify({ trigger: 'new_donation', donation_id: donationRecord.id }),
      })
    } catch (error) {
      console.error('Failed to trigger matching engine:', error)
      // Don't fail the request if matching engine fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        donation_id: donationRecord.id,
        message: 'Donation logged successfully',
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