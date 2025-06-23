import React, { createContext, useContext, ReactNode } from 'react';
import { ColorSchemeName } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colorScheme: ColorSchemeName;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always use light theme
  const isDark = false;
  const colorScheme: ColorSchemeName = 'light';

  // No-op function since we don't support theme toggling
  const toggleTheme = () => {
    // Do nothing - dark theme is disabled
  };

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    colorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}