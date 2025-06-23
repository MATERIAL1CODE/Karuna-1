import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import {
  Text,
  Appbar,
  Button,
  useTheme,
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ExternalLink, Shield, Heart } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

interface LetterData {
  id: string;
  fullAiGeneratedLetter: string;
  blockchainTransactionLink?: string;
  ngoLogoUrl?: string;
  recipientName?: string;
  type: 'report' | 'donation';
  peopleHelped?: number;
  date: string;
}

// Mock data source for letters (in a real app, this would come from your backend)
const mockLetterData: Record<string, LetterData> = {
  '2': {
    id: '2',
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
    recipientName: 'Community Member',
    type: 'donation',
    peopleHelped: 15,
    date: '1 day ago',
  },
  '3': {
    id: '3',
    fullAiGeneratedLetter: `Dear Compassionate Citizen,

Your report about the family near Lajpat Nagar Market led to something beautiful. Because you took the time to notice and care, five people—including three children—found shelter and warmth during the recent cold spell.

Your vigilance and compassion helped connect them with our local partner organization, who provided temporary accommodation and essential supplies. The children, ages 6, 8, and 12, are now safe and attending a nearby community center for daily meals and educational support.

Sometimes the smallest acts of awareness create the biggest ripples of change. Your report was that first ripple.

Thank you for seeing what others might have overlooked, and for caring enough to act.

With deep appreciation,
The Sahayata Team`,
    blockchainTransactionLink: 'https://polygonscan.com/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    recipientName: 'Compassionate Citizen',
    type: 'report',
    peopleHelped: 5,
    date: '2 days ago',
  },
  '5': {
    id: '5',
    fullAiGeneratedLetter: `Dear Kind Soul,

Your report about the elderly couple near Saket District Centre touched our hearts, and we wanted you to know the beautiful outcome of your compassion.

The couple, married for 45 years, had been struggling after the husband's recent illness left them unable to work. Your alert led our team to connect them with medical assistance and ongoing support from our partner healthcare clinic.

Today, they are receiving regular medical care, nutritious meals, and most importantly, they know they are not forgotten. The wife mentioned that knowing someone cared enough to report their situation gave them hope when they had almost lost it.

Your awareness and action reminded them—and us—that humanity's greatest strength lies in how we care for one another.

With sincere gratitude,
The Sahayata Team`,
    blockchainTransactionLink: 'https://polygonscan.com/tx/0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    recipientName: 'Kind Soul',
    type: 'report',
    peopleHelped: 2,
    date: '1 week ago',
  },
};

export default function LetterOfThanksScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const [letterData, setLetterData] = useState<LetterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching letter data
    const fetchLetterData = () => {
      const data = mockLetterData[id as string];
      setLetterData(data || null);
      setLoading(false);
    };

    fetchLetterData();
  }, [id]);

  const handleBlockchainVerification = async () => {
    if (letterData?.blockchainTransactionLink) {
      if (Platform.OS === 'web') {
        window.open(letterData.blockchainTransactionLink, '_blank');
      } else {
        await WebBrowser.openBrowserAsync(letterData.blockchainTransactionLink);
      }
    }
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading your letter...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!letterData) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Letter Not Found" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.errorContainer}>
          <Text variant="titleMedium" style={styles.errorTitle}>
            Letter Not Found
          </Text>
          <Text variant="bodyMedium" style={styles.errorText}>
            We couldn't find the letter you're looking for.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Your Letter of Thanks" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Letter Header */}
        <View style={styles.letterHeader}>
          <View style={styles.letterHeaderIcon}>
            <Heart size={32} color={theme.colors.primary} />
          </View>
          <Text variant="headlineSmall" style={styles.letterHeaderTitle}>
            A Personal Letter of Thanks
          </Text>
          <Text variant="bodyMedium" style={styles.letterHeaderSubtitle}>
            Your {letterData.type === 'donation' ? 'donation' : 'report'} helped {letterData.peopleHelped} people • {letterData.date}
          </Text>
        </View>

        {/* Letter Content */}
        <View style={styles.letterContainer}>
          {/* Paper texture background */}
          <View style={styles.paperBackground}>
            {/* Letter content */}
            <View style={styles.letterContent}>
              <Text style={styles.letterText}>
                {letterData.fullAiGeneratedLetter}
              </Text>
            </View>

            {/* Signature section */}
            <View style={styles.signatureSection}>
              <View style={styles.logoContainer}>
                {letterData.ngoLogoUrl && (
                  <Image
                    source={{ uri: letterData.ngoLogoUrl }}
                    style={styles.ngoLogo}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.logoTextContainer}>
                  <Text variant="titleMedium" style={styles.organizationName}>
                    Sahayata
                  </Text>
                  <Text variant="bodySmall" style={styles.organizationTagline}>
                    Making a Difference Together
                  </Text>
                </View>
              </View>

              {/* Blockchain verification */}
              {letterData.blockchainTransactionLink && (
                <Pressable style={styles.verificationBadge} onPress={handleBlockchainVerification}>
                  <Shield size={16} color={theme.colors.success} />
                  <Text style={styles.verificationText}>
                    Verified on Polygon
                  </Text>
                  <ExternalLink size={14} color={theme.colors.success} />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => router.push('/(citizen)/(tabs)/home/donate')}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
            textColor={theme.colors.primary}
          >
            Make Another Donation
          </Button>
          
          <Button
            mode="contained"
            onPress={() => router.push('/(citizen)/(tabs)/home')}
            style={styles.primaryActionButton}
            contentStyle={styles.buttonContent}
          >
            Continue Helping
          </Button>
        </View>

        {/* Impact reminder */}
        <View style={styles.impactReminder}>
          <Text variant="bodyMedium" style={styles.impactText}>
            Every act of kindness creates ripples of positive change. Thank you for being part of our community of compassion.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  headerTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  letterHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  letterHeaderIcon: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  letterHeaderTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  letterHeaderSubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  letterContainer: {
    marginBottom: 32,
  },
  paperBackground: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    // Subtle paper texture effect
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  letterContent: {
    marginBottom: 40,
  },
  letterText: {
    fontSize: 16,
    lineHeight: 28,
    color: theme.colors.onSurface,
    fontFamily: 'Lora-Regular', // Using Lora for elegant letter typography
    textAlign: 'left',
  },
  signatureSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    paddingTop: 32,
    gap: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ngoLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surfaceVariant,
  },
  logoTextContainer: {
    flex: 1,
  },
  organizationName: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  organizationTagline: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.secondaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verificationText: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  actionButtons: {
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    borderColor: theme.colors.primary,
    borderRadius: 12,
  },
  primaryActionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 16,
  },
  impactReminder: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  impactText: {
    color: theme.colors.onPrimaryContainer,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});