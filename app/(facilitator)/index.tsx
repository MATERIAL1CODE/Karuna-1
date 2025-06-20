import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { Text, Chip, Appbar } from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Clock, ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, borderRadius } from '@/lib/design-tokens';

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
        return colors.error[500];
      case 'medium':
        return colors.warning[500];
      default:
        return colors.success[500];
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Food':
        return colors.success[500];
      case 'Medicine':
        return colors.error[500];
      default:
        return colors.info[500];
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <GlassCard variant="elevated" style={styles.missionCard}>
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
              <View style={[styles.dot, { backgroundColor: colors.success[500] }]} />
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
              <View style={[styles.dot, { backgroundColor: colors.error[500] }]} />
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
            <Clock size={16} color={colors.neutral[500]} />
            <Text variant="bodySmall" style={styles.timeText}>
              Pickup: {mission.pickupTime}
            </Text>
          </View>
          <View style={styles.timeItem}>
            <Clock size={16} color={colors.neutral[500]} />
            <Text variant="bodySmall" style={styles.timeText}>
              Delivery: {mission.deliveryTime}
            </Text>
          </View>
        </View>
      </GlassCard>
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
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
      style={styles.backgroundImage}
      blurRadius={6}
    >
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header} elevated={false}>
          <Appbar.Action 
            icon={() => <ArrowLeft size={24} color="#FFFFFF" />} 
            onPress={() => router.replace('/')} 
          />
          <Appbar.Content title="Available Missions" titleStyle={styles.headerTitle} />
        </Appbar.Header>

        <View style={styles.content}>
          <GlassCard variant="standard" style={styles.summaryCard}>
            <Text variant="bodyLarge" style={styles.summaryText}>
              {mockMissions.length} missions waiting for volunteers
            </Text>
            <Text variant="bodyMedium" style={styles.summarySubtext}>
              Choose a mission that fits your schedule
            </Text>
          </GlassCard>

          <FlatList
            data={mockMissions}
            renderItem={renderMission}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MapPin size={48} color="rgba(255, 255, 255, 0.7)" />
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['3xl'],
  },
  summaryCard: {
    marginBottom: spacing['3xl'],
  },
  summaryText: {
    color: colors.neutral[800],
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  summarySubtext: {
    color: colors.neutral[600],
    fontFamily: 'Inter-Regular',
  },
  listContent: {
    paddingBottom: spacing['3xl'],
  },
  missionCard: {
    marginBottom: spacing['2xl'],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['2xl'],
  },
  missionTitle: {
    fontWeight: '700',
    color: colors.neutral[800],
    flex: 1,
    marginRight: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  chipContainer: {
    gap: spacing.md,
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
    fontFamily: 'Inter-SemiBold',
  },
  locationSection: {
    marginBottom: spacing['2xl'],
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  locationDot: {
    marginTop: spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeLine: {
    width: 2,
    height: spacing['2xl'],
    backgroundColor: colors.neutral[300],
    marginLeft: 21,
    marginVertical: spacing.md,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    color: colors.neutral[500],
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontFamily: 'Inter-SemiBold',
  },
  locationValue: {
    color: colors.neutral[800],
    fontWeight: '500',
    marginBottom: spacing.xs,
    fontFamily: 'Inter-Medium',
  },
  contactText: {
    color: colors.neutral[600],
    fontFamily: 'Inter-Regular',
  },
  routePreview: {
    marginBottom: spacing['2xl'],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  routeImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.neutral[200],
  },
  routeOverlay: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  distanceText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timeText: {
    color: colors.neutral[600],
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['8xl'],
  },
  emptyTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});