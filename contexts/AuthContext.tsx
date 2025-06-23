import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AnalyticsService } from '@/components/AnalyticsService';

interface User {
  name: string;
  role: 'citizen' | 'facilitator';
  email?: string;
  phone?: string;
  id?: string;
  joinedDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: 'citizen' | 'facilitator', userData?: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (role: 'citizen' | 'facilitator', userData?: Partial<User>) => {
    setIsLoading(true);
    
    // Simulate login process with delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData?.name || (role === 'citizen' ? 'Community Member' : 'Community Volunteer'),
      role,
      email: userData?.email || (role === 'citizen' ? 'member@example.com' : 'volunteer@example.com'),
      phone: userData?.phone || (role === 'citizen' ? '+91 98765 43210' : '+91 87654 32109'),
      joinedDate: new Date().toISOString(),
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    setIsLoading(false);

    // Update analytics with user information
    AnalyticsService.updateUserProperties({
      userId: newUser.id,
      userType: newUser.role,
    });

    // Track login event
    AnalyticsService.trackUserAction('user_login', {
      userRole: newUser.role,
      loginMethod: 'role_selection',
    });
  };

  const logout = () => {
    if (user) {
      AnalyticsService.trackUserAction('user_logout', {
        userRole: user.role,
        sessionDuration: Date.now() - new Date(user.joinedDate || '').getTime(),
      });
    }

    setUser(null);
    setIsAuthenticated(false);
    AnalyticsService.clearData();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Track profile update
      AnalyticsService.trackUserAction('profile_updated', {
        updatedFields: Object.keys(userData),
      });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
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