// admin\src\components\AuthProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type User = {
  username: string;
  email?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Restore session from cookie
  useEffect(() => {
    if (typeof window === "undefined") return;
    api
      .get("auth/me/")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Login (cookie is set by backend)
  const login = async (username: string, password: string) => {
    await api.post("auth/token/", {
      username,
      password,
    });

    // access cookie is now set by backend
    const res = await api.get("auth/me/");
    setUser(res.data);
    router.push("/admin/");
  };

  // // 🔹 Logout (backend clears cookies)
  // const logout = async () => {
  //   await api.post("/auth/logout/");
  //   setUser(null);
  //   router.replace("/");
  // };
// 🔹 Logout (backend clears cookies)
  const logout = async () => {
    try {
      // Call backend to clear httpOnly cookies
      await api.post("auth/logout/");
    } catch (err) {
      console.error("Logout request failed:", err);
      // Still clear local state even if request fails
    } finally {
      // Always clear user state and redirect
      setUser(null);
      router.replace("/"); // or "/login" if you have a dedicated login page
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
