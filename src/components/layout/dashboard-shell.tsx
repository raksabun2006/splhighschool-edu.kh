"use client";

import React, { createContext, useContext, useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { MobileSidebar } from "./mobile-sidebar";
import { RoleRouteGuard } from "@/components/common/role-guard";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { cn } from "@/lib/cn";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within DashboardShell");
  }
  return context;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        mobileOpen,
        setMobileOpen,
        toggleSidebar,
        toggleMobile,
      }}
    >
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Slide-out Drawer */}
        <MobileSidebar />

        {/* Main Content Area */}
        <div
          className={cn(
            "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out",
            collapsed ? "md:pl-20" : "md:pl-64"
          )}
        >
          <Navbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
            <ProtectedRoute>
              <RoleRouteGuard>{children}</RoleRouteGuard>
            </ProtectedRoute>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
