import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Token cache implementation for Clerk
const createTokenCache = () => {
  return {
    async getToken(key: string) {
      try {
        if (Platform.OS === 'web') {
          return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    },
    async saveToken(key: string, token: string) {
      try {
        if (Platform.OS === 'web') {
          localStorage.setItem(key, token);
          return;
        }
        await SecureStore.setItemAsync(key, token);
      } catch (error) {
        console.error('Error saving token:', error);
      }
    },
    async clearToken(key: string) {
      try {
        if (Platform.OS === 'web') {
          localStorage.removeItem(key);
          return;
        }
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error('Error clearing token:', error);
      }
    },
  };
};

export const tokenCache = createTokenCache();