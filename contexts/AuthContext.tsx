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
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔄 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setLoading(false);
            setInitializing(false);
          }
          return;
        }
        
        console.log('✅ Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setLoading(false);
            setInitializing(false);
          }
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
          setInitializing(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No session');
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
          setInitializing(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔄 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        
        if (error.code === 'PGRST116') {
          console.log('🔄 Profile not found, creating new profile...');
          await createProfile(userId);
        } else {
          console.log('🔄 Profile fetch error, attempting to create profile...');
          await createProfile(userId);
        }
      } else if (data) {
        console.log('✅ Profile fetched successfully:', data);
        setProfile(data);
        setLoading(false);
        setInitializing(false);
      }
    } catch (error) {
      console.error('❌ Error in fetchProfile:', error);
      try {
        await createProfile(userId);
      } catch (createError) {
        console.error('❌ Failed to create profile as fallback:', createError);
        setLoading(false);
        setInitializing(false);
      }
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('No user data available');
      }

      const newProfile = {
        id: userId,
        email: userData.user.email || '',
        role: (userData.user.user_metadata?.role as UserRole) || 'citizen',
      };

      console.log('🔄 Creating profile:', newProfile);

      const { data, error } = await supabase
        .from('profiles')
        .upsert([newProfile], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        throw error;
      }

      if (data) {
        console.log('✅ Profile created/updated successfully:', data);
        setProfile(data);
        setLoading(false);
        setInitializing(false);
      }
    } catch (error) {
      console.error('❌ Error in createProfile:', error);
      setLoading(false);
      setInitializing(false);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔄 Attempting to sign in with:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        setLoading(false);
        throw error;
      }

      console.log('✅ Sign in successful:', data.user?.email);
      // Don't set loading to false here - let the auth state change handle it
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      console.log('🔄 Attempting to sign up with:', email, 'as', role);
      setLoading(true);
      
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
        setLoading(false);
        throw error;
      }

      console.log('✅ Sign up successful:', data.user?.email);
      // Don't set loading to false here - let the auth state change handle it
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Signing out...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setProfile(null);
      setLoading(false);
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setLoading(false);
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

  // Show loading only during initial setup
  const isLoading = initializing || loading;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading: isLoading,
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