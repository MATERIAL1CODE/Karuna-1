import { ActivityItem } from '@/contexts/DataContext';

export interface AIStorytellerResponse {
  letterText: string;
  peopleHelped: number;
  blockchainTransactionLink?: string;
  ngoLogoUrl?: string;
}

export class AIStorytellerService {
  // Enhanced AI Storyteller function for reports using API route
  static async generateReportStory(
    peopleCount: number,
    location?: { latitude: number; longitude: number },
    description?: string,
    videoUri?: string
  ): Promise<AIStorytellerResponse> {
    try {
      const response = await fetch('/api/ai-storyteller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'report',
          data: {
            peopleCount,
            location,
            description,
            videoUri,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating report story:', error);
      // Fallback to mock data
      return this.generateMockReportStory(peopleCount, location, description, videoUri);
    }
  }

  // Enhanced AI Storyteller function for donations using API route
  static async generateDonationStory(
    resourceType: string,
    quantity: string,
    notes?: string
  ): Promise<AIStorytellerResponse> {
    try {
      const response = await fetch('/api/ai-storyteller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'donation',
          data: {
            resourceType,
            quantity,
            notes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating donation story:', error);
      // Fallback to mock data
      return this.generateMockDonationStory(resourceType, quantity, notes);
    }
  }

  // Generate story for completed missions using API route
  static async generateMissionCompletionStory(
    missionTitle: string,
    peopleHelped: number,
    missionType: string
  ): Promise<AIStorytellerResponse> {
    try {
      const response = await fetch('/api/ai-storyteller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'mission',
          data: {
            missionTitle,
            peopleHelped,
            missionType,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating mission story:', error);
      // Fallback to mock data
      return this.generateMockMissionStory(missionTitle, peopleHelped, missionType);
    }
  }

  // Fallback mock functions for offline/error scenarios
  private static async generateMockReportStory(
    peopleCount: number,
    location?: { latitude: number; longitude: number },
    description?: string,
    videoUri?: string
  ): Promise<AIStorytellerResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
The Sahayata Team`,
      peopleHelped: peopleCount,
      blockchainTransactionLink: `https://polygonscan.com/tx/0x${Math.random().toString(16).substr(2, 64)}`,
      ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    };
  }

  private static async generateMockDonationStory(
    resourceType: string,
    quantity: string,
    notes?: string
  ): Promise<AIStorytellerResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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

From all of us at Sahayata, thank you for being the light in someone's day.

With heartfelt gratitude,
The Sahayata Team`,
      peopleHelped: estimatedPeopleHelped,
      blockchainTransactionLink: `https://polygonscan.com/tx/0x${Math.random().toString(16).substr(2, 64)}`,
      ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    };
  }

  private static async generateMockMissionStory(
    missionTitle: string,
    peopleHelped: number,
    missionType: string
  ): Promise<AIStorytellerResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      letterText: `Dear Dedicated Facilitator,

Your successful completion of "${missionTitle}" has made a real difference in our community. Through your efforts, ${peopleHelped} people received the ${missionType.toLowerCase()} they needed.

Your commitment to serving others exemplifies the spirit of Sahayata. Every mile you traveled, every moment you dedicated, and every smile you brought to someone's face contributes to building a more compassionate community.

The families you helped today will remember your kindness. You didn't just deliver resources—you delivered hope, dignity, and the message that they are not forgotten.

Thank you for being the bridge between generosity and need, for being the hands and feet of compassion in action.

With sincere gratitude,
The Sahayata Team`,
      peopleHelped,
      blockchainTransactionLink: `https://polygonscan.com/tx/0x${Math.random().toString(16).substr(2, 64)}`,
      ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    };
  }

  // Update activity with AI-generated story
  static enhanceActivityWithStory(
    activity: ActivityItem,
    storyResponse: AIStorytellerResponse
  ): ActivityItem {
    const snippet = this.generateSnippet(storyResponse.letterText, activity.type);
    
    return {
      ...activity,
      status: 'completed',
      peopleHelped: storyResponse.peopleHelped,
      fullAiGeneratedLetter: storyResponse.letterText,
      aiGeneratedLetterSnippet: snippet,
      blockchainTransactionLink: storyResponse.blockchainTransactionLink,
      ngoLogoUrl: storyResponse.ngoLogoUrl,
    };
  }

  // Generate a snippet from the full letter
  private static generateSnippet(fullLetter: string, type: 'report' | 'donation'): string {
    const sentences = fullLetter.split('. ');
    
    // Find a meaningful sentence that captures the impact
    const impactSentence = sentences.find(sentence => 
      sentence.includes('people') && 
      (sentence.includes('helped') || sentence.includes('didn\'t have to') || sentence.includes('received'))
    );
    
    if (impactSentence) {
      return `...${impactSentence.replace(/^[^a-zA-Z]*/, '').toLowerCase()}.`;
    }
    
    // Fallback snippets
    if (type === 'donation') {
      return '...your generosity provided comfort and hope when it was needed most.';
    } else {
      return '...your compassion helped connect them with essential support.';
    }
  }
}