import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {
  Text,
  Appbar,
  useTheme,
} from 'react-native-paper';
import { router } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { useData, ActivityItem } from '@/contexts/DataContext';
import { ActivityCardSkeleton } from '@/components/SkeletonLoader';
import ActivityCard from '@/components/ActivityCard';

export default function ActivityScreen() {
  const theme = useTheme();
  const { activities, isLoadingData, fetchData, getUserImpactStats } = useData();

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  const renderActivity = ({ item }: { item: ActivityItem }) => (
    <ActivityCard item={item} />
  );

  const renderSkeletonLoader = () => (
    <View>
      <ActivityCardSkeleton />
      <ActivityCardSkeleton />
      <ActivityCardSkeleton />
    </View>
  );

  const userStats = getUserImpactStats();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurfaceVariant} />} 
          onPress={() => router.back()} 
        />
        <Appbar.Content title="My Stories" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Your Impact Library
          </Text>
          {isLoadingData ? (
            <View style={styles.loadingText}>
              <Text variant="bodyMedium" style={styles.summaryText}>
                Loading your impact stories...
              </Text>
            </View>
          ) : (
            <Text variant="bodyMedium" style={styles.summaryText}>
              You've helped {userStats.totalPeopleHelped} people through your contributions. Each completed mission becomes a personal story of your kindness.
            </Text>
          )}
        </View>

        {isLoadingData ? (
          renderSkeletonLoader()
        ) : (
          <FlatList
            data={activities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Mail size={48} color={theme.colors.onSurfaceVariant} />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  An Unwritten Story
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubtitle}>
                  Your first act of kindness will create a beautiful story here. Start by reporting a need or making a donation.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  summaryTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  summaryText: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  loadingText: {
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 96,
  },
  emptyTitle: {
    color: theme.colors.onSurface,
    marginTop: 24,
    marginBottom: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
});