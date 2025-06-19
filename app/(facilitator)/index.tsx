import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Clock, User } from 'lucide-react-native';

// Mock data for missions
const mockMissions = [
  {
    id: '1',
    title: 'Food for 4',
    pickupLocation: "Anna's Cafe, Saket",
    deliveryLocation: 'Underneath Lajpat Nagar Flyover',
    pickupContact: 'Sarah Miller',
    deliveryContact: 'David Chen',
    pickupTime: '2:00 PM',
    deliveryTime: '3:00 PM',
    type: 'Food',
    urgency: 'high',
  },
  {
    id: '2',
    title: 'Clothing for Family',
    pickupLocation: 'Green Valley Mall, Sector 18',
    deliveryLocation: 'Near Railway Station',
    pickupContact: 'Mike Johnson',
    deliveryContact: 'Lisa Wong',
    pickupTime: '4:00 PM',
    deliveryTime: '5:00 PM',
    type: 'Clothing',
    urgency: 'medium',
  },
  {
    id: '3',
    title: 'Medical Supplies',
    pickupLocation: 'City Hospital Pharmacy',
    deliveryLocation: 'Community Center, Block A',
    pickupContact: 'Dr. Patel',
    deliveryContact: 'John Smith',
    pickupTime: '10:00 AM',
    deliveryTime: '11:00 AM',
    type: 'Medicine',
    urgency: 'high',
  },
];

interface MissionCardProps {
  mission: typeof mockMissions[0];
  onPress: () => void;
}

function MissionCard({ mission, onPress }: MissionCardProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      default:
        return '#10B981';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.missionCard} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.missionTitle}>
              {mission.title}
            </Text>
            <Chip
              style={[
                styles.urgencyChip,
                { backgroundColor: getUrgencyColor(mission.urgency) },
              ]}
              textStyle={styles.urgencyText}
            >
              {mission.urgency.toUpperCase()}
            </Chip>
          </View>

          <View style={styles.locationSection}>
            <View style={styles.locationItem}>
              <MapPin size={16} color="#10B981" />
              <View style={styles.locationText}>
                <Text variant="labelSmall" style={styles.locationLabel}>
                  FROM
                </Text>
                <Text variant="bodyMedium" style={styles.locationValue}>
                  {mission.pickupLocation}
                </Text>
              </View>
            </View>

            <View style={styles.locationItem}>
              <MapPin size={16} color="#EF4444" />
              <View style={styles.locationText}>
                <Text variant="labelSmall" style={styles.locationLabel}>
                  TO
                </Text>
                <Text variant="bodyMedium" style={styles.locationValue}>
                  {mission.deliveryLocation}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.routePreview}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop',
              }}
              style={styles.routeImage}
            />
          </View>

          <View style={styles.timeSection}>
            <View style={styles.timeItem}>
              <Clock size={14} color="#64748B" />
              <Text variant="bodySmall" style={styles.timeText}>
                Pickup: {mission.pickupTime}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <Clock size={14} color="#64748B" />
              <Text variant="bodySmall" style={styles.timeText}>
                Delivery: {mission.deliveryTime}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

export default function FacilitatorDashboard() {
  const handleMissionPress = (missionId: string) => {
    router.push(`/(facilitator)/mission/${missionId}`);
  };

  const renderMission = ({ item }: { item: typeof mockMissions[0] }) => (
    <MissionCard
      mission={item}
      onPress={() => handleMissionPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Available Missions
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {mockMissions.length} missions waiting for volunteers
        </Text>
      </View>

      <FlatList
        data={mockMissions}
        renderItem={renderMission}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MapPin size={48} color="#64748B" />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No available missions
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              Check back later for new opportunities to help.
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  missionTitle: {
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  urgencyChip: {
    marginLeft: 12,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  locationSection: {
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  locationValue: {
    color: '#1E293B',
  },
  routePreview: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  routeImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E2E8F0',
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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