import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Card,
  IconButton,
} from 'react-native-paper';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Video } from 'expo-av';
import { MapPin, Video as VideoIcon, SkipForward, RotateCcw, Play, Pause, Trash2 } from 'lucide-react-native';
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

type ReportStep = 'details' | 'video' | 'review';

export default function ReportScreen() {
  // Existing state
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

  // New state for video recording
  const [currentStep, setCurrentStep] = useState<ReportStep>('details');
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const videoRef = useRef<Video>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      getCurrentLocation();
    }
  }, []);

  useEffect(() => {
    if (currentStep === 'video' && Platform.OS !== 'web') {
      requestPermission();
    }
  }, [currentStep]);

  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 15) {
            stopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
    }

    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, [isRecording]);

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

  const handleDetailsSubmit = () => {
    if (!markerCoordinate) {
      Alert.alert('Error', 'Please select a location on the map');
      return;
    }

    if (!peopleCount) {
      Alert.alert('Error', 'Please enter the estimated number of people');
      return;
    }

    // Move to video step
    setCurrentStep('video');
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      setRecordingDuration(0);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 15,
        quality: '720p',
      });
      setRecordedVideoUri(video.uri);
      setIsRecording(false);
    } catch (error) {
      console.error('Error recording video:', error);
      setIsRecording(false);
      Alert.alert('Error', 'Failed to record video. Please try again.');
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const deleteRecording = () => {
    setRecordedVideoUri(null);
    setRecordingDuration(0);
  };

  const skipVideo = () => {
    setCurrentStep('review');
  };

  const proceedWithVideo = () => {
    setCurrentStep('review');
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      console.log('Submitting report:', {
        location: markerCoordinate,
        peopleCount,
        description,
        videoUri: recordedVideoUri,
      });

      // Here you would upload the video to Supabase Storage if available
      // and associate it with the report

      Alert.alert(
        'Report Submitted',
        recordedVideoUri 
          ? 'Thank you for reporting with video context. Our team will review this shortly.'
          : 'Thank you for reporting. Our team will review this shortly.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBackToDetails = () => {
    setCurrentStep('details');
    setRecordedVideoUri(null);
    setRecordingDuration(0);
  };

  const goBackToVideo = () => {
    setCurrentStep('video');
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

  const CameraComponent = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webCameraPlaceholder}>
          <VideoIcon size={48} color={colors.neutral[500]} />
          <Text variant="bodyLarge" style={styles.webCameraText}>
            Video recording available on mobile devices
          </Text>
          <Button 
            mode="outlined"
            onPress={() => setRecordedVideoUri('mock-video-uri')}
            style={styles.webCameraButton}
            textColor={colors.primary[600]}
          >
            Simulate Video Recording
          </Button>
        </View>
      );
    }

    if (!permission) {
      return (
        <View style={styles.permissionContainer}>
          <Text variant="bodyLarge" style={styles.permissionText}>
            Loading camera permissions...
          </Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <VideoIcon size={48} color={colors.neutral[500]} />
          <Text variant="bodyLarge" style={styles.permissionText}>
            Camera access is needed to record video context
          </Text>
          <Button 
            mode="contained"
            onPress={requestPermission}
            style={styles.permissionButton}
          >
            Grant Camera Permission
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
          mode="video"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <Text variant="bodyMedium" style={styles.recordingTimer}>
                {isRecording ? `Recording: ${recordingDuration}s / 15s` : 'Tap to record (max 15s)'}
              </Text>
              <IconButton
                icon={() => <RotateCcw size={24} color="#FFFFFF" />}
                onPress={toggleCameraFacing}
                style={styles.flipButton}
              />
            </View>
            
            <View style={styles.cameraControls}>
              <Pressable
                style={[
                  styles.recordButton,
                  isRecording && styles.recordButtonActive
                ]}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <View style={[
                  styles.recordButtonInner,
                  isRecording && styles.recordButtonInnerActive
                ]} />
              </Pressable>
            </View>
          </View>
        </CameraView>
      </View>
    );
  };

  const VideoPreview = () => {
    if (!recordedVideoUri) return null;

    if (Platform.OS === 'web') {
      return (
        <View style={styles.videoPreviewContainer}>
          <View style={styles.mockVideoPreview}>
            <Play size={48} color={colors.primary[600]} />
            <Text variant="bodyMedium" style={styles.mockVideoText}>
              Video recorded successfully ({recordingDuration}s)
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.videoPreviewContainer}>
        <Video
          ref={videoRef}
          style={styles.videoPreview}
          source={{ uri: recordedVideoUri }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status: any) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
            }
          }}
        />
        <View style={styles.videoPreviewOverlay}>
          <Text variant="bodySmall" style={styles.videoDuration}>
            Duration: {recordingDuration}s
          </Text>
          <IconButton
            icon={() => <Trash2 size={20} color={colors.error[600]} />}
            onPress={deleteRecording}
            style={styles.deleteButton}
          />
        </View>
      </View>
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[
          styles.stepCircle,
          currentStep === 'details' && styles.stepCircleActive,
          (currentStep === 'video' || currentStep === 'review') && styles.stepCircleCompleted
        ]}>
          <Text style={[
            styles.stepNumber,
            (currentStep === 'details' || currentStep === 'video' || currentStep === 'review') && styles.stepNumberActive
          ]}>1</Text>
        </View>
        <Text variant="bodySmall" style={styles.stepLabel}>Details</Text>
      </View>
      
      <View style={[
        styles.stepLine,
        (currentStep === 'video' || currentStep === 'review') && styles.stepLineActive
      ]} />
      
      <View style={styles.stepContainer}>
        <View style={[
          styles.stepCircle,
          currentStep === 'video' && styles.stepCircleActive,
          currentStep === 'review' && styles.stepCircleCompleted
        ]}>
          <Text style={[
            styles.stepNumber,
            (currentStep === 'video' || currentStep === 'review') && styles.stepNumberActive
          ]}>2</Text>
        </View>
        <Text variant="bodySmall" style={styles.stepLabel}>Video</Text>
      </View>
      
      <View style={[
        styles.stepLine,
        currentStep === 'review' && styles.stepLineActive
      ]} />
      
      <View style={styles.stepContainer}>
        <View style={[
          styles.stepCircle,
          currentStep === 'review' && styles.stepCircleActive
        ]}>
          <Text style={[
            styles.stepNumber,
            currentStep === 'review' && styles.stepNumberActive
          ]}>3</Text>
        </View>
        <Text variant="bodySmall" style={styles.stepLabel}>Review</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Report a Need" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      {renderStepIndicator()}

      {currentStep === 'details' && (
        <>
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
                onPress={handleDetailsSubmit}
                disabled={!markerCoordinate || !peopleCount}
                style={styles.nextButton}
                contentStyle={styles.buttonContent}
              >
                Next: Add Video Context
              </Button>
            </Card.Content>
          </Card>
        </>
      )}

      {currentStep === 'video' && (
        <View style={styles.videoStepContainer}>
          <Card style={styles.videoCard} mode="elevated">
            <Card.Content style={styles.videoCardContent}>
              <Text variant="titleLarge" style={styles.videoTitle}>
                Add Visual Context (Optional)
              </Text>
              <Text variant="bodyMedium" style={styles.videoDescription}>
                Record a short video to help the facilitator understand the situation better
              </Text>
              
              <Text variant="bodySmall" style={styles.privacyText}>
                🔒 This video is encrypted and will only be visible to the assigned facilitator for operational purposes.
              </Text>
            </Card.Content>
          </Card>

          {!recordedVideoUri ? (
            <CameraComponent />
          ) : (
            <VideoPreview />
          )}

          <View style={styles.videoActions}>
            <Button
              mode="outlined"
              onPress={goBackToDetails}
              style={styles.backButton}
              textColor={colors.neutral[600]}
            >
              Back
            </Button>
            
            {!recordedVideoUri ? (
              <Button
                mode="contained"
                onPress={skipVideo}
                style={styles.skipButton}
                contentStyle={styles.buttonContent}
                icon={() => <SkipForward size={20} color="#FFFFFF" />}
              >
                Skip & Continue
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={proceedWithVideo}
                style={styles.continueButton}
                contentStyle={styles.buttonContent}
              >
                Continue with Video
              </Button>
            )}
          </View>
        </View>
      )}

      {currentStep === 'review' && (
        <View style={styles.reviewContainer}>
          <Card style={styles.reviewCard} mode="elevated">
            <Card.Content style={styles.reviewContent}>
              <Text variant="titleLarge" style={styles.reviewTitle}>
                Review Your Report
              </Text>
              
              <View style={styles.reviewSection}>
                <Text variant="titleMedium" style={styles.reviewSectionTitle}>
                  Location
                </Text>
                <Text variant="bodyMedium" style={styles.reviewText}>
                  {markerCoordinate ? 
                    `Lat: ${markerCoordinate.latitude.toFixed(6)}, Lng: ${markerCoordinate.longitude.toFixed(6)}` :
                    'No location selected'
                  }
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text variant="titleMedium" style={styles.reviewSectionTitle}>
                  People in Need
                </Text>
                <Text variant="bodyMedium" style={styles.reviewText}>
                  {peopleCount} people
                </Text>
              </View>

              {description && (
                <View style={styles.reviewSection}>
                  <Text variant="titleMedium" style={styles.reviewSectionTitle}>
                    Description
                  </Text>
                  <Text variant="bodyMedium" style={styles.reviewText}>
                    {description}
                  </Text>
                </View>
              )}

              <View style={styles.reviewSection}>
                <Text variant="titleMedium" style={styles.reviewSectionTitle}>
                  Video Context
                </Text>
                <Text variant="bodyMedium" style={styles.reviewText}>
                  {recordedVideoUri ? 
                    `✅ Video recorded (${recordingDuration}s)` : 
                    '❌ No video attached'
                  }
                </Text>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.reviewActions}>
            <Button
              mode="outlined"
              onPress={goBackToVideo}
              style={styles.backButton}
              textColor={colors.neutral[600]}
            >
              Back
            </Button>
            
            <Button
              mode="contained"
              onPress={handleFinalSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
            >
              Submit Report
            </Button>
          </View>
        </View>
      )}
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing['2xl'],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  stepContainer: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary[600],
  },
  stepCircleCompleted: {
    backgroundColor: colors.success[500],
  },
  stepNumber: {
    color: colors.neutral[500],
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    color: colors.neutral[500],
    fontFamily: 'Inter-Regular',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.neutral[200],
    marginHorizontal: spacing.lg,
  },
  stepLineActive: {
    backgroundColor: colors.primary[600],
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
  nextButton: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[600],
  },
  buttonContent: {
    paddingVertical: spacing.lg,
  },
  videoStepContainer: {
    flex: 1,
    padding: spacing['2xl'],
  },
  videoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing['2xl'],
    ...shadows.md,
  },
  videoCardContent: {
    padding: spacing['3xl'],
  },
  videoTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
  },
  videoDescription: {
    color: colors.neutral[600],
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Regular',
  },
  privacyText: {
    color: colors.success[600],
    backgroundColor: colors.success[50],
    padding: spacing['2xl'],
    borderRadius: borderRadius.lg,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing['2xl'],
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing['2xl'],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  recordingTimer: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  flipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: spacing['4xl'],
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  recordButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.error[500],
  },
  recordButtonInnerActive: {
    borderRadius: 8,
    width: 40,
    height: 40,
  },
  webCameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.xl,
    marginBottom: spacing['2xl'],
    padding: spacing['4xl'],
  },
  webCameraText: {
    color: colors.neutral[800],
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-SemiBold',
  },
  webCameraButton: {
    borderColor: colors.primary[600],
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.xl,
    marginBottom: spacing['2xl'],
    padding: spacing['4xl'],
  },
  permissionText: {
    color: colors.neutral[800],
    textAlign: 'center',
    marginVertical: spacing['2xl'],
    fontFamily: 'Inter-Regular',
  },
  permissionButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
  },
  videoPreviewContainer: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing['2xl'],
    position: 'relative',
  },
  videoPreview: {
    flex: 1,
    backgroundColor: colors.neutral[900],
  },
  mockVideoPreview: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['2xl'],
  },
  mockVideoText: {
    color: colors.neutral[800],
    fontFamily: 'Inter-Regular',
  },
  videoPreviewOverlay: {
    position: 'absolute',
    top: spacing['2xl'],
    right: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  videoDuration: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    margin: 0,
  },
  videoActions: {
    flexDirection: 'row',
    gap: spacing['2xl'],
  },
  backButton: {
    flex: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
  },
  skipButton: {
    flex: 2,
    backgroundColor: colors.neutral[600],
    borderRadius: borderRadius.lg,
  },
  continueButton: {
    flex: 2,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
  },
  reviewContainer: {
    flex: 1,
    padding: spacing['2xl'],
  },
  reviewCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing['2xl'],
    ...shadows.md,
  },
  reviewContent: {
    padding: spacing['3xl'],
  },
  reviewTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    marginBottom: spacing['3xl'],
    fontFamily: 'Inter-Bold',
  },
  reviewSection: {
    marginBottom: spacing['3xl'],
  },
  reviewSectionTitle: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-SemiBold',
  },
  reviewText: {
    color: colors.neutral[600],
    fontFamily: 'Inter-Regular',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: spacing['2xl'],
  },
  submitButton: {
    flex: 2,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
  },
});