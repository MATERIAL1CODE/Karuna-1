import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.replace('/(auth)/login');
      } else if (profile?.role === 'citizen') {
        router.replace('/(citizen)');
      } else if (profile?.role === 'facilitator') {
        router.replace('/(facilitator)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [session, profile, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}