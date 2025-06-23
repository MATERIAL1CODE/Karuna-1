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
import { Bell, MapPin, Gift, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { SkeletonLoader, StatsCardSkeleton } from '@/components/SkeletonLoader';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { communityImpactFeed, isLoadingData, fetchData, getTotalPeopleHelped } = useData();

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  const handleReportPress = () => {
    router.push('/(citizen)/(tabs)/home/report');
  };

  const handleDonationPress = () => {
    router.push('/(citizen)/(tabs)/home/donate');
  };

  const totalPeopleHelped = getTotalPeopleHelped();

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={colors.neutral[600]} />} 
          onPress={() => router.replace('/(home)')} 
        />
        <View style={styles.headerContent}>
          <Text variant="headlineSmall" style={styles.welcomeText}>
            Hello, {user?.name || 'Friend'}! 👋
          </Text>
        </View>
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
    alignItems: 'center',
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
    fontFamily: 'Inter-Regular',
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
});