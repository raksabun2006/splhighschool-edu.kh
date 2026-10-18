"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/features/auth";
import { UserRole } from "@/types/auth";
import { ROUTE_PERMISSIONS, getRoleConfig, canAccessRoute } from "@/config/roles";

export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const pathname = usePathname();
  const { role } = useAuth();
  const currentRole: UserRole = role || "ADMIN";
  const roleConfig = getRoleConfig(currentRole);

  const baseRoute = "/" + pathname.split("/").filter(Boolean)[0];
  const requiredRoles = allowedRoles || ROUTE_PERMISSIONS[baseRoute] || [];

  const isAllowed = allowedRoles
    ? allowedRoles.includes(currentRole)
    : canAccessRoute(currentRole, pathname);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border shadow-xl text-center overflow-hidden">
        {/* Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#e53935] via-[#253c95] to-[#e53935]" />

        <CardHeader className="pb-3 pt-6">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-[#e53935]/10 text-[#e53935] flex items-center justify-center mb-3">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Access Restricted (403)
          </CardTitle>
          <CardDescription className="text-xs max-w-xs mx-auto">
            Your role does not have authorization to access this area.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Your Active Role:</span>
              <Badge className={`${roleConfig.badgeBg} ${roleConfig.badgeColor} text-[11px] font-bold`}>
                {roleConfig.badgeLabel}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Requested Resource:</span>
              <span className="font-mono font-semibold text-foreground">{pathname}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-2 pt-2 pb-6 border-t border-border/60">
          <Link href="/dashboard">
            <Button size="sm" className="gap-2 bg-[#253c95] hover:bg-[#1b2b6b] text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
