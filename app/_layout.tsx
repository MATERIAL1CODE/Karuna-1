import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@/lib/auth';
import { AuthProvider } from '@/contexts/AuthContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { theme } from '@/lib/theme';
import { Alert } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  // Get the publishable key with fallback
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

  // Enhanced validation for publishable key
  useEffect(() => {
    if (!publishableKey) {
      console.error('❌ CRITICAL: Missing Clerk Publishable Key');
      Alert.alert(
        'Configuration Error',
        'Clerk Publishable Key is missing. Please add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (publishableKey === 'pk_test_placeholder' || publishableKey.length < 10) {
      console.error('❌ CRITICAL: Invalid Clerk Publishable Key');
      Alert.alert(
        'Configuration Error',
        'Clerk Publishable Key appears to be invalid. Please check your .env file and ensure you have the correct key from your Clerk Dashboard.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validate key format
    if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
      console.error('❌ CRITICAL: Clerk Publishable Key has invalid format');
      Alert.alert(
        'Configuration Error',
        'Clerk Publishable Key must start with "pk_test_" or "pk_live_". Please check your key.',
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('✅ Clerk Publishable Key validated successfully');
    console.log('🔑 Key type:', publishableKey.startsWith('pk_test_') ? 'Development' : 'Production');
  }, [publishableKey]);

  // Don't render if key is invalid
  if (!publishableKey || publishableKey === 'pk_test_placeholder' || publishableKey.length < 10) {
    return null;
  }

  return (
    <ClerkProvider 
      tokenCache={tokenCache} 
      publishableKey={publishableKey}
      options={{
        // Remove experimental skipVerification as it might cause issues
        // Instead, we'll handle verification properly in the sign-up flow
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