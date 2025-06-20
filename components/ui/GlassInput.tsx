import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, borderRadius, spacing } from '@/lib/design-tokens';

interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'standard' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export function GlassInput({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'standard',
  size = 'md',
  containerStyle,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
  ...textInputProps
}: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(colors.glass.border);
  const borderWidth = useSharedValue(1);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    borderWidth: borderWidth.value,
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming(error ? colors.error[500] : colors.primary[600]);
    borderWidth.value = withTiming(2);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(error ? colors.error[500] : colors.glass.border);
    borderWidth.value = withTiming(1);
    onBlur?.(e);
  };

  const getInputHeight = () => {
    switch (size) {
      case 'sm': return 36;
      case 'md': return 44;
      case 'lg': return 52;
      default: return 44;
    }
  };

  const getInputStyle = () => {
    const baseStyle = {
      ...styles.input,
      height: getInputHeight(),
      fontSize: typography.fontSize.base,
      color: colors.neutral[800],
    };

    if (variant === 'filled') {
      return {
        ...baseStyle,
        backgroundColor: colors.glass.light,
      };
    }

    return baseStyle;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <Animated.View style={[styles.inputContainer, animatedBorderStyle]}>
        <BlurView intensity={15} tint="light" style={styles.blurView}>
          <View style={styles.inputWrapper}>
            {leftIcon && (
              <View style={styles.leftIcon}>{leftIcon}</View>
            )}
            
            <TextInput
              {...textInputProps}
              style={[getInputStyle(), inputStyle]}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholderTextColor={colors.neutral[400]}
            />
            
            {rightIcon && (
              <View style={styles.rightIcon}>{rightIcon}</View>
            )}
          </View>
        </BlurView>
      </Animated.View>

      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.primary,
  },
  labelError: {
    color: colors.error[500],
  },
  inputContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.glass.light,
  },
  blurView: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.base,
    color: colors.neutral[800],
    paddingVertical: 0, // Remove default padding
  },
  leftIcon: {
    marginRight: spacing.md,
  },
  rightIcon: {
    marginLeft: spacing.md,
  },
  helperText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.secondary,
  },
  errorText: {
    color: colors.error[500],
  },
});