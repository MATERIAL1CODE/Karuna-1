import React, { useEffect } from 'react';
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
  useTheme,
} from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Gift, ArrowLeft, Eye, Mail, Award } from 'lucide-react-native';
import { useData, ActivityItem } from '@/contexts/DataContext';
import { ActivityCardSkeleton } from '@/components/SkeletonLoader';

interface ActivityItemCardProps {
  item: ActivityItem;
}

function ActivityItemCard({ item }: ActivityItemCardProps) {
  const theme = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'in_progress':
        return theme.colors.warning;
      default:
        return theme.colors.onSurfaceVariant;
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

  // Use Mail/Award icons for completed items with AI letters, otherwise use original icons
  const getIconComponent = () => {
    if (item.status === 'completed' && item.aiGeneratedLetterSnippet) {
      return item.type === 'report' ? Award : Mail;
    }
    return item.type === 'report' ? MapPin : Gift;
  };

  const IconComponent = getIconComponent();
  const iconColor = item.type === 'report' ? theme.colors.primary : theme.colors.success;
  const iconBgColor = item.type === 'report' ? theme.colors.primaryContainer : theme.colors.secondaryContainer;

  const getDisplaySubtitle = () => {
    // For completed items with AI letter snippet, show the snippet instead of original subtitle
    if (item.status === 'completed' && item.aiGeneratedLetterSnippet) {
      return item.aiGeneratedLetterSnippet;
    }
    return item.subtitle;
  };

  const getHelpedText = () => {
    if (item.status === 'completed' && item.peopleHelped) {
      if (item.type === 'report') {
        return `Your report led to aid for ${item.peopleHelped} people.`;
      }
      return `${item.peopleHelped} people helped`;
    }
    return null;
  };

  const handlePress = () => {
    if (item.status === 'in_progress') {
      router.push(`/(citizen)/(tabs)/activity/live-mission-view/${item.id}`);
    } else if (item.status === 'completed' && item.fullAiGeneratedLetter) {
      router.push(`/(citizen)/(tabs)/activity/letter-of-thanks/${item.id}`);
    }
  };

  const handleViewStoryPress = () => {
    if (item.status === 'completed' && item.fullAiGeneratedLetter) {
      router.push(`/(citizen)/(tabs)/activity/letter-of-thanks/${item.id}`);
    }
  };

  const styles = createStyles(theme);

  return (
    <Pressable 
      onPress={handlePress} 
      disabled={item.status === 'pending' || (item.status === 'completed' && !item.fullAiGeneratedLetter)}
    >
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
                <View style={styles.statusContainer}>
                  <Chip
                    style={[
                      styles.statusChip,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                    textStyle={styles.statusText}
                  >
                    {getStatusText(item.status)}
                  </Chip>
                  {item.status === 'in_progress' && (
                    <View style={styles.liveIndicator}>
                      <Eye size={16} color={theme.colors.primary} />
                      <Text variant="bodySmall" style={styles.liveText}>
                        Track Live
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Text variant="bodyMedium" style={[
                styles.activitySubtitle,
                item.status === 'completed' && item.aiGeneratedLetterSnippet && styles.letterSnippet
              ]}>
                {getDisplaySubtitle()}
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
                    {item.status === 'completed' && item.fullAiGeneratedLetter && (
                      <Pressable style={styles.viewStoryButton} onPress={handleViewStoryPress}>
                        <Text style={styles.viewStoryText}>Read Your Letter</Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

export default function ActivityScreen() {
  const theme = useTheme();
  const { activities, isLoadingData, fetchData, getUserImpactStats } = useData();

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  const renderActivity = ({ item }: { item: ActivityItem }) => (
    <ActivityItemCard item={item} />
  );

  const renderSkeletonLoader = () => (
    <View>
      <ActivityCardSkeleton />
      <ActivityCardSkeleton />
      <ActivityCardSkeleton />
    </View>
  );

  const userStats = getUserImpactStats();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurfaceVariant} />} 
          onPress={() => router.back()} 
        />
        <Appbar.Content title="My Stories" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Your Impact Library
          </Text>
          {isLoadingData ? (
            <View style={styles.loadingText}>
              <Text variant="bodyMedium" style={styles.summaryText}>
                Loading your impact stories...
              </Text>
            </View>
          ) : (
            <Text variant="bodyMedium" style={styles.summaryText}>
              You've helped {userStats.totalPeopleHelped} people through your contributions. Each completed mission becomes a personal story of your kindness.
            </Text>
          )}
        </View>

        {isLoadingData ? (
          renderSkeletonLoader()
        ) : (
          <FlatList
            data={activities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Mail size={48} color={theme.colors.onSurfaceVariant} />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  An Unwritten Story
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubtitle}>
                  Your first act of kindness will create a beautiful story here. Start by reporting a need or making a donation.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  summaryTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  summaryText: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  loadingText: {
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  activityCard: {
    marginBottom: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardContent: {
    padding: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  iconContainer: {
    borderRadius: 12,
    padding: 24,
  },
  activityInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 16,
  },
  activitySubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  letterSnippet: {
    fontStyle: 'italic',
    color: theme.colors.primary,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  bottomRow: {
    flexDirection: 'column',
    gap: 16,
  },
  activityDate: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  helpedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpedText: {
    color: theme.colors.success,
    fontWeight: '600',
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  viewStoryButton: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  viewStoryText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  liveText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 96,
  },
  emptyTitle: {
    color: theme.colors.onSurface,
    marginTop: 24,
    marginBottom: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
});