import { Platform, Alert } from 'react-native';
import { ActivityItem } from '@/contexts/DataContext';

export class ShareService {
  // Share impact story
  static async shareImpactStory(activity: ActivityItem): Promise<boolean> {
    const shareText = this.generateShareText(activity);
    
    if (Platform.OS === 'web') {
      return this.shareOnWeb(shareText);
    } else {
      // Mobile sharing would use expo-sharing
      console.log('Mobile share:', shareText);
      return true;
    }
  }

  // Share mission completion
  static async shareMissionCompletion(
    missionTitle: string,
    peopleHelped: number
  ): Promise<boolean> {
    const shareText = `🎉 Just completed "${missionTitle}" and helped ${peopleHelped} people through Karuna! Every small act of kindness makes a big difference. #Karuna #CommunitySupport #MakingADifference`;
    
    if (Platform.OS === 'web') {
      return this.shareOnWeb(shareText);
    } else {
      console.log('Mobile share:', shareText);
      return true;
    }
  }

  // Share app invitation
  static async shareAppInvitation(): Promise<boolean> {
    const shareText = `Join me on Karuna - an app that connects people in need with those who can help. Together, we can make our community stronger! 🤝 Download: https://karuna-app.com #Karuna #CommunitySupport`;
    
    if (Platform.OS === 'web') {
      return this.shareOnWeb(shareText);
    } else {
      console.log('Mobile share:', shareText);
      return true;
    }
  }

  // Generate share text for activities
  private static generateShareText(activity: ActivityItem): string {
    const baseText = activity.type === 'donation' 
      ? `💝 Just made a donation through Karuna and helped ${activity.peopleHelped} people!`
      : `📍 Reported people in need through Karuna and helped connect ${activity.peopleHelped} people with support!`;
    
    const impactText = activity.aiGeneratedLetterSnippet 
      ? ` ${activity.aiGeneratedLetterSnippet}`
      : '';
    
    return `${baseText}${impactText} Every act of kindness matters. #Karuna #CommunitySupport #MakingADifference`;
  }

  // Web sharing implementation
  private static async shareOnWeb(text: string): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Karuna - Making a Difference',
          text: text,
          url: 'https://karuna-app.com',
        });
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return this.fallbackWebShare(text);
      }
    } else {
      return this.fallbackWebShare(text);
    }
  }

  // Fallback web sharing
  private static fallbackWebShare(text: string): boolean {
    try {
      // Copy to clipboard
      navigator.clipboard.writeText(text);
      Alert.alert(
        'Copied to Clipboard',
        'The text has been copied to your clipboard. You can now paste it on social media or share it with friends!',
        [{ text: 'OK' }]
      );
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert(
        'Share',
        text,
        [
          { text: 'Copy Text', onPress: () => this.copyToClipboard(text) },
          { text: 'Close', style: 'cancel' },
        ]
      );
      return false;
    }
  }

  // Copy text to clipboard
  private static copyToClipboard(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  // Share via specific platforms (web only)
  static shareOnTwitter(text: string): void {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  static shareOnFacebook(text: string): void {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://karuna-app.com')}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  static shareOnLinkedIn(text: string): void {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://karuna-app.com')}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  static shareOnWhatsApp(text: string): void {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}