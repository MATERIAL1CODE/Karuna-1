import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import {
  Text,
  useTheme,
} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const { width, height } = Dimensions.get('window');

export default function LoadingOverlay({ 
  isVisible, 
  message = "Crafting your thank you story..." 
}: LoadingOverlayProps) {
  const theme = useTheme();
  const pulseAnimation = useSharedValue(1);
  const rotateAnimation = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      // Pulse animation for the heart
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );

      // Gentle rotation animation
      rotateAnimation.value = withRepeat(
        withTiming(360, { duration: 3000 }),
        -1,
        false
      );
    }
  }, [isVisible]);

  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pulseAnimation.value },
        { rotate: `${rotateAnimation.value}deg` },
      ],
    };
  });

  const styles = createStyles(theme);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Animated.View style={[styles.iconContainer, heartAnimatedStyle]}>
            <Heart size={48} color={theme.colors.primary} fill={theme.colors.primary} />
          </Animated.View>
          
          <Text variant="headlineSmall" style={styles.title}>
            Creating Your Story
          </Text>
          
          <Text variant="bodyLarge" style={styles.message}>
            {message}
          </Text>
          
          <View style={styles.dotsContainer}>
            <LoadingDot delay={0} />
            <LoadingDot delay={200} />
            <LoadingDot delay={400} />
          </View>
          
          <Text variant="bodySmall" style={styles.subtitle}>
            This may take a few moments...
          </Text>
        </View>
      </View>
    </Modal>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const theme = useTheme();
  const dotAnimation = useSharedValue(0.3);

  useEffect(() => {
    const timer = setTimeout(() => {
      dotAnimation.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const dotAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: dotAnimation.value,
    };
  });

  return (
    <Animated.View 
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.colors.primary,
          marginHorizontal: 4,
        },
        dotAnimatedStyle
      ]} 
    />
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 48,
    alignItems: 'center',
    maxWidth: width * 0.85,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  iconContainer: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  message: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
});