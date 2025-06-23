import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import {
  Text,
} from 'react-native-paper';
import { router } from 'expo-router';
import { Heart, Users, MapPin } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

export default function HomePage() {
  const handleCitizenPress = () => {
    router.push('/(citizen)');
  };

  const handleFacilitatorPress = () => {
    router.push('/(facilitator)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <View style={styles.iconContainer}>
              <Heart size={48} color={colors.primary[600]} />
            </View>
            <Text variant="displayMedium" style={styles.title}>
              Welcome to Sahayata
            </Text>
            <Text variant="headlineSmall" style={styles.subtitle}>
              Making a Difference Together
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Choose how you'd like to make a difference today
            </Text>
          </View>
        </View>

        <View style={styles.roleCards}>
          <Pressable onPress={handleCitizenPress}>
            <View style={[styles.roleCard, styles.citizenCard]}>
              <View style={styles.cardIcon}>
                <MapPin size={40} color={colors.primary[600]} />
              </View>
              <Text variant="headlineSmall" style={styles.cardTitle}>
                Citizen Mode
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Report people in need and donate surplus resources to help your community
              </Text>
              <View style={styles.features}>
                <Text style={styles.feature}>• Report people in need</Text>
                <Text style={styles.feature}>• Donate food & resources</Text>
                <Text style={styles.feature}>• Track your impact</Text>
              </View>
            </View>
          </Pressable>

          <Pressable onPress={handleFacilitatorPress}>
            <View style={[styles.roleCard, styles.facilitatorCard]}>
              <View style={styles.cardIcon}>
                <Users size={40} color={colors.success[500]} />
              </View>
              <Text variant="headlineSmall" style={styles.cardTitle}>
                Facilitator Mode
              </Text>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                Accept delivery missions and coordinate aid efforts to help those in need
              </Text>
              <View style={styles.features}>
                <Text style={styles.feature}>• Accept delivery missions</Text>
                <Text style={styles.feature}>• Coordinate aid efforts</Text>
                <Text style={styles.feature}>• Make direct impact</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Start making a positive impact in your community today
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['6xl'],
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius['3xl'],
    padding: spacing['4xl'],
    marginBottom: spacing['4xl'],
    ...shadows.md,
  },
  title: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: colors.primary[600],
    textAlign: 'center',
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.lg,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing['2xl'],
    fontFamily: 'Inter-Regular',
  },
  roleCards: {
    gap: spacing['4xl'],
    marginBottom: spacing['6xl'],
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing['4xl'],
    alignItems: 'center',
    ...shadows.md,
  },
  citizenCard: {
    borderWidth: 2,
    borderColor: colors.primary[200],
  },
  facilitatorCard: {
    borderWidth: 2,
    borderColor: colors.success[200],
  },
  cardIcon: {
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius['3xl'],
    padding: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  cardTitle: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  cardDescription: {
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Regular',
  },
  features: {
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  feature: {
    color: colors.neutral[600],
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: colors.neutral[400],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});