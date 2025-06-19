import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
  Chip,
} from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Gift, ArrowLeft } from 'lucide-react-native';

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
        return '#10B981';
      case 'in_progress':
        return '#F59E0B';
      default:
        return '#64748B';
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
  const iconColor = item.type === 'report' ? '#4F46E5' : '#10B981';

  return (
    <Card style={styles.activityCard} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
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
              {item.peopleHelped && item.status === 'completed' && (
                <Text variant="bodySmall" style={styles.helpedText}>
                  {item.peopleHelped} people helped
                </Text>
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
          icon={() => <ArrowLeft size={24} color="#6B7280" />} 
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
              <MapPin size={48} color="#64748B" />
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#F8FAFC',
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  summaryText: {
    color: '#64748B',
  },
  listContent: {
    paddingBottom: 24,
  },
  activityCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
  },
  activityInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  activitySubtitle: {
    color: '#64748B',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDate: {
    color: '#9CA3AF',
  },
  helpedText: {
    color: '#10B981',
    fontWeight: '600',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#64748B',
    textAlign: 'center',
  },
});