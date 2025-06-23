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
} from 'react-native-paper';
import { router } from 'expo-router';
import { User, Heart, Settings, ArrowLeft, CircleHelp as HelpCircle, Info, TrendingUp } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

export default function ProfileScreen() {
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
            Community Member
          </Text>
          <Text variant="bodyMedium" style={styles.role}>
            Citizen
          </Text>
        </View>

        <Card style={styles.statsCard} mode="elevated">
          <Card.Content style={styles.statsCardContent}>
            <Text variant="titleMedium" style={styles.statsTitle}>
              Your Impact This Month
            </Text>
            
            {/* Placeholder for line graph */}
            <View style={styles.graphPlaceholder}>
              <TrendingUp size={32} color={colors.primary[600]} />
              <Text variant="bodySmall" style={styles.graphText}>
                Impact trend over time
              </Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.primary[100] }]}>
                  <Heart size={20} color={colors.primary[600]} />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>12</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Reports</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.success[100] }]}>
                  <Heart size={20} color={colors.success[500]} />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>8</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Donations</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.warning[100] }]}>
                  <Heart size={20} color={colors.warning[500]} />
                </View>
                <Text variant="titleMedium" style={styles.statNumber}>45</Text>
                <Text variant="bodySmall" style={styles.statLabel}>People Helped</Text>
              </View>
            </View>
            
            <Text variant="bodyMedium" style={styles.lifetimeTotal}>
              You have helped a total of 150 people since joining.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.impactCard} mode="elevated">
          <Card.Content style={styles.impactCardContent}>
            <Text variant="titleMedium" style={styles.impactTitle}>
              Community Impact
            </Text>
            <Text variant="bodyMedium" style={styles.impactText}>
              Thank you for being an active member of our community! Your reports and donations have made a real difference in people's lives.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.milestonesCard} mode="elevated">
          <Card.Content style={styles.milestonesCardContent}>
            <Text variant="titleMedium" style={styles.milestonesTitle}>
              Your Milestones
            </Text>
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🏆</Text>
                <Text variant="bodySmall" style={styles.badgeLabel}>First Report</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>💝</Text>
                <Text variant="bodySmall" style={styles.badgeLabel}>First Donation</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🌟</Text>
                <Text variant="bodySmall" style={styles.badgeLabel}>Community Helper</Text>
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
              onPress={() => router.push('/(citizen)/settings')}
              titleStyle={styles.menuItemTitle}
              descriptionStyle={styles.menuItemDescription}
              style={styles.menuItem}
            />
            <Divider style={styles.divider} />
            <List.Item
              title="My Activity"
              description="View your reports and donations"
              left={() => <List.Icon icon="history" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => router.push('/(citizen)/activity')}
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
          onPress={() => router.replace('/(facilitator)')}
          style={styles.switchRoleButton}
          contentStyle={styles.buttonContent}
          textColor={colors.primary[600]}
        >
          Switch to Facilitator Mode
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
  role: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  statsCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  statsCardContent: {
    padding: spacing['3xl'],
  },
  statsTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  graphPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  graphText: {
    color: colors.neutral[500],
    marginTop: spacing.lg,
    fontFamily: 'Inter-Regular',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing['2xl'],
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  statIconContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  statNumber: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  lifetimeTotal: {
    color: colors.neutral[600],
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
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
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  impactText: {
    color: colors.neutral[500],
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  milestonesCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  milestonesCardContent: {
    padding: spacing['3xl'],
  },
  milestonesTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    minWidth: 80,
  },
  badgeText: {
    fontSize: 24,
    marginBottom: spacing.lg,
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