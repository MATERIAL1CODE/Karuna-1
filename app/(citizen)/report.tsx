import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
} from 'react-native-paper';
import { router } from 'expo-router';
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

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function ReportScreen() {
  const [location, setLocation] = useState<any>(null);
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
    if (Platform.OS !== 'web') {
      getCurrentLocation();
    }
  }, []);

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

    if (!peopleCount) {
      Alert.alert('Error', 'Please enter the estimated number of people');
      return;
    }

    setLoading(true);
    try {
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
          />
        )}
      </MapView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Report a Need" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.mapContainer}>
        <MapComponent />

        <View style={styles.mapOverlay}>
          <Text variant="bodyMedium" style={styles.mapInstruction}>
            {markerCoordinate ? 
              '📍 Pin placed. Tap elsewhere to move.' : 
              Platform.OS === 'web' ? 
                'Tap the button to place a pin' :
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
            label="Estimated number of people in need"
            value={peopleCount}
            onChangeText={setPeopleCount}
            mode="outlined"
            keyboardType="numeric"
            placeholder="e.g., 5"
            style={styles.input}
            outlineColor={colors.neutral[200]}
            activeOutlineColor={colors.primary[600]}
            placeholderTextColor={colors.neutral[500]}
            textColor={colors.neutral[800]}
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
            outlineColor={colors.neutral[200]}
            activeOutlineColor={colors.primary[600]}
            placeholderTextColor={colors.neutral[500]}
            textColor={colors.neutral[800]}
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
    marginBottom: spacing.lg,
    fontFamily: 'Inter-SemiBold',
  },
  webMapSubtext: {
    color: colors.neutral[500],
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Regular',
  },
  webMapButton: {
    borderColor: colors.primary[600],
  },
  mapOverlay: {
    position: 'absolute',
    top: spacing['2xl'],
    left: spacing['2xl'],
    right: spacing['2xl'],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    ...shadows.md,
  },
  mapInstruction: {
    textAlign: 'center',
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
  },
  formCard: {
    margin: spacing['2xl'],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  formContent: {
    padding: spacing['3xl'],
  },
  formTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  input: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.surface,
  },
  textArea: {
    marginBottom: spacing['3xl'],
    backgroundColor: colors.surface,
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[600],
  },
  buttonContent: {
    paddingVertical: spacing.lg,
  },
});