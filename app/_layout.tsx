import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { Merriweather_400Regular, Merriweather_700Bold } from '@expo-google-fonts/merriweather';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { lightTheme, createExtendedTheme } from '@/lib/themes';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { BackendProvider } from '@/components/BackendIntegration';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AnalyticsService } from '@/components/AnalyticsService';
import { NotificationService } from '@/components/NotificationService';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppContent() {
  // Load Inter, Lora, and Merriweather fonts
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Lora-Regular': Lora_400Regular,
    'Lora-Bold': Lora_700Bold,
    'Merriweather-Regular': Merriweather_400Regular,
    'Merriweather-Bold': Merriweather_700Bold,
  });

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      // Request notification permissions
      await NotificationService.requestPermissions();
      
      // Initialize analytics
      AnalyticsService.initialize({
        userType: 'citizen', // Default, will be updated on login
      });
    };

    if (fontsLoaded || fontError) {
      initializeServices();
    }
  }, [fontsLoaded, fontError]);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Always use light theme
  const currentTheme = createExtendedTheme(lightTheme);

  return (
    <ErrorBoundary>
      <PaperProvider theme={currentTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(citizen)" />
          <Stack.Screen name="(facilitator)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="dark" />
      </PaperProvider>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <BackendProvider>
              <AppContent />
            </BackendProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}