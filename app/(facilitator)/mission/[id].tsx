import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Appbar,
  Card,
  Chip,
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MapPin, User, Clock, Phone, AlertTriangle } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';
import ReportIssueModal from '@/components/ReportIssueModal';

type MissionState = 'accepted' | 'enRoutePickup' | 'arrivedPickup' | 'enRouteDelivery' | 'arrivedDelivery' | 'completed';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [missionState, setMissionState] = useState<MissionState>('accepted');
  const [reportIssueVisible, setReportIssueVisible] = useState(false);

  const getPrimaryActionText = () => {
    switch (missionState) {
      case 'accepted':
        return 'Navigate to Pickup Location';
      case 'enRoutePickup':
        return 'Confirm Pickup';
      case 'arrivedPickup':
        return 'Navigate to Delivery Location';
      case 'enRouteDelivery':
        return 'Confirm Delivery';
      case 'arrivedDelivery':
        return 'Complete Mission';
      default:
        return 'Mission Completed';
    }
  };

  const getStateDescription = () => {
    switch (missionState) {
      case 'accepted':
        return 'Mission accepted. Ready to start pickup.';
      case 'enRoutePickup':
        return 'En route to pickup location. Tap "Confirm Pickup" when you arrive.';
      case 'arrivedPickup':
        return 'Pickup confirmed. Ready to deliver to beneficiary.';
      case 'enRouteDelivery':
        return 'En route to delivery location. Tap "Confirm Delivery" when you arrive.';
      case 'arrivedDelivery':
        return 'Delivery confirmed. Tap "Complete Mission" to finish.';
      default:
        return 'Mission completed successfully!';
    }
  };

  const handlePrimaryAction = () => {
    switch (missionState) {
      case 'accepted':
        setMissionState('enRoutePickup');
        break;
      case 'enRoutePickup':
        setMissionState('arrivedPickup');
        break;
      case 'arrivedPickup':
        setMissionState('enRouteDelivery');
        break;
      case 'enRouteDelivery':
        setMissionState('arrivedDelivery');
        break;
      case 'arrivedDelivery':
        setMissionState('completed');
        Alert.alert(
          'Mission Completed!',
          'Thank you for your service! Your impact has been recorded.',
          [{ text: 'Return to Dashboard', onPress: () => router.back() }]
        );
        break;
    }
  };

  const isCompleted = missionState === 'completed';

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Active Mission" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Mission State Card */}
        <Card style={styles.stateCard} mode="elevated">
          <Card.Content style={styles.stateContent}>
            <Text variant="titleLarge" style={styles.stateTitle}>
              Food for 4 People
            </Text>
            <Text variant="bodyMedium" style={styles.stateDescription}>
              {getStateDescription()}
            </Text>
          </Card.Content>
        </Card>

        {/* Current Focus Card - Dynamic based on state */}
        {(missionState === 'accepted' || missionState === 'enRoutePickup') && (
          <Card style={styles.focusCard} mode="elevated">
            <Card.Content style={styles.focusContent}>
              <Text variant="titleLarge" style={styles.focusTitle}>
                📍 Pickup Details
              </Text>

              <View style={styles.detailRow}>
                <View style={[styles.iconContainer, { backgroundColor: colors.success[100] }]}>
                  <MapPin size={20} color={colors.success[500]} />
                </View>
                <View style={styles.detailContent}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Location
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    Anna's Cafe, Saket District Centre
                  </Text>
                  <Text variant="bodySmall" style={styles.addressText}>
                    Shop 45, Ground Floor, Saket District Centre, New Delhi
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.iconContainer, { backgroundColor: colors.success[100] }]}>
                  <User size={20} color={colors.success[500]} />
                </View>
                <View style={styles.detailContent}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Contact Person
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    Sarah Miller (Manager)
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.iconContainer, { backgroundColor: colors.success[100] }]}>
                  <Phone size={20} color={colors.success[500]} />
                </View>
                <View style={styles.detailContent}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Phone Number
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    +91 98765 43210
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {(missionState === 'arrivedPickup' || missionState === 'enRouteDelivery') && (
          <Card style={styles.focusCard} mode="elevated">
            <Card.Content style={styles.focusContent}>
              <Text variant="titleLarge" style={styles.focusTitle}>
                🎯 Delivery Details
              </Text>

              <View style={styles.detailRow}>
                <View style={[styles.iconContainer, { backgroundColor: colors.error[100] }]}>
                  <MapPin size={20} color={colors.error[500]} />
                </View>
                <View style={styles.detailContent}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Location
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    Underneath Lajpat Nagar Flyover
                  </Text>
                  <Text variant="bodySmall" style={styles.addressText}>
                    Near Lajpat Nagar Metro Station, Ring Road
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.iconContainer, { backgroundColor: colors.error[100] }]}>
                  <User size={20} color={colors.error[500]} />
                </View>
                <View style={styles.detailContent}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Contact Person
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    Local Coordinator
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.iconContainer, { backgroundColor: colors.error[100] }]}>
                  <Phone size={20} color={colors.error[500]} />
                </View>
                <View style={styles.detailContent}>
                  <Text variant="labelMedium" style={styles.detailLabel}>
                    Phone Number
                  </Text>
                  <Text variant="bodyLarge" style={styles.detailValue}>
                    +91 87654 32109
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Route Preview - Always visible */}
        <Card style={styles.routeCard} mode="elevated">
          <Card.Content style={styles.routeContent}>
            <Text variant="titleLarge" style={styles.routeTitle}>
              🗺️ Route
            </Text>
            <View style={styles.routeContainer}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
                }}
                style={styles.routeImage}
              />
              <View style={styles.routeOverlay}>
                <Text variant="bodyMedium" style={styles.routeText}>
                  3.2 km • Est. 15 minutes
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        {!isCompleted && (
          <Button
            mode="outlined"
            onPress={() => setReportIssueVisible(true)}
            style={styles.reportButton}
            contentStyle={styles.reportButtonContent}
            textColor={colors.error[600]}
            icon={() => <AlertTriangle size={20} color={colors.error[600]} />}
          >
            Report Issue
          </Button>
        )}
        
        {!isCompleted && (
          <Button
            mode="contained"
            onPress={handlePrimaryAction}
            style={styles.primaryButton}
            contentStyle={styles.primaryButtonContent}
          >
            {getPrimaryActionText()}
          </Button>
        )}
      </View>

      <ReportIssueModal 
        visible={reportIssueVisible}
        onDismiss={() => setReportIssueVisible(false)}
      />
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
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    padding: spacing['2xl'],
    paddingBottom: spacing['8xl'], // Extra space for fixed bottom actions
  },
  stateCard: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  stateContent: {
    padding: spacing['3xl'],
  },
  stateTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  stateDescription: {
    color: colors.primary[700],
    fontFamily: 'Inter-Regular',
  },
  focusCard: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  focusContent: {
    padding: spacing['3xl'],
  },
  focusTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing['2xl'],
    gap: spacing['2xl'],
  },
  iconContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: colors.neutral[500],
    marginBottom: spacing.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  detailValue: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
    fontFamily: 'Inter-SemiBold',
    fontSize: 18, // Mission Critical Info - 18px, Semi-Bold
  },
  addressText: {
    color: colors.neutral[500],
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  routeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  routeContent: {
    padding: spacing['3xl'],
  },
  routeTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  routeContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  routeImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.neutral[200],
  },
  routeOverlay: {
    position: 'absolute',
    bottom: spacing['2xl'],
    left: spacing['2xl'],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.lg,
  },
  routeText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing.lg,
  },
  reportButton: {
    borderColor: colors.error[600],
    borderRadius: borderRadius.lg,
  },
  reportButtonContent: {
    paddingVertical: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
  },
  primaryButtonContent: {
    paddingVertical: spacing['2xl'],
  },
});