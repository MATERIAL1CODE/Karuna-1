import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { colors, borderRadius, spacing, shadows } from '@/lib/design-tokens';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'slide' | 'fade' | 'scale';
  backdropBlur?: boolean;
  style?: ViewStyle;
}

export function GlassModal({
  visible,
  onClose,
  children,
  animationType = 'scale',
  backdropBlur = true,
  style,
}: GlassModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(screenHeight);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      
      if (animationType === 'scale') {
        scale.value = withSpring(1, {
          damping: 20,
          stiffness: 300,
        });
      } else if (animationType === 'slide') {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      
      if (animationType === 'scale') {
        scale.value = withTiming(0, { duration: 200 });
      } else if (animationType === 'slide') {
        translateY.value = withTiming(screenHeight, { duration: 200 });
      }
    }
  }, [visible, animationType]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => {
    const baseStyle = {
      opacity: opacity.value,
    };

    if (animationType === 'scale') {
      return {
        ...baseStyle,
        transform: [{ scale: scale.value }],
      };
    } else if (animationType === 'slide') {
      return {
        ...baseStyle,
        transform: [{ translateY: translateY.value }],
      };
    }

    return baseStyle;
  });

  const handleBackdropPress = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          {backdropBlur ? (
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
              <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
            </BlurView>
          ) : (
            <Pressable 
              style={[StyleSheet.absoluteFill, styles.darkBackdrop]} 
              onPress={handleBackdropPress} 
            />
          )}
        </Animated.View>

        <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
          <View style={[styles.modalContent, style]}>
            <BlurView intensity={25} tint="light" style={styles.contentBlur}>
              <View style={styles.content}>
                {children}
              </View>
            </BlurView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  darkBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: screenWidth - spacing['4xl'],
    maxHeight: screenHeight - spacing['8xl'],
  },
  modalContent: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: colors.glass.medium,
    borderWidth: 1,
    borderColor: colors.glass.borderStrong,
    ...shadows.glass.medium,
  },
  contentBlur: {
    flex: 1,
  },
  content: {
    padding: spacing['3xl'],
  },
});