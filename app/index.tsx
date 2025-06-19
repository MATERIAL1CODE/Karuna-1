import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    // Only navigate when we have complete auth state (not loading)
    if (!loading) {
      console.log('📱 Navigation check - Session:', !!session, 'Profile:', profile?.role);
      
      if (session && profile) {
        // We have both session and profile - navigate to appropriate dashboard
        if (profile.role === 'citizen') {
          console.log('🏠 Navigating to citizen dashboard');
          router.replace('/(citizen)');
        } else if (profile.role === 'facilitator') {
          console.log('🚀 Navigating to facilitator dashboard');
          router.replace('/(facilitator)');
        } else {
          console.log('❓ Unknown role, going to login');
          router.replace('/(auth)/login');
        }
      } else {
        // No session or profile - go to login
        console.log('🔄 No auth, going to login');
        router.replace('/(auth)/login');
      }
    }
  }, [loading, session, profile]);

  // Show loading screen while determining auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text variant="bodyMedium" style={styles.loadingText}>
        {loading ? 'Loading...' : 'Redirecting...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    gap: 16,
  },
  loadingText: {
    color: '#6B7280',
    fontWeight: '500',
  },
});