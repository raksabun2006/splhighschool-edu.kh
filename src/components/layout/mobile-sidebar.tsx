"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigationForRole } from "@/config/navigation";
import { useSidebar } from "./dashboard-shell";
import { cn } from "@/lib/cn";
import { GraduationCap, X, Globe, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getInitials } from "@/lib/utils";

export function MobileSidebar() {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useSidebar();
  const { user } = useCurrentUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = user?.fullName || "Bun Raksa";
  const displayRole = user?.role || "ADMIN";
  const displayEmail = user?.email || "raksabun2006@gmail.com";
  const userInitials = getInitials(displayName) || "BR";

  const navGroups = getNavigationForRole(user?.role);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  if (!mobileOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border p-4 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <Link
            href="/"
            title="ត្រឡប់ទៅគេហទំព័រវិទ្យាល័យសំរោងពន្លៃ"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="relative h-9 w-9 rounded-xl bg-[#1b365d] flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#10b981] border-2 border-card" />
            </div>
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <span>វិទ្យាល័យសំរោងពន្លៃ</span>
              </div>
              <div className="text-[11px] text-muted-foreground">Samrong Ponley High School</div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {mounted && navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.group}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate flex-1">{item.title}</span>
                      {item.badge !== undefined && (
                        <Badge
                          variant={isActive ? "secondary" : item.badgeVariant || "default"}
                          className="ml-auto text-[10px] px-1.5 py-0 h-5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick link to Samrong Ponley Home Website */}
        <div className="py-2.5 border-t border-border">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors bg-muted/30 hover:bg-primary/10 hover:text-primary border border-border/60 text-muted-foreground"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-primary" />
              <span>គេហទំព័រសាលា</span>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </div>

        {/* User profile info */}
        <div className="pt-4 border-t border-border flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0">
            {userInitials}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground truncate">
              {displayName}
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              {displayEmail}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary uppercase shrink-0">
            {displayRole}
          </span>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">វិទ្យាល័យសំរោងពន្លៃ</p>
          <p className="text-[11px] mt-0.5">ស្រុកសំរោង ខេត្តតាកែវ</p>
        </div>
      </div>
    </div>
  );
}
