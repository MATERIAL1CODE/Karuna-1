import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { CircleCheck as CheckCircle, MapPin } from 'lucide-react-native';

const completedMissions = [
  {
    id: '1',
    title: 'Food Delivery Completed',
    location: 'Saket to Lajpat Nagar',
    completedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Medicine Delivery Completed',
    location: 'Hospital to Community Center',
    completedAt: '1 day ago',
  },
];

interface CompletedMissionCardProps {
  mission: typeof completedMissions[0];
}

function CompletedMissionCard({ mission }: CompletedMissionCardProps) {
  return (
    <Card style={styles.missionCard} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <CheckCircle size={24} color="#10B981" />
          <View style={styles.missionInfo}>
            <Text variant="titleMedium" style={styles.missionTitle}>
              {mission.title}
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#64748B" />
              <Text variant="bodySmall" style={styles.locationText}>
                {mission.location}
              </Text>
            </View>
          </View>
          <Text variant="bodySmall" style={styles.timeText}>
            {mission.completedAt}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

export default function CompletedMissionsScreen() {
  const renderMission = ({ item }: { item: typeof completedMissions[0] }) => (
    <CompletedMissionCard mission={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Completed Missions
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Your contribution to the community
        </Text>
      </View>

      <FlatList
        data={completedMissions}
        renderItem={renderMission}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CheckCircle size={48} color="#64748B" />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No completed missions yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              Your completed missions will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748B',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  missionCard: {
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
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#64748B',
  },
  timeText: {
    color: '#64748B',
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
  },
  emptySubtitle: {
    color: '#64748B',
    textAlign: 'center',
  },
});