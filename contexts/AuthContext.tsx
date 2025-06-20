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

  // Load user profile from Supabase when Clerk user is available
  useEffect(() => {
    if (isLoaded && user) {
      authenticateWithSupabase();
    } else if (isLoaded && !user) {
      setProfile(null);
      setLoading(false);
    }
  }, [user, isLoaded]);

  const authenticateWithSupabase = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get the Clerk session token
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        console.error('No Clerk token available');
        return;
      }

      // Authenticate Supabase with Clerk's JWT token
      const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'custom',
        token,
      });

      if (authError) {
        console.error('Error authenticating with Supabase:', authError);
        return;
      }

      if (!authData.user) {
        console.error('No Supabase user returned after authentication');
        return;
      }

      // Now use the Supabase user ID (UUID) for profile operations
      await loadProfile(authData.user.id);
    } catch (error) {
      console.error('Error in authenticateWithSupabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (supabaseUserId: string) => {
    try {
      // Try to get existing profile using Supabase user ID
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Create profile if it doesn't exist
        const role = (user?.unsafeMetadata?.role as UserRole) || 'citizen';
        await createProfile(supabaseUserId, role);
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
    }
  };

  const createProfile = async (supabaseUserId: string, role: UserRole) => {
    if (!user) return;

    try {
      const newProfile: Partial<UserProfile> = {
        id: supabaseUserId, // Use Supabase user ID (UUID)
        email: user.emailAddresses?.[0]?.emailAddress || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || '',
        role,
        full_name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || '',
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in createProfile:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id) // Use the Supabase user ID
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in updateProfile:', error);
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