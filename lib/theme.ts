import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5',
    secondary: '#06B6D4',
    tertiary: '#8B5CF6',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
    background: '#F8F9FA',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1F2937',
    onSurfaceVariant: '#6B7280',
    onBackground: '#1F2937',
    outline: '#E5E7EB',
  },
  roundness: 16,
};