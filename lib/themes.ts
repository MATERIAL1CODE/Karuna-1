import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { typography, borderRadius } from './design-tokens';

// True Black Dark Theme Colors
const darkColors = {
  // Primary colors (enhanced for dark mode)
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#5B5FE8', // Slightly brighter for dark mode
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  
  // Success/Green (enhanced for dark mode)
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
  
  // Warning/Amber (enhanced for dark mode)
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
  
  // Error/Red (enhanced for dark mode)
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
  
  // Info/Blue (enhanced for dark mode)
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
  
  // Purple/Violet (enhanced for dark mode)
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
  
  // True Black Dark Theme Neutrals
  neutral: {
    50: '#FFFFFF',   // Pure white for highest contrast text
    100: '#F8F9FA',  // Near white for secondary text
    200: '#E9ECEF',  // Light gray for borders
    300: '#DEE2E6',  // Medium light gray
    400: '#CED4DA',  // Medium gray for disabled elements
    500: '#ADB5BD',  // Medium gray for secondary text
    600: '#6C757D',  // Dark gray for tertiary text
    700: '#495057',  // Darker gray for surfaces
    800: '#343A40',  // Very dark gray for elevated surfaces
    900: '#000000',  // True black background
  },
  
  // Semantic colors for dark theme
  background: '#000000',      // True black as requested
  surface: '#1A1A1A',        // Very dark gray for cards
  surfaceVariant: '#2D2D2D', // Slightly lighter for elevated elements
  onBackground: '#FFFFFF',    // Pure white text on black
  onSurface: '#FFFFFF',      // Pure white text on surfaces
  onSurfaceVariant: '#B0B0B0', // Light gray for secondary text
  outline: '#404040',         // Dark gray for borders
  outlineVariant: '#2D2D2D',  // Darker gray for subtle borders
};

// Light Theme Colors (keeping original palette)
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

// Light Theme
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

// Dark Theme with True Black Background
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
    
    // Surface colors - True Black Theme
    surface: darkColors.surface,
    surfaceVariant: darkColors.surfaceVariant,
    onSurface: darkColors.onSurface,
    onSurfaceVariant: darkColors.onSurfaceVariant,
    
    // Background colors - True Black
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