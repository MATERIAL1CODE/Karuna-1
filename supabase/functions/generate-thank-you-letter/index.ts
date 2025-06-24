import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { mission_id } = await req.json()

    if (!mission_id) {
      return new Response(
        JSON.stringify({ error: 'Missing mission_id' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get mission with all related data
    const { data: mission, error: missionError } = await supabaseClient
      .from('missions')
      .select(`
        *,
        reports!inner(
          id,
          location,
          description,
          people_in_need,
          reporter_id,
          profiles!reports_reporter_id_fkey(full_name, phone)
        ),
        donations!inner(
          id,
          resource_type,
          quantity,
          pickup_location,
          pickup_address,
          notes,
          donor_id,
          profiles!donations_donor_id_fkey(full_name, phone)
        ),
        profiles!missions_facilitator_id_fkey(full_name)
      `)
      .eq('id', mission_id)
      .eq('status', 'completed')
      .single()

    if (missionError || !mission) {
      console.error('Error fetching mission:', missionError)
      return new Response(
        JSON.stringify({ error: 'Mission not found or not completed' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Extract location information
    const reportLocation = await extractLocationInfo(supabaseClient, mission.reports.location)
    const donationLocation = await extractLocationInfo(supabaseClient, mission.donations.pickup_location)

    // Construct AI prompt
    const prompt = constructAIPrompt(mission, reportLocation, donationLocation)

    // Call Picaos API
    const thankYouLetter = await generateThankYouLetter(prompt)

    if (!thankYouLetter) {
      throw new Error('Failed to generate thank you letter')
    }

    // Save letter to mission
    const { error: updateError } = await supabaseClient
      .from('missions')
      .update({ letter_of_thanks: thankYouLetter })
      .eq('id', mission_id)

    if (updateError) {
      console.error('Error saving thank you letter:', updateError)
      throw updateError
    }

    // Send push notification to both donor and reporter
    await sendPushNotifications(supabaseClient, mission, thankYouLetter)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you letter generated successfully',
        letter_preview: thankYouLetter.substring(0, 100) + '...'
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

async function extractLocationInfo(supabaseClient: any, geographyPoint: string): Promise<string> {
  try {
    // Extract coordinates from geography point
    const { data: coordinates, error } = await supabaseClient
      .rpc('extract_coordinates', { geography_point: geographyPoint })

    if (error || !coordinates) {
      return 'a location in the community'
    }

    // For now, return a generic location description
    // In a real implementation, you could use reverse geocoding
    return `coordinates ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
  } catch (error) {
    console.error('Error extracting location info:', error)
    return 'a location in the community'
  }
}

function constructAIPrompt(mission: any, reportLocation: string, donationLocation: string): string {
  const donorName = mission.donations.profiles.full_name
  const facilitatorName = mission.profiles?.full_name || 'our facilitator'
  const resourceType = mission.donations.resource_type
  const quantity = mission.donations.quantity
  const peopleHelped = mission.reports.people_in_need
  const description = mission.reports.description
  const donationNotes = mission.donations.notes

  const contextDetails = []
  if (description) {
    contextDetails.push(`The situation was described as: "${description}"`)
  }
  if (donationNotes) {
    contextDetails.push(`The donor noted: "${donationNotes}"`)
  }

  const prompt = `You are the compassionate voice of the 'Karuna' community aid organization. Write a heartfelt, personal, and unique thank you letter to ${donorName}. 

Tell the specific story of their impact. The key details are:
- They donated ${quantity} ${resourceType}
- This helped ${peopleHelped} people in need
- The people were located near ${reportLocation}
- The donation was picked up from ${donationLocation}
- The mission was facilitated by ${facilitatorName}
- The mission was completed on ${new Date().toLocaleDateString()}

${contextDetails.length > 0 ? contextDetails.join('. ') + '.' : ''}

Write this as a personal letter that:
1. Expresses genuine gratitude for their specific contribution
2. Describes the real impact their donation had on the people helped
3. Mentions how their kindness made a difference in the community
4. Sounds like it's written by a real person, not a robot
5. Is warm, authentic, and inspiring
6. Is approximately 200-300 words long

Begin the letter with "Dear ${donorName}," and end with a warm closing from the Karuna team.`

  return prompt
}

async function generateThankYouLetter(prompt: string): Promise<string | null> {
  try {
    const picaosApiKey = Deno.env.get('PICAOS_SECRET_KEY')
    
    if (!picaosApiKey) {
      console.error('PICAOS_SECRET_KEY not found in environment variables')
      return generateFallbackLetter(prompt)
    }

    // Call Picaos API
    const response = await fetch('https://api.picaos.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${picaosApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate writer for a community aid organization. Write heartfelt, personal thank you letters that genuinely express gratitude and impact.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('Picaos API error:', response.status, response.statusText)
      return generateFallbackLetter(prompt)
    }

    const data = await response.json()
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim()
    } else {
      console.error('Unexpected Picaos API response format:', data)
      return generateFallbackLetter(prompt)
    }
  } catch (error) {
    console.error('Error calling Picaos API:', error)
    return generateFallbackLetter(prompt)
  }
}

function generateFallbackLetter(prompt: string): string {
  // Extract donor name from prompt
  const donorNameMatch = prompt.match(/to ([^.]+)\./)
  const donorName = donorNameMatch ? donorNameMatch[1] : 'Dear Friend'

  // Extract basic details for fallback
  const quantityMatch = prompt.match(/They donated ([^-]+)/)
  const donation = quantityMatch ? quantityMatch[1].trim() : 'their generous donation'

  const peopleMatch = prompt.match(/This helped (\d+) people/)
  const peopleHelped = peopleMatch ? peopleMatch[1] : 'several people'

  return `Dear ${donorName},

I wanted to personally reach out to thank you for your incredible generosity. Your donation of ${donation} has made a real difference in our community.

Because of your kindness, ${peopleHelped} people received the help they needed when they needed it most. Your contribution didn't just provide essential resources – it provided hope, dignity, and the knowledge that there are people who care.

Our facilitator was able to coordinate the delivery efficiently, ensuring that your donation reached those who needed it most. The gratitude expressed by the recipients was truly heartwarming, and I wish you could have seen the relief and joy on their faces.

Your act of compassion creates ripples of positive change that extend far beyond the immediate impact. You've shown that our community is one where people look out for each other, where kindness prevails, and where no one has to face hardship alone.

Thank you for being a beacon of hope and for trusting Karuna to help you make a difference. Your generosity inspires us all to continue building a more compassionate community.

With heartfelt gratitude,
The Karuna Team`
}

async function sendPushNotifications(supabaseClient: any, mission: any, thankYouLetter: string) {
  try {
    // Get FCM tokens for donor and reporter
    const donorId = mission.donations.donor_id
    const reporterId = mission.reports.reporter_id

    const { data: profiles, error } = await supabaseClient
      .from('profiles')
      .select('id, fcm_token, full_name')
      .in('id', [donorId, reporterId])
      .not('fcm_token', 'is', null)

    if (error || !profiles || profiles.length === 0) {
      console.log('No FCM tokens found for notification')
      return
    }

    // Extract first sentence of letter for notification
    const firstSentence = thankYouLetter.split('.')[0] + '.'

    // Send notifications (this would integrate with your push notification service)
    for (const profile of profiles) {
      const notificationData = {
        token: profile.fcm_token,
        title: 'Your Impact Story is Ready! 💝',
        body: firstSentence,
        data: {
          type: 'impact_story',
          mission_id: mission.id.toString(),
        }
      }

      // Log notification (in a real implementation, you'd send via FCM)
      console.log(`Would send notification to ${profile.full_name}:`, notificationData)
    }
  } catch (error) {
    console.error('Error sending push notifications:', error)
  }
}