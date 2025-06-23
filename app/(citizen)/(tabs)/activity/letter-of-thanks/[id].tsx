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
import { ArrowLeft, ExternalLink, Shield, Heart, User, Calendar } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import { useData } from '@/contexts/DataContext';

export default function LetterOfThanksScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const { activities } = useData();
  const [letterData, setLetterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the activity by ID
    const activity = activities.find(a => a.id === id);
    setLetterData(activity || null);
    setLoading(false);
  }, [id, activities]);

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

  if (!letterData || !letterData.fullFacilitatorStory) {
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
        <Appbar.Content title="Your Thank You Letter" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Letter Header */}
        <View style={styles.letterHeader}>
          <View style={styles.letterHeaderIcon}>
            <Heart size={32} color={theme.colors.primary} />
          </View>
          <Text variant="headlineSmall" style={styles.letterHeaderTitle}>
            A Personal Thank You Letter
          </Text>
          <Text variant="bodyMedium" style={styles.letterHeaderSubtitle}>
            Your {letterData.type === 'donation' ? 'donation' : 'report'} helped {letterData.peopleHelped} people • {letterData.date}
          </Text>
          
          {/* Facilitator Info */}
          <View style={styles.facilitatorInfo}>
            <User size={20} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={styles.facilitatorText}>
              Written by {letterData.facilitatorName}
            </Text>
            {letterData.completedAt && (
              <>
                <Calendar size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodySmall" style={styles.completedText}>
                  {new Date(letterData.completedAt).toLocaleDateString()}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Letter Content */}
        <View style={styles.letterContainer}>
          {/* Paper texture background */}
          <View style={styles.paperBackground}>
            {/* Letter content */}
            <View style={styles.letterContent}>
              <Text style={styles.letterText}>
                {letterData.fullFacilitatorStory}
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

              {/* Facilitator signature */}
              <View style={styles.facilitatorSignature}>
                <Text variant="bodyMedium" style={styles.signatureText}>
                  With heartfelt gratitude,
                </Text>
                <Text variant="titleMedium" style={styles.facilitatorSignatureName}>
                  {letterData.facilitatorName}
                </Text>
                <Text variant="bodySmall" style={styles.facilitatorTitle}>
                  Sahayata Facilitator
                </Text>
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
            This letter was personally written by your facilitator who witnessed the impact of your kindness firsthand. Every act of compassion creates ripples of positive change.
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
    marginBottom: 16,
  },
  facilitatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  facilitatorText: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  completedText: {
    color: theme.colors.onSurfaceVariant,
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
    fontFamily: 'Lora-Regular',
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
  facilitatorSignature: {
    alignItems: 'flex-start',
    gap: 4,
  },
  signatureText: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  facilitatorSignatureName: {
    color: theme.colors.onSurface,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  facilitatorTitle: {
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