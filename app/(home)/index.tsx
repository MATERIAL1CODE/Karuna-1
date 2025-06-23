import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ImageBackground,
} from 'react-native';
import {
  Text,
} from 'react-native-paper';
import { router } from 'expo-router';
import { Heart, Users, MapPin } from 'lucide-react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, borderRadius } from '@/lib/design-tokens';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomePage() {
  const citizenCardScale = useSharedValue(1);
  const facilitatorCardScale = useSharedValue(1);

  const citizenCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: citizenCardScale.value }],
  }));

  const facilitatorCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: facilitatorCardScale.value }],
  }));

  const handleCitizenPress = () => {
    citizenCardScale.value = withSpring(0.95, {}, () => {
      citizenCardScale.value = withSpring(1);
    });
    router.push('/(citizen)');
  };

  const handleFacilitatorPress = () => {
    facilitatorCardScale.value = withSpring(0.95, {}, () => {
      facilitatorCardScale.value = withSpring(1);
    });
    router.push('/(facilitator)');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
      style={styles.backgroundImage}
      blurRadius={6}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.welcomeSection}>
              <View style={styles.iconContainer}>
                <Heart size={48} color={colors.primary[600]} />
              </View>
              <Text variant="displayMedium" style={styles.title}>
                Welcome to Impact
              </Text>
              <Text variant="headlineSmall" style={styles.subtitle}>
                Making a Difference Together
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                Choose how you'd like to make a difference today
              </Text>
            </View>
          </View>

          <View style={styles.roleCards}>
            <AnimatedPressable onPress={handleCitizenPress} style={citizenCardAnimatedStyle}>
              <GlassCard variant="elevated" style={styles.citizenCard}>
                <View style={styles.cardIcon}>
                  <MapPin size={40} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Citizen Mode
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Report people in need and donate surplus resources to help your community
                </Text>
                <View style={styles.features}>
                  <Text style={styles.feature}>• Report people in need</Text>
                  <Text style={styles.feature}>• Donate food & resources</Text>
                  <Text style={styles.feature}>• Track your impact</Text>
                </View>
              </GlassCard>
            </AnimatedPressable>

            <AnimatedPressable onPress={handleFacilitatorPress} style={facilitatorCardAnimatedStyle}>
              <GlassCard variant="elevated" style={styles.facilitatorCard}>
                <View style={styles.cardIcon}>
                  <Users size={40} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  Facilitator Mode
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Accept delivery missions and coordinate aid efforts to help those in need
                </Text>
                <View style={styles.features}>
                  <Text style={styles.feature}>• Accept delivery missions</Text>
                  <Text style={styles.feature}>• Coordinate aid efforts</Text>
                  <Text style={styles.feature}>• Make direct impact</Text>
                </View>
              </GlassCard>
            </AnimatedPressable>
          </View>

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              Start making a positive impact in your community today
            </Text>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing['3xl'],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['6xl'],
  },
  welcomeSection: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius['3xl'],
    padding: spacing['2xl'],
    marginBottom: spacing['3xl'],
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  title: {
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.md,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: colors.primary[300],
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  roleCards: {
    gap: spacing['3xl'],
    marginBottom: spacing['4xl'],
  },
  citizenCard: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderColor: 'rgba(79, 70, 229, 0.3)',
    borderWidth: 1,
  },
  facilitatorCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
  },
  cardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius['3xl'],
    padding: spacing['2xl'],
    marginBottom: spacing['2xl'],
    alignSelf: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing['2xl'],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  features: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  feature: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});