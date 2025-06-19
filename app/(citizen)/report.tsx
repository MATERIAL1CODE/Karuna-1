import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
} from 'react-native-paper';
import MapView, { Marker, Region } from 'react-native-maps';
import { router } from 'expo-router';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function ReportScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
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
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
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

    if (!peopleCount) {
      Alert.alert('Error', 'Please enter the estimated number of people');
      return;
    }

    setLoading(true);
    try {
      // Here you would submit to Supabase
      console.log('Submitting report:', {
        location: markerCoordinate,
        peopleCount,
        description,
      });

      Alert.alert(
        'Report Submitted',
        'Thank you for reporting. Our team will review this shortly.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Report a Need" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.mapContainer}>
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
            />
          )}
        </MapView>

        <View style={styles.mapOverlay}>
          <Text variant="bodyMedium" style={styles.mapInstruction}>
            Tap on the map to pin the location
          </Text>
        </View>
      </View>

      <Card style={styles.formCard} mode="elevated">
        <Card.Content style={styles.formContent}>
          <Text variant="titleMedium" style={styles.formTitle}>
            Details
          </Text>

          <TextInput
            label="Estimated number of people in need"
            value={peopleCount}
            onChangeText={setPeopleCount}
            mode="outlined"
            keyboardType="numeric"
            placeholder="e.g., 5"
            style={styles.input}
          />

          <TextInput
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Add more details about the situation, specific needs, etc."
            style={styles.textArea}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !markerCoordinate}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            Submit Report
          </Button>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontWeight: '600',
    color: '#1E293B',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
  },
  mapInstruction: {
    textAlign: 'center',
    color: '#64748B',
  },
  formCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
  },
  formContent: {
    padding: 20,
  },
  formTitle: {
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    marginBottom: 24,
  },
  submitButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});