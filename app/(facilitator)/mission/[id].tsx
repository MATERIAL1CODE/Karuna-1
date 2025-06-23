import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import {
  Text,
  Button,
  Appbar,
  Card,
  Chip,
  IconButton,
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { MapPin, User, Clock, Phone, TriangleAlert as AlertTriangle, Video as VideoIcon, X, Play, CreditCard as Edit3, Send } from 'lucide-react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/design-tokens';
import ReportIssueModal from '@/components/ReportIssueModal';
import { useData } from '@/contexts/DataContext';

type MissionState = 'accepted' | 'enRoutePickup' | 'arrivedPickup' | 'enRouteDelivery' | 'arrivedDelivery' | 'completed';

// Mock mission data with video
const mockMissionData = {
  id: '1',
  title: 'Food for 4 People',
  videoUri: Platform.OS === 'web' ? null : 'mock-video-uri',
  videoDuration: 12,
  hasVideo: true,
};

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { completeMission } = useData();
  const [missionState, setMissionState] = useState<MissionState>('accepted');
  const [reportIssueVisible, setReportIssueVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [thankYouModalVisible, setThankYouModalVisible] = useState(false);
  const [thankYouStory, setThankYouStory] = useState('');
  const [peopleHelped, setPeopleHelped] = useState('4');

  // Video player for modal
  const player = useVideoPlayer(mockMissionData.videoUri || '', (player) => {
    player.loop = true;
    player.muted = false;
  });

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
        return 'Delivery confirmed. Ready to complete mission and write thank you story.';
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
        setThankYouModalVisible(true);
        break;
    }
  };

  const handleVideoPress = () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Video Context',
        'This would show the video recorded by the citizen to provide context about the situation. Video playback is available on mobile devices.',
        [{ text: 'OK' }]
      );
    } else {
      setVideoModalVisible(true);
    }
  };

  const handleSubmitThankYouStory = () => {
    if (!thankYouStory.trim()) {
      Alert.alert('Error', 'Please write a thank you story before completing the mission.');
      return;
    }

    if (!peopleHelped || parseInt(peopleHelped) <= 0) {
      Alert.alert('Error', 'Please enter the number of people helped.');
      return;
    }

    // Complete the mission with the thank you story
    completeMission(id as string, thankYouStory, parseInt(peopleHelped));
    
    setMissionState('completed');
    setThankYouModalVisible(false);
    
    Alert.alert(
      'Mission Completed!',
      'Thank you for your service! Your thank you story has been sent to the donor/reporter.',
      [{ text: 'Return to Dashboard', onPress: () => router.back() }]
    );
  };

  const ThankYouStoryModal = () => (
    <Modal
      visible={thankYouModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setThankYouModalVisible(false)}
    >
      <View style={styles.thankYouModal}>
        <View style={styles.thankYouModalHeader}>
          <Text variant="titleLarge" style={styles.thankYouModalTitle}>
            Write Thank You Story
          </Text>
          <IconButton
            icon={() => <X size={24} color={colors.neutral[800]} />}
            onPress={() => setThankYouModalVisible(false)}
          />
        </View>
        
        <ScrollView style={styles.thankYouModalContent}>
          <Text variant="bodyMedium" style={styles.thankYouModalDescription}>
            Share the impact of this mission with the donor/reporter. Your personal story will help them understand how their kindness made a difference.
          </Text>
          
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.inputLabel}>
              Number of People Helped *
            </Text>
            <TextInput
              style={styles.numberInput}
              value={peopleHelped}
              onChangeText={setPeopleHelped}
              keyboardType="numeric"
              placeholder="Enter number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.inputLabel}>
              Your Thank You Story *
            </Text>
            <Text variant="bodySmall" style={styles.inputHint}>
              Describe what you witnessed, how the people reacted, and the impact of this donation/report. Be personal and authentic.
            </Text>
            <TextInput
              style={styles.storyInput}
              value={thankYouStory}
              onChangeText={setThankYouStory}
              multiline
              numberOfLines={10}
              placeholder="Dear Generous Donor/Compassionate Reporter,

I had the privilege of delivering your help today, and I wanted to share what I witnessed...

(Describe the situation, the people's reaction, and the impact)"
              textAlignVertical="top"
            />
          </View>

          <View style={styles.storyTips}>
            <Text variant="titleSmall" style={styles.tipsTitle}>
              💡 Writing Tips:
            </Text>
            <Text variant="bodySmall" style={styles.tipText}>
              • Be specific about what you saw and experienced
            </Text>
            <Text variant="bodySmall" style={styles.tipText}>
              • Mention how the people reacted to receiving help
            </Text>
            <Text variant="bodySmall" style={styles.tipText}>
              • Share any meaningful moments or conversations
            </Text>
            <Text variant="bodySmall" style={styles.tipText}>
              • Express gratitude on behalf of those helped
            </Text>
          </View>
        </ScrollView>

        <View style={styles.thankYouModalActions}>
          <Button
            mode="outlined"
            onPress={() => setThankYouModalVisible(false)}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmitThankYouStory}
            style={styles.submitStoryButton}
            icon={() => <Send size={20} color="#FFFFFF" />}
          >
            Complete Mission
          </Button>
        </View>
      </View>
    </Modal>
  );

  const VideoModal = () => (
    <Modal
      visible={videoModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setVideoModalVisible(false)}
    >
      <View style={styles.videoModal}>
        <View style={styles.videoModalHeader}>
          <Text variant="titleLarge" style={styles.videoModalTitle}>
            Video Context
          </Text>
          <IconButton
            icon={() => <X size={24} color={colors.neutral[800]} />}
            onPress={() => setVideoModalVisible(false)}
          />
        </View>
        
        <View style={styles.videoModalContent}>
          <Text variant="bodyMedium" style={styles.videoModalDescription}>
            This video was recorded by the citizen to provide visual context about the situation.
          </Text>
          
          {Platform.OS === 'web' ? (
            <View style={styles.mockVideoPlayer}>
              <Play size={48} color={colors.primary[600]} />
              <Text variant="bodyMedium" style={styles.mockVideoText}>
                Video Player ({mockMissionData.videoDuration}s)
              </Text>
            </View>
          ) : (
            <VideoView
              style={styles.videoPlayer}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          )}
          
          <Text variant="bodySmall" style={styles.videoPrivacyNote}>
            🔒 This video is securely encrypted and only visible to you as the assigned facilitator.
          </Text>
        </View>
      </View>
    </Modal>
  );

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
            <View style={styles.stateHeader}>
              <Text variant="titleLarge" style={styles.stateTitle}>
                {mockMissionData.title}
              </Text>
              {mockMissionData.hasVideo && (
                <Button
                  mode="outlined"
                  onPress={handleVideoPress}
                  style={styles.videoButton}
                  contentStyle={styles.videoButtonContent}
                  icon={() => <VideoIcon size={20} color={colors.primary[600]} />}
                >
                  View Context
                </Button>
              )}
            </View>
            <Text variant="bodyMedium" style={styles.stateDescription}>
              {getStateDescription()}
            </Text>
            {mockMissionData.hasVideo && (
              <View style={styles.videoIndicator}>
                <VideoIcon size={16} color={colors.success[500]} />
                <Text variant="bodySmall" style={styles.videoIndicatorText}>
                  Video context available ({mockMissionData.videoDuration}s)
                </Text>
              </View>
            )}
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

        {/* Thank You Story Reminder for arrivedDelivery state */}
        {missionState === 'arrivedDelivery' && (
          <Card style={styles.storyReminderCard} mode="elevated">
            <Card.Content style={styles.storyReminderContent}>
              <View style={styles.storyReminderHeader}>
                <Edit3 size={24} color={colors.primary[600]} />
                <Text variant="titleMedium" style={styles.storyReminderTitle}>
                  Ready to Complete Mission
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.storyReminderText}>
                After completing the delivery, you'll write a personal thank you story to share with the donor/reporter. This helps them understand the real impact of their kindness.
              </Text>
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

      <VideoModal />
      <ThankYouStoryModal />
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
    paddingBottom: spacing['8xl'],
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
  stateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  stateTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[800],
    flex: 1,
    marginRight: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  videoButton: {
    borderColor: colors.primary[600],
    borderRadius: borderRadius.lg,
  },
  videoButtonContent: {
    paddingVertical: spacing.md,
  },
  stateDescription: {
    color: colors.primary[700],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Regular',
  },
  videoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.success[50],
    padding: spacing['2xl'],
    borderRadius: borderRadius.lg,
  },
  videoIndicatorText: {
    color: colors.success[700],
    fontWeight: typography.fontWeight.medium,
    fontFamily: 'Inter-Medium',
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
    fontSize: 18,
  },
  addressText: {
    color: colors.neutral[500],
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  storyReminderCard: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  storyReminderContent: {
    padding: spacing['3xl'],
  },
  storyReminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  storyReminderTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[800],
    fontFamily: 'Inter-Bold',
  },
  storyReminderText: {
    color: colors.primary[700],
    lineHeight: 22,
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
  thankYouModal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  thankYouModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing['3xl'],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  thankYouModalTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  thankYouModalContent: {
    flex: 1,
    padding: spacing['3xl'],
  },
  thankYouModalDescription: {
    color: colors.neutral[600],
    marginBottom: spacing['3xl'],
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  inputGroup: {
    marginBottom: spacing['3xl'],
  },
  inputLabel: {
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Inter-SemiBold',
  },
  inputHint: {
    color: colors.neutral[500],
    marginBottom: spacing['2xl'],
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: colors.surface,
  },
  storyInput: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: colors.surface,
    minHeight: 200,
  },
  storyTips: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    padding: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  tipsTitle: {
    color: colors.primary[800],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing['2xl'],
    fontFamily: 'Inter-Bold',
  },
  tipText: {
    color: colors.primary[700],
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Regular',
  },
  thankYouModalActions: {
    flexDirection: 'row',
    gap: spacing['2xl'],
    padding: spacing['3xl'],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
  },
  submitStoryButton: {
    flex: 2,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
  },
  videoModal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing['3xl'],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  videoModalTitle: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    fontFamily: 'Inter-Bold',
  },
  videoModalContent: {
    flex: 1,
    padding: spacing['3xl'],
    gap: spacing['3xl'],
  },
  videoModalDescription: {
    color: colors.neutral[600],
    fontFamily: 'Inter-Regular',
  },
  videoPlayer: {
    flex: 1,
    backgroundColor: colors.neutral[900],
    borderRadius: borderRadius.lg,
  },
  mockVideoPlayer: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['2xl'],
  },
  mockVideoText: {
    color: colors.neutral[800],
    fontFamily: 'Inter-Regular',
  },
  videoPrivacyNote: {
    color: colors.success[600],
    backgroundColor: colors.success[50],
    padding: spacing['2xl'],
    borderRadius: borderRadius.lg,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});