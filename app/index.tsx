import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    console.log('Index useEffect - Loading:', loading, 'Session:', !!session, 'Profile:', profile?.role);
    
    if (!loading) {
      if (!session) {
        console.log('No session, redirecting to login');
        router.replace('/(auth)/login');
      } else if (profile) {
        if (profile.role === 'citizen') {
          console.log('Citizen user, redirecting to citizen dashboard');
          router.replace('/(citizen)');
        } else if (profile.role === 'facilitator') {
          console.log('Facilitator user, redirecting to facilitator dashboard');
          router.replace('/(facilitator)');
        } else {
          console.log('Unknown role, redirecting to login');
          router.replace('/(auth)/login');
        }
      } else {
        console.log('No profile found, redirecting to login');
        router.replace('/(auth)/login');
      }
    }
  }, [session, profile, loading]);

  // Show loading screen while determining auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text variant="bodyMedium" style={styles.loadingText}>
        Loading...
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
  },
});