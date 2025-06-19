import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, Card, Chip, Appbar } from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Clock, ArrowLeft } from 'lucide-react-native';

// Mock data for missions
const mockMissions = [
  {
    id: '1',
    title: 'Food for 4 People',
    pickupLocation: "Anna's Cafe, Saket District Centre",
    deliveryLocation: 'Underneath Lajpat Nagar Flyover',
    pickupContact: 'Sarah Miller',
    deliveryContact: 'Local Coordinator',
    pickupTime: '2:00 PM',
    deliveryTime: '3:00 PM',
    type: 'Food',
    urgency: 'high',
    distance: '3.2 km',
  },
  {
    id: '2',
    title: 'Clothing for Family',
    pickupLocation: 'Green Valley Mall, Sector 18',
    deliveryLocation: 'Near Railway Station Platform 2',
    pickupContact: 'Mike Johnson',
    deliveryContact: 'Community Volunteer',
    pickupTime: '4:00 PM',
    deliveryTime: '5:00 PM',
    type: 'Clothing',
    urgency: 'medium',
    distance: '5.1 km',
  },
  {
    id: '3',
    title: 'Medical Supplies',
    pickupLocation: 'City Hospital Pharmacy',
    deliveryLocation: 'Community Center, Block A',
    pickupContact: 'Dr. Patel',
    deliveryContact: 'Health Worker',
    pickupTime: '10:00 AM',
    deliveryTime: '11:00 AM',
    type: 'Medicine',
    urgency: 'high',
    distance: '2.8 km',
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.missionCard} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge" style={styles.missionTitle}>
              {mission.title}
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                style={[
                  styles.typeChip,
                  { backgroundColor: getTypeColor(mission.type) },
                ]}
                textStyle={styles.chipText}
              >
                {mission.type}
              </Chip>
              <Chip
                style={[
                  styles.urgencyChip,
                  { backgroundColor: getUrgencyColor(mission.urgency) },
                ]}
                textStyle={styles.chipText}
              >
                {mission.urgency.toUpperCase()}
              </Chip>
            </View>
          </View>

          <View style={styles.locationSection}>
            <View style={styles.locationItem}>
              <View style={styles.locationDot}>
                <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              </View>
              <View style={styles.locationText}>
                <Text variant="labelMedium" style={styles.locationLabel}>
                  PICKUP
                </Text>
                <Text variant="bodyMedium" style={styles.locationValue}>
                  {mission.pickupLocation}
                </Text>
                <Text variant="bodySmall" style={styles.contactText}>
                  Contact: {mission.pickupContact}
                </Text>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.locationItem}>
              <View style={styles.locationDot}>
                <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              </View>
              <View style={styles.locationText}>
                <Text variant="labelMedium" style={styles.locationLabel}>
                  DELIVERY
                </Text>
                <Text variant="bodyMedium" style={styles.locationValue}>
                  {mission.deliveryLocation}
                </Text>
                <Text variant="bodySmall" style={styles.contactText}>
                  Contact: {mission.deliveryContact}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.routePreview}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400&h=150&fit=crop',
              }}
              style={styles.routeImage}
            />
            <View style={styles.routeOverlay}>
              <Text variant="bodySmall" style={styles.distanceText}>
                {mission.distance} • Est. 15 min
              </Text>
            </View>
          </View>

          <View style={styles.timeSection}>
            <View style={styles.timeItem}>
              <Clock size={16} color="#64748B" />
              <Text variant="bodySmall" style={styles.timeText}>
                Pickup: {mission.pickupTime}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <Clock size={16} color="#64748B" />
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
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color="#6B7280" />} 
          onPress={() => router.replace('/')} 
        />
        <Appbar.Content title="Available Missions" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text variant="bodyLarge" style={styles.summaryText}>
            {mockMissions.length} missions waiting for volunteers
          </Text>
          <Text variant="bodyMedium" style={styles.summarySubtext}>
            Choose a mission that fits your schedule
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
  summaryText: {
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 4,
  },
  summarySubtext: {
    color: '#64748B',
  },
  listContent: {
    paddingBottom: 24,
  },
  missionCard: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  missionTitle: {
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  chipContainer: {
    gap: 8,
  },
  typeChip: {
    alignSelf: 'flex-end',
  },
  urgencyChip: {
    alignSelf: 'flex-end',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  locationSection: {
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  locationDot: {
    marginTop: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginLeft: 21,
    marginVertical: 8,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  locationValue: {
    color: '#1E293B',
    fontWeight: '500',
    marginBottom: 2,
  },
  contactText: {
    color: '#64748B',
  },
  routePreview: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  routeImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  routeOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    color: '#64748B',
    fontWeight: '500',
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