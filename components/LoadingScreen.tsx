import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Heart } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';

export default function LoadingScreen() {
  const theme = useTheme();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Heart size={48} color={theme.colors.primary} />
      </Animated.View>
      <Text variant="headlineSmall" style={styles.title}>
        Karuna
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Loading your experience...
      </Text>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  logoContainer: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
});