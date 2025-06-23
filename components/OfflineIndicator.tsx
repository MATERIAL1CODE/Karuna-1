import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WifiOff, Wifi } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Check initial state
      setIsOnline(navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  useEffect(() => {
    if (!isOnline) {
      // Show offline indicator
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      // Hide offline indicator
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOnline]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.content}>
        <WifiOff size={20} color="#FFFFFF" />
        <Text style={styles.text}>No internet connection</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EF4444',
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // Account for status bar
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});