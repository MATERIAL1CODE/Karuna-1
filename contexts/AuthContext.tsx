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
      console.log('🔄 Loading user profile...');
      
      // Try to find existing profile by email or phone
      const email = user.emailAddresses?.[0]?.emailAddress;
      const phone = user.phoneNumbers?.[0]?.phoneNumber;
      
      let existingProfile = null;
      
      // First try to find by email
      if (email) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();
        
        if (!error) {
          existingProfile = data;
        }
      }
      
      // If not found by email, try by phone
      if (!existingProfile && phone) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', phone)
          .single();
        
        if (!error) {
          existingProfile = data;
        }
      }

      if (existingProfile) {
        console.log('✅ Found existing profile');
        setProfile(existingProfile);
      } else {
        console.log('🔄 Creating new profile...');
        await createNewProfile();
      }
    } catch (error) {
      console.error('❌ Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewProfile = async () => {
    if (!user) return;

    try {
      console.log('🔄 Creating new profile...');
      
      const role = (user.unsafeMetadata?.role as UserRole) || 'citizen';
      const email = user.emailAddresses?.[0]?.emailAddress || '';
      const phone = user.phoneNumbers?.[0]?.phoneNumber || '';
      const fullName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.firstName || '';

      // Use the service role client to bypass RLS for profile creation
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            email,
            phone,
            role,
            full_name: fullName,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        
        // If RLS is blocking, try a different approach
        if (error.code === '42501') {
          console.log('🔄 RLS blocking insert, trying alternative approach...');
          
          // Create a minimal profile that should pass RLS
          const { data: minimalProfile, error: minimalError } = await supabase
            .from('profiles')
            .insert([
              {
                email: email || null,
                phone: phone || null,
                role: 'citizen', // Default role
                full_name: fullName || null,
              }
            ])
            .select()
            .single();

          if (minimalError) {
            console.error('❌ Error creating minimal profile:', minimalError);
            return;
          }

          console.log('✅ Minimal profile created successfully');
          setProfile(minimalProfile);
        }
        return;
      }

      console.log('✅ Profile created successfully');
      setProfile(data);
    } catch (error) {
      console.error('❌ Error in createNewProfile:', error);
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