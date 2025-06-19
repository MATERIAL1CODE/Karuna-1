import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
} from 'react-native-paper';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface ReportNeedModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function ReportNeedModal({ visible, onDismiss }: ReportNeedModalProps) {
  const [region, setRegion] = useState<Region>({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [peopleCount, setPeopleCount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        // For web, use default Delhi location
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
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
      // Here you would submit to Supabase
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

  const MapComponent = Platform.OS === 'web' ? 
    () => (
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
        >
          Place Pin
        </Button>
      </View>
    ) : 
    () => (
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
            onDragEnd={(e) => setMarkerCoordinate(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>
    );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modal}>
          <Appbar.Header style={styles.modalHeader}>
            <Appbar.Content title="Report a Need" titleStyle={styles.modalTitle} />
            <Appbar.Action 
              icon={() => <X size={24} color="#1F2937" />} 
              onPress={onDismiss} 
            />
          </Appbar.Header>

          <View style={styles.mapContainer}>
            <MapComponent />
            
            <View style={styles.mapOverlay}>
              <Text variant="bodyMedium" style={styles.mapInstruction}>
                {markerCoordinate ? 
                  '📍 Pin placed. Drag to adjust.' : 
                  'Tap on the map to pin the location'
                }
              </Text>
            </View>
          </View>

          <Card style={styles.formCard} mode="elevated">
            <Card.Content style={styles.formContent}>
              <Text variant="titleMedium" style={styles.formTitle}>
                Details
              </Text>

              <TextInput
                label="Estimated number of people in need *"
                value={peopleCount}
                onChangeText={setPeopleCount}
                mode="outlined"
                keyboardType="numeric"
                placeholder="e.g., 5"
                style={styles.input}
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
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  modalTitle: {
    fontWeight: '700',
    color: '#1F2937',
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
    backgroundColor: '#E5E7EB',
    padding: 40,
  },
  webMapText: {
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  webMapSubtext: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  webMapButton: {
    borderColor: '#4F46E5',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  mapInstruction: {
    textAlign: 'center',
    color: '#1F2937',
    fontWeight: '500',
  },
  formCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
  },
  formContent: {
    padding: 24,
  },
  formTitle: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  input: {
    marginBottom: 24,
  },
  submitButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});