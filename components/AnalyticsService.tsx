export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface UserProperties {
  userId?: string;
  userType: 'citizen' | 'facilitator';
  totalReports?: number;
  totalDonations?: number;
  totalMissions?: number;
  totalPeopleHelped?: number;
}

export class AnalyticsService {
  private static events: AnalyticsEvent[] = [];
  private static userProperties: UserProperties | null = null;

  // Initialize analytics with user properties
  static initialize(userProps: UserProperties): void {
    this.userProperties = userProps;
    this.trackEvent('app_initialized', {
      userType: userProps.userType,
      timestamp: new Date(),
    });
  }

  // Track custom events
  static trackEvent(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        userType: this.userProperties?.userType,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
    };

    this.events.push(event);
    console.log('Analytics Event:', event);

    // In a real app, this would send to analytics service
    // Example: Mixpanel, Amplitude, Google Analytics, etc.
  }

  // Track user actions
  static trackUserAction(action: string, context?: Record<string, any>): void {
    this.trackEvent('user_action', {
      action,
      ...context,
    });
  }

  // Track screen views
  static trackScreenView(screenName: string, properties?: Record<string, any>): void {
    this.trackEvent('screen_view', {
      screenName,
      ...properties,
    });
  }

  // Track mission events
  static trackMissionEvent(
    eventType: 'mission_accepted' | 'mission_completed' | 'mission_cancelled',
    missionData: {
      missionId: string;
      missionType: string;
      peopleHelped?: number;
      distance?: string;
      duration?: number;
    }
  ): void {
    this.trackEvent(eventType, missionData);
  }

  // Track donation events
  static trackDonationEvent(
    eventType: 'donation_started' | 'donation_completed' | 'donation_cancelled',
    donationData: {
      resourceType: string;
      quantity: string;
      estimatedPeopleHelped?: number;
    }
  ): void {
    this.trackEvent(eventType, donationData);
  }

  // Track report events
  static trackReportEvent(
    eventType: 'report_started' | 'report_completed' | 'report_cancelled',
    reportData: {
      peopleCount: number;
      hasVideo?: boolean;
      hasDescription?: boolean;
      location?: { latitude: number; longitude: number };
    }
  ): void {
    this.trackEvent(eventType, reportData);
  }

  // Track impact story events
  static trackImpactStoryEvent(
    eventType: 'story_generated' | 'story_viewed' | 'story_shared',
    storyData: {
      activityType: 'report' | 'donation';
      peopleHelped: number;
      hasBlockchainVerification?: boolean;
    }
  ): void {
    this.trackEvent(eventType, storyData);
  }

  // Update user properties
  static updateUserProperties(properties: Partial<UserProperties>): void {
    if (this.userProperties) {
      this.userProperties = { ...this.userProperties, ...properties };
    }
    
    this.trackEvent('user_properties_updated', properties);
  }

  // Get analytics summary
  static getAnalyticsSummary(): {
    totalEvents: number;
    recentEvents: AnalyticsEvent[];
    userProperties: UserProperties | null;
  } {
    return {
      totalEvents: this.events.length,
      recentEvents: this.events.slice(-10), // Last 10 events
      userProperties: this.userProperties,
    };
  }

  // Export analytics data (for debugging or data export)
  static exportData(): {
    events: AnalyticsEvent[];
    userProperties: UserProperties | null;
    exportTimestamp: string;
  } {
    return {
      events: this.events,
      userProperties: this.userProperties,
      exportTimestamp: new Date().toISOString(),
    };
  }

  // Clear analytics data
  static clearData(): void {
    this.events = [];
    this.userProperties = null;
  }
}