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
  const { getToken, isLoaded: isAuthLoaded } = useClerkAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile when Clerk user is available
  useEffect(() => {
    if (isLoaded && isAuthLoaded) {
      if (user) {
        loadUserProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    }
  }, [user, isLoaded, isAuthLoaded]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('🔄 Loading user profile for user ID:', user.id);
      
      // Step 1: Get Clerk token for Supabase
      console.log('🔑 Getting Clerk token for Supabase...');
      const clerkToken = await getToken({ template: 'supabase' });
      
      if (!clerkToken) {
        console.error('❌ Failed to get Clerk token');
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('✅ Got Clerk token, setting Supabase session...');

      // Step 2: Set Supabase session with Clerk token
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: clerkToken,
        refresh_token: '', // Not needed for Clerk integration
      });

      if (sessionError) {
        console.error('❌ Failed to set Supabase session:', sessionError);
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('✅ Supabase session set successfully');

      // Step 3: Get the authenticated Supabase user
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !supabaseUser) {
        console.error('❌ Failed to get Supabase user:', userError);
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('✅ Got Supabase user ID:', supabaseUser.id);

      // Step 4: Retry mechanism to wait for profile creation
      const maxAttempts = 10;
      const retryDelay = 1000; // 1 second
      let attempt = 0;
      let foundProfile = null;

      while (attempt < maxAttempts && !foundProfile) {
        attempt++;
        console.log(`🔄 Profile loading attempt ${attempt}/${maxAttempts}`);

        // Query profile using the Supabase user ID
        const { data: existingProfile, error: findError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (existingProfile && !findError) {
          console.log('✅ Found existing profile');
          foundProfile = existingProfile;
          break;
        }

        // Check for specific "no rows found" error
        if (findError && findError.code === 'PGRST116') {
          console.log('⏳ Profile not found yet, waiting for trigger to create it...');
        } else if (findError) {
          console.error('❌ Error querying profile:', findError);
        }

        // If this is not the last attempt, wait before retrying
        if (attempt < maxAttempts) {
          console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }

      if (foundProfile) {
        console.log('✅ Profile loaded successfully');
        setProfile(foundProfile);
      } else {
        console.warn('⚠️ No profile found after all attempts. Creating profile manually...');
        
        // Fallback: Try to create profile manually
        const email = user.emailAddresses?.[0]?.emailAddress || '';
        const phone = user.phoneNumbers?.[0]?.phoneNumber || '';
        const role = (user.unsafeMetadata?.role as UserRole) || 'citizen';

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: supabaseUser.id,
              email,
              phone,
              role,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('❌ Failed to create profile manually:', createError);
          setProfile(null);
        } else {
          console.log('✅ Profile created manually');
          setProfile(newProfile);
        }
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