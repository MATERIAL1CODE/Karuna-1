import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  useTheme,
} from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Gift, Eye, Mail, Award, User } from 'lucide-react-native';
import { ActivityItem } from '@/contexts/DataContext';

interface ActivityCardProps {
  item: ActivityItem;
  onPress?: () => void;
}

export default function ActivityCard({ item, onPress }: ActivityCardProps) {
  const theme = useTheme();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'in_progress':
        return theme.colors.warning;
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
      default:
        return 'Pending';
    }
  };

  // Use Mail/Award icons for completed items with facilitator stories, otherwise use original icons
  const getIconComponent = () => {
    if (item.status === 'completed' && item.fullFacilitatorStory) {
      return item.type === 'report' ? Award : Mail;
    }
    return item.type === 'report' ? MapPin : Gift;
  };

  const IconComponent = getIconComponent();
  const iconColor = item.type === 'report' ? theme.colors.primary : theme.colors.success;
  const iconBgColor = item.type === 'report' ? theme.colors.primaryContainer : theme.colors.secondaryContainer;

  const getDisplaySubtitle = () => {
    // For completed items with facilitator story snippet, show the snippet instead of original subtitle
    if (item.status === 'completed' && item.facilitatorStorySnippet) {
      return item.facilitatorStorySnippet;
    }
    return item.subtitle;
  };

  const getHelpedText = () => {
    if (item.status === 'completed' && item.peopleHelped) {
      if (item.type === 'report') {
        return `Your report led to aid for ${item.peopleHelped} people.`;
      }
      return `${item.peopleHelped} people helped`;
    }
    return null;
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (item.status === 'in_progress') {
      router.push(`/(citizen)/(tabs)/activity/live-mission-view/${item.id}`);
    } else if (item.status === 'completed' && item.fullFacilitatorStory) {
      router.push(`/(citizen)/(tabs)/activity/letter-of-thanks/${item.id}`);
    }
  };

  const handleViewStoryPress = () => {
    if (item.status === 'completed' && item.fullFacilitatorStory) {
      router.push(`/(citizen)/(tabs)/activity/letter-of-thanks/${item.id}`);
    }
  };

  const styles = createStyles(theme);

  return (
    <Pressable 
      onPress={handlePress} 
      disabled={item.status === 'pending' || (item.status === 'completed' && !item.fullFacilitatorStory)}
    >
      <Card style={styles.activityCard} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
              <IconComponent size={24} color={iconColor} />
            </View>
            <View style={styles.activityInfo}>
              <View style={styles.titleRow}>
                <Text variant="titleMedium" style={styles.activityTitle}>
                  {item.title}
                </Text>
                <View style={styles.statusContainer}>
                  <Chip
                    style={[
                      styles.statusChip,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                    textStyle={styles.statusText}
                  >
                    {getStatusText(item.status)}
                  </Chip>
                  {item.status === 'in_progress' && (
                    <View style={styles.liveIndicator}>
                      <Eye size={16} color={theme.colors.primary} />
                      <Text variant="bodySmall" style={styles.liveText}>
                        Track Live
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Text variant="bodyMedium" style={[
                styles.activitySubtitle,
                item.status === 'completed' && item.facilitatorStorySnippet && styles.storySnippet
              ]}>
                {getDisplaySubtitle()}
              </Text>
              
              {/* Show facilitator info for completed items */}
              {item.status === 'completed' && item.facilitatorName && (
                <View style={styles.facilitatorInfo}>
                  <User size={14} color={theme.colors.onSurfaceVariant} />
                  <Text variant="bodySmall" style={styles.facilitatorText}>
                    Facilitated by {item.facilitatorName}
                  </Text>
                </View>
              )}

              <View style={styles.bottomRow}>
                <Text variant="bodySmall" style={styles.activityDate}>
                  {item.date}
                </Text>
                {getHelpedText() && (
                  <View style={styles.helpedContainer}>
                    <Text variant="bodySmall" style={styles.helpedText}>
                      {getHelpedText()}
                    </Text>
                    {item.status === 'completed' && item.fullFacilitatorStory && (
                      <Pressable style={styles.viewStoryButton} onPress={handleViewStoryPress}>
                        <Text style={styles.viewStoryText}>Read Thank You Letter</Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  activityCard: {
    marginBottom: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardContent: {
    padding: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  iconContainer: {
    borderRadius: 12,
    padding: 24,
  },
  activityInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 16,
  },
  activitySubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  storySnippet: {
    fontStyle: 'italic',
    color: theme.colors.primary,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  facilitatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  facilitatorText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  bottomRow: {
    flexDirection: 'column',
    gap: 16,
  },
  activityDate: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  helpedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpedText: {
    color: theme.colors.success,
    fontWeight: '600',
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  viewStoryButton: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  viewStoryText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  liveText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});