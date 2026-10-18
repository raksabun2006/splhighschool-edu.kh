"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigationForRole } from "@/config/navigation";
import { useSidebar } from "./dashboard-shell";
import { cn } from "@/lib/cn";
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getInitials } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleSidebar } = useSidebar();
  const { user } = useCurrentUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = user?.fullName || "Bun Raksa";
  const displayRole = user?.role || "ADMIN";
  const userInitials = getInitials(displayName) || "BR";

  const navGroups = getNavigationForRole(user?.role);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed inset-y-0 left-0 z-30 bg-card border-r border-border transition-all duration-300 ease-in-out select-none",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link
          href="/"
          title="ត្រឡប់ទៅគេហទំព័រវិទ្យាល័យសំរោងពន្លៃ"
          className="flex items-center gap-3 overflow-hidden group focus:outline-none"
        >
          <div className="relative h-10 w-10 shrink-0 rounded-xl bg-[#1b365d] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#10b981] border-2 border-card" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-foreground truncate">
                វិទ្យាល័យសំរោងពន្លៃ
              </span>
              <span className="text-[10.5px] font-medium text-muted-foreground truncate">
                Samrong Ponley High School
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {mounted && navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed ? (
              <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.group}
              </h4>
            ) : (
              <div className="h-px bg-border/60 mx-2 my-2" />
            )}

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
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-transform group-hover:scale-105",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.title}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
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
      <div className="px-3 py-2 border-t border-border">
        <Link
          href="/"
          title={collapsed ? "គេហទំព័រសាលា" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all border border-border/60 bg-muted/20 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground group",
            collapsed ? "justify-center px-0" : ""
          )}
        >
          <Globe className="h-4 w-4 shrink-0 text-primary group-hover:scale-110 transition-transform" />
          {!collapsed && (
            <div className="flex items-center justify-between w-full">
              <span>គេហទំព័រសាលា</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          )}
        </Link>
      </div>

      {/* User Profile in Sidebar */}
      <div className="p-3 border-t border-border">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-muted/40 border border-border/50">
            <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs uppercase shrink-0">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-foreground truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize truncate">
                {displayRole.toLowerCase()}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div
              className="h-8 w-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs uppercase"
              title={`${displayName} (${displayRole})`}
            >
              {userInitials}
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 pt-0 flex items-center justify-between">
        {!collapsed && (
          <div className="flex flex-col px-2">
            <span className="text-xs font-medium text-foreground">ឆ្នាំសិក្សា</span>
            <span className="text-[11px] text-muted-foreground">២០២៥ - ២០២៦ • ឆមាសទី ១</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "p-2 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors cursor-pointer",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
