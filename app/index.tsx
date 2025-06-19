import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      console.log('Auth state:', { session: !!session, profile: profile?.role });
      
      if (!session) {
        console.log('No session, redirecting to login');
        router.replace('/(auth)/login');
      } else if (profile) {
        console.log('User authenticated, redirecting to main app');
        router.replace('/(tabs)');
      } else {
        console.log('No profile found, redirecting to login');
        router.replace('/(auth)/login');
      }
    }
  }, [session, profile, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
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
    backgroundColor: '#F8FAFC',
    gap: 16,
  },
  loadingText: {
    color: '#64748B',
  },
});