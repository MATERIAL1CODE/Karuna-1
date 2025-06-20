import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
} from 'react-native-paper';
import { router } from 'expo-router';
import { Heart, Users, MapPin } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';

const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function RoleSelectionScreen() {
  const { session, profile, loading } = useAuth();
  const citizenCardScale = useSharedValue(1);
  const facilitatorCardScale = useSharedValue(1);

  const citizenCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: citizenCardScale.value }],
  }));

  const facilitatorCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: facilitatorCardScale.value }],
  }));

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (!loading && session && profile) {
      console.log('🔄 Index: Redirecting authenticated user to dashboard');
      if (profile.role === 'facilitator') {
        router.replace('/(facilitator)');
      } else {
        router.replace('/(citizen)');
      }
    }
  }, [loading, session, profile]);

  const handleCitizenPress = () => {
    citizenCardScale.value = withSpring(0.95, {}, () => {
      citizenCardScale.value = withSpring(1);
    });
    
    if (session) {
      router.push('/(citizen)');
    } else {
      router.push('/(auth)/signup');
    }
  };

  const handleFacilitatorPress = () => {
    facilitatorCardScale.value = withSpring(0.95, {}, () => {
      facilitatorCardScale.value = withSpring(1);
    });
    
    if (session) {
      router.push('/(facilitator)');
    } else {
      router.push('/(auth)/signup');
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Heart size={48} color="#4F46E5" />
          </View>
          <Text variant="headlineLarge" style={styles.title}>
            Welcome to Impact
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Choose how you'd like to make a difference in your community
          </Text>
          {!session && (
            <View style={styles.authPrompt}>
              <Text variant="bodyMedium" style={styles.authPromptText}>
                Sign up or sign in to get started
              </Text>
            </View>
          )}
        </View>

        <View style={styles.roleCards}>
          <Pressable onPress={handleCitizenPress}>
            <AnimatedCard style={[styles.roleCard, styles.citizenCard, citizenCardAnimatedStyle]} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardIcon}>
                  <MapPin size={40} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  I'm a Citizen
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Report people in need and donate surplus resources to help your community
                </Text>
                <View style={styles.features}>
                  <Text style={styles.feature}>• Report people in need</Text>
                  <Text style={styles.feature}>• Donate food & resources</Text>
                  <Text style={styles.feature}>• Track your impact</Text>
                </View>
              </Card.Content>
            </AnimatedCard>
          </Pressable>

          <Pressable onPress={handleFacilitatorPress}>
            <AnimatedCard style={[styles.roleCard, styles.facilitatorCard, facilitatorCardAnimatedStyle]} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardIcon}>
                  <Users size={40} color="#FFFFFF" />
                </View>
                <Text variant="headlineSmall" style={styles.cardTitle}>
                  I'm a Facilitator
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  Accept delivery missions and coordinate aid efforts to help those in need
                </Text>
                <View style={styles.features}>
                  <Text style={styles.feature}>• Accept delivery missions</Text>
                  <Text style={styles.feature}>• Coordinate aid efforts</Text>
                  <Text style={styles.feature}>• Make direct impact</Text>
                </View>
              </Card.Content>
            </AnimatedCard>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            You can switch roles anytime in the app settings
          </Text>
          {!session && (
            <View style={styles.authLinks}>
              <Text style={styles.authLinkText}>Already have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.authLink}>Sign in</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#64748B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    backgroundColor: '#EBF4FF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  authPrompt: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  authPromptText: {
    color: '#0369A1',
    textAlign: 'center',
    fontWeight: '500',
  },
  roleCards: {
    gap: 24,
    marginBottom: 32,
  },
  roleCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  citizenCard: {
    backgroundColor: '#4F46E5',
  },
  facilitatorCard: {
    backgroundColor: '#10B981',
  },
  cardContent: {
    padding: 32,
    alignItems: 'center',
  },
  cardIcon: {
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
    marginBottom: 20,
  },
  features: {
    alignItems: 'flex-start',
    gap: 8,
  },
  feature: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  footerText: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  authLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authLinkText: {
    color: '#64748B',
  },
  authLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});