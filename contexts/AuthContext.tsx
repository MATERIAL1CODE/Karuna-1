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

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        console.log('✅ Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await handleUserProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const handleUserProfile = async (userId: string) => {
      try {
        console.log('🔄 Handling user profile for:', userId);
        
        // First try to get existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (existingProfile && !fetchError) {
          console.log('✅ Profile found:', existingProfile);
          if (mounted) {
            setProfile(existingProfile);
            setLoading(false);
          }
          return;
        }

        // If no profile exists, create one
        console.log('🔄 No profile found, creating one...');
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData.user) {
          throw new Error('No user data available');
        }

        const newProfile = {
          id: userId,
          email: userData.user.email || '',
          role: (userData.user.user_metadata?.role as UserRole) || 'citizen',
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .upsert([newProfile], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creating profile:', createError);
          throw createError;
        }

        if (createdProfile && mounted) {
          console.log('✅ Profile created:', createdProfile);
          setProfile(createdProfile);
        }
      } catch (error) {
        console.error('❌ Error handling user profile:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize auth
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No session');
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setLoading(true);
          await handleUserProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔄 Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        throw error;
      }

      console.log('✅ Sign in successful:', data.user?.email);
      // Auth state change will handle the rest
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      console.log('🔄 Attempting to sign up with:', email, 'as', role);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        throw error;
      }

      console.log('✅ Sign up successful:', data.user?.email);
      // Auth state change will handle the rest
    } catch (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Signing out...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
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

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
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