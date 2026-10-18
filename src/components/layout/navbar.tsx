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
    <header className="sticky top-0 z-20 h-16 border-b border-[#cfd2d8] dark:border-slate-800 bg-[#e0e1e6] dark:bg-[#151921] px-3 sm:px-4 md:px-6 flex items-center justify-between transition-colors shadow-2xs">
      {/* Left side: Mobile menu toggle & Search bar */}
      <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 max-w-lg min-w-0">
        <button
          onClick={toggleMobile}
          className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-slate-300/80 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 md:hidden cursor-pointer shrink-0"
          aria-label="បើកម៉ឺនុយ"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="ស្វែងរកសិស្ស គ្រូ ថ្នាក់រៀន..."
            readOnly
            onClick={() => {}}
            className="h-9 w-full rounded-lg border border-slate-300/80 dark:border-slate-700/80 bg-white/75 dark:bg-slate-900/60 pl-9 pr-4 text-xs text-foreground placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-ring transition-colors cursor-pointer"
          />
          <kbd className="absolute right-2.5 top-2.5 hidden lg:inline-flex h-4 select-none items-center gap-1 rounded border border-slate-300/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side: Home Website button, Academic year badge, theme toggle, notifications, profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        {/* Quick Link to Samrong Ponley Website */}
        <Link href="/" title="ទៅកាន់គេហទំព័រវិទ្យាល័យសំរោងពន្លៃ (Angkor Borei, Takeo)">
          <Button
            variant="outline"
            size="sm"
            className="h-8.5 gap-1.5 text-xs font-medium border-slate-300/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs transition-colors px-2.5 sm:px-3"
          >
            <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="hidden sm:inline">គេហទំព័រសាលា</span>
            <ArrowUpRight className="h-3 w-3 opacity-60 hidden md:inline" />
          </Button>
        </Link>

        {/* Academic Year indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-300/70 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ឆ្នាំសិក្សា ២០២៥ - ២០២៦ • អង្គរបុរី</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="ប្តូរពណ៌ផ្ទៃ"
          className="text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 h-9 w-9 cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications Dropdown (Borderless) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 h-9 w-9 cursor-pointer"
              aria-label="សេចក្តីជូនដំណឹង"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right" className="w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] p-2">
            <div className="flex items-center justify-between px-3 py-2 bg-muted/40 rounded-lg mb-1">
              <span className="font-semibold text-xs text-foreground">សេចក្តីជូនដំណឹង</span>
              <Badge className="text-[10px] border-0 bg-primary/10 text-primary">៣ ថ្មី</Badge>
            </div>
            <div className="space-y-1">
              <div className="p-2.5 rounded-lg text-xs hover:bg-muted/50 transition-colors">
                <p className="font-medium text-foreground">ពាក្យសុំចុះឈ្មោះចូលរៀនថ្មី</p>
                <p className="text-muted-foreground mt-0.5">មានពាក្យសុំចុះឈ្មោះថ្មីពីសិស្សានុសិស្ស។</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">៥ នាទីមុន</span>
              </div>
              <div className="p-2.5 rounded-lg text-xs hover:bg-muted/50 transition-colors">
                <p className="font-medium text-foreground">បានកត់ត្រាវត្តមានសិស្ស</p>
                <p className="text-muted-foreground mt-0.5">វត្តមានប្រចាំថ្ងៃត្រូវបានបញ្ចូលរួចរាល់។</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">១ ម៉ោងមុន</span>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown (Borderless) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 pl-2.5 rounded-full hover:bg-white/80 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 transition-colors focus:outline-none cursor-pointer">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight max-w-[140px] truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {displayRole}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {userInitials}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right" className="w-56 p-2">
            <DropdownMenuLabel className="px-2.5 py-2 bg-muted/40 rounded-lg mb-1">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground truncate">{displayName}</span>
                <span className="text-xs text-muted-foreground font-normal truncate">{displayEmail}</span>
              </div>
            </DropdownMenuLabel>
            <div className="space-y-0.5">
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
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:bg-destructive/10 cursor-pointer mt-1"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>ចាកចេញពីប្រព័ន្ធ</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
