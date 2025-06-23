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
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['7xl'],
      lineHeight: typography.lineHeight['7xl'],
      fontWeight: typography.fontWeight.extrabold,
    },
    displayMedium: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['6xl'],
      lineHeight: typography.lineHeight['6xl'],
      fontWeight: typography.fontWeight.extrabold,
    },
    displaySmall: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['5xl'],
      lineHeight: typography.lineHeight['5xl'],
      fontWeight: typography.fontWeight.extrabold,
    },
    headlineLarge: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['4xl'],
      lineHeight: typography.lineHeight['4xl'],
      fontWeight: typography.fontWeight.semibold,
    },
    headlineMedium: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['3xl'],
      lineHeight: typography.lineHeight['3xl'],
      fontWeight: typography.fontWeight.semibold,
    },
    headlineSmall: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize['2xl'],
      lineHeight: typography.lineHeight['2xl'],
      fontWeight: typography.fontWeight.semibold,
    },
    titleLarge: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.xl,
      lineHeight: typography.lineHeight.xl,
      fontWeight: typography.fontWeight.medium,
    },
    titleMedium: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.lg,
      fontWeight: typography.fontWeight.medium,
    },
    titleSmall: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.base,
      fontWeight: typography.fontWeight.medium,
    },
    bodyLarge: {
      fontFamily: typography.fontFamily.secondary,
      fontSize: typography.fontSize.lg,
      lineHeight: typography.lineHeight.lg,
      fontWeight: typography.fontWeight.regular,
    },
    bodyMedium: {
      fontFamily: typography.fontFamily.secondary,
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.base,
      fontWeight: typography.fontWeight.regular,
    },
    bodySmall: {
      fontFamily: typography.fontFamily.secondary,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.sm,
      fontWeight: typography.fontWeight.regular,
    },
    labelLarge: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.base,
      fontWeight: typography.fontWeight.medium,
    },
    labelMedium: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.sm,
      fontWeight: typography.fontWeight.medium,
    },
    labelSmall: {
      fontFamily: typography.fontFamily.primary,
      fontSize: typography.fontSize.xs,
      lineHeight: typography.lineHeight.xs,
      fontWeight: typography.fontWeight.medium,
    },
  },
  roundness: borderRadius.xl,
};

// Extended theme with design tokens
export const extendedTheme = {
  ...theme,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
    '7xl': 80,
    '8xl': 96,
  },
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  shadows: {
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#1F2937',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 12,
    },
  },
};

export type ExtendedTheme = typeof extendedTheme;