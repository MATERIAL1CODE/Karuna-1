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
  useTheme,
} from 'react-native-paper';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { VideoView, useVideoPlayer } from 'expo-video';
import { MapPin, Video as VideoIcon, SkipForward, RotateCcw, Play, Pause, Trash2 } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import { AIStorytellerService } from '@/components/AIStorytellerService';

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
  const theme = useTheme();
  const { addActivity } = useData();
  
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

  // AI Storyteller loading state
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  // Video player for preview
  const player = useVideoPlayer(recordedVideoUri || '', (player) => {
    player.loop = true;
    player.muted = true;
  });

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
      // Show AI Storyteller loading overlay
      setIsGeneratingStory(true);
      
      // Call AI Storyteller service
      const storyResponse = await AIStorytellerService.generateReportStory(
        parseInt(peopleCount),
        markerCoordinate || undefined,
        description || undefined,
        recordedVideoUri || undefined
      );
      
      // Create activity with AI-generated story
      const newActivity = {
        type: 'report' as const,
        title: 'Need Reported',
        subtitle: `Location: ${markerCoordinate ? `${markerCoordinate.latitude.toFixed(4)}, ${markerCoordinate.longitude.toFixed(4)}` : 'Unknown'}`,
        status: 'pending' as const,
        peopleHelped: parseInt(peopleCount),
        location: markerCoordinate || undefined,
        description,
        videoUri: recordedVideoUri || undefined,
      };

      // Enhance with AI story
      const enhancedActivity = AIStorytellerService.enhanceActivityWithStory(
        { ...newActivity, id: '', date: '' },
        storyResponse
      );

      // Add to context
      addActivity(enhancedActivity);

      setIsGeneratingStory(false);
      
      Alert.alert(
        'Report Submitted Successfully!',
        'Thank you for your compassion! Your report has been submitted and our team will coordinate assistance. You\'ll receive a personalized letter showing the impact of your kindness once aid is delivered.',
        [{ text: 'View My Stories', onPress: () => router.push('/(citizen)/(tabs)/activity') }]
      );
    } catch (error) {
      setIsGeneratingStory(false);
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
            textColor={theme.colors.primary}
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
          <VideoIcon size={48} color={theme.colors.onSurfaceVariant} />
          <Text variant="bodyLarge" style={styles.webCameraText}>
            Video recording available on mobile devices
          </Text>
          <Button 
            mode="outlined"
            onPress={() => setRecordedVideoUri('mock-video-uri')}
            style={styles.webCameraButton}
            textColor={theme.colors.primary}
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
          <VideoIcon size={48} color={theme.colors.onSurfaceVariant} />
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
            <Play size={48} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={styles.mockVideoText}>
              Video recorded successfully ({recordingDuration}s)
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.videoPreviewContainer}>
        <VideoView
          style={styles.videoPreview}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
        <View style={styles.videoPreviewOverlay}>
          <Text variant="bodySmall" style={styles.videoDuration}>
            Duration: {recordingDuration}s
          </Text>
          <IconButton
            icon={() => <Trash2 size={20} color={theme.colors.error} />}
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

  const styles = createStyles(theme);

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
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
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
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
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
              textColor={theme.colors.onSurfaceVariant}
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
              textColor={theme.colors.onSurfaceVariant}
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

      {/* AI Storyteller Loading Overlay */}
      <LoadingOverlay 
        isVisible={isGeneratingStory}
        message="Crafting your thank you story..."
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  headerTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  stepContainer: {
    alignItems: 'center',
    gap: 16,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: theme.colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: theme.colors.success,
  },
  stepNumber: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.outline,
    marginHorizontal: 16,
  },
  stepLineActive: {
    backgroundColor: theme.colors.primary,
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
    backgroundColor: theme.colors.surfaceVariant,
    padding: 48,
  },
  webMapText: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  webMapSubtext: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  webMapButton: {
    borderColor: theme.colors.primary,
  },
  mapOverlay: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  mapInstruction: {
    textAlign: 'center',
    color: theme.colors.onSurface,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  formCard: {
    margin: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  formContent: {
    padding: 32,
  },
  formTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 24,
    fontFamily: 'Inter-Bold',
  },
  input: {
    marginBottom: 24,
    backgroundColor: theme.colors.surface,
  },
  textArea: {
    marginBottom: 32,
    backgroundColor: theme.colors.surface,
  },
  nextButton: {
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    paddingVertical: 16,
  },
  videoStepContainer: {
    flex: 1,
    padding: 24,
  },
  videoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  videoCardContent: {
    padding: 32,
  },
  videoTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  videoDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  privacyText: {
    color: theme.colors.success,
    backgroundColor: theme.colors.secondaryContainer,
    padding: 24,
    borderRadius: 12,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
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
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  recordingTimer: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  flipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 40,
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
    backgroundColor: theme.colors.error,
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
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    marginBottom: 24,
    padding: 40,
  },
  webCameraText: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
    fontFamily: 'Inter-SemiBold',
  },
  webCameraButton: {
    borderColor: theme.colors.primary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    marginBottom: 24,
    padding: 40,
  },
  permissionText: {
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginVertical: 24,
    fontFamily: 'Inter-Regular',
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
  videoPreviewContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  videoPreview: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
  },
  mockVideoPreview: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  mockVideoText: {
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
  },
  videoPreviewOverlay: {
    position: 'absolute',
    top: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 16,
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
    gap: 24,
  },
  backButton: {
    flex: 1,
    borderColor: theme.colors.outline,
    borderRadius: 12,
  },
  skipButton: {
    flex: 2,
    backgroundColor: theme.colors.onSurfaceVariant,
    borderRadius: 12,
  },
  continueButton: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
  reviewContainer: {
    flex: 1,
    padding: 24,
  },
  reviewCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  reviewContent: {
    padding: 32,
  },
  reviewTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 32,
    fontFamily: 'Inter-Bold',
  },
  reviewSection: {
    marginBottom: 32,
  },
  reviewSectionTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  reviewText: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 24,
  },
  submitButton: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
});