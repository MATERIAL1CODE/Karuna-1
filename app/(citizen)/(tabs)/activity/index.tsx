import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
  Chip,
  useTheme,
} from 'react-native-paper';
import { router } from 'expo-router';
import { MapPin, Gift, ArrowLeft, Eye, Mail, Award } from 'lucide-react-native';

interface ActivityItem {
  id: string;
  type: 'report' | 'donation';
  title: string;
  subtitle: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  peopleHelped?: number;
  // New fields for AI-Powered Letter of Thanks
  aiGeneratedLetterSnippet?: string;
  fullAiGeneratedLetter?: string;
  blockchainTransactionLink?: string;
  ngoLogoUrl?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'report',
    title: 'Need Reported',
    subtitle: 'Location: Nehru Place Metro Station',
    status: 'in_progress',
    date: '2 hours ago',
    peopleHelped: 3,
  },
  {
    id: '2',
    type: 'donation',
    title: 'Donation Logged',
    subtitle: 'Item: 15 Cooked Meals',
    status: 'completed',
    date: '1 day ago',
    peopleHelped: 15,
    aiGeneratedLetterSnippet: '...a family of four didn\'t have to go to sleep hungry on a cold night.',
    fullAiGeneratedLetter: `Dear Community Member,

We wanted to share a small story with you. Because of the 15 cooked meals you donated, a family of four didn't have to go to sleep hungry on a cold night. Your kindness provided immediate comfort and nourishment when it was needed most.

It was a simple act for you, but for them, it provided real comfort and dignity. Your generosity was a tangible source of warmth and hope on what could have been a difficult evening.

The father, who works as a daily wage laborer, had not found work for three days. The mother, caring for two young children, was worried about how to feed her family. When our facilitator arrived with your donation, the relief and gratitude in their eyes was profound.

Your contribution didn't just fill empty stomachs—it restored their faith that there are people who care, people who understand that we are all connected in this journey of life.

From all of us at Sahayata, thank you for being the light in someone's darkness.

With heartfelt gratitude,
The Sahayata Team`,
    blockchainTransactionLink: 'https://polygonscan.com/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '3',
    type: 'report',
    title: 'Need Reported',
    subtitle: 'Location: Lajpat Nagar Market',
    status: 'completed',
    date: '2 days ago',
    peopleHelped: 5,
    aiGeneratedLetterSnippet: '...your vigilance and compassion helped five people find shelter and warmth.',
    fullAiGeneratedLetter: `Dear Compassionate Citizen,

Your report about the family near Lajpat Nagar Market led to something beautiful. Because you took the time to notice and care, five people—including three children—found shelter and warmth during the recent cold spell.

Your vigilance and compassion helped connect them with our local partner organization, who provided temporary accommodation and essential supplies. The children, ages 6, 8, and 12, are now safe and attending a nearby community center for daily meals and educational support.

Sometimes the smallest acts of awareness create the biggest ripples of change. Your report was that first ripple.

Thank you for seeing what others might have overlooked, and for caring enough to act.

With deep appreciation,
The Sahayata Team`,
    blockchainTransactionLink: 'https://polygonscan.com/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '4',
    type: 'donation',
    title: 'Donation Logged',
    subtitle: 'Item: 10 Blankets',
    status: 'pending',
    date: '3 days ago',
  },
  {
    id: '5',
    type: 'report',
    title: 'Need Reported',
    subtitle: 'Location: Saket District Centre',
    status: 'completed',
    date: '1 week ago',
    peopleHelped: 2,
    aiGeneratedLetterSnippet: '...an elderly couple found dignity and care in their time of need.',
    fullAiGeneratedLetter: `Dear Kind Soul,

Your report about the elderly couple near Saket District Centre touched our hearts, and we wanted you to know the beautiful outcome of your compassion.

The couple, married for 45 years, had been struggling after the husband's recent illness left them unable to work. Your alert led our team to connect them with medical assistance and ongoing support from our partner healthcare clinic.

Today, they are receiving regular medical care, nutritious meals, and most importantly, they know they are not forgotten. The wife mentioned that knowing someone cared enough to report their situation gave them hope when they had almost lost it.

Your awareness and action reminded them—and us—that humanity's greatest strength lies in how we care for one another.

With sincere gratitude,
The Sahayata Team`,
    blockchainTransactionLink: 'https://polygonscan.com/tx/0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    ngoLogoUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

interface ActivityItemCardProps {
  item: ActivityItem;
}

function ActivityItemCard({ item }: ActivityItemCardProps) {
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

  // Use Mail/Award icons for completed items with AI letters, otherwise use original icons
  const getIconComponent = () => {
    if (item.status === 'completed' && item.aiGeneratedLetterSnippet) {
      return item.type === 'report' ? Award : Mail;
    }
    return item.type === 'report' ? MapPin : Gift;
  };

  const IconComponent = getIconComponent();
  const iconColor = item.type === 'report' ? theme.colors.primary : theme.colors.success;
  const iconBgColor = item.type === 'report' ? theme.colors.primaryContainer : theme.colors.secondaryContainer;

  const getDisplaySubtitle = () => {
    // For completed items with AI letter snippet, show the snippet instead of original subtitle
    if (item.status === 'completed' && item.aiGeneratedLetterSnippet) {
      return item.aiGeneratedLetterSnippet;
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
    if (item.status === 'in_progress') {
      router.push(`/(citizen)/(tabs)/activity/live-mission-view/${item.id}`);
    } else if (item.status === 'completed' && item.fullAiGeneratedLetter) {
      router.push(`/(citizen)/(tabs)/activity/letter-of-thanks/${item.id}`);
    }
  };

  const handleViewStoryPress = () => {
    if (item.status === 'completed' && item.fullAiGeneratedLetter) {
      router.push(`/(citizen)/(tabs)/activity/letter-of-thanks/${item.id}`);
    }
  };

  const styles = createStyles(theme);

  return (
    <Pressable 
      onPress={handlePress} 
      disabled={item.status === 'pending' || (item.status === 'completed' && !item.fullAiGeneratedLetter)}
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
                item.status === 'completed' && item.aiGeneratedLetterSnippet && styles.letterSnippet
              ]}>
                {getDisplaySubtitle()}
              </Text>
              <View style={styles.bottomRow}>
                <Text variant="bodySmall" style={styles.activityDate}>
                  {item.date}
                </Text>
                {getHelpedText() && (
                  <View style={styles.helpedContainer}>
                    <Text variant="bodySmall" style={styles.helpedText}>
                      {getHelpedText()}
                    </Text>
                    {item.status === 'completed' && item.fullAiGeneratedLetter && (
                      <Pressable style={styles.viewStoryButton} onPress={handleViewStoryPress}>
                        <Text style={styles.viewStoryText}>Read Your Letter</Text>
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

export default function ActivityScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const renderActivity = ({ item }: { item: ActivityItem }) => (
    <ActivityItemCard item={item} />
  );

  const totalPeopleHelped = mockActivities
    .filter(item => item.status === 'completed' && item.peopleHelped)
    .reduce((sum, item) => sum + (item.peopleHelped || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <Appbar.Action 
          icon={() => <ArrowLeft size={24} color={theme.colors.onSurfaceVariant} />} 
          onPress={() => router.back()} 
        />
        <Appbar.Content title="My Stories" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Your Impact Library
          </Text>
          <Text variant="bodyMedium" style={styles.summaryText}>
            You've helped {totalPeopleHelped} people through your contributions. Each completed mission becomes a personal story of your kindness.
          </Text>
        </View>

        <FlatList
          data={mockActivities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Mail size={48} color={theme.colors.onSurfaceVariant} />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No stories yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Your reports and donations will create beautiful stories of impact here.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    elevation: 0,
  },
  headerTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  summaryTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  summaryText: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 40,
  },
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
  letterSnippet: {
    fontStyle: 'italic',
    color: theme.colors.primary,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 96,
  },
  emptyTitle: {
    color: theme.colors.onSurface,
    marginTop: 24,
    marginBottom: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});