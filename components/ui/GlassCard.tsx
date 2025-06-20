import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, glassmorphism, shadows } from '@/lib/design-tokens';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'standard' | 'elevated' | 'strong';
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export function GlassCard({ 
  children, 
  style, 
  variant = 'standard',
  intensity = 20,
  tint = 'light'
}: GlassCardProps) {
  const glassStyle = glassmorphism[variant];
  
  return (
    <View style={[styles.container, glassStyle, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={styles.blurView}
      >
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
});