import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'teacher' | 'student' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username?: string; studentId?: string; password: string }, type: 'staff' | 'student') => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const existingUser = authService.verifyToken();
    if (existingUser) {
      setUser(existingUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (
    credentials: { username?: string; studentId?: string; password: string },
    type: 'staff' | 'student'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      let response;
      
      if (type === 'student' && credentials.studentId) {
        response = await authService.loginStudent(credentials.studentId, credentials.password);
      } else {
        return { success: false, error: 'Invalid credentials' };
      }

      if (response.success && response.user) {
        setUser(response.user);
        authService.saveUserSession(response.user);
        return { success: true };
      }

      return { success: false, error: response.error };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.loginWithGoogle();

      if (response.success && response.user) {
        setUser(response.user);
        authService.saveUserSession(response.user);
        return { success: true };
      }

      return { success: false, error: response.error };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    setUser(null);
    await authService.logout();
  };

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
