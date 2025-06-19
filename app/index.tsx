import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    console.log('📱 Index useEffect - Loading:', loading, 'Session:', !!session, 'Profile:', profile?.role);
    
    // Only proceed with navigation when not loading
    if (!loading) {
      if (!session) {
        console.log('🔄 No session, redirecting to login');
        router.replace('/(auth)/login');
      } else if (session && profile) {
        if (profile.role === 'citizen') {
          console.log('🏠 Citizen user, redirecting to citizen dashboard');
          router.replace('/(citizen)');
        } else if (profile.role === 'facilitator') {
          console.log('🚀 Facilitator user, redirecting to facilitator dashboard');
          router.replace('/(facilitator)');
        } else {
          console.log('❓ Unknown role, redirecting to login');
          router.replace('/(auth)/login');
        }
      } else if (session && !profile) {
        console.log('⚠️ Session exists but no profile, waiting for profile creation...');
        // Give it a moment for profile creation, then redirect to login if still no profile
        setTimeout(() => {
          if (!profile) {
            console.log('❌ Profile creation failed, redirecting to login');
            router.replace('/(auth)/login');
          }
        }, 3000);
      }
    }
  }, [session, profile, loading]);

  // Show loading screen while determining auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text variant="bodyMedium" style={styles.loadingText}>
        {loading ? 'Loading...' : 'Redirecting...'}
      </Text>
      <Text variant="bodySmall" style={styles.debugText}>
        Session: {session ? '✅' : '❌'} | Profile: {profile ? `✅ (${profile.role})` : '❌'} | Loading: {loading ? '🔄' : '✅'}
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
  debugText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
});