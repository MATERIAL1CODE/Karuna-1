import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Button,
  useTheme,
} from 'react-native-paper';
import { MapPin, Clock, Gift } from 'lucide-react-native';
import { Mission } from '@/contexts/DataContext';

interface MissionCardProps {
  mission: Mission;
  onPress: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export default function MissionCard({ 
  mission, 
  onPress, 
  onAccept, 
  showAcceptButton = true 
}: MissionCardProps) {
  const theme = useTheme();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      default:
        return theme.colors.success;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Food':
        return theme.colors.success;
      case 'Medicine':
        return theme.colors.error;
      case 'Emergency':
        return theme.colors.warning;
      default:
        return theme.colors.info;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'in_progress':
        return theme.colors.warning;
      case 'accepted':
        return theme.colors.primary;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'accepted':
        return 'Accepted';
      default:
        return 'Available';
    }
  };

  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.missionCard} mode="elevated">
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
              {mission.status !== 'available' && (
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(mission.status) },
                  ]}
                  textStyle={styles.chipText}
                >
                  {getStatusText(mission.status)}
                </Chip>
              )}
            </View>
          </View>

          <View style={styles.locationSection}>
            <View style={styles.locationItem}>
              <View style={styles.locationDot}>
                <Gift size={16} color={theme.colors.success} />
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
                <MapPin size={16} color={theme.colors.error} />
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
              <Clock size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.timeText}>
                Pickup: {mission.pickupTime}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <Clock size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.timeText}>
                Delivery: {mission.deliveryTime}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          {showAcceptButton && mission.status === 'available' && onAccept && (
            <Button
              mode="contained"
              onPress={onAccept}
              style={styles.acceptButton}
              contentStyle={styles.acceptButtonContent}
            >
              Accept Mission
            </Button>
          )}

          {mission.status !== 'available' && (
            <Button
              mode="outlined"
              onPress={onPress}
              style={styles.viewButton}
              contentStyle={styles.acceptButtonContent}
              textColor={theme.colors.primary}
            >
              View Details
            </Button>
          )}
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  missionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  routePreview: {
    position: 'relative',
  },
  routeImage: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.surfaceVariant,
  },
  routeOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  distanceText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  missionTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: 16,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  chipContainer: {
    gap: 8,
    alignItems: 'flex-end',
  },
  typeChip: {
    alignSelf: 'flex-end',
  },
  urgencyChip: {
    alignSelf: 'flex-end',
  },
  statusChip: {
    alignSelf: 'flex-end',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  locationSection: {
    marginBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  locationDot: {
    marginTop: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    padding: 12,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: theme.colors.outline,
    marginLeft: 21,
    marginVertical: 12,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  locationValue: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  contactText: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  acceptButton: {
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  viewButton: {
    borderRadius: 12,
    borderColor: theme.colors.primary,
  },
  acceptButtonContent: {
    paddingVertical: 12,
  },
});