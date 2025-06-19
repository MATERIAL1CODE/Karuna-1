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
import { MapPin, Gift } from 'lucide-react-native';

interface ActivityItem {
  id: string;
  type: 'report' | 'donation';
  title: string;
  subtitle: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'report',
    title: 'Need Reported',
    subtitle: 'Location: Nehru Place Metro Station',
    status: 'in_progress',
    date: '2 hours ago',
  },
  {
    id: '2',
    type: 'donation',
    title: 'Donation Logged',
    subtitle: 'Item: 15 Cooked Meals',
    status: 'completed',
    date: '1 day ago',
  },
  {
    id: '3',
    type: 'report',
    title: 'Need Reported',
    subtitle: 'Location: Lajpat Nagar Market',
    status: 'completed',
    date: '2 days ago',
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
        return '#6B7280';
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
            <Text variant="titleMedium" style={styles.activityTitle}>
              {item.title}
            </Text>
            <Text variant="bodyMedium" style={styles.activitySubtitle}>
              {item.subtitle}
            </Text>
            <Text variant="bodySmall" style={styles.activityDate}>
              {item.date}
            </Text>
          </View>
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
      </Card.Content>
    </Card>
  );
}

export default function ActivityScreen() {
  const renderActivity = ({ item }: { item: ActivityItem }) => (
    <ActivityItemCard item={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Content title="My Activity" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your contributions to the community
        </Text>

        <FlatList
          data={mockActivities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MapPin size={48} color="#6B7280" />
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#F8F9FA',
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
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
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activitySubtitle: {
    color: '#6B7280',
    marginBottom: 4,
  },
  activityDate: {
    color: '#9CA3AF',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#6B7280',
    textAlign: 'center',
  },
});