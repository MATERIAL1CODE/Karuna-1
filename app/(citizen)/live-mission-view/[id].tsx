import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
  Button,
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { Gift, Chrome as Home, Truck, MapPin, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

// Conditionally import native-only modules
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (error) {
    console.log('Maps not available on this platform');
  }
}

const { width, height } = Dimensions.get('window');

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MissionData {
  id: string;
  donorLocation: Coordinate;
  deliveryLocation: Coordinate;
  facilitatorLocation: Coordinate;
  status: 'pickup' | 'delivery' | 'completed';
  estimatedTime: string;
  distance: string;
}

// Mock mission data
const mockMissionData: MissionData = {
  id: '1',
  donorLocation: { latitude: 28.6139, longitude: 77.2090 },
  deliveryLocation: { latitude: 28.6304, longitude: 77.2177 },
  facilitatorLocation: { latitude: 28.6200, longitude: 77.2100 },
  status: 'pickup',
  estimatedTime: '15 mins',
  distance: '3.2 km',
};

// Mock route coordinates (simplified path)
const mockRouteCoordinates = [
  { latitude: 28.6139, longitude: 77.2090 }, // Donor
  { latitude: 28.6180, longitude: 77.2120 },
  { latitude: 28.6220, longitude: 77.2140 },
  { latitude: 28.6260, longitude: 77.2160 },
  { latitude: 28.6304, longitude: 77.2177 }, // Delivery
];

export default function LiveMissionViewScreen() {
  const { id } = useLocalSearchParams();
  const [missionData, setMissionData] = useState<MissionData>(mockMissionData);
  const [currentPhase, setCurrentPhase] = useState<'pickup' | 'delivery' | 'completed'>('pickup');
  
  // Animation values
  const facilitatorProgress = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  const routeProgress = useSharedValue(0);

  useEffect(() => {
    // Start route drawing animation
    routeProgress.value = withTiming(1, {
      duration: 2000,
      easing: Easing.out(Easing.cubic),
    });

    // Start facilitator movement animation
    facilitatorProgress.value = withTiming(0.5, {
      duration: 8000,
      easing: Easing.inOut(Easing.cubic),
    });

    // Pulse animation for active elements
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );

    // Simulate status updates
    const timer1 = setTimeout(() => {
      setCurrentPhase('delivery');
      facilitatorProgress.value = withTiming(1, {
        duration: 8000,
        easing: Easing.inOut(Easing.cubic),
      });
    }, 10000);

    const timer2 = setTimeout(() => {
      setCurrentPhase('completed');
    }, 20000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const facilitatorAnimatedStyle = useAnimatedStyle(() => {
    const progress = facilitatorProgress.value;
    
    // Interpolate position along the route
    const totalPoints = mockRouteCoordinates.length - 1;
    const segmentIndex = Math.floor(progress * totalPoints);
    const segmentProgress = (progress * totalPoints) % 1;
    
    const startPoint = mockRouteCoordinates[Math.min(segmentIndex, totalPoints - 1)];
    const endPoint = mockRouteCoordinates[Math.min(segmentIndex + 1, totalPoints)];
    
    const latitude = interpolate(
      segmentProgress,
      [0, 1],
      [startPoint.latitude, endPoint.latitude]
    );
    
    const longitude = interpolate(
      segmentProgress,
      [0, 1],
      [startPoint.longitude, endPoint.longitude]
    );

    // Convert lat/lng to screen coordinates (simplified)
    const x = interpolate(longitude, [77.2090, 77.2177], [50, width - 50]);
    const y = interpolate(latitude, [28.6139, 28.6304], [height * 0.7, height * 0.3]);

    return {
      transform: [
        { translateX: x - 25 },
        { translateY: y - 25 },
        { scale: currentPhase === 'pickup' ? pulseAnimation.value : 1 },
      ],
    };
  });

  const routeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: routeProgress.value,
      transform: [{ scale: routeProgress.value }],
    };
  });

  const MapComponent = () => {
    if (Platform.OS === 'web' || !MapView) {
      return (
        <View style={styles.webMapContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
            }}
            style={styles.mapBackground}
          />
          
          {/* Route overlay */}
          <Animated.View style={[styles.routeOverlay, routeAnimatedStyle]}>
            <Svg width={width} height="100%" style={styles.routeSvg}>
              <Path
                d={`M 50 ${height * 0.7} Q ${width * 0.3} ${height * 0.5} ${width - 50} ${height * 0.3}`}
                stroke={colors.primary[600]}
                strokeWidth="4"
                strokeDasharray="10,5"
                fill="none"
              />
            </Svg>
          </Animated.View>

          {/* Static markers */}
          <View style={[styles.marker, { left: 25, top: height * 0.7 - 25 }]}>
            <View style={[styles.markerIcon, { backgroundColor: colors.success[100] }]}>
              <Gift size={20} color={colors.success[500]} />
            </View>
            <Text style={styles.markerLabel}>Donor</Text>
          </View>

          <View style={[styles.marker, { right: 25, top: height * 0.3 - 25 }]}>
            <View style={[styles.markerIcon, { backgroundColor: colors.error[100] }]}>
              <Home size={20} color={colors.error[500]} />
            </View>
            <Text style={styles.markerLabel}>You</Text>
          </View>

          {/* Animated facilitator marker */}
          <Animated.View style={[styles.facilitatorMarker, facilitatorAnimatedStyle]}>
            <View style={[styles.markerIcon, { backgroundColor: colors.primary[100] }]}>
              <Truck size={20} color={colors.primary[600]} />
            </View>
          </Animated.View>
        </View>
      );
    }

    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.6221,
          longitude: 77.2133,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={missionData.donorLocation}
          title="Donor Location"
        >
          <View style={[styles.markerIcon, { backgroundColor: colors.success[100] }]}>
            <Gift size={20} color={colors.success[500]} />
          </View>
        </Marker>

        <Marker
          coordinate={missionData.deliveryLocation}
          title="Your Location"
        >
          <View style={[styles.markerIcon, { backgroundColor: colors.error[100] }]}>
            <Home size={20} color={colors.error[500]} />
          </View>
        </Marker>

        <Marker
          coordinate={missionData.facilitatorLocation}
          title="Facilitator"
        >
          <View style={[styles.markerIcon, { backgroundColor: colors.primary[100] }]}>
            <Truck size={20} color={colors.primary[600]} />
          </View>
        </Marker>
      </MapView>
    );
  };

  const getStatusMessage = () => {
    switch (currentPhase) {
      case 'pickup':
        return 'Facilitator is heading to pickup location...';
      case 'delivery':
        return 'Resource picked up! Facilitator is on the way to you.';
      case 'completed':
        return 'Mission completed! Help has been delivered.';
      default:
        return 'Tracking mission progress...';
    }
  };

  const getStatusIcon = () => {
    switch (currentPhase) {
      case 'pickup':
        return <MapPin size={24} color={colors.warning[500]} />;
      case 'delivery':
        return <Truck size={24} color={colors.primary[600]} />;
      case 'completed':
        return <CheckCircle size={24} color={colors.success[500]} />;
      default:
        return <Clock size={24} color={colors.neutral[500]} />;
    }
  };

  const getStatusColor = () => {
    switch (currentPhase) {
      case 'pickup':
        return colors.warning[100];
      case 'delivery':
        return colors.primary[100];
      case 'completed':
        return colors.success[100];
      default:
        return colors.neutral[100];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Live Mission Tracking" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        {/* Status Card */}
        <Card style={[styles.statusCard, { backgroundColor: getStatusColor() }]} mode="elevated">
          <Card.Content style={styles.statusContent}>
            <View style={styles.statusHeader}>
              {getStatusIcon()}
              <Text variant="titleLarge" style={styles.statusTitle}>
                Mission in Progress
              </Text>
            </View>
            <Text variant="bodyLarge" style={styles.statusMessage}>
              {getStatusMessage()}
            </Text>
            <View style={styles.statusDetails}>
              <View style={styles.statusDetail}>
                <Clock size={16} color={colors.neutral[500]} />
                <Text variant="bodySmall" style={styles.statusDetailText}>
                  ETA: {missionData.estimatedTime}
                </Text>
              </View>
              <View style={styles.statusDetail}>
                <MapPin size={16} color={colors.neutral[500]} />
                <Text variant="bodySmall" style={styles.statusDetailText}>
                  Distance: {missionData.distance}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Live Map */}
        <Card style={styles.mapCard} mode="elevated">
          <MapComponent />
        </Card>

        {/* Progress Indicator */}
        <Card style={styles.progressCard} mode="elevated">
          <Card.Content style={styles.progressContent}>
            <Text variant="titleMedium" style={styles.progressTitle}>
              Mission Progress
            </Text>
            
            <View style={styles.progressSteps}>
              <View style={styles.progressStep}>
                <View style={[
                  styles.progressStepIcon,
                  { backgroundColor: colors.success[500] }
                ]}>
                  <Gift size={16} color="#FFFFFF" />
                </View>
                <Text variant="bodySmall" style={styles.progressStepText}>
                  Pickup
                </Text>
                <Text variant="bodySmall" style={styles.progressStepStatus}>
                  {currentPhase === 'pickup' ? 'In Progress' : 'Completed'}
                </Text>
              </View>

              <View style={[
                styles.progressLine,
                { backgroundColor: currentPhase !== 'pickup' ? colors.success[500] : colors.neutral[300] }
              ]} />

              <View style={styles.progressStep}>
                <View style={[
                  styles.progressStepIcon,
                  { 
                    backgroundColor: currentPhase === 'delivery' || currentPhase === 'completed' 
                      ? colors.primary[600] 
                      : colors.neutral[300] 
                  }
                ]}>
                  <Truck size={16} color="#FFFFFF" />
                </View>
                <Text variant="bodySmall" style={styles.progressStepText}>
                  Delivery
                </Text>
                <Text variant="bodySmall" style={styles.progressStepStatus}>
                  {currentPhase === 'pickup' ? 'Pending' : 
                   currentPhase === 'delivery' ? 'In Progress' : 'Completed'}
                </Text>
              </View>

              <View style={[
                styles.progressLine,
                { backgroundColor: currentPhase === 'completed' ? colors.success[500] : colors.neutral[300] }
              ]} />

              <View style={styles.progressStep}>
                <View style={[
                  styles.progressStepIcon,
                  { 
                    backgroundColor: currentPhase === 'completed' 
                      ? colors.success[500] 
                      : colors.neutral[300] 
                  }
                ]}>
                  <CheckCircle size={16} color="#FFFFFF" />
                </View>
                <Text variant="bodySmall" style={styles.progressStepText}>
                  Complete
                </Text>
                <Text variant="bodySmall" style={styles.progressStepStatus}>
                  {currentPhase === 'completed' ? 'Completed' : 'Pending'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {currentPhase === 'completed' && (
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={styles.completeButton}
            contentStyle={styles.buttonContent}
          >
            View Impact Story
          </Button>
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
    padding: spacing['2xl'],
    gap: spacing['2xl'],
  },
  statusCard: {
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  statusContent: {
    padding: spacing['3xl'],
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  statusTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  statusMessage: {
    color: colors.neutral[700],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Regular',
  },
  statusDetails: {
    flexDirection: 'row',
    gap: spacing['3xl'],
  },
  statusDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  statusDetailText: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  mapCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  map: {
    flex: 1,
  },
  webMapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  routeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  routeSvg: {
    position: 'absolute',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    gap: spacing.lg,
  },
  markerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...shadows.md,
  },
  markerLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  facilitatorMarker: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  progressCard: {
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  progressContent: {
    padding: spacing['3xl'],
  },
  progressTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    gap: spacing.lg,
    flex: 1,
  },
  progressStepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepText: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  progressStepStatus: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  progressLine: {
    height: 2,
    flex: 1,
    marginHorizontal: spacing.lg,
  },
  completeButton: {
    backgroundColor: colors.success[500],
    borderRadius: borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing.lg,
  },
});