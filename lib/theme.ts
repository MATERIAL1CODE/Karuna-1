import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors, typography, borderRadius } from './design-tokens';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Primary colors
    primary: colors.primary[600],
    primaryContainer: colors.primary[100],
    onPrimary: '#FFFFFF',
    onPrimaryContainer: colors.primary[900],
    
    // Secondary colors
    secondary: colors.success[500],
    secondaryContainer: colors.success[100],
    onSecondary: '#FFFFFF',
    onSecondaryContainer: colors.success[900],
    
    // Tertiary colors
    tertiary: colors.purple[500],
    tertiaryContainer: colors.purple[100],
    onTertiary: '#FFFFFF',
    onTertiaryContainer: colors.purple[900],
    
    // Surface colors
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onSurface: colors.onSurface,
    onSurfaceVariant: colors.onSurfaceVariant,
    
    // Background colors
    background: colors.background,
    onBackground: colors.onBackground,
    
    // Error colors
    error: colors.error[500],
    errorContainer: colors.error[100],
    onError: '#FFFFFF',
    onErrorContainer: colors.error[900],
    
    // Outline colors
    outline: colors.outline,
    outlineVariant: colors.outlineVariant,
    
    // Custom semantic colors
    success: colors.success[500],
    warning: colors.warning[500],
    info: colors.info[500],
  },
  fonts: {
    ...DefaultTheme.fonts,
    displayLarge: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['7xl'],
      lineHeight: typography.lineHeight['7xl'],
      fontWeight: typography.fontWeight.bold,
    },
    displayMedium: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['6xl'],
      lineHeight: typography.lineHeight['6xl'],
      fontWeight: typography.fontWeight.bold,
    },
    displaySmall: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['5xl'],
      lineHeight: typography.lineHeight['5xl'],
      fontWeight: typography.fontWeight.bold,
    },
    headlineLarge: {
      fontFamily: 'Inter-SemiBold',
      fontSize: typography.fontSize['4xl'],
      lineHeight: typography.lineHeight['4xl'],
      fontWeight: typography.fontWeight.semibold,
    },
    headlineMedium: {
      fontFamily: 'Inter-SemiBold',
      fontSize: typography.fontSize['3xl'],
      lineHeight: typography.lineHeight['3xl'],
      fontWeight: typography.fontWeight.semibold,
    },
    headlineSmall: {
      fontFamily: 'Inter-SemiBold',
      fontSize: typography.fontSize['2xl'],
      lineHeight: typography.lineHeight['2xl'],
      fontWeight: typography.fontWeight.semibold,
    },
    titleLarge: {
      fontFamily: 'Inter-Medium',
      fontSize: typography.fontSize.xl,
      lineHeight: typography.lineHeight.xl,
      fontWeight: typography.fontWeight.medium,
    },
    titleMedium: {
      fontFamily: 'Inter-Medium',
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.lg,
      fontWeight: typography.fontWeight.medium,
    },
    titleSmall: {
      fontFamily: 'Inter-Medium',
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.base,
      fontWeight: typography.fontWeight.medium,
    },
    bodyLarge: {
      fontFamily: 'Inter-Regular',
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.lg,
      fontWeight: typography.fontWeight.regular,
    },
    bodyMedium: {
      fontFamily: 'Inter-Regular',
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.base,
      fontWeight: typography.fontWeight.regular,
    },
    bodySmall: {
      fontFamily: 'Inter-Regular',
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.sm,
      fontWeight: typography.fontWeight.regular,
    },
    labelLarge: {
      fontFamily: 'Inter-Medium',
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.base,
      fontWeight: typography.fontWeight.medium,
    },
    labelMedium: {
      fontFamily: 'Inter-Medium',
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.sm,
      fontWeight: typography.fontWeight.medium,
    },
    labelSmall: {
      fontFamily: 'Inter-Medium',
      fontSize: typography.fontSize.xs,
      lineHeight: typography.lineHeight.xs,
      fontWeight: typography.fontWeight.medium,
    },
  },
  roundness: borderRadius.xl,
};