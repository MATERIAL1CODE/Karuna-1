import React from 'react';
import { Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/');
            } catch (err) {
              console.error('Sign out error:', err);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <Button
      mode="outlined"
      onPress={handleSignOut}
      icon={() => <LogOut size={16} color="#EF4444" />}
      textColor="#EF4444"
      style={{
        borderColor: '#EF4444',
        borderRadius: 12,
      }}
      contentStyle={{
        paddingVertical: 4,
      }}
    >
      Sign Out
    </Button>
  );
};