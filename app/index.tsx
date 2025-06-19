import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    console.log('🔄 Index: Auth state check', {
      loading,
      hasSession: !!session,
      hasProfile: !!profile,
      profileRole: profile?.role,
    });

    // Only navigate when we're not loading
    if (!loading) {
      if (session && profile) {
        console.log('✅ Index: User authenticated, navigating to dashboard');
        if (profile.role === 'citizen') {
          router.replace('/(citizen)');
        } else if (profile.role === 'facilitator') {
          router.replace('/(facilitator)');
        } else {
          console.log('❓ Index: Unknown role, going to login');
          router.replace('/(auth)/login');
        }
      } else {
        console.log('🔄 Index: No auth, going to login');
        router.replace('/(auth)/login');
      }
    }
  }, [loading, session, profile]);

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