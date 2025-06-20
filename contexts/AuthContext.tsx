import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { supabase, UserProfile, UserRole } from '@/lib/supabase';

interface AuthContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile when Clerk user is available
  useEffect(() => {
    if (isLoaded && user) {
      loadUserProfile();
    } else if (isLoaded && !user) {
      setProfile(null);
      setLoading(false);
    }
  }, [user, isLoaded]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('🔄 Loading user profile for user ID:', user.id);
      
      const maxAttempts = 10;
      const retryDelay = 1000; // 1 second
      let attempt = 0;
      let foundProfile = null;

      // Retry mechanism to wait for Supabase trigger to create profile
      while (attempt < maxAttempts && !foundProfile) {
        attempt++;
        console.log(`🔄 Profile loading attempt ${attempt}/${maxAttempts}`);

        // First try to find existing profile by ID
        const { data: existingProfile, error: findError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (existingProfile && !findError) {
          console.log('✅ Found existing profile by ID');
          foundProfile = existingProfile;
          break;
        }

        // If not found by ID, try to find by email or phone
        const email = user.emailAddresses?.[0]?.emailAddress;
        const phone = user.phoneNumbers?.[0]?.phoneNumber;
        
        // Try to find by email
        if (email && !foundProfile) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
          
          if (!error && data) {
            console.log('✅ Found existing profile by email');
            foundProfile = data;
            break;
          }
        }
        
        // If not found by email, try by phone
        if (phone && !foundProfile) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('phone', phone)
            .single();
          
          if (!error && data) {
            console.log('✅ Found existing profile by phone');
            foundProfile = data;
            break;
          }
        }

        // If this is not the last attempt, wait before retrying
        if (attempt < maxAttempts) {
          console.log(`⏳ Profile not found yet, waiting ${retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }

      if (foundProfile) {
        console.log('✅ Profile loaded successfully');
        setProfile(foundProfile);
      } else {
        console.warn('⚠️ No profile found after all attempts. The Supabase trigger may not have executed yet.');
        console.warn('💡 This could be due to:');
        console.warn('   - Database trigger not firing');
        console.warn('   - RLS policies blocking profile creation');
        console.warn('   - Network connectivity issues');
        console.warn('   - User authentication not fully synchronized');
        
        // Set profile to null but don't throw an error
        // This allows the app to continue functioning
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Error in loadUserProfile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating profile:', error);
        return;
      }

      console.log('✅ Profile updated successfully');
      setProfile(data);
    } catch (error) {
      console.error('❌ Error in updateProfile:', error);
    }
  };

  const value = {
    profile,
    loading,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAppAuth must be used within an AuthProvider');
  }
  return context;
};