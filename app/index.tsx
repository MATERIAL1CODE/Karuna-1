import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { Heart } from 'lucide-react-native';

export default function IndexScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading screen while Clerk is initializing
  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.iconContainer}>
            <Heart size={48} color="#4F46E5" />
          </View>
          <ActivityIndicator size="large" color="#4F46E5" style={styles.spinner} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading Impact...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Redirect based on authentication status
  if (isSignedIn) {
    return <Redirect href="/(home)" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
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
    gap: 24,
  },
  iconContainer: {
    backgroundColor: '#EBF4FF',
    borderRadius: 24,
    padding: 20,
  },
  spinner: {
    marginVertical: 8,
  },
  loadingText: {
    color: '#64748B',
    fontWeight: '500',
  },
});