"use client";

import React from "react";
import { useAuth } from "@/features/auth";
import { AppPermission } from "@/types/auth";
import { PermissionAction, canPerformAction } from "@/config/roles";

export interface PermissionGuardProps {
  permission?: AppPermission;
  action?: PermissionAction;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Conditionally renders UI elements based on user permissions.
 *
 * IMPORTANT SECURITY NOTE:
 * Frontend permission guards only adjust UI visibility (hiding buttons/forms).
 * Every backend endpoint and mutation independently enforces authorization.
 */
export function PermissionGuard({
  permission,
  action,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, role } = useAuth();

  let isAllowed = false;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (action) {
    isAllowed = canPerformAction(role || undefined, action);
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Alias for backwards compatibility with existing components
export const PermissionGate = PermissionGuard;
