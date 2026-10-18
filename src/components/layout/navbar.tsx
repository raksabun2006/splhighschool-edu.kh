"use client";

import React from "react";
import Link from "next/link";
import { useSidebar } from "./dashboard-shell";
import { useTheme } from "@/components/theme-provider";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getInitials } from "@/lib/utils";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Shield,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { toggleMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useCurrentUser();

  const displayName = user?.fullName || "Bun Raksa";
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "Admin";
  const displayEmail = user?.email || "raksabun2006@gmail.com";
  const userInitials = getInitials(displayName) || "BR";

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* Left side: Mobile menu toggle & Search bar */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-lg">
        <button
          onClick={toggleMobile}
          className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
          aria-label="បើកម៉ឺនុយ"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ស្វែងរកសិស្ស គ្រូ ថ្នាក់រៀន..."
            readOnly
            onClick={() => {}}
            className="h-9 w-full rounded-lg border border-border bg-background/50 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors cursor-pointer"
          />
          <kbd className="absolute right-2.5 top-2.5 hidden lg:inline-flex h-4 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side: Home Website button, Academic year badge, theme toggle, notifications, profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Link to Samrong Ponley Website */}
        <Link href="/" title="ទៅកាន់គេហទំព័រវិទ្យាល័យសំរោងពន្លៃ">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-medium border-border/80 bg-background/60 hover:bg-accent hover:text-accent-foreground text-foreground shadow-2xs transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="hidden sm:inline">គេហទំព័រសាលា</span>
            <ArrowUpRight className="h-3 w-3 opacity-60 hidden md:inline" />
          </Button>
        </Link>

        {/* Academic Year indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs text-secondary-foreground font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ឆ្នាំសិក្សា ២០២៥ - ២០២៦ • ឆមាសទី ១</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="ប្តូរពណ៌ផ្ទៃ"
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="សេចក្តីជូនដំណឹង"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right" className="w-80">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="font-semibold text-xs text-foreground">សេចក្តីជូនដំណឹង</span>
              <Badge variant="outline" className="text-[10px]">៣ ថ្មី</Badge>
            </div>
            <div className="divide-y divide-border/60">
              <div className="p-3 text-xs hover:bg-muted/40 transition-colors">
                <p className="font-medium text-foreground">ពាក្យសុំចុះឈ្មោះចូលរៀនថ្មី</p>
                <p className="text-muted-foreground mt-0.5">មានពាក្យសុំចុះឈ្មោះថ្មីពីសិស្សានុសិស្ស។</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">៥ នាទីមុន</span>
              </div>
              <div className="p-3 text-xs hover:bg-muted/40 transition-colors">
                <p className="font-medium text-foreground">បានកត់ត្រាវត្តមានសិស្ស</p>
                <p className="text-muted-foreground mt-0.5">វត្តមានប្រចាំថ្ងៃត្រូវបានបញ្ចូលរួចរាល់។</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">១ ម៉ោងមុន</span>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-muted border border-border/80 transition-colors focus:outline-none cursor-pointer">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground leading-tight max-w-[140px] truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {displayRole}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {userInitials}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground truncate">{displayName}</span>
                <span className="text-xs text-muted-foreground font-normal truncate">{displayEmail}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/" className="w-full">
              <DropdownMenuItem className="cursor-pointer">
                <Globe className="mr-2 h-4 w-4 text-primary" />
                <span>គេហទំព័រសាលា</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings" className="w-full">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>ព័ត៌មានផ្ទាល់ខ្លួន</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings" className="w-full">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>ការកំណត់ប្រព័ន្ធ</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>ចាកចេញពីប្រព័ន្ធ</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
