import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  role: 'citizen' | 'facilitator';
  email?: string;
  phone?: string;
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
      name: userData?.name || (role === 'citizen' ? 'Community Member' : 'Community Volunteer'),
      role,
      email: userData?.email || (role === 'citizen' ? 'member@example.com' : 'volunteer@example.com'),
      phone: userData?.phone || (role === 'citizen' ? '+91 98765 43210' : '+91 87654 32109'),
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
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