// admin\src\components\AuthProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';
import { setTokens, getAccessToken, getRefreshToken, clearTokens } from '@/lib/auth';
import { useRouter } from 'next/navigation';

type User = { username?: string } | null;
type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // check token on mount
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      // optionally fetch user info from /auth/me
      api.get('/auth/me/')
        .then(res => setUser(res.data))
        .catch(() => clearTokens())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const resp = await api.post('/auth/token/', { username, password });
      const { access, refresh } = resp.data;
      setTokens(access, refresh);
      setUser({ username });
      router.push('/admin'); // redirect after login
    } catch (err) {
      throw new Error('Invalid credentials');
    }
  };
  
  const logout = () => {
    clearTokens(); // remove JWT from localStorage
    setUser(null); // clear user state
    router.replace('/'); // redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
