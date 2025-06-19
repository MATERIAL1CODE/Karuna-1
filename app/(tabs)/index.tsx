import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { Heart, Gift, MapPin, Users, Clock, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for facilitator missions
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

function CitizenDashboard() {
  const handleReportNeed = () => {
    router.push('/(tabs)/report');
  };

  const handleMakeDonation = () => {
    router.push('/(tabs)/donate');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.greeting}>
            Welcome back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Ready to make a difference today?
          </Text>
        </View>

        <View style={styles.actionCards}>
          <TouchableOpacity onPress={handleReportNeed} activeOpacity={0.7}>
            <Card style={[styles.actionCard, styles.reportCard]} mode="elevated">
              <Card.Content style={styles.actionCardContent}>
                <View style={styles.cardIcon}>
                  <MapPin size={32} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Report a Need
                </Text>
                <Text variant="bodyMedium" style={styles.cardSubtitle}>
                  Help us locate people or families who need assistance
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleMakeDonation} activeOpacity={0.7}>
            <Card style={[styles.actionCard, styles.donateCard]} mode="elevated">
              <Card.Content style={styles.actionCardContent}>
                <View style={styles.cardIcon}>
                  <Gift size={32} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Make a Donation
                </Text>
                <Text variant="bodyMedium" style={styles.cardSubtitle}>
                  Share surplus food or resources with those in need
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Community Impact
          </Text>
          
          <View style={styles.statsGrid}>
            <Card style={styles.statCard} mode="contained">
              <Card.Content style={styles.statContent}>
                <Heart size={24} color="#2563EB" />
                <Text variant="headlineSmall" style={styles.statNumber}>
                  1,247
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  People Helped
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard} mode="contained">
              <Card.Content style={styles.statContent}>
                <Users size={24} color="#06B6D4" />
                <Text variant="headlineSmall" style={styles.statNumber}>
                  89
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active Volunteers
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FacilitatorDashboard() {
  const handleMissionPress = (missionId: string) => {
    router.push(`/(tabs)/mission/${missionId}`);
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

export default function MainScreen() {
  const { profile } = useAuth();

  if (profile?.role === 'facilitator') {
    return <FacilitatorDashboard />;
  }

  return <CitizenDashboard />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748B',
  },
  actionCards: {
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    borderRadius: 16,
    elevation: 4,
  },
  reportCard: {
    backgroundColor: '#2563EB',
  },
  donateCard: {
    backgroundColor: '#06B6D4',
  },
  actionCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  cardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: '#64748B',
    textAlign: 'center',
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