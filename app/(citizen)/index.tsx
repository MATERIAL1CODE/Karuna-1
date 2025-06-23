import React from 'react';
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

export default function CitizenDashboard() {
  const handleReportPress = () => {
    router.push('/(citizen)/report');
  };

  const handleDonationPress = () => {
    router.push('/(citizen)/donate');
  };

  const totalPeopleHelped = 1247; // Mock data

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={colors.neutral[600]} />} 
          onPress={() => router.replace('/(home)')} 
        />
        <View style={styles.headerContent}>
          <Text variant="headlineSmall" style={styles.welcomeText}>
            Hello, Friend! 👋
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
          
          <Text variant="bodyMedium" style={styles.communityImpactText}>
            Together, our community has helped {totalPeopleHelped.toLocaleString()} people this month
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  1,247
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  People Helped
                </Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statContent}>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  89
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active Volunteers
                </Text>
              </View>
            </View>
          </View>
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
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flex: 1,
    paddingLeft: spacing.lg,
  },
  welcomeText: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: spacing['3xl'],
  },
  titleSection: {
    marginBottom: spacing['4xl'],
    alignItems: 'center',
  },
  mainTitle: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.neutral[800],
    textAlign: 'center',
    marginBottom: spacing.md,
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
    gap: spacing.lg,
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
    padding: spacing['2xl'],
    gap: spacing.lg,
  },
  iconContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
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
    marginBottom: spacing.sm,
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
    padding: spacing['3xl'],
    ...shadows.md,
  },
  sectionTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  communityImpactText: {
    color: colors.neutral[600],
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Medium',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.primary[600],
    marginBottom: spacing.sm,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
});