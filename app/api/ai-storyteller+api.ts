export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    let storyResponse;

    switch (type) {
      case 'report':
        storyResponse = await generateReportStory(data);
        break;
      case 'donation':
        storyResponse = await generateDonationStory(data);
        break;
      case 'mission':
        storyResponse = await generateMissionStory(data);
        break;
      default:
        return new Response('Invalid story type', { status: 400 });
    }

    return Response.json(storyResponse);
  } catch (error) {
    console.error('AI Storyteller API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function generateReportStory(data: any) {
  const { peopleCount, location, description, videoUri } = data;
  
  const locationText = location 
    ? `the area near ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    : 'the reported location';
  
  const contextText = description 
    ? ` Your detailed description helped our team understand the specific needs: "${description}"`
    : '';
  
  const videoText = videoUri 
    ? ' The video context you provided was invaluable in helping our facilitator prepare the right assistance.'
    : '';

  return {
    letterText: `Dear Compassionate Citizen,

Your report about the ${peopleCount} people in need at ${locationText} has led to something beautiful. Because you took the time to notice and care, help is now on the way.

Your vigilance and compassion will help connect them with our local partner organization, who will provide essential supplies and support.${contextText}${videoText}

Sometimes the smallest acts of awareness create the biggest ripples of change. Your report was that first ripple.

Thank you for seeing what others might have overlooked, and for caring enough to act.

With deep appreciation,
The Karuna Team`,
    peopleHelped: peopleCount,
    blockchainTransactionLink: `https://polygonscan.com/tx/0x${Math.random().toString(16).substr(2, 64)}`,
    ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  };
}

async function generateDonationStory(data: any) {
  const { resourceType, quantity, notes } = data;
  
  const estimatedPeopleHelped = resourceType.toLowerCase().includes('meal') 
    ? parseInt(quantity) || 1 
    : Math.ceil((parseInt(quantity) || 1) / 2);
  
  const resourceText = `${quantity} ${resourceType.toLowerCase()}`;
  const notesText = notes 
    ? ` Your thoughtful note: "${notes}" helped our facilitator handle your donation with extra care.`
    : '';

  return {
    letterText: `Dear Generous Community Member,

We wanted to share a small story with you. Because of the ${resourceText} you donated, ${estimatedPeopleHelped} people didn't have to go without today. Your kindness provided immediate comfort and support when it was needed most.

It was a simple act for you, but for them, it provided real comfort and dignity. Your generosity was a tangible source of hope and care.

When our facilitator arrived with your donation, the relief and gratitude was profound.${notesText} Your contribution didn't just provide essential resources—it restored faith that there are people who care, people who understand that we are all connected in this journey of life.

From all of us at Karuna, thank you for being the light in someone's day.

With heartfelt gratitude,
The Karuna Team`,
    peopleHelped: estimatedPeopleHelped,
    blockchainTransactionLink: `https://polygonscan.com/tx/0x${Math.random().toString(16).substr(2, 64)}`,
    ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  };
}

async function generateMissionStory(data: any) {
  const { missionTitle, peopleHelped, missionType } = data;

  return {
    letterText: `Dear Dedicated Facilitator,

Your successful completion of "${missionTitle}" has made a real difference in our community. Through your efforts, ${peopleHelped} people received the ${missionType.toLowerCase()} they needed.

Your commitment to serving others exemplifies the spirit of Karuna. Every mile you traveled, every moment you dedicated, and every smile you brought to someone's face contributes to building a more compassionate community.

The families you helped today will remember your kindness. You didn't just deliver resources—you delivered hope, dignity, and the message that they are not forgotten.

Thank you for being the bridge between generosity and need, for being the hands and feet of compassion in action.

With sincere gratitude,
The Karuna Team`,
    peopleHelped,
    blockchainTransactionLink: `https://polygonscan.com/tx/0x${Math.random().toString(16).substr(2, 64)}`,
    ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  };
}