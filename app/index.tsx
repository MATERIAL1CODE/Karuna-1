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

  // Redirect based on user role
  if (user.role === 'citizen') {
    return <Redirect href="/(citizen)/(tabs)/home" />;
  } else if (user.role === 'facilitator') {
    return <Redirect href="/(facilitator)" />;
  }

  // Fallback for users without a defined role
  return (
    <View style={styles.errorContainer}>
      <Text variant="titleLarge">Error: User role not defined</Text>
      <Text variant="bodyMedium">Please contact support for assistance.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
});