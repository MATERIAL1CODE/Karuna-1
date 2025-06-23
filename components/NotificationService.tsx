import { Platform } from 'react-native';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class NotificationService {
  // Send push notification (mock implementation for web)
  static async sendPushNotification(notification: NotificationData): Promise<boolean> {
    if (Platform.OS === 'web') {
      // Web notification implementation
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/assets/images/icon.png',
            badge: '/assets/images/icon.png',
          });
          return true;
        }
      }
      return false;
    } else {
      // Mobile notification would be handled by expo-notifications
      console.log('Mobile notification:', notification);
      return true;
    }
  }

  // Schedule local notification
  static async scheduleLocalNotification(
    notification: NotificationData,
    delaySeconds: number = 0
  ): Promise<boolean> {
    if (Platform.OS === 'web') {
      setTimeout(() => {
        this.sendPushNotification(notification);
      }, delaySeconds * 1000);
      return true;
    } else {
      // Mobile scheduling would be handled by expo-notifications
      console.log('Scheduled mobile notification:', notification, 'in', delaySeconds, 'seconds');
      return true;
    }
  }

  // Send mission update notification
  static async sendMissionUpdateNotification(
    missionTitle: string,
    status: string,
    facilitatorName?: string
  ): Promise<void> {
    const notification: NotificationData = {
      title: 'Mission Update',
      body: `${missionTitle} - ${status}${facilitatorName ? ` by ${facilitatorName}` : ''}`,
      data: {
        type: 'mission_update',
        missionTitle,
        status,
      },
    };

    await this.sendPushNotification(notification);
  }

  // Send impact story notification
  static async sendImpactStoryNotification(
    activityType: 'report' | 'donation',
    peopleHelped: number
  ): Promise<void> {
    const notification: NotificationData = {
      title: 'Your Impact Story is Ready!',
      body: `Your ${activityType} helped ${peopleHelped} people. Read your personalized thank you letter.`,
      data: {
        type: 'impact_story',
        activityType,
        peopleHelped,
      },
    };

    await this.sendPushNotification(notification);
  }

  // Send new mission notification for facilitators
  static async sendNewMissionNotification(
    missionTitle: string,
    urgency: string,
    distance: string
  ): Promise<void> {
    const notification: NotificationData = {
      title: 'New Mission Available',
      body: `${missionTitle} - ${urgency} priority, ${distance} away`,
      data: {
        type: 'new_mission',
        missionTitle,
        urgency,
        distance,
      },
    };

    await this.sendPushNotification(notification);
  }

  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    } else {
      // Mobile permissions would be handled by expo-notifications
      return true;
    }
  }
}