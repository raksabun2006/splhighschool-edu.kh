"use client";

import { useAuth } from "@/features/auth";

/**
 * Adapter hook bridging useCurrentUser calls to the centralized useAuth() provider.
 */
export function useCurrentUser() {
  const { user, isLoading, logout } = useAuth();

  return {
    user,
    loading: isLoading,
    logout,
  };
}
