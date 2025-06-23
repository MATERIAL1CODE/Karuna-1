import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
  Chip,
} from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Gift, ArrowLeft } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

interface ActivityItem {
  id: string;
  type: 'report' | 'donation';
  title: string;
  subtitle: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  peopleHelped?: number;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'report',
    title: 'Need Reported',
    subtitle: 'Location: Nehru Place Metro Station',
    status: 'in_progress',
    date: '2 hours ago',
    peopleHelped: 3,
  },
  {
    id: '2',
    type: 'donation',
    title: 'Donation Logged',
    subtitle: 'Item: 15 Cooked Meals',
    status: 'completed',
    date: '1 day ago',
    peopleHelped: 15,
  },
  {
    id: '3',
    type: 'report',
    title: 'Need Reported',
    subtitle: 'Location: Lajpat Nagar Market',
    status: 'completed',
    date: '2 days ago',
    peopleHelped: 5,
  },
  {
    id: '4',
    type: 'donation',
    title: 'Donation Logged',
    subtitle: 'Item: 10 Blankets',
    status: 'pending',
    date: '3 days ago',
  },
  {
    id: '5',
    type: 'report',
    title: 'Need Reported',
    subtitle: 'Location: Saket District Centre',
    status: 'completed',
    date: '1 week ago',
    peopleHelped: 2,
  },
];

interface ActivityItemCardProps {
  item: ActivityItem;
}

function ActivityItemCard({ item }: ActivityItemCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success[500];
      case 'in_progress':
        return colors.warning[500];
      default:
        return colors.neutral[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const IconComponent = item.type === 'report' ? MapPin : Gift;
  const iconColor = item.type === 'report' ? colors.primary[600] : colors.success[500];
  const iconBgColor = item.type === 'report' ? colors.primary[100] : colors.success[100];

  const getHelpedText = () => {
    if (item.status === 'completed' && item.peopleHelped) {
      if (item.type === 'report') {
        return `Your report led to aid for ${item.peopleHelped} people.`;
      }
      return `${item.peopleHelped} people helped`;
    }
    return null;
  };

  return (
    <Card style={styles.activityCard} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <IconComponent size={24} color={iconColor} />
          </View>
          <View style={styles.activityInfo}>
            <View style={styles.titleRow}>
              <Text variant="titleMedium" style={styles.activityTitle}>
                {item.title}
              </Text>
              <Chip
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
                textStyle={styles.statusText}
              >
                {getStatusText(item.status)}
              </Chip>
            </View>
            <Text variant="bodyMedium" style={styles.activitySubtitle}>
              {item.subtitle}
            </Text>
            <View style={styles.bottomRow}>
              <Text variant="bodySmall" style={styles.activityDate}>
                {item.date}
              </Text>
              {getHelpedText() && (
                <View style={styles.helpedContainer}>
                  <Text variant="bodySmall" style={styles.helpedText}>
                    {getHelpedText()}
                  </Text>
                  {item.status === 'completed' && (
                    <Pressable style={styles.viewStoryButton}>
                      <Text style={styles.viewStoryText}>View Story</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

export default function ActivityScreen() {
  const renderActivity = ({ item }: { item: ActivityItem }) => (
    <ActivityItemCard item={item} />
  );

  const totalPeopleHelped = mockActivities
    .filter(item => item.status === 'completed' && item.peopleHelped)
    .reduce((sum, item) => sum + (item.peopleHelped || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={colors.neutral[600]} />} 
          onPress={() => router.back()} 
        />
        <Appbar.Content title="My Activity" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Your Impact
          </Text>
          <Text variant="bodyMedium" style={styles.summaryText}>
            You've helped {totalPeopleHelped} people through your contributions
          </Text>
        </View>

        <FlatList
          data={mockActivities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MapPin size={48} color={colors.neutral[500]} />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No activity yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Your reports and donations will appear here.
              </Text>
            </View>
          }
        />
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['3xl'],
    marginBottom: spacing['2xl'],
    ...shadows.md,
  },
  summaryTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  summaryText: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  listContent: {
    paddingBottom: spacing['4xl'],
  },
  activityCard: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing['3xl'],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['2xl'],
  },
  iconContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
  },
  activityInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  activityTitle: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    flex: 1,
    marginRight: spacing.lg,
    fontFamily: 'Inter-SemiBold',
  },
  activitySubtitle: {
    color: colors.neutral[500],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Regular',
  },
  bottomRow: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  activityDate: {
    color: colors.neutral[400],
    fontFamily: 'Inter-Regular',
  },
  helpedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpedText: {
    color: colors.success[500],
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  viewStoryButton: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  viewStoryText: {
    color: colors.primary[600],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['8xl'],
  },
  emptyTitle: {
    color: colors.neutral[800],
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});