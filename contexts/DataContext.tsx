import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalyticsService } from '@/components/AnalyticsService';
import { NotificationService } from '@/components/NotificationService';

export interface ActivityItem {
  id: string;
  type: 'report' | 'donation';
  title: string;
  subtitle: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  peopleHelped?: number;
  facilitatorStorySnippet?: string;
  fullFacilitatorStory?: string;
  facilitatorName?: string;
  facilitatorId?: string;
  blockchainTransactionLink?: string;
  ngoLogoUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  resourceType?: string;
  quantity?: string;
  description?: string;
  videoUri?: string;
  completedAt?: string;
  missionId?: string;
}

export interface CommunityImpactItem {
  id: string;
  title: string;
  description: string;
  peopleHelped: number;
  date: string;
  type: 'report' | 'donation' | 'mission';
  facilitatorName?: string;
  storySnippet?: string;
}

export interface Mission {
  id: string;
  title: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupContact: string;
  deliveryContact: string;
  pickupTime: string;
  deliveryTime: string;
  type: 'Food' | 'Clothing' | 'Medicine' | 'Emergency';
  urgency: 'high' | 'medium' | 'low';
  distance: string;
  eta: string;
  status: 'available' | 'accepted' | 'in_progress' | 'completed';
  citizenActivityId?: string; // Link to the original report/donation
  facilitatorId?: string;
  facilitatorName?: string;
  completedAt?: string;
  thankYouStory?: string;
}

export interface ThankYouStory {
  id: string;
  missionId: string;
  activityId: string;
  facilitatorId: string;
  facilitatorName: string;
  story: string;
  peopleHelped: number;
  createdAt: string;
  isPublic: boolean;
}

interface DataContextType {
  // Activities (for citizen stories)
  activities: ActivityItem[];
  
  // Community impact feed
  communityImpactFeed: CommunityImpactItem[];
  
  // Missions (for facilitators)
  missions: Mission[];
  completedMissions: Mission[];
  
  // Thank you stories
  thankYouStories: ThankYouStory[];
  
  // Loading states
  isLoadingData: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  addActivity: (newActivity: Omit<ActivityItem, 'id' | 'date'>) => void;
  updateActivityStatus: (id: string, status: ActivityItem['status'], additionalData?: Partial<ActivityItem>) => void;
  acceptMission: (missionId: string, facilitatorId: string, facilitatorName: string) => void;
  completeMission: (missionId: string, thankYouStory: string, peopleHelped: number) => void;
  submitThankYouStory: (missionId: string, story: string, peopleHelped: number, isPublic?: boolean) => void;
  
  // Statistics
  getTotalPeopleHelped: () => number;
  getUserImpactStats: () => {
    totalReports: number;
    totalDonations: number;
    totalPeopleHelped: number;
    completedMissions: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [communityImpactFeed, setCommunityImpactFeed] = useState<CommunityImpactItem[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);
  const [thankYouStories, setThankYouStories] = useState<ThankYouStory[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchData = async () => {
    setIsLoadingData(true);
    
    // Track data fetch event
    AnalyticsService.trackUserAction('data_fetch_started');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock activities data with facilitator-written stories
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'report',
        title: 'Need Reported',
        subtitle: 'Location: Nehru Place Metro Station',
        status: 'in_progress',
        date: '2 hours ago',
        peopleHelped: 3,
        missionId: 'mission_1',
      },
      {
        id: '2',
        type: 'donation',
        title: 'Donation Logged',
        subtitle: 'Item: 15 Cooked Meals',
        status: 'completed',
        date: '1 day ago',
        peopleHelped: 15,
        facilitatorName: 'Priya Sharma',
        facilitatorId: 'facilitator_1',
        facilitatorStorySnippet: '...the family was so grateful, the children smiled for the first time in days.',
        fullFacilitatorStory: `Dear Generous Donor,

I had the privilege of delivering your 15 cooked meals to a family of four who had been struggling for the past week. When I arrived at their small shelter near the construction site, I could see the worry in the mother's eyes fade away as she realized help had arrived.

The father, who works as a daily laborer, hadn't found work for several days due to the recent rains. The mother was caring for two young children, ages 6 and 8, and an elderly grandmother. Your donation meant they could have a proper meal after going without food for almost two days.

What touched me most was when the little girl asked her mother if they could save some food for tomorrow, showing how uncertain their next meal was. Your kindness not only filled their stomachs but also gave them hope that there are people who care.

The grandmother blessed you with tears in her eyes, and the children smiled for the first time in days. Your simple act of generosity created a moment of joy and relief that this family will remember forever.

Thank you for trusting me to deliver your kindness. It's moments like these that remind me why I became a facilitator.

With heartfelt gratitude,
Priya Sharma
Karuna Facilitator`,
        blockchainTransactionLink: 'https://polygonscan.com/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        completedAt: '2024-01-15T14:30:00Z',
        missionId: 'mission_2',
      },
      {
        id: '3',
        type: 'report',
        title: 'Need Reported',
        subtitle: 'Location: Lajpat Nagar Market',
        status: 'completed',
        date: '2 days ago',
        peopleHelped: 5,
        facilitatorName: 'Rajesh Kumar',
        facilitatorId: 'facilitator_2',
        facilitatorStorySnippet: '...the children are now safe and attending school regularly.',
        fullFacilitatorStory: `Dear Compassionate Reporter,

Your alert about the family near Lajpat Nagar Market led to one of the most heartwarming rescues I've been part of. When I reached the location you described, I found a mother with three children (ages 6, 8, and 12) and an elderly man who had been living under a makeshift shelter.

The family had been displaced after their rented room was flooded during the monsoon. They had been surviving on the streets for over a week, with the children missing school and the elderly man needing medical attention for his diabetes.

Thanks to your detailed report, I was able to coordinate with our partner NGO to provide immediate shelter at a nearby community center. We also arranged for medical care for the grandfather and ensured the children could continue their education.

Today, I'm happy to share that the family has been moved to temporary housing, the children are attending school regularly, and the grandfather is receiving proper medical care. The mother has also found work at a nearby textile unit.

The eldest child, Aarti, asked me to thank the "angel" who noticed them and cared enough to report their situation. Your vigilance and compassion literally changed the trajectory of this family's life.

Sometimes the smallest acts of awareness create the biggest changes. Thank you for being their voice when they couldn't speak for themselves.

With deep appreciation,
Rajesh Kumar
Karuna Facilitator`,
        blockchainTransactionLink: 'https://polygonscan.com/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        completedAt: '2024-01-14T16:45:00Z',
        missionId: 'mission_3',
      },
      {
        id: '4',
        type: 'donation',
        title: 'Clothing Donation',
        subtitle: 'Item: Winter Clothes for 8 People',
        status: 'pending',
        date: '3 hours ago',
        peopleHelped: 8,
      },
      {
        id: '5',
        type: 'report',
        title: 'Elderly Couple Reported',
        subtitle: 'Location: Saket District Centre',
        status: 'completed',
        date: '1 week ago',
        peopleHelped: 2,
        facilitatorName: 'Anita Verma',
        facilitatorId: 'facilitator_3',
        facilitatorStorySnippet: '...they now have regular meals and medical care, and most importantly, hope.',
        fullFacilitatorStory: `Dear Kind Soul,

Your report about the elderly couple near Saket District Centre touched my heart, and I wanted to personally share the beautiful outcome of your compassion.

When I met Mr. and Mrs. Gupta, both in their 70s, they had been sitting outside the metro station for three days. Mr. Gupta had recently been discharged from the hospital after a heart procedure, and they had exhausted their savings on medical bills. With no family support, they were literally on the streets.

Your detailed description helped me locate them quickly. Mrs. Gupta was trying to shield her husband from the cold wind, and both looked exhausted and defeated. When I approached them and mentioned that someone had reported their situation out of concern, Mrs. Gupta started crying - not from sadness, but from relief that someone had noticed them.

I immediately arranged for them to stay at our partner senior care facility. We also connected them with a government scheme for elderly healthcare and ensured they receive daily meals. Mr. Gupta's medication is now being provided free of cost through our medical partner.

Yesterday, when I visited them, Mrs. Gupta was teaching other residents how to knit, and Mr. Gupta was sharing stories with the children who visit the center. They asked me to find the person who reported them because they wanted to thank them personally.

Mrs. Gupta said, "Tell them that when we had lost all hope, their kindness reminded us that we are not forgotten." Your awareness and action didn't just save their lives - it restored their dignity and gave them a community.

Thank you for seeing them when the world seemed to look away.

With sincere gratitude,
Anita Verma
Karuna Facilitator`,
        blockchainTransactionLink: 'https://polygonscan.com/tx/0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        completedAt: '2024-01-08T11:20:00Z',
        missionId: 'mission_4',
      },
    ];

    // Enhanced community impact feed with facilitator stories
    const mockCommunityImpact: CommunityImpactItem[] = [
      {
        id: '1',
        title: 'Emergency Food Distribution',
        description: 'Community volunteers distributed 500 meals to families affected by recent flooding',
        peopleHelped: 500,
        date: '3 hours ago',
        type: 'mission',
        facilitatorName: 'Team of 12 Facilitators',
        storySnippet: 'Families were reunited with hope as warm meals reached every shelter...',
      },
      {
        id: '2',
        title: 'Winter Clothing Drive',
        description: 'Warm clothes and blankets provided to homeless individuals during cold wave',
        peopleHelped: 75,
        date: '1 day ago',
        type: 'donation',
        facilitatorName: 'Meera Patel',
        storySnippet: 'The warmth in their eyes was worth more than any blanket...',
      },
      {
        id: '3',
        title: 'Medical Aid Response',
        description: 'Quick response team provided medical assistance to elderly residents',
        peopleHelped: 12,
        date: '2 days ago',
        type: 'report',
        facilitatorName: 'Dr. Suresh Reddy',
        storySnippet: 'Timely intervention saved lives and restored health to the community...',
      },
      {
        id: '4',
        title: 'School Supply Distribution',
        description: 'Educational materials distributed to underprivileged children',
        peopleHelped: 150,
        date: '3 days ago',
        type: 'donation',
        facilitatorName: 'Kavita Singh',
        storySnippet: 'Children\'s faces lit up with dreams of a brighter future...',
      },
      {
        id: '5',
        title: 'Community Kitchen Setup',
        description: 'Temporary kitchen established to serve daily meals',
        peopleHelped: 200,
        date: '1 week ago',
        type: 'mission',
        facilitatorName: 'Community Volunteers',
        storySnippet: 'Every meal served was a reminder that no one eats alone...',
      },
    ];

    // Enhanced missions for facilitators
    const mockMissions: Mission[] = [
      {
        id: '1',
        title: 'Food for 4 People',
        pickupLocation: "Anna's Cafe, Saket District Centre",
        deliveryLocation: 'Underneath Lajpat Nagar Flyover',
        pickupContact: 'Sarah Miller (+91 98765 43210)',
        deliveryContact: 'Local Coordinator (+91 87654 32109)',
        pickupTime: '2:00 PM',
        deliveryTime: '3:00 PM',
        type: 'Food',
        urgency: 'high',
        distance: '3.2 km',
        eta: '45 mins',
        status: 'available',
        citizenActivityId: '1',
      },
      {
        id: '2',
        title: 'Clothing for Family',
        pickupLocation: 'Green Valley Mall, Sector 18',
        deliveryLocation: 'Near Railway Station Platform 2',
        pickupContact: 'Mike Johnson (+91 98765 43211)',
        deliveryContact: 'Community Volunteer (+91 87654 32110)',
        pickupTime: '4:00 PM',
        deliveryTime: '5:00 PM',
        type: 'Clothing',
        urgency: 'medium',
        distance: '5.1 km',
        eta: '60 mins',
        status: 'available',
        citizenActivityId: '4',
      },
      {
        id: '3',
        title: 'Emergency Medicine Delivery',
        pickupLocation: 'City Hospital Pharmacy',
        deliveryLocation: 'Community Health Center',
        pickupContact: 'Dr. Patel (+91 98765 43212)',
        deliveryContact: 'Nurse Station (+91 87654 32111)',
        pickupTime: '1:00 PM',
        deliveryTime: '1:30 PM',
        type: 'Medicine',
        urgency: 'high',
        distance: '2.8 km',
        eta: '30 mins',
        status: 'available',
      },
    ];

    // Enhanced completed missions with thank you stories
    const mockCompletedMissions: Mission[] = [
      {
        id: 'c1',
        title: 'Food Delivery Completed',
        pickupLocation: 'Restaurant ABC',
        deliveryLocation: 'Community Center',
        pickupContact: 'Chef Kumar',
        deliveryContact: 'Center Manager',
        pickupTime: '1:00 PM',
        deliveryTime: '2:00 PM',
        type: 'Food',
        urgency: 'high',
        distance: '2.5 km',
        eta: '30 mins',
        status: 'completed',
        facilitatorId: 'facilitator_1',
        facilitatorName: 'Priya Sharma',
        completedAt: '2024-01-15T14:30:00Z',
        citizenActivityId: '2',
        thankYouStory: 'Successfully delivered meals to grateful families...',
      },
      {
        id: 'c2',
        title: 'Medicine Distribution',
        pickupLocation: 'Medical Store',
        deliveryLocation: 'Elder Care Home',
        pickupContact: 'Pharmacist',
        deliveryContact: 'Care Manager',
        pickupTime: '10:00 AM',
        deliveryTime: '11:00 AM',
        type: 'Medicine',
        urgency: 'medium',
        distance: '4.2 km',
        eta: '45 mins',
        status: 'completed',
        facilitatorId: 'facilitator_2',
        facilitatorName: 'Rajesh Kumar',
        completedAt: '2024-01-14T11:00:00Z',
        thankYouStory: 'Ensured elderly residents received their vital medications...',
      },
    ];

    // Mock thank you stories
    const mockThankYouStories: ThankYouStory[] = [
      {
        id: 'story_1',
        missionId: 'c1',
        activityId: '2',
        facilitatorId: 'facilitator_1',
        facilitatorName: 'Priya Sharma',
        story: 'The family was so grateful, the children smiled for the first time in days...',
        peopleHelped: 15,
        createdAt: '2024-01-15T14:30:00Z',
        isPublic: true,
      },
      {
        id: 'story_2',
        missionId: 'c2',
        activityId: '3',
        facilitatorId: 'facilitator_2',
        facilitatorName: 'Rajesh Kumar',
        story: 'The children are now safe and attending school regularly...',
        peopleHelped: 5,
        createdAt: '2024-01-14T16:45:00Z',
        isPublic: true,
      },
    ];

    setActivities(mockActivities);
    setCommunityImpactFeed(mockCommunityImpact);
    setMissions(mockMissions);
    setCompletedMissions(mockCompletedMissions);
    setThankYouStories(mockThankYouStories);
    setIsLoadingData(false);

    // Track successful data fetch
    AnalyticsService.trackUserAction('data_fetch_completed', {
      activitiesCount: mockActivities.length,
      missionsCount: mockMissions.length,
      impactItemsCount: mockCommunityImpact.length,
      storiesCount: mockThankYouStories.length,
    });
  };

  const addActivity = (newActivity: Omit<ActivityItem, 'id' | 'date'>) => {
    const activity: ActivityItem = {
      ...newActivity,
      id: Date.now().toString(),
      date: 'Just now',
    };
    
    setActivities(prev => [activity, ...prev]);
    
    // Track activity creation
    AnalyticsService.trackUserAction('activity_created', {
      activityType: newActivity.type,
      status: newActivity.status,
      peopleHelped: newActivity.peopleHelped,
    });
    
    // Also add to community impact feed
    const impactItem: CommunityImpactItem = {
      id: Date.now().toString(),
      title: newActivity.title,
      description: newActivity.subtitle,
      peopleHelped: newActivity.peopleHelped || 1,
      date: 'Just now',
      type: newActivity.type,
    };
    
    setCommunityImpactFeed(prev => [impactItem, ...prev]);

    // Send notification for activity creation
    NotificationService.scheduleLocalNotification({
      title: 'Activity Logged Successfully',
      body: `Your ${newActivity.type} has been recorded and will be processed soon.`,
      data: { activityId: activity.id, type: newActivity.type },
    }, 2);
  };

  const updateActivityStatus = (id: string, status: ActivityItem['status'], additionalData?: Partial<ActivityItem>) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === id) {
          const updatedActivity = { ...activity, status, ...additionalData };
          
          // Track status update
          AnalyticsService.trackUserAction('activity_status_updated', {
            activityId: id,
            activityType: activity.type,
            oldStatus: activity.status,
            newStatus: status,
            peopleHelped: updatedActivity.peopleHelped,
          });

          // Send notification for completed activities with facilitator stories
          if (status === 'completed' && additionalData?.fullFacilitatorStory) {
            NotificationService.sendImpactStoryNotification(
              activity.type,
              updatedActivity.peopleHelped || 1
            );
          }

          return updatedActivity;
        }
        return activity;
      })
    );
  };

  const acceptMission = (missionId: string, facilitatorId: string, facilitatorName: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setMissions(prev => 
        prev.map(m => 
          m.id === missionId 
            ? { ...m, status: 'accepted', facilitatorId, facilitatorName }
            : m
        )
      );

      // Track mission acceptance
      AnalyticsService.trackMissionEvent('mission_accepted', {
        missionId,
        missionType: mission.type,
        distance: mission.distance,
        facilitatorId,
      });

      // Send notification
      NotificationService.sendMissionUpdateNotification(
        mission.title,
        'accepted',
        facilitatorName
      );
    }
  };

  const completeMission = (missionId: string, thankYouStory: string, peopleHelped: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      const completedMission = { 
        ...mission, 
        status: 'completed' as const,
        thankYouStory,
        completedAt: new Date().toISOString(),
      };
      
      setCompletedMissions(prev => [completedMission, ...prev]);
      setMissions(prev => prev.filter(m => m.id !== missionId));

      // Update the related activity with facilitator story
      if (mission.citizenActivityId) {
        updateActivityStatus(mission.citizenActivityId, 'completed', {
          facilitatorName: mission.facilitatorName,
          facilitatorId: mission.facilitatorId,
          facilitatorStorySnippet: thankYouStory.substring(0, 100) + '...',
          fullFacilitatorStory: thankYouStory,
          peopleHelped,
          completedAt: new Date().toISOString(),
          missionId,
        });
      }

      // Track mission completion
      AnalyticsService.trackMissionEvent('mission_completed', {
        missionId,
        missionType: mission.type,
        distance: mission.distance,
        facilitatorId: mission.facilitatorId,
        peopleHelped,
      });

      // Send notification
      NotificationService.sendMissionUpdateNotification(
        mission.title,
        'completed',
        mission.facilitatorName || 'Facilitator'
      );
    }
  };

  const submitThankYouStory = (missionId: string, story: string, peopleHelped: number, isPublic: boolean = true) => {
    const mission = completedMissions.find(m => m.id === missionId);
    if (mission) {
      const newStory: ThankYouStory = {
        id: `story_${Date.now()}`,
        missionId,
        activityId: mission.citizenActivityId || '',
        facilitatorId: mission.facilitatorId || '',
        facilitatorName: mission.facilitatorName || '',
        story,
        peopleHelped,
        createdAt: new Date().toISOString(),
        isPublic,
      };

      setThankYouStories(prev => [newStory, ...prev]);

      // Track story submission
      AnalyticsService.trackUserAction('thank_you_story_submitted', {
        missionId,
        facilitatorId: mission.facilitatorId,
        peopleHelped,
        isPublic,
        storyLength: story.length,
      });
    }
  };

  const getTotalPeopleHelped = () => {
    return communityImpactFeed.reduce((total, item) => total + item.peopleHelped, 0);
  };

  const getUserImpactStats = () => {
    const completedActivities = activities.filter(a => a.status === 'completed');
    const totalReports = completedActivities.filter(a => a.type === 'report').length;
    const totalDonations = completedActivities.filter(a => a.type === 'donation').length;
    const totalPeopleHelped = completedActivities.reduce((total, activity) => total + (activity.peopleHelped || 0), 0);
    const completedMissionsCount = completedMissions.length;

    return {
      totalReports,
      totalDonations,
      totalPeopleHelped,
      completedMissions: completedMissionsCount,
    };
  };

  const value: DataContextType = {
    activities,
    communityImpactFeed,
    missions,
    completedMissions,
    thankYouStories,
    isLoadingData,
    fetchData,
    addActivity,
    updateActivityStatus,
    acceptMission,
    completeMission,
    submitThankYouStory,
    getTotalPeopleHelped,
    getUserImpactStats,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}