import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style 
}: SkeletonLoaderProps) {
  const theme = useTheme();
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 0.7, 0.3]);
    return { opacity };
  });

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </View>
  );
}

// Predefined skeleton components for common use cases
export function ActivityCardSkeleton() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.activityCard}>
      <View style={styles.cardHeader}>
        <SkeletonLoader width={48} height={48} borderRadius={12} />
        <View style={styles.cardContent}>
          <SkeletonLoader width="60%" height={20} />
          <SkeletonLoader width="40%" height={16} style={{ marginTop: 8 }} />
          <SkeletonLoader width="80%" height={16} style={{ marginTop: 12 }} />
        </View>
      </View>
    </View>
  );
}

export function StatsCardSkeleton() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.statsCard}>
      <SkeletonLoader width="70%" height={24} style={{ marginBottom: 16 }} />
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <SkeletonLoader width={40} height={40} borderRadius={20} />
          <SkeletonLoader width={30} height={20} style={{ marginTop: 8 }} />
          <SkeletonLoader width={50} height={14} style={{ marginTop: 4 }} />
        </View>
        <View style={styles.statItem}>
          <SkeletonLoader width={40} height={40} borderRadius={20} />
          <SkeletonLoader width={30} height={20} style={{ marginTop: 8 }} />
          <SkeletonLoader width={50} height={14} style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
}

export function MissionCardSkeleton() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.missionCard}>
      <SkeletonLoader width="100%" height={120} borderRadius={16} style={{ marginBottom: 16 }} />
      <View style={styles.missionContent}>
        <View style={styles.missionHeader}>
          <SkeletonLoader width="70%" height={22} />
          <SkeletonLoader width={60} height={24} borderRadius={12} />
        </View>
        <SkeletonLoader width="90%" height={16} style={{ marginTop: 12 }} />
        <SkeletonLoader width="60%" height={16} style={{ marginTop: 8 }} />
        <SkeletonLoader width="100%" height={40} borderRadius={12} style={{ marginTop: 16 }} />
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceVariant,
    overflow: 'hidden',
  },
  shimmer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  activityCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  cardContent: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  missionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  missionContent: {
    padding: 24,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});