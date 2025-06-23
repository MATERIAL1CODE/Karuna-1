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
  aiGeneratedLetterSnippet?: string;
  fullAiGeneratedLetter?: string;
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
}

export interface CommunityImpactItem {
  id: string;
  title: string;
  description: string;
  peopleHelped: number;
  date: string;
  type: 'report' | 'donation' | 'mission';
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
}

interface DataContextType {
  // Activities (for citizen stories)
  activities: ActivityItem[];
  
  // Community impact feed
  communityImpactFeed: CommunityImpactItem[];
  
  // Missions (for facilitators)
  missions: Mission[];
  completedMissions: Mission[];
  
  // Loading states
  isLoadingData: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  addActivity: (newActivity: Omit<ActivityItem, 'id' | 'date'>) => void;
  updateActivityStatus: (id: string, status: ActivityItem['status'], additionalData?: Partial<ActivityItem>) => void;
  acceptMission: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  
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
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchData = async () => {
    setIsLoadingData(true);
    
    // Track data fetch event
    AnalyticsService.trackUserAction('data_fetch_started');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock activities data with enhanced stories
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'report',
        title: 'Need Reported',
        subtitle: 'Location: Nehru Place Metro Station',
        status: 'in_progress',
        date: '2 hours ago',
        peopleHelped: 3,
      },
      {
        id: '2',
        type: 'donation',
        title: 'Donation Logged',
        subtitle: 'Item: 15 Cooked Meals',
        status: 'completed',
        date: '1 day ago',
        peopleHelped: 15,
        aiGeneratedLetterSnippet: '...a family of four didn\'t have to go to sleep hungry on a cold night.',
        fullAiGeneratedLetter: `Dear Community Member,

We wanted to share a small story with you. Because of the 15 cooked meals you donated, a family of four didn't have to go to sleep hungry on a cold night. Your kindness provided immediate comfort and nourishment when it was needed most.

It was a simple act for you, but for them, it provided real comfort and dignity. Your generosity was a tangible source of warmth and hope on what could have been a difficult evening.

The father, who works as a daily wage laborer, had not found work for three days. The mother, caring for two young children, was worried about how to feed her family. When our facilitator arrived with your donation, the relief and gratitude in their eyes was profound.

Your contribution didn't just fill empty stomachs—it restored their faith that there are people who care, people who understand that we are all connected in this journey of life.

From all of us at Sahayata, thank you for being the light in someone's darkness.

With heartfelt gratitude,
The Sahayata Team`,
        blockchainTransactionLink: 'https://polygonscan.com/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      {
        id: '3',
        type: 'report',
        title: 'Need Reported',
        subtitle: 'Location: Lajpat Nagar Market',
        status: 'completed',
        date: '2 days ago',
        peopleHelped: 5,
        aiGeneratedLetterSnippet: '...your vigilance and compassion helped five people find shelter and warmth.',
        fullAiGeneratedLetter: `Dear Compassionate Citizen,

Your report about the family near Lajpat Nagar Market led to something beautiful. Because you took the time to notice and care, five people—including three children—found shelter and warmth during the recent cold spell.

Your vigilance and compassion helped connect them with our local partner organization, who provided temporary accommodation and essential supplies. The children, ages 6, 8, and 12, are now safe and attending a nearby community center for daily meals and educational support.

Sometimes the smallest acts of awareness create the biggest ripples of change. Your report was that first ripple.

Thank you for seeing what others might have overlooked, and for caring enough to act.

With deep appreciation,
The Sahayata Team`,
        blockchainTransactionLink: 'https://polygonscan.com/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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
        aiGeneratedLetterSnippet: '...knowing someone cared enough to report their situation gave them hope.',
        fullAiGeneratedLetter: `Dear Kind Soul,

Your report about the elderly couple near Saket District Centre touched our hearts, and we wanted you to know the beautiful outcome of your compassion.

The couple, married for 45 years, had been struggling after the husband's recent illness left them unable to work. Your alert led our team to connect them with medical assistance and ongoing support from our partner healthcare clinic.

Today, they are receiving regular medical care, nutritious meals, and most importantly, they know they are not forgotten. The wife mentioned that knowing someone cared enough to report their situation gave them hope when they had almost lost it.

Your awareness and action reminded them—and us—that humanity's greatest strength lies in how we care for one another.

With sincere gratitude,
The Sahayata Team`,
        blockchainTransactionLink: 'https://polygonscan.com/tx/0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
    ];

    // Enhanced community impact feed
    const mockCommunityImpact: CommunityImpactItem[] = [
      {
        id: '1',
        title: 'Emergency Food Distribution',
        description: 'Community volunteers distributed 500 meals to families affected by recent flooding',
        peopleHelped: 500,
        date: '3 hours ago',
        type: 'mission',
      },
      {
        id: '2',
        title: 'Winter Clothing Drive',
        description: 'Warm clothes and blankets provided to homeless individuals during cold wave',
        peopleHelped: 75,
        date: '1 day ago',
        type: 'donation',
      },
      {
        id: '3',
        title: 'Medical Aid Response',
        description: 'Quick response team provided medical assistance to elderly residents',
        peopleHelped: 12,
        date: '2 days ago',
        type: 'report',
      },
      {
        id: '4',
        title: 'School Supply Distribution',
        description: 'Educational materials distributed to underprivileged children',
        peopleHelped: 150,
        date: '3 days ago',
        type: 'donation',
      },
      {
        id: '5',
        title: 'Community Kitchen Setup',
        description: 'Temporary kitchen established to serve daily meals',
        peopleHelped: 200,
        date: '1 week ago',
        type: 'mission',
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

    // Enhanced completed missions
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
      },
    ];

    setActivities(mockActivities);
    setCommunityImpactFeed(mockCommunityImpact);
    setMissions(mockMissions);
    setCompletedMissions(mockCompletedMissions);
    setIsLoadingData(false);

    // Track successful data fetch
    AnalyticsService.trackUserAction('data_fetch_completed', {
      activitiesCount: mockActivities.length,
      missionsCount: mockMissions.length,
      impactItemsCount: mockCommunityImpact.length,
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

          // Send notification for completed activities
          if (status === 'completed' && additionalData?.fullAiGeneratedLetter) {
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

  const acceptMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setMissions(prev => 
        prev.map(m => 
          m.id === missionId 
            ? { ...m, status: 'accepted' }
            : m
        )
      );

      // Track mission acceptance
      AnalyticsService.trackMissionEvent('mission_accepted', {
        missionId,
        missionType: mission.type,
        distance: mission.distance,
      });

      // Send notification
      NotificationService.sendMissionUpdateNotification(
        mission.title,
        'accepted',
        'You'
      );
    }
  };

  const completeMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      const completedMission = { ...mission, status: 'completed' as const };
      setCompletedMissions(prev => [completedMission, ...prev]);
      setMissions(prev => prev.filter(m => m.id !== missionId));

      // Track mission completion
      AnalyticsService.trackMissionEvent('mission_completed', {
        missionId,
        missionType: mission.type,
        distance: mission.distance,
      });

      // Send notification
      NotificationService.sendMissionUpdateNotification(
        mission.title,
        'completed',
        'You'
      );
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
    isLoadingData,
    fetchData,
    addActivity,
    updateActivityStatus,
    acceptMission,
    completeMission,
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