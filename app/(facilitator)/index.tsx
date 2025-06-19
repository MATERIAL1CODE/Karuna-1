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
import { MapPin, Clock, User, ArrowLeft } from 'lucide-react-native';

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
              <Clock size={14} color="#6B7280" />
              <Text variant="bodySmall" style={styles.timeText}>
                Pickup: {mission.pickupTime}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <Clock size={14} color="#6B7280" />
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
        <Text variant="bodyMedium" style={styles.subtitle}>
          {mockMissions.length} missions waiting for volunteers
        </Text>

        <FlatList
          data={mockMissions}
          renderItem={renderMission}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MapPin size={48} color="#6B7280" />
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
    color: '#1F2937',
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
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  locationValue: {
    color: '#1F2937',
  },
  routePreview: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  routeImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E5E7EB',
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
    color: '#6B7280',
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
  },
  emptySubtitle: {
    color: '#6B7280',
    textAlign: 'center',
  },
});