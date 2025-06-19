import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, UserProfile, UserRole } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Simple profile creation/fetch function
  const getOrCreateProfile = async (userId: string, userEmail: string, userRole?: string) => {
    try {
      console.log('🔄 Getting/creating profile for:', userEmail);
      
      // Try to get existing profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        console.log('✅ Profile found:', existingProfile);
        return existingProfile;
      }

      // Create new profile if it doesn't exist
      console.log('🔄 Creating new profile...');
      const newProfile = {
        id: userId,
        email: userEmail,
        role: (userRole as UserRole) || 'citizen',
      };

      const { data: createdProfile, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        // Return a default profile if creation fails
        return {
          id: userId,
          email: userEmail,
          role: 'citizen' as UserRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      console.log('✅ Profile created:', createdProfile);
      return createdProfile;
    } catch (error) {
      console.error('❌ Error in getOrCreateProfile:', error);
      // Return a default profile if everything fails
      return {
        id: userId,
        email: userEmail,
        role: 'citizen' as UserRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (initialSession?.user) {
          console.log('✅ Found initial session for:', initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          const userProfile = await getOrCreateProfile(
            initialSession.user.id,
            initialSession.user.email || '',
            initialSession.user.user_metadata?.role
          );
          
          if (isMounted) {
            setProfile(userProfile);
          }
        } else {
          console.log('ℹ️ No initial session found');
        }
      } catch (error) {
        console.error('❌ Error in initAuth:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('🔄 Auth state changed:', event);
        
        if (!isMounted) return;

        if (newSession?.user) {
          console.log('✅ New session for:', newSession.user.email);
          setSession(newSession);
          setUser(newSession.user);
          
          const userProfile = await getOrCreateProfile(
            newSession.user.id,
            newSession.user.email || '',
            newSession.user.user_metadata?.role
          );
          
          if (isMounted) {
            setProfile(userProfile);
            setLoading(false);
          }
        } else {
          console.log('ℹ️ Session cleared');
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔄 Signing in:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        throw error;
      }

      console.log('✅ Sign in successful');
      // Auth state change will handle the rest
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      setLoading(true);
      console.log('🔄 Signing up:', email, 'as', role);
      
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { role },
        },
      });

      if (error) {
        throw error;
      }

      console.log('✅ Sign up successful');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      setProfile(null);
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};