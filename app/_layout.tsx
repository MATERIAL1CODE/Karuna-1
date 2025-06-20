import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@/lib/auth';
import { AuthProvider } from '@/contexts/AuthContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { theme } from '@/lib/theme';

export default function RootLayout() {
  useFrameworkReady();

  // Get the publishable key with fallback
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

  if (!publishableKey || publishableKey === 'pk_test_placeholder') {
    console.warn('⚠️ Missing Clerk Publishable Key. Please add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file');
  }

  return (
    <ClerkProvider 
      tokenCache={tokenCache} 
      publishableKey={publishableKey}
      // Add development mode settings
      options={{
        experimental: {
          skipVerification: true,
        },
      }}
    >
      <AuthProvider>
        <PaperProvider theme={theme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(home)" />
            <Stack.Screen name="(citizen)" />
            <Stack.Screen name="(facilitator)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </PaperProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}