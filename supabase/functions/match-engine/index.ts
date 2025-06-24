import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MatchingResult {
  report_id: number;
  donation_id: number;
  distance: number;
  compatibility_score: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for full access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { trigger, report_id, donation_id } = await req.json()

    console.log(`Matching engine triggered by: ${trigger}`)

    // Get all pending reports
    const { data: pendingReports, error: reportsError } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('status', 'pending_match')

    if (reportsError) {
      console.error('Error fetching reports:', reportsError)
      throw reportsError
    }

    // Get all available donations
    const { data: availableDonations, error: donationsError } = await supabaseClient
      .from('donations')
      .select('*')
      .eq('status', 'available')

    if (donationsError) {
      console.error('Error fetching donations:', donationsError)
      throw donationsError
    }

    console.log(`Found ${pendingReports.length} pending reports and ${availableDonations.length} available donations`)

    const matches: MatchingResult[] = []

    // Find optimal matches using geospatial queries
    for (const report of pendingReports) {
      for (const donation of availableDonations) {
        // Calculate distance using PostGIS
        const { data: distanceData, error: distanceError } = await supabaseClient
          .rpc('calculate_distance', {
            point1: report.location,
            point2: donation.pickup_location
          })

        if (distanceError) {
          console.error('Error calculating distance:', distanceError)
          continue
        }

        const distance = distanceData || 0

        // Only consider matches within 10km
        if (distance <= 10000) { // 10km in meters
          // Calculate compatibility score
          let compatibilityScore = 100 - (distance / 100) // Base score inversely related to distance

          // Boost score for resource type compatibility
          if (isResourceCompatible(donation.resource_type, report.people_in_need)) {
            compatibilityScore += 20
          }

          // Boost score for quantity adequacy
          if (isQuantityAdequate(donation.quantity, report.people_in_need)) {
            compatibilityScore += 15
          }

          matches.push({
            report_id: report.id,
            donation_id: donation.id,
            distance: distance,
            compatibility_score: compatibilityScore
          })
        }
      }
    }

    // Sort matches by compatibility score (highest first)
    matches.sort((a, b) => b.compatibility_score - a.compatibility_score)

    console.log(`Found ${matches.length} potential matches`)

    const createdMissions = []
    const usedReports = new Set<number>()
    const usedDonations = new Set<number>()

    // Create missions for the best matches
    for (const match of matches) {
      // Skip if report or donation already used
      if (usedReports.has(match.report_id) || usedDonations.has(match.donation_id)) {
        continue
      }

      // Calculate estimated duration (base 30 minutes + 2 minutes per km)
      const estimatedDuration = 30 + Math.round((match.distance / 1000) * 2)

      // Create mission
      const { data: missionData, error: missionError } = await supabaseClient
        .from('missions')
        .insert({
          report_id: match.report_id,
          donation_id: match.donation_id,
          status: 'unassigned',
          estimated_distance: Math.round(match.distance / 1000 * 100) / 100, // Convert to km with 2 decimal places
          estimated_duration: estimatedDuration
        })
        .select()
        .single()

      if (missionError) {
        console.error('Error creating mission:', missionError)
        continue
      }

      // Update report status
      const { error: reportUpdateError } = await supabaseClient
        .from('reports')
        .update({ status: 'assigned' })
        .eq('id', match.report_id)

      if (reportUpdateError) {
        console.error('Error updating report status:', reportUpdateError)
      }

      // Update donation status
      const { error: donationUpdateError } = await supabaseClient
        .from('donations')
        .update({ status: 'assigned' })
        .eq('id', match.donation_id)

      if (donationUpdateError) {
        console.error('Error updating donation status:', donationUpdateError)
      }

      createdMissions.push(missionData)
      usedReports.add(match.report_id)
      usedDonations.add(match.donation_id)

      console.log(`Created mission ${missionData.id} for report ${match.report_id} and donation ${match.donation_id}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        matches_found: matches.length,
        missions_created: createdMissions.length,
        created_missions: createdMissions,
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

// Helper function to check resource compatibility
function isResourceCompatible(resourceType: string, peopleInNeed: number): boolean {
  const foodTypes = ['food', 'meals', 'cooked meals', 'groceries', 'water']
  const essentialTypes = ['blankets', 'clothing', 'medicine', 'shelter']
  
  // Food is always compatible
  if (foodTypes.some(type => resourceType.toLowerCase().includes(type))) {
    return true
  }
  
  // Essential items are compatible for larger groups
  if (essentialTypes.some(type => resourceType.toLowerCase().includes(type)) && peopleInNeed >= 2) {
    return true
  }
  
  return false
}

// Helper function to check if quantity is adequate
function isQuantityAdequate(quantity: string, peopleInNeed: number): boolean {
  // Extract numbers from quantity string
  const numbers = quantity.match(/\d+/g)
  if (!numbers) return false
  
  const quantityNumber = parseInt(numbers[0])
  
  // Check if quantity is at least equal to people in need
  return quantityNumber >= peopleInNeed
}