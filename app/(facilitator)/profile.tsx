import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  List,
  Divider,
  Appbar,
  Badge,
} from 'react-native-paper';
import { router } from 'expo-router';
import { User, Award, Settings, ArrowLeft, CircleHelp as HelpCircle, Info, Star, TrendingUp } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

export default function FacilitatorProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={colors.neutral[600]} />} 
          onPress={() => router.replace('/(home)')} 
        />
        <Appbar.Content title="Profile" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color={colors.primary[600]} />
          </View>
          <Text variant="headlineSmall" style={styles.name}>
            Community Volunteer
          </Text>
          <View style={styles.roleContainer}>
            <Text variant="bodyMedium" style={styles.role}>
              Verified Facilitator
            </Text>
            <Badge style={styles.badge} size={20}>
              ACTIVE
            </Badge>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.warning[500]} fill={colors.warning[500]} />
            <Text variant="bodyMedium" style={styles.rating}>
              4.9 Rating
            </Text>
          </View>
        </View>

        {/* Impact Dashboard */}
        <Card style={styles.impactCard} mode="elevated">
          <Card.Content style={styles.impactCardContent}>
            <Text variant="titleMedium" style={styles.impactTitle}>
              Impact Dashboard
            </Text>
            
            {/* Hero Metric */}
            <View style={styles.heroMetric}>
              <Text variant="displaySmall" style={styles.heroNumber}>
                452
              </Text>
              <Text variant="titleMedium" style={styles.heroLabel}>
                People Helped
              </Text>
            </View>

            {/* Supporting Metrics */}
            <View style={styles.supportingMetrics}>
              <View style={styles.supportingMetric}>
                <Text variant="headlineSmall" style={styles.supportingNumber}>
                  112
                </Text>
                <Text variant="bodySmall" style={styles.supportingLabel}>
                  Missions Completed
                </Text>
              </View>
              <View style={styles.supportingMetric}>
                <Text variant="headlineSmall" style={styles.supportingNumber}>
                  45h
                </Text>
                <Text variant="bodySmall" style={styles.supportingLabel}>
                  Time Donated
                </Text>
              </View>
            </View>

            <Text variant="bodyMedium" style={styles.activeSince}>
              Active Since June 2024
            </Text>
          </Card.Content>
        </Card>

        {/* Milestone Badges */}
        <Card style={styles.achievementsCard} mode="elevated">
          <Card.Content style={styles.achievementsCardContent}>
            <Text variant="titleMedium" style={styles.achievementsTitle}>
              Achievements
            </Text>
            <View style={styles.badgesGrid}>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.warning[100] }]}>
                  <Text style={styles.badgeEmoji}>🥉</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  First Delivery
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.success[100] }]}>
                  <Text style={styles.badgeEmoji}>🥈</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  Community Helper
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.primary[100] }]}>
                  <Text style={styles.badgeEmoji}>🥇</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  Mission Master
                </Text>
              </View>
              <View style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: colors.purple[100] }]}>
                  <Text style={styles.badgeEmoji}>⭐</Text>
                </View>
                <Text variant="bodySmall" style={styles.badgeLabel}>
                  Top Rated
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard} mode="elevated">
          <List.Section>
            <Text variant="titleSmall" style={styles.menuSectionTitle}>Account</Text>
            <List.Item
              title="Account Settings"
              description="Update your profile and preferences"
              left={() => <Settings size={20} color={colors.neutral[500]} />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => router.push('/(facilitator)/settings')}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
              style={styles.menuItem}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Mission History"
              description="View all your completed missions"
              left={() => <List.Icon icon="history" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => router.push('/(facilitator)/completed')}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
              style={styles.menuItem}
            />
            
            <Text variant="titleSmall" style={[styles.menuSectionTitle, styles.menuSectionTitleSpaced]}>Support</Text>
            <Divider style={styles.divider} />
            <List.Item
              title="Help & Support"
              description="Get help or contact support"
              left={() => <HelpCircle size={20} color={colors.neutral[500]} />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
              style={styles.menuItem}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="About Sahayata"
              description="Learn more about our mission"
              left={() => <Info size={20} color={colors.neutral[500]} />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => {}}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
              style={styles.menuItem}
            />
          </List.Section>
        </Card>

        <Button
          mode="outlined"
          onPress={() => router.replace('/(citizen)')}
          style={styles.switchRoleButton}
          contentStyle={styles.buttonContent}
          textColor={colors.primary[600]}
        >
          Switch to Citizen Mode
        </Button>
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
  },
  headerTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    padding: spacing['2xl'],
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
    paddingVertical: spacing['2xl'],
  },
  avatarContainer: {
    backgroundColor: colors.primary[100],
    borderRadius: 50,
    padding: spacing['3xl'],
    marginBottom: spacing['2xl'],
  },
  name: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  role: {
    color: colors.neutral[500],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  badge: {
    backgroundColor: colors.success[500],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  rating: {
    color: colors.warning[500],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  impactCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  impactCardContent: {
    padding: spacing['3xl'],
  },
  impactTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  heroMetric: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  heroNumber: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.primary[600],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  heroLabel: {
    color: colors.neutral[600],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  supportingMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing['2xl'],
  },
  supportingMetric: {
    alignItems: 'center',
  },
  supportingNumber: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  supportingLabel: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  activeSince: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  achievementsCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  achievementsCardContent: {
    padding: spacing['3xl'],
  },
  achievementsTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing['2xl'],
  },
  badgeItem: {
    alignItems: 'center',
    width: '22%',
  },
  badgeIcon: {
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeLabel: {
    color: colors.neutral[600],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  menuCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['4xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  menuSectionTitle: {
    color: colors.neutral[700],
    fontWeight: typography.fontWeight.semibold,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    fontFamily: 'Inter-SemiBold',
  },
  menuSectionTitleSpaced: {
    paddingTop: spacing['3xl'],
  },
  menuItem: {
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.lg,
  },
  menuItemTitle: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  menuItemDescription: {
    color: colors.neutral[500],
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    marginHorizontal: spacing['2xl'],
  },
  switchRoleButton: {
    borderColor: colors.primary[600],
    borderRadius: borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing.lg,
  },
});