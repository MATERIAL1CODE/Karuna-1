import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ImageBackground,
} from 'react-native';
import {
  Text,
  Appbar,
} from 'react-native-paper';
import { Bell, MapPin, Gift, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import ReportNeedModal from '@/components/ReportNeedModal';
import MakeDonationModal from '@/components/MakeDonationModal';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, borderRadius } from '@/lib/design-tokens';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CitizenDashboard() {
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

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
      style={styles.backgroundImage}
      blurRadius={6}
    >
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.header} elevated={false}>
          <Appbar.Action 
            icon={() => <ArrowLeft size={24} color="#FFFFFF" />} 
            onPress={() => router.replace('/(home)')} 
          />
          <View style={styles.headerContent}>
            <Text variant="headlineSmall" style={styles.welcomeText}>
              Hello, Friend! 👋
            </Text>
          </View>
          <Appbar.Action 
            icon={() => <Bell size={24} color="#FFFFFF" />} 
            onPress={() => {}} 
          />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.titleSection}>
            <Text variant="displaySmall" style={styles.mainTitle}>
              How would you like to help today?
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Every small act of kindness makes a big difference
            </Text>
          </View>

          <View style={styles.actionCards}>
            <AnimatedPressable onPress={handleReportPress} style={reportCardAnimatedStyle}>
              <GlassCard variant="elevated" style={styles.reportCard}>
                <View style={styles.iconContainer}>
                  <MapPin size={40} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Report a Need
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  See someone who needs help? Let us know their location and we'll coordinate assistance.
                </Text>
              </GlassCard>
            </AnimatedPressable>

            <AnimatedPressable onPress={handleDonationPress} style={donationCardAnimatedStyle}>
              <GlassCard variant="elevated" style={styles.donationCard}>
                <View style={styles.iconContainer}>
                  <Gift size={40} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Make a Donation
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Have surplus food or resources? Connect with those who need it most.
                </Text>
              </GlassCard>
            </AnimatedPressable>
          </View>

          <View style={styles.statsSection}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Community Impact
            </Text>
            
            <View style={styles.statsGrid}>
              <GlassCard variant="standard" style={styles.statCard}>
                <Text variant="displaySmall" style={styles.statNumber}>
                  1,247
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  People Helped
                </Text>
              </GlassCard>

              <GlassCard variant="standard" style={styles.statCard}>
                <Text variant="displaySmall" style={styles.statNumber}>
                  89
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Active Volunteers
                </Text>
              </GlassCard>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flex: 1,
    paddingLeft: spacing.lg,
  },
  welcomeText: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    padding: spacing['3xl'],
  },
  titleSection: {
    marginBottom: spacing['4xl'],
    alignItems: 'center',
  },
  mainTitle: {
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 36,
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionCards: {
    gap: spacing['2xl'],
    marginBottom: spacing['5xl'],
  },
  reportCard: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderColor: 'rgba(79, 70, 229, 0.3)',
    borderWidth: 1,
    alignItems: 'center',
  },
  donationCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius['3xl'],
    padding: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing['2xl'],
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  statNumber: {
    fontWeight: '800',
    color: colors.primary[600],
    marginBottom: spacing.md,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    color: colors.neutral[600],
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
});