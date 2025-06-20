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
      
      // First try to find existing profile by ID
      const { data: existingProfile, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile && !findError) {
        console.log('✅ Found existing profile by ID');
        setProfile(existingProfile);
        return;
      }

      // If not found by ID, try to find by email or phone
      const email = user.emailAddresses?.[0]?.emailAddress;
      const phone = user.phoneNumbers?.[0]?.phoneNumber;
      
      let profileByContact = null;
      
      // Try to find by email
      if (email) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();
        
        if (!error && data) {
          profileByContact = data;
        }
      }
      
      // If not found by email, try by phone
      if (!profileByContact && phone) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', phone)
          .single();
        
        if (!error && data) {
          profileByContact = data;
        }
      }

      if (profileByContact) {
        console.log('✅ Found existing profile by contact info');
        setProfile(profileByContact);
      } else {
        console.log('🔄 No existing profile found, creating new one...');
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
      console.log('🔄 Creating new profile with user ID:', user.id);
      
      const role = (user.unsafeMetadata?.role as UserRole) || 'citizen';
      const email = user.emailAddresses?.[0]?.emailAddress || '';
      const phone = user.phoneNumbers?.[0]?.phoneNumber || '';
      const fullName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.firstName || '';

      // Create profile with the Clerk user ID
      const profileData = {
        id: user.id, // This is crucial - use Clerk user ID
        email: email || null,
        phone: phone || null,
        role,
        full_name: fullName || null,
      };

      console.log('📝 Profile data to insert:', profileData);

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        
        // If there's a unique constraint violation, the profile might already exist
        if (error.code === '23505') {
          console.log('🔄 Profile already exists, trying to fetch it...');
          const { data: existingData, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (!fetchError && existingData) {
            console.log('✅ Found existing profile after conflict');
            setProfile(existingData);
            return;
          }
        }
        
        throw error;
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