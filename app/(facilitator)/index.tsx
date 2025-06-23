import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { router } from 'expo-router';
import { ArrowLeft, List, Map, MapPin } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';
import { useData, Mission } from '@/contexts/DataContext';
import { MissionCardSkeleton } from '@/components/SkeletonLoader';
import MissionCard from '@/components/MissionCard';

export default function FacilitatorDashboard() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { missions, isLoadingData, fetchData, acceptMission } = useData();

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  const handleMissionPress = (missionId: string) => {
    router.push(`/(facilitator)/mission/${missionId}`);
  };

  const handleAcceptMission = (missionId: string) => {
    acceptMission(missionId);
    router.push(`/(facilitator)/mission/${missionId}`);
  };

  const renderMission = ({ item }: { item: Mission }) => (
    <MissionCard
      mission={item}
      onPress={() => handleMissionPress(item.id)}
      onAccept={() => handleAcceptMission(item.id)}
      showAcceptButton={item.status === 'available'}
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