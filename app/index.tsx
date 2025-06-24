import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="bodyLarge">Loading...</Text>
      </View>
    );
  }

  // If no user, redirect to auth screen
  if (!user) {
    return <Redirect href="/auth" />;
  }

  // Redirect based on user role - DIRECT navigation without intermediate screens
  if (user.role === 'citizen') {
    return <Redirect href="/(citizen)/(tabs)/home" />;
  } else if (user.role === 'facilitator') {
    return <Redirect href="/(facilitator)" />;
  }

  // Fallback - redirect to auth if role is undefined
  return <Redirect href="/auth" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});