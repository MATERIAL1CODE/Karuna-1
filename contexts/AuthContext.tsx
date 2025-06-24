import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, Profile } from '@/lib/supabase';
import { AnalyticsService } from '@/components/AnalyticsService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'facilitator';
  phone?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'citizen' | 'facilitator') => Promise<{ error?: string }>;
  signIn: (email: string, password: string, selectedRole: 'citizen' | 'facilitator') => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email' | 'phone'>>) => void;
  login: (role: 'citizen' | 'facilitator') => Promise<void>; // Keep for compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }

        // Track auth events
        if (event === 'SIGNED_IN') {
          AnalyticsService.trackUserAction('user_signed_in');
        } else if (event === 'SIGNED_OUT') {
          AnalyticsService.trackUserAction('user_signed_out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: supabaseUser.email || '',
          name: profile.full_name,
          role: profile.role,
          created_at: profile.created_at,
        };
        
        setUser(userData);
        
        // Update analytics with user info
        AnalyticsService.updateUserProperties({
          userId: userData.id,
          userType: userData.role,
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: 'citizen' | 'facilitator'
  ): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Track successful sign up
      AnalyticsService.trackUserAction('user_signed_up', {
        userRole: role,
        signUpMethod: 'email',
      });

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred during sign up' };
    }
  };

  const signIn = async (
    email: string, 
    password: string, 
    selectedRole: 'citizen' | 'facilitator'
  ): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Check the user's actual role from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          // Sign out the user since we can't verify their role
          await supabase.auth.signOut();
          return { error: 'Unable to verify account details. Please try again.' };
        }

        if (profile.role !== selectedRole) {
          // Sign out the user since role doesn't match
          await supabase.auth.signOut();
          const correctRole = profile.role === 'citizen' ? 'Citizen' : 'Facilitator';
          const attemptedRole = selectedRole === 'citizen' ? 'Citizen' : 'Facilitator';
          return { 
            error: `This account is registered as a ${correctRole}. Please sign in as a ${correctRole} or create a new account for ${attemptedRole}.` 
          };
        }
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred during sign in' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      AnalyticsService.clearData();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = (updates: Partial<Pick<User, 'name' | 'email' | 'phone'>>) => {
    if (user) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Keep login function for compatibility with existing code
  const login = async (role: 'citizen' | 'facilitator'): Promise<void> => {
    // Mock login for demo purposes - in real app this would be removed
    const mockUser: User = {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Demo User',
      role: role,
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateUser,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}