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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    console.log('🔄 AuthProvider: Initializing...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔄 AuthProvider: Initial session check', session ? 'Found' : 'None');
      handleAuthChange(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthProvider: Auth state changed:', event);
        handleAuthChange(session);
      }
    );

    return () => {
      console.log('🔄 AuthProvider: Cleaning up...');
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (session: Session | null) => {
    console.log('🔄 AuthProvider: Handling auth change', session ? 'Session exists' : 'No session');
    
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      console.log('🔄 AuthProvider: Fetching profile for:', session.user.email);
      await fetchProfile(session.user);
    } else {
      console.log('🔄 AuthProvider: No session, clearing profile');
      setProfile(null);
      setLoading(false);
    }
  };

  const fetchProfile = async (user: User) => {
    try {
      console.log('🔄 AuthProvider: Fetching profile from database...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AuthProvider: Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('✅ AuthProvider: Profile found:', data.email, data.role);
        setProfile(data);
      } else {
        console.log('🔄 AuthProvider: No profile found, creating one...');
        await createProfile(user);
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error in fetchProfile:', error);
      // Create a fallback profile
      const fallbackProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        role: 'citizen',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (user: User) => {
    try {
      const newProfile = {
        id: user.id,
        email: user.email || '',
        role: (user.user_metadata?.role as UserRole) || 'citizen',
      };

      console.log('🔄 AuthProvider: Creating profile:', newProfile);

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('❌ AuthProvider: Error creating profile:', error);
        throw error;
      }

      console.log('✅ AuthProvider: Profile created:', data);
      setProfile(data);
    } catch (error) {
      console.error('❌ AuthProvider: Failed to create profile:', error);
      // Set fallback profile
      const fallbackProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        role: 'citizen',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔄 AuthProvider: Sign in attempt for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error('❌ AuthProvider: Sign in error:', error);
      throw error;
    }

    console.log('✅ AuthProvider: Sign in successful');
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    console.log('🔄 AuthProvider: Sign up attempt for:', email, 'as', role);
    
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { role },
      },
    });

    if (error) {
      console.error('❌ AuthProvider: Sign up error:', error);
      throw error;
    }

    console.log('✅ AuthProvider: Sign up successful');
  };

  const signOut = async () => {
    console.log('🔄 AuthProvider: Sign out attempt');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ AuthProvider: Sign out error:', error);
      throw error;
    }

    console.log('✅ AuthProvider: Sign out successful');
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  console.log('🔄 AuthProvider: Current state:', {
    hasSession: !!session,
    hasProfile: !!profile,
    loading,
    userEmail: user?.email,
    profileRole: profile?.role,
  });

  return (
    <AuthContext.Provider value={value}>
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