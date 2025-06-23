import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors, typography, borderRadius } from './design-tokens';

// Extended color palette for dark theme
const darkColors = {
  // Primary colors (maintain brand identity)
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5', // Primary - slightly brighter for dark mode
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  // Success/Green (adjusted for dark mode)
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Success
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  
  // Warning/Amber (enhanced for dark mode)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Warning
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Error/Red (optimized for dark backgrounds)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Error
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  // Info/Blue (enhanced contrast)
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Info
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Purple/Violet (maintained vibrancy)
  purple: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // Purple
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  
  // Dark theme specific neutrals
  neutral: {
    50: '#F9FAFB',  // Light text on dark
    100: '#F3F4F6', // Secondary light text
    200: '#E5E7EB', // Borders on dark
    300: '#D1D5DB', // Disabled elements
    400: '#9CA3AF', // Secondary text
    500: '#6B7280', // Tertiary text
    600: '#4B5563', // Surface variants
    700: '#374151', // Card backgrounds
    800: '#1F2937', // Primary surface
    900: '#111827', // Background
  },
  
  // Semantic colors for dark theme
  background: '#111827',
  surface: '#1F2937',
  surfaceVariant: '#374151',
  onBackground: '#F9FAFB',
  onSurface: '#F9FAFB',
  onSurfaceVariant: '#9CA3AF',
  outline: '#4B5563',
  outlineVariant: '#374151',
};

// Light Theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
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
    purple: colors.purple[500],
    
    // Neutral shades for consistent theming
    neutral: colors.neutral,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['7xl'],
      lineHeight: typography.lineHeight['7xl'],
      fontWeight: typography.fontWeight.extrabold,
    },
    displayMedium: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['6xl'],
      lineHeight: typography.lineHeight['6xl'],
      fontWeight: typography.fontWeight.extrabold,
    },
    displaySmall: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['5xl'],
      lineHeight: typography.lineHeight['5xl'],
      fontWeight: typography.fontWeight.extrabold,
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

// Dark Theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors (enhanced for dark mode)
    primary: darkColors.primary[500],
    primaryContainer: darkColors.primary[800],
    onPrimary: '#FFFFFF',
    onPrimaryContainer: darkColors.primary[100],
    
    // Secondary colors
    secondary: darkColors.success[400],
    secondaryContainer: darkColors.success[800],
    onSecondary: '#FFFFFF',
    onSecondaryContainer: darkColors.success[100],
    
    // Tertiary colors
    tertiary: darkColors.purple[400],
    tertiaryContainer: darkColors.purple[800],
    onTertiary: '#FFFFFF',
    onTertiaryContainer: darkColors.purple[100],
    
    // Surface colors
    surface: darkColors.surface,
    surfaceVariant: darkColors.surfaceVariant,
    onSurface: darkColors.onSurface,
    onSurfaceVariant: darkColors.onSurfaceVariant,
    
    // Background colors
    background: darkColors.background,
    onBackground: darkColors.onBackground,
    
    // Error colors
    error: darkColors.error[400],
    errorContainer: darkColors.error[800],
    onError: '#FFFFFF',
    onErrorContainer: darkColors.error[100],
    
    // Outline colors
    outline: darkColors.outline,
    outlineVariant: darkColors.outlineVariant,
    
    // Custom semantic colors (enhanced for dark mode)
    success: darkColors.success[400],
    warning: darkColors.warning[400],
    info: darkColors.info[400],
    purple: darkColors.purple[400],
    
    // Neutral shades for dark theme
    neutral: darkColors.neutral,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    displayLarge: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['7xl'],
      lineHeight: typography.lineHeight['7xl'],
      fontWeight: typography.fontWeight.extrabold,
    },
    displayMedium: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['6xl'],
      lineHeight: typography.lineHeight['6xl'],
      fontWeight: typography.fontWeight.extrabold,
    },
    displaySmall: {
      fontFamily: 'Inter-Bold',
      fontSize: typography.fontSize['5xl'],
      lineHeight: typography.lineHeight['5xl'],
      fontWeight: typography.fontWeight.extrabold,
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

// Extended theme with design tokens (works with both light and dark)
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
});

export type ExtendedTheme = ReturnType<typeof createExtendedTheme>;