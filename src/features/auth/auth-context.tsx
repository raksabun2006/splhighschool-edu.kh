"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserRole, AuthUser, AppPermission } from "@/types/auth";
import { AuthContextType, LoginCredentials, AuthResponse } from "./types";
import { authService } from "./services/auth-service";
import { hasPermission as checkPermission } from "@/config/permissions";
import { hasAuthToken, removeAuthToken } from "@/lib/auth/token-storage";
import { registerSessionExpiredHandler, unregisterSessionExpiredHandler } from "@/lib/api/interceptors";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Authoritatively load current authenticated user from Spring Boot API (/auth/me)
  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    if (!hasAuthToken()) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const liveUser = await authService.getMe();
      setUser(liveUser);
      return liveUser;
    } catch {
      // If /auth/me fails (invalid or expired token), clear credentials
      removeAuthToken();
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Central session expiration handler (401 response from any protected API endpoint)
  useEffect(() => {
    const onSessionExpired = () => {
      removeAuthToken();
      setUser(null);
      router.push("/login?error=session_expired");
    };

    registerSessionExpiredHandler(onSessionExpired);
    return () => {
      unregisterSessionExpiredHandler();
    };
  }, [router]);

  // Initial load: verify session with backend on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login handler
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      // Immediately fetch authoritative user profile from backend
      await refreshUser();
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  // Role strictly derives from the authenticated backend user
  const role: UserRole | null = user?.role || null;

  // Permission checker
  const hasPermission = useCallback(
    (permission: AppPermission): boolean => {
      if (!role) return false;
      return checkPermission(role, permission);
    },
    [role]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        refreshUser,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
