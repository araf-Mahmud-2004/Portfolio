import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdminMode: boolean;
  isAuthenticated: boolean;
  showAdminButton: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  toggleAdminMode: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user, signIn, signOut } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Settings button should always be visible regardless of environment variable
  const showAdminButton = true;

  // User is authenticated if they have a valid Supabase session
  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        setIsAdminMode(true);
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const logout = async () => {
    await signOut();
    setIsAdminMode(false);
  };

  const toggleAdminMode = () => {
    if (isAuthenticated) {
      setIsAdminMode(!isAdminMode);
    }
  };

  const value: AdminContextType = {
    isAdminMode,
    isAuthenticated,
    showAdminButton,
    login,
    logout,
    toggleAdminMode,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};