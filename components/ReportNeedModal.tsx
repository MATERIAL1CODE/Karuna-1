import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Text,
  Appbar,
} from 'react-native-paper';
import { X } from 'lucide-react-native';
import { GlassModal } from '@/components/ui/GlassModal';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { colors, spacing, borderRadius } from '@/lib/design-tokens';

// Conditionally import native-only modules
let MapView: any = null;
let Marker: any = null;
let Location: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Location = require('expo-location');
  } catch (error) {
    console.log('Maps not available on this platform');
  }
}

const { width, height } = Dimensions.get('window');

interface ReportNeedModalProps {
  visible: boolean;
  onDismiss: () => void;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function ReportNeedModal({ visible, onDismiss }: ReportNeedModalProps) {
  const [region, setRegion] = useState<Region>({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [location, setLocation] = useState<any>(null);
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [peopleCount, setPeopleCount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    if (!Location) return;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleMapPress = (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    setMarkerCoordinate(coordinate);
  };

  const handleSubmit = async () => {
    if (!markerCoordinate) {
      Alert.alert('Error', 'Please select a location on the map');
      return;
    }

    if (!peopleCount || isNaN(Number(peopleCount)) || Number(peopleCount) <= 0) {
      Alert.alert('Error', 'Please enter a valid number of people');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting report:', {
        location: markerCoordinate,
        peopleCount: Number(peopleCount),
      });

      Alert.alert(
        'Report Submitted',
        'Thank you for reporting. Our team will review this shortly.',
        [{ text: 'OK', onPress: () => {
          onDismiss();
          setMarkerCoordinate(null);
          setPeopleCount('');
        }}]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const MapComponent = () => {
    if (Platform.OS === 'web' || !MapView) {
      return (
        <View style={styles.webMapPlaceholder}>
          <Text variant="bodyLarge" style={styles.webMapText}>
            Map functionality available on mobile devices
          </Text>
          <Text variant="bodyMedium" style={styles.webMapSubtext}>
            Tap here to simulate pin placement
          </Text>
          <GlassButton 
            title="Place Pin"
            onPress={() => setMarkerCoordinate({ latitude: 28.6139, longitude: 77.2090 })}
            variant="secondary"
            size="md"
            style={styles.webMapButton}
          />
        </View>
      );
    }

    return (
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title="Need Location"
            description="Person/family in need"
            draggable
            onDragEnd={(e: any) => setMarkerCoordinate(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>
    );
  };

  return (
    <GlassModal
      visible={visible}
      onClose={onDismiss}
      animationType="slide"
      style={styles.modalContent}
    >
      <View style={styles.modal}>
        <Appbar.Header style={styles.modalHeader}>
          <Appbar.Content title="Report a Need" titleStyle={styles.modalTitle} />
          <Appbar.Action 
            icon={() => <X size={24} color={colors.neutral[800]} />} 
            onPress={onDismiss} 
          />
        </Appbar.Header>

        <View style={styles.mapContainer}>
          <MapComponent />
          
          <GlassCard variant="standard" style={styles.mapOverlay}>
            <Text variant="bodyMedium" style={styles.mapInstruction}>
              {markerCoordinate ? 
                '📍 Pin placed. Drag to adjust.' : 
                Platform.OS === 'web' ? 
                  'Tap the button to place a pin' :
                  'Tap on the map to pin the location'
              }
            </Text>
          </GlassCard>
        </View>

        <GlassCard variant="elevated" style={styles.formCard}>
          <Text variant="titleMedium" style={styles.formTitle}>
            Details
          </Text>

          <GlassInput
            label="Estimated number of people in need *"
            value={peopleCount}
            onChangeText={setPeopleCount}
            keyboardType="numeric"
            placeholder="e.g., 5"
          />

          <GlassButton
            title="Submit Report"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !markerCoordinate || !peopleCount}
            variant="primary"
            size="lg"
          />
        </GlassCard>
      </View>
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    margin: 0,
    padding: 0,
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  modalTitle: {
    fontWeight: '700',
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: '100%',
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    padding: spacing['5xl'],
  },
  webMapText: {
    color: colors.neutral[800],
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: 'Inter-SemiBold',
  },
  webMapSubtext: {
    color: colors.neutral[500],
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Regular',
  },
  webMapButton: {
    borderColor: colors.primary[600],
  },
  mapOverlay: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  mapInstruction: {
    textAlign: 'center',
    color: colors.neutral[800],
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  formCard: {
    margin: spacing.lg,
  },
  formTitle: {
    fontWeight: '700',
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
});