import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { Text, Chip, Appbar, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Clock, ArrowLeft, Gift, List, Map } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';
import { useData, Mission } from '@/contexts/DataContext';
import { MissionCardSkeleton } from '@/components/SkeletonLoader';

interface MissionCardProps {
  mission: Mission;
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
    <View style={styles.missionCard}>
      {/* Route Map Preview */}
      <View style={styles.routePreview}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400&h=150&fit=crop',
          }}
          style={styles.routeImage}
        />
        <View style={styles.routeOverlay}>
          <Text variant="bodySmall" style={styles.distanceText}>
            {mission.distance} • Est. {mission.eta}
          </Text>
        </View>
      </View>

      {/* Mission Details */}
      <View style={styles.cardContent}>
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
              <Gift size={16} color={colors.success[500]} />
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
              <MapPin size={16} color={colors.error[500]} />
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

        {/* Full-width Accept Button */}
        <Button
          mode="contained"
          onPress={onPress}
          style={styles.acceptButton}
          contentStyle={styles.acceptButtonContent}
        >
          View Details & Accept
        </Button>
      </View>
    </View>
  );
}

export default function FacilitatorDashboard() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { missions, isLoadingData, fetchData } = useData();

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  const handleMissionPress = (missionId: string) => {
    router.push(`/(facilitator)/mission/${missionId}`);
  };

  const renderMission = ({ item }: { item: Mission }) => (
    <MissionCard
      mission={item}
      onPress={() => handleMissionPress(item.id)}
    />
  );

  const renderSkeletonLoader = () => (
    <View>
      <MissionCardSkeleton />
      <MissionCardSkeleton />
      <MissionCardSkeleton />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={colors.neutral[600]} />} 
          onPress={() => router.replace('/(home)')} 
        />
        <Appbar.Content title="Available Missions" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <Pressable
            style={[
              styles.toggleButton,
              viewMode === 'list' && styles.toggleButtonActive
            ]}
            onPress={() => setViewMode('list')}
          >
            <List size={20} color={viewMode === 'list' ? colors.primary[600] : colors.neutral[500]} />
            <Text style={[
              styles.toggleText,
              viewMode === 'list' && styles.toggleTextActive
            ]}>
              List View
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              viewMode === 'map' && styles.toggleButtonActive
            ]}
            onPress={() => setViewMode('map')}
          >
            <Map size={20} color={viewMode === 'map' ? colors.primary[600] : colors.neutral[500]} />
            <Text style={[
              styles.toggleText,
              viewMode === 'map' && styles.toggleTextActive
            ]}>
              Map View
            </Text>
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          {isLoadingData ? (
            <Text variant="bodyLarge" style={styles.summaryText}>
              Loading available missions...
            </Text>
          ) : (
            <>
              <Text variant="bodyLarge" style={styles.summaryText}>
                {missions.length} missions waiting for volunteers
              </Text>
              <Text variant="bodyMedium" style={styles.summarySubtext}>
                Choose a mission that fits your schedule
              </Text>
            </>
          )}
        </View>

        {viewMode === 'list' ? (
          isLoadingData ? (
            renderSkeletonLoader()
          ) : (
            <FlatList
              data={missions}
              renderItem={renderMission}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MapPin size={48} color={colors.neutral[500]} />
                  <Text variant="titleMedium" style={styles.emptyTitle}>
                    No available missions
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptySubtitle}>
                    Check back later for new opportunities to help.
                  </Text>
                </View>
              }
            />
          )
        ) : (
          <View style={styles.mapPlaceholder}>
            <Map size={48} color={colors.neutral[500]} />
            <Text variant="titleMedium" style={styles.mapPlaceholderTitle}>
              Map View
            </Text>
            <Text variant="bodyMedium" style={styles.mapPlaceholderText}>
              Interactive map with mission pins coming soon
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginVertical: spacing['2xl'],
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    borderRadius: borderRadius.md,
    gap: spacing.lg,
  },
  toggleButtonActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  toggleText: {
    color: colors.neutral[500],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  toggleTextActive: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['3xl'],
    marginBottom: spacing['2xl'],
    ...shadows.md,
  },
  summaryText: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.lg,
    fontFamily: 'Inter-SemiBold',
  },
  summarySubtext: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  listContent: {
    paddingBottom: spacing['4xl'],
  },
  missionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing['2xl'],
    ...shadows.md,
    overflow: 'hidden',
  },
  routePreview: {
    position: 'relative',
  },
  routeImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.neutral[200],
  },
  routeOverlay: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  distanceText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  cardContent: {
    padding: spacing['3xl'],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['2xl'],
  },
  missionTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    flex: 1,
    marginRight: spacing['2xl'],
    fontFamily: 'Inter-Bold',
    fontSize: 18, // Mission Critical Info - 18px, Semi-Bold
  },
  chipContainer: {
    gap: spacing.lg,
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
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  locationSection: {
    marginBottom: spacing['2xl'],
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['2xl'],
  },
  locationDot: {
    marginTop: spacing.lg,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  routeLine: {
    width: 2,
    height: spacing['2xl'],
    backgroundColor: colors.neutral[300],
    marginLeft: 21,
    marginVertical: spacing.lg,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    color: colors.neutral[500],
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  locationValue: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
    fontFamily: 'Inter-SemiBold',
    fontSize: 18, // Mission Critical Info - 18px, Semi-Bold
  },
  contactText: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing['2xl'],
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  timeText: {
    color: colors.neutral[600],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  acceptButton: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[600],
  },
  acceptButtonContent: {
    paddingVertical: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['8xl'],
  },
  emptyTitle: {
    color: colors.neutral[800],
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    margin: spacing['2xl'],
    ...shadows.md,
  },
  mapPlaceholderTitle: {
    color: colors.neutral[800],
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  mapPlaceholderText: {
    color: colors.neutral[500],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});