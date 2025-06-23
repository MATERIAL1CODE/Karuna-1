import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Text, Card, Appbar, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle, MapPin, Clock, ArrowLeft, TrendingUp } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

const completedMissions = [
  {
    id: '1',
    title: 'Food Delivery Completed',
    type: 'Food',
    location: 'Saket to Lajpat Nagar',
    completedAt: '2 hours ago',
    peopleHelped: 4,
    rating: 5,
  },
  {
    id: '2',
    title: 'Medicine Delivery Completed',
    type: 'Medicine',
    location: 'Hospital to Community Center',
    completedAt: '1 day ago',
    peopleHelped: 2,
    rating: 5,
  },
  {
    id: '3',
    title: 'Clothing Distribution Completed',
    type: 'Clothing',
    location: 'Mall to Railway Station',
    completedAt: '3 days ago',
    peopleHelped: 6,
    rating: 4,
  },
  {
    id: '4',
    title: 'Emergency Supply Delivery',
    type: 'Emergency',
    location: 'Warehouse to Shelter',
    completedAt: '1 week ago',
    peopleHelped: 12,
    rating: 5,
  },
  {
    id: '5',
    title: 'Food Distribution',
    type: 'Food',
    location: 'Restaurant to Community Kitchen',
    completedAt: '2 weeks ago',
    peopleHelped: 8,
    rating: 5,
  },
];

interface CompletedMissionCardProps {
  mission: typeof completedMissions[0];
}

function CompletedMissionCard({ mission }: CompletedMissionCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Food':
        return colors.success[500];
      case 'Medicine':
        return colors.error[500];
      case 'Emergency':
        return colors.warning[500];
      default:
        return colors.info[500];
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text key={i} style={[styles.star, { color: i < rating ? colors.warning[500] : colors.neutral[300] }]}>
        ★
      </Text>
    ));
  };

  return (
    <Card style={styles.missionCard} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <CheckCircle size={24} color={colors.success[500]} />
          </View>
          <View style={styles.missionInfo}>
            <View style={styles.titleRow}>
              <Text variant="titleMedium" style={styles.missionTitle}>
                {mission.title}
              </Text>
              <Chip
                style={[
                  styles.typeChip,
                  { backgroundColor: getTypeColor(mission.type) },
                ]}
                textStyle={styles.chipText}
              >
                {mission.type}
              </Chip>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.neutral[500]} />
              <Text variant="bodyMedium" style={styles.locationText}>
                {mission.location}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Clock size={14} color={colors.neutral[500]} />
                <Text variant="bodySmall" style={styles.timeText}>
                  {mission.completedAt}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="bodySmall" style={styles.helpedText}>
                  {mission.peopleHelped} people helped
                </Text>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <Text variant="bodySmall" style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.starsContainer}>
                {renderStars(mission.rating)}
              </View>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

export default function CompletedMissionsScreen() {
  const renderMission = ({ item }: { item: typeof completedMissions[0] }) => (
    <CompletedMissionCard mission={item} />
  );

  const totalPeopleHelped = completedMissions.reduce((sum, mission) => sum + mission.peopleHelped, 0);
  const averageRating = (completedMissions.reduce((sum, mission) => sum + mission.rating, 0) / completedMissions.length).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={colors.neutral[600]} />} 
          onPress={() => router.replace('/(facilitator)')} 
        />
        <Appbar.Content title="Mission History" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        {/* Impact Summary */}
        <View style={styles.summaryCard}>
          <Text variant="titleLarge" style={styles.summaryTitle}>
            Your Mission Record
          </Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text variant="headlineMedium" style={styles.summaryNumber}>
                {completedMissions.length}
              </Text>
              <Text variant="bodyMedium" style={styles.summaryLabel}>
                Missions Completed
              </Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text variant="headlineMedium" style={styles.summaryNumber}>
                {totalPeopleHelped}
              </Text>
              <Text variant="bodyMedium" style={styles.summaryLabel}>
                People Helped
              </Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text variant="headlineMedium" style={styles.summaryNumber}>
                {averageRating}
              </Text>
              <Text variant="bodyMedium" style={styles.summaryLabel}>
                Avg Rating
              </Text>
            </View>
          </View>
          
          <View style={styles.trendContainer}>
            <TrendingUp size={20} color={colors.success[500]} />
            <Text variant="bodyMedium" style={styles.trendText}>
              Your impact is growing! Keep up the excellent work.
            </Text>
          </View>
        </View>

        <FlatList
          data={completedMissions}
          renderItem={renderMission}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CheckCircle size={48} color={colors.neutral[500]} />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No completed missions yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Your completed missions will appear here once you start helping.
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
    backgroundColor: colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['3xl'],
    marginVertical: spacing.lg,
    ...shadows.md,
  },
  summaryTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing['2xl'],
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontWeight: typography.fontWeight.extrabold,
    color: colors.primary[600],
    marginBottom: spacing.sm,
    fontFamily: 'Inter-Bold',
  },
  summaryLabel: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.success[50],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  trendText: {
    color: colors.success[700],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    paddingBottom: spacing['3xl'],
  },
  missionCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing['2xl'],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  iconContainer: {
    backgroundColor: colors.success[100],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  missionInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  missionTitle: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    flex: 1,
    marginRight: spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  locationText: {
    color: colors.neutral[500],
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeText: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  helpedText: {
    color: colors.success[500],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ratingLabel: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['8xl'],
  },
  emptyTitle: {
    color: colors.neutral[800],
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});