import { MD3LightTheme } from 'react-native-paper';
import { typography, borderRadius } from './design-tokens';

// Light Theme Colors
const lightColors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  purple: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  
  neutral: {
    50: '#F9FAFB',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#6B7280',
    600: '#475569',
    700: '#334155',
    800: '#1F2937',
    900: '#0F172A',
  },
  
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F8F9FA',
  onBackground: '#1F2937',
  onSurface: '#1F2937',
  onSurfaceVariant: '#6B7280',
  outline: '#E2E8F0',
  outlineVariant: '#CBD5E1',
};

// Light Theme (only theme available)
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: lightColors.primary[600],
    primaryContainer: lightColors.primary[100],
    onPrimary: '#FFFFFF',
    onPrimaryContainer: lightColors.primary[900],
    
    // Secondary colors
    secondary: lightColors.success[500],
    secondaryContainer: lightColors.success[100],
    onSecondary: '#FFFFFF',
    onSecondaryContainer: lightColors.success[900],
    
    // Tertiary colors
    tertiary: lightColors.purple[500],
    tertiaryContainer: lightColors.purple[100],
    onTertiary: '#FFFFFF',
    onTertiaryContainer: lightColors.purple[900],
    
    // Surface colors
    surface: lightColors.surface,
    surfaceVariant: lightColors.surfaceVariant,
    onSurface: lightColors.onSurface,
    onSurfaceVariant: lightColors.onSurfaceVariant,
    
    // Background colors
    background: lightColors.background,
    onBackground: lightColors.onBackground,
    
    // Error colors
    error: lightColors.error[500],
    errorContainer: lightColors.error[100],
    onError: '#FFFFFF',
    onErrorContainer: lightColors.error[900],
    
    // Outline colors
    outline: lightColors.outline,
    outlineVariant: lightColors.outlineVariant,
    
    // Custom semantic colors
    success: lightColors.success[500],
    warning: lightColors.warning[500],
    info: lightColors.info[500],
    purple: lightColors.purple[500],
    
    // Neutral shades for consistent theming
    neutral: lightColors.neutral,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      fontFamily: 'Inter-Bold',
      fontSize: 48,
      lineHeight: 52,
      fontWeight: '800',
    },
    displayMedium: {
      fontFamily: 'Inter-Bold',
      fontSize: 40,
      lineHeight: 44,
      fontWeight: '800',
    },
    displaySmall: {
      fontFamily: 'Inter-Bold',
      fontSize: 32,
      lineHeight: 36,
      fontWeight: '800',
    },
    headlineLarge: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 28,
      lineHeight: 32,
      fontWeight: '600',
    },
    headlineMedium: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 24,
      lineHeight: 28,
      fontWeight: '600',
    },
    headlineSmall: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '600',
    },
    titleLarge: {
      fontFamily: 'Inter-Medium',
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '500',
    },
    titleMedium: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '500',
    },
    titleSmall: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    bodyLarge: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyMedium: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    bodySmall: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
    labelLarge: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    labelMedium: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
    },
    labelSmall: {
      fontFamily: 'Inter-Medium',
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '500',
    },
  },
  roundness: borderRadius.xl,
};

// Extended theme with design tokens (only light theme)
export const createExtendedTheme = (baseTheme: typeof lightTheme) => ({
  ...baseTheme,
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.2,
      shadowRadius: 25,
      elevation: 12,
    },
  },
});

export type ExtendedTheme = ReturnType<typeof createExtendedTheme>;