import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Text, Card, Appbar, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { CheckCircle, MapPin, Clock, ArrowLeft } from 'lucide-react-native';

const completedMissions = [
  {
    id: '1',
    title: 'Food Delivery Completed',
    type: 'Food',
    location: 'Saket to Lajpat Nagar',
    completedAt: '2 hours ago',
    peopleHelped: 4,
  },
  {
    id: '2',
    title: 'Medicine Delivery Completed',
    type: 'Medicine',
    location: 'Hospital to Community Center',
    completedAt: '1 day ago',
    peopleHelped: 2,
  },
  {
    id: '3',
    title: 'Clothing Distribution Completed',
    type: 'Clothing',
    location: 'Mall to Railway Station',
    completedAt: '3 days ago',
    peopleHelped: 6,
  },
];

interface CompletedMissionCardProps {
  mission: typeof completedMissions[0];
}

function CompletedMissionCard({ mission }: CompletedMissionCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Food':
        return '#10B981';
      case 'Medicine':
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  };

  return (
    <Card style={styles.missionCard} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <CheckCircle size={24} color="#10B981" />
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
              <MapPin size={14} color="#64748B" />
              <Text variant="bodyMedium" style={styles.locationText}>
                {mission.location}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Clock size={14} color="#64748B" />
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

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color="#6B7280" />} 
          onPress={() => router.replace('/')} 
        />
        <Appbar.Content title="Completed Missions" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text variant="titleLarge" style={styles.summaryTitle}>
            Your Impact
          </Text>
          <Text variant="bodyMedium" style={styles.summaryText}>
            You've completed {completedMissions.length} missions and helped{' '}
            {completedMissions.reduce((sum, mission) => sum + mission.peopleHelped, 0)} people
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
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 24,
  },
  missionCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
  },
  missionInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  missionTitle: {
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    color: '#64748B',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#64748B',
  },
  helpedText: {
    color: '#10B981',
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
    lineHeight: 20,
  },
});