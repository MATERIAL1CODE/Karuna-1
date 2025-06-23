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
  useTheme,
} from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Gift, ArrowLeft, Eye } from 'lucide-react-native';

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

  const IconComponent = item.type === 'report' ? MapPin : Gift;
  const iconColor = item.type === 'report' ? theme.colors.primary : theme.colors.success;
  const iconBgColor = item.type === 'report' ? theme.colors.primaryContainer : theme.colors.secondaryContainer;

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
      router.push(`/(citizen)/live-mission-view/${item.id}`);
    }
  };

  const styles = createStyles(theme);

  return (
    <Pressable onPress={handlePress} disabled={item.status !== 'in_progress'}>
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
    </Pressable>
  );
}

export default function ActivityScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

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
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurfaceVariant} />} 
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
              <MapPin size={48} color={theme.colors.onSurfaceVariant} />
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
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
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
  },
});