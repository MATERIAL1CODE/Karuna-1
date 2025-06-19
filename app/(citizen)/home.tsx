import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
} from 'react-native-paper';
import { Bell, MapPin, Gift } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import ReportNeedModal from '@/components/ReportNeedModal';
import MakeDonationModal from '@/components/MakeDonationModal';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';

const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function HomeScreen() {
  const { profile } = useAuth();
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [donationModalVisible, setDonationModalVisible] = useState(false);

  const reportCardScale = useSharedValue(1);
  const donationCardScale = useSharedValue(1);

  const reportCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reportCardScale.value }],
  }));

  const donationCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: donationCardScale.value }],
  }));

  const handleReportPress = () => {
    reportCardScale.value = withSpring(0.95, {}, () => {
      reportCardScale.value = withSpring(1);
    });
    setReportModalVisible(true);
  };

  const handleDonationPress = () => {
    donationCardScale.value = withSpring(0.95, {}, () => {
      donationCardScale.value = withSpring(1);
    });
    setDonationModalVisible(true);
  };

  const getUserName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    if (profile?.email) {
      return profile.email.split('@')[0];
    }
    return 'Friend';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header} elevated={false}>
        <View style={styles.headerContent}>
          <Text variant="headlineSmall" style={styles.welcomeText}>
            Hello, {getUserName()}! 👋
          </Text>
        </View>
        <Appbar.Action 
          icon={() => <Bell size={24} color="#6B7280" />} 
          onPress={() => {}} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text variant="headlineMedium" style={styles.mainTitle}>
            How would you like to help today?
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Every small act of kindness makes a big difference
          </Text>
        </View>

        <View style={styles.actionCards}>
          <Pressable onPress={handleReportPress}>
            <AnimatedCard style={[styles.actionCard, styles.reportCard, reportCardAnimatedStyle]} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <MapPin size={40} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Report a Need
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  See someone who needs help? Let us know their location.
                </Text>
              </Card.Content>
            </AnimatedCard>
          </Pressable>

          <Pressable onPress={handleDonationPress}>
            <AnimatedCard style={[styles.actionCard, styles.donationCard, donationCardAnimatedStyle]} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Gift size={40} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Make a Donation
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Have surplus food or resources? Connect with those who need it.
                </Text>
              </Card.Content>
            </AnimatedCard>
          </Pressable>
        </View>

        <View style={styles.statsSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Community Impact
          </Text>
          
          <View style={styles.statsGrid}>
            <Card style={styles.statCard} mode="contained">
              <Card.Content style={styles.statContent}>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  1,247
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  People Helped
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard} mode="contained">
              <Card.Content style={styles.statContent}>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  89
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active Volunteers
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>

      <ReportNeedModal 
        visible={reportModalVisible}
        onDismiss={() => setReportModalVisible(false)}
      />

      <MakeDonationModal 
        visible={donationModalVisible}
        onDismiss={() => setDonationModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#F8F9FA',
    elevation: 0,
    paddingHorizontal: 8,
  },
  headerContent: {
    flex: 1,
    paddingLeft: 16,
  },
  welcomeText: {
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  mainTitle: {
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  actionCards: {
    gap: 20,
    marginBottom: 40,
  },
  actionCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  reportCard: {
    backgroundColor: '#4F46E5',
  },
  donationCard: {
    backgroundColor: '#10B981',
  },
  cardContent: {
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  statContent: {
    alignItems: 'center',
    padding: 24,
  },
  statNumber: {
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 8,
  },
  statLabel: {
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});