import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563EB',
    secondary: '#06B6D4',
    tertiary: '#8B5CF6',
    surface: '#FFFFFF',
    surfaceVariant: '#F8FAFC',
    background: '#F8FAFC',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1E293B',
    onSurfaceVariant: '#64748B',
    onBackground: '#1E293B',
    outline: '#E2E8F0',
  },
  roundness: 12,
};