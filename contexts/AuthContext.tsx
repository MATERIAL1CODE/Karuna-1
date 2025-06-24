import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Alert } from 'react-native';
import { supabase, Profile } from '@/lib/supabase';
import { AnalyticsService } from '@/components/AnalyticsService';
import { router } from 'expo-router';

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
      console.log('Initial session check:', session ? 'Found session' : 'No session');
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
        console.log('Auth state change:', event, session ? 'Session exists' : 'No session');
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
          // Redirect to auth screen when signed out
          router.replace('/auth');
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
      console.log('Loading profile for user:', supabaseUser.id);
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
        console.log('Profile loaded:', profile.role);
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

        // Navigate to appropriate dashboard based on role
        console.log('Navigating to dashboard for role:', userData.role);
        if (userData.role === 'citizen') {
          router.replace('/(citizen)/(tabs)/home');
        } else if (userData.role === 'facilitator') {
          router.replace('/(facilitator)');
        }
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
      console.log('Signing up user with role:', role);
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
        console.error('Sign up error:', error);
        return { error: error.message };
      }

      console.log('Sign up successful');
      // Track successful sign up
      AnalyticsService.trackUserAction('user_signed_up', {
        userRole: role,
        signUpMethod: 'email',
      });

      return {};
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error: 'An unexpected error occurred during sign up' };
    }
  };

  const signIn = async (
    email: string, 
    password: string, 
    selectedRole: 'citizen' | 'facilitator'
  ): Promise<{ error?: string }> => {
    try {
      console.log('Signing in user with selected role:', selectedRole);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      if (data.user) {
        console.log('Sign in successful, checking profile...');
        // Check the user's actual role from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile check error:', profileError);
          // Sign out the user since we can't verify their role
          await supabase.auth.signOut();
          return { error: 'Unable to verify account details. Please try again.' };
        }

        console.log('User actual role:', profile.role, 'Selected role:', selectedRole);
        if (profile.role !== selectedRole) {
          // Sign out the user since role doesn't match
          await supabase.auth.signOut();
          
          const correctRole = profile.role === 'citizen' ? 'Citizen' : 'Facilitator';
          const attemptedRole = selectedRole === 'citizen' ? 'Citizen' : 'Facilitator';
          
          // Show a helpful alert with detailed information
          Alert.alert(
            '🚫 Role Mismatch',
            `Hi ${profile.full_name}!\n\nYour account is registered as a ${correctRole}, but you're trying to sign in as a ${attemptedRole}.\n\nPlease:\n• Select "${correctRole}" to access your account\n• Or create a new account if you want to join as a ${attemptedRole}`,
            [
              {
                text: 'Got it!',
                style: 'default',
              }
            ],
            { cancelable: true }
          );
          
          // Track role mismatch for analytics
          AnalyticsService.trackUserAction('role_mismatch_attempt', {
            actualRole: profile.role,
            attemptedRole: selectedRole,
            userEmail: data.user.email,
          });
          
          return { 
            error: `Account registered as ${correctRole}. Please select "${correctRole}" to sign in.` 
          };
        }

        console.log('Role validation successful');
        // Track successful role validation
        AnalyticsService.trackUserAction('role_validation_success', {
          userRole: profile.role,
          selectedRole: selectedRole,
        });
        
        // Navigation will be handled by the auth state change listener
      }

      return {};
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: 'An unexpected error occurred during sign in' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('Signing out user');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      AnalyticsService.clearData();
      console.log('Sign out successful');
      // Navigation will be handled by auth state change listener
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = (updates: Partial<Pick<User, 'name' | 'email' | 'phone'>>) => {
    if (user) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
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