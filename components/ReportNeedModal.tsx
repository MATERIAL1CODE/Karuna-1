import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import {
  Text,
  Appbar,
  TextInput,
  Button,
} from 'react-native-paper';
import { X } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';

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
          <Button 
            mode="outlined"
            onPress={() => setMarkerCoordinate({ latitude: 28.6139, longitude: 77.2090 })}
            style={styles.webMapButton}
            textColor={colors.primary[600]}
          >
            Place Pin
          </Button>
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
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
          
          <View style={styles.mapOverlay}>
            <Text variant="bodyMedium" style={styles.mapInstruction}>
              {markerCoordinate ? 
                '📍 Pin placed. Drag to adjust.' : 
                Platform.OS === 'web' ? 
                  'Tap the button to place a pin' :
                  'Tap on the map to pin the location'
              }
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text variant="titleMedium" style={styles.formTitle}>
            Details
          </Text>

          <Text variant="labelLarge" style={styles.fieldLabel}>
            Estimated number of people in need *
          </Text>
          <TextInput
            value={peopleCount}
            onChangeText={setPeopleCount}
            mode="outlined"
            keyboardType="numeric"
            placeholder="e.g., 5"
            style={styles.input}
            outlineColor={colors.neutral[200]}
            activeOutlineColor={colors.primary[600]}
            placeholderTextColor={colors.neutral[400]}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !markerCoordinate || !peopleCount}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            Submit Report
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    backgroundColor: colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  modalTitle: {
    fontWeight: typography.fontWeight.bold,
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
    fontWeight: typography.fontWeight.semibold,
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  mapInstruction: {
    textAlign: 'center',
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  formCard: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    ...shadows.md,
  },
  formTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  fieldLabel: {
    color: colors.neutral[800],
    marginBottom: spacing.md,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.surface,
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[600],
  },
  buttonContent: {
    paddingVertical: spacing.md,
  },
});