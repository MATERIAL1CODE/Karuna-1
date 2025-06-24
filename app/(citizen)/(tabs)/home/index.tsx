import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  Text,
  Appbar,
} from 'react-native-paper';
import { Bell, MapPin, Gift, Share2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { SkeletonLoader, StatsCardSkeleton } from '@/components/SkeletonLoader';
import { AnalyticsService } from '@/components/AnalyticsService';
import { ShareService } from '@/components/ShareService';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { communityImpactFeed, isLoadingData, fetchData, getTotalPeopleHelped } = useData();

  useEffect(() => {
    // Track screen view
    AnalyticsService.trackScreenView('citizen_dashboard');
    
    // Fetch data when component mounts
    fetchData();
  }, []);

  const handleReportPress = () => {
    AnalyticsService.trackUserAction('report_button_pressed');
    router.push('/(citizen)/(tabs)/home/report');
  };

  const handleDonationPress = () => {
    AnalyticsService.trackUserAction('donation_button_pressed');
    router.push('/(citizen)/(tabs)/home/donate');
  };

  const handleSharePress = async () => {
    AnalyticsService.trackUserAction('share_app_pressed');
    await ShareService.shareAppInvitation();
  };

  const totalPeopleHelped = getTotalPeopleHelped();

  return (
    <SafeAreaView style={styles.container}>
      <OfflineIndicator />
      
      <Appbar.Header style={styles.header} elevated={false}>
        <View style={styles.headerContent}>
          <Text variant="headlineSmall" style={styles.welcomeText}>
            Hello, {user?.name || 'Friend'}! 👋
          </Text>
        </View>
        <Appbar.Action 
          icon={() => <Share2 size={24} color={colors.neutral[600]} />} 
          onPress={handleSharePress} 
        />
        <Appbar.Action 
          icon={() => <Bell size={24} color={colors.neutral[600]} />} 
          onPress={() => {}} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text variant="headlineMedium" style={styles.mainTitle}>
            How would you like to help today?
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Every small act of kindness makes a big difference
          </Text>
        </View>

        <View style={styles.actionCards}>
          <Pressable onPress={handleReportPress} style={styles.actionCard}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.reportIconContainer]}>
                <MapPin size={32} color={colors.primary[600]} />
              </View>
              <View style={styles.cardTextContent}>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  Report a Need
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  See someone who needs help? Let us know their location and we'll coordinate assistance.
                </Text>
                <View style={styles.cardFeatures}>
                  <Text style={styles.cardFeature}>• Quick location reporting</Text>
                  <Text style={styles.cardFeature}>• Video context support</Text>
                  <Text style={styles.cardFeature}>• Real-time tracking</Text>
                </View>
              </View>
            </View>
          </Pressable>

          <Pressable onPress={handleDonationPress} style={styles.actionCard}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.donationIconContainer]}>
                <Gift size={32} color={colors.success[500]} />
              </View>
              <View style={styles.cardTextContent}>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  Make a Donation
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Have surplus food or resources? Connect with those who need it most.
                </Text>
                <View style={styles.cardFeatures}>
                  <Text style={styles.cardFeature}>• Easy pickup scheduling</Text>
                  <Text style={styles.cardFeature}>• Impact tracking</Text>
                  <Text style={styles.cardFeature}>• Thank you letters</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.communityImpactSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Community Impact
          </Text>
          
          {isLoadingData ? (
            <>
              <SkeletonLoader width="80%" height={20} style={{ marginBottom: 24 }} />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <Text variant="bodyMedium" style={styles.communityImpactText}>
                Together, our community has helped {totalPeopleHelped.toLocaleString()} people this month
              </Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statContent}>
                    <Text variant="headlineMedium" style={styles.statNumber}>
                      {totalPeopleHelped.toLocaleString()}
                    </Text>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      People Helped
                    </Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statContent}>
                    <Text variant="headlineMedium" style={styles.statNumber}>
                      {communityImpactFeed.length}
                    </Text>
                    <Text variant="bodySmall" style={styles.statLabel}>
                      Active Missions
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentImpactSection}>
                <Text variant="titleMedium" style={styles.recentImpactTitle}>
                  Recent Community Impact
                </Text>
                {communityImpactFeed.slice(0, 3).map((item) => (
                  <View key={item.id} style={styles.impactItem}>
                    <View style={styles.impactItemContent}>
                      <Text variant="titleSmall" style={styles.impactItemTitle}>
                        {item.title}
                      </Text>
                      <Text variant="bodySmall" style={styles.impactItemDescription}>
                        {item.description}
                      </Text>
                      <View style={styles.impactItemFooter}>
                        <Text variant="bodySmall" style={styles.impactItemDate}>
                          {item.date}
                        </Text>
                        <Text variant="bodySmall" style={styles.impactItemPeople}>
                          {item.peopleHelped} people helped
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    elevation: 0,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flex: 1,
    paddingLeft: spacing['2xl'],
  },
  welcomeText: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: spacing['2xl'],
  },
  titleSection: {
    marginBottom: spacing['4xl'],
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  mainTitle: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.neutral[800],
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 36,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  actionCards: {
    gap: spacing['2xl'],
    marginBottom: spacing['4xl'],
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing['3xl'],
    gap: spacing['2xl'],
  },
  iconContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
  },
  reportIconContainer: {
    backgroundColor: colors.primary[100],
  },
  donationIconContainer: {
    backgroundColor: colors.success[100],
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  cardDescription: {
    color: colors.neutral[500],
    lineHeight: 20,
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Regular',
  },
  cardFeatures: {
    gap: spacing.md,
  },
  cardFeature: {
    color: colors.neutral[600],
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  communityImpactSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['4xl'],
    ...shadows.md,
  },
  sectionTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  communityImpactText: {
    color: colors.neutral[600],
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Medium',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing['2xl'],
    marginBottom: spacing['4xl'],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.primary[600],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  recentImpactSection: {
    gap: spacing['2xl'],
  },
  recentImpactTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  impactItem: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[600],
  },
  impactItemContent: {
    gap: spacing.lg,
  },
  impactItemTitle: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    fontFamily: 'Inter-SemiBold',
  },
  impactItemDescription: {
    color: colors.neutral[600],
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  impactItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impactItemDate: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  impactItemPeople: {
    color: colors.success[600],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
});